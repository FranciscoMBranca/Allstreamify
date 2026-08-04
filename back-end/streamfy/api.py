from __future__ import annotations

import json
from typing import Any

import ninja
import orjson
from django.db.models import Sum
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.utils import timezone
from ninja.errors import HttpError
from ninja.parser import Parser

from django.contrib.auth.models import User

from social.models import SocialAccount
from scheduler.models import ScheduledPost
from live.models import LiveRoom


# Cada chamada do frontend passa por este parser. Ele converte o request em JSON e
# torna a API mais rápida e previsível para os endpoints que devolvem dados em React.
class ORJSONParser(Parser):
    """Parser JSON com suporte a orjson para respostas rápidas e legíveis."""

    media_type = "application/json"

    def parse_body(self, request: HttpRequest) -> dict[str, Any]:
        try:
            body = request.body or b'{}'
            if not body.strip():
                return {}
            payload = orjson.loads(body)
            if isinstance(payload, dict):
                return payload
            return {'value': payload}
        except (orjson.JSONDecodeError, TypeError, ValueError):
            try:
                return json.loads(request.body.decode('utf-8'))
            except (TypeError, ValueError, UnicodeDecodeError):
                return {}

    def parse_querydict(self, data, list_fields, request):
        result = {}
        for key in data.keys():
            if key in list_fields:
                result[key] = data.getlist(key)
            else:
                result[key] = data.get(key)
        return result


# NinjaAPI é o centro do backend: aqui ficam os endpoints que o frontend consome.
# O React usa fetch() para chamar /api/dashboard, /api/platforms/connect, /api/live/salas etc.
Api = ninja.NinjaAPI(
    parser=ORJSONParser(),
    title="Streamfy API",
    version="0.1.0",
    description="API do painel Streamify para gestão de plataformas sociais e transmissão.",
)


PLATFORMS = [
    {
        "id": "youtube",
        "name": "YouTube",
        "title": "YouTube",
        "description": "Transmita para o seu canal com qualidade profissional e controle de audiência.",
        "icon": "https://api.iconify.design/mdi:youtube.svg?color=%23FF0000",
        "category": "video",
    },
    {
        "id": "linkedin",
        "name": "LinkedIn",
        "title": "LinkedIn",
        "description": "Conecte o seu perfil ou página para reforçar marcas e eventos profissionais.",
        "icon": "https://api.iconify.design/mdi:linkedin.svg?color=%230A66C2",
        "category": "network",
    },
    {
        "id": "twitch",
        "name": "Twitch",
        "title": "Twitch",
        "description": "Acompanhe o chat, a comunidade e o desempenho das suas transmissões.",
        "icon": "https://api.iconify.design/mdi:twitch.svg?color=%239146FF",
        "category": "live",
    },
]


def build_dashboard_payload() -> dict[str, Any]:
    """Montagem de dados reais do painel com base nos registros do sistema."""
    contas_conectadas = SocialAccount.objects.filter(is_active=True)
    conexoes_por_plataforma = {item['id']: contas_conectadas.filter(platform__iexact=item['id']).first() for item in PLATFORMS}
    next_post = ScheduledPost.objects.filter(scheduled_at__gte=timezone.now()).order_by('scheduled_at').first()

    audience_total = contas_conectadas.aggregate(total=Sum('followers_count'))['total'] or 0
    next_event = next_post.scheduled_at.isoformat() if next_post else None

    return {
        'summary': {
            'connectedPlatforms': contas_conectadas.values_list('platform', flat=True).distinct().count(),
            'activeStreams': LiveRoom.objects.filter(status__iexact='live').count(),
            'audience': audience_total,
            'nextEvent': next_event,
        },
        'platforms': [
            {
                **platform,
                'isConnected': conexoes_por_plataforma[platform['id']] is not None,
                'accountInfo': {
                    'username': conexoes_por_plataforma[platform['id']].username,
                    'followers': conexoes_por_plataforma[platform['id']].followers_count,
                    'connectedAt': conexoes_por_plataforma[platform['id']].connected_at.isoformat(),
                }
                if conexoes_por_plataforma[platform['id']] is not None
                else None,
            }
            for platform in PLATFORMS
        ],
        'highlights': [
            {
                'title': 'Transmissão multistream',
                'description': 'Conecte diferentes plataformas e mantenha o conteúdo em sincronização.',
                'tag': 'Ao vivo',
            },
            {
                'title': 'Painel de produção',
                'description': 'Gerencie cenas, áudio e convidados com uma visão simples e clara.',
                'tag': 'Novo',
            },
        ],
    }


@Api.get('/health')
def health(request):
    """Endpoint simples para validar se a API está disponível."""
    return {'status': 'ok', 'service': 'streamfy'}


@Api.get('/dashboard')
def dashboard(request):
    """Retorna os dados do painel principal com base nos modelos reais."""
    return build_dashboard_payload()


@Api.get('/platforms')
def platforms(request):
    """Lista as plataformas disponíveis para conexão."""
    return {'platforms': PLATFORMS}


@Api.get('/platforms/connect')
def connect_platform_get(request):
    """Informa ao frontend que a conexão exige um POST com payload válido."""
    return {'success': False, 'message': 'Use POST para conectar uma plataforma. Envie userId, platformId, username e platformUserId.'}


@Api.post('/platforms/connect')
def connect_platform(request):
    """Cria a conexão de uma conta social real no sistema."""
    payload = {}

    if request.body:
        try:
            raw_body = request.body.decode('utf-8') if isinstance(request.body, bytes) else request.body
            payload = json.loads(raw_body) if raw_body.strip() else {}
        except (TypeError, ValueError, UnicodeDecodeError):
            payload = {}

    if not payload:
        payload = dict(request.POST)

    if isinstance(payload, dict):
        user_id = payload.get('userId')
        platform_id = payload.get('platformId')
        username = payload.get('username')
        platform_user_id = payload.get('platformUserId')
    else:
        user_id = platform_id = username = platform_user_id = None

    if not all([user_id, platform_id, username, platform_user_id]):
        raise HttpError(400, 'userId, platformId, username e platformUserId são obrigatórios.')

    user = get_object_or_404(User, id=user_id)
    platform_data = next((item for item in PLATFORMS if item['id'] == platform_id), None)
    if not platform_data:
        raise HttpError(404, 'Plataforma não encontrada.')

    account, created = SocialAccount.objects.get_or_create(
        platform_user_id=platform_user_id,
        defaults={
            'user': user,
            'platform': platform_id,
            'username': username,
            'display_name': payload.get('displayName', username),
            'avatar_url': payload.get('avatarUrl', ''),
            'access_token': payload.get('accessToken', ''),
            'refresh_token': payload.get('refreshToken', ''),
            'is_active': True,
        },
    )

    if not created and account.user_id != user.id:
        account.user = user
        account.save(update_fields=['user'])

    return {
        'success': True,
        'message': f"{platform_data['name']} conectada com sucesso.",
        'platform': platform_id,
        'accountId': account.id,
        'created': created,
    }
