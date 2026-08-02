from __future__ import annotations

from html import parser as parse
from typing import Any

import ninja
import orjson
from django.db.models import Sum
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.utils import timezone
from ninja.parser import Parser

from django.contrib.auth.models import User

from social.models import SocialAccount
from scheduler.models import ScheduledPost
from live.models import LiveRoom


class ORJSONParser(Parser):
    """Parser JSON com suporte a orjson para respostas rápidas e legíveis."""

    media_type = "application/json"

    def parse_body(self, request: HttpRequest) -> dict[str, Any]:
        try:
            body = request.body or b'{}'
            if not body.strip():
                return {}
            return orjson.loads(body)
        except orjson.JSONDecodeError as exc:
            raise parse.ParseError(f"JSON parse error - {str(exc)}")

    def parse_querydict(self, data, list_fields, request):
        return super().parse_querydict(data, list_fields, request)


Api = ninja.NinjaAPI(
    parser=ORJSONParser,
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


@Api.post('/platforms/connect')
def connect_platform(request, payload: dict[str, Any]):
    """Cria a conexão de uma conta social real no sistema."""
    user_id = payload.get('userId')
    platform_id = payload.get('platformId')
    username = payload.get('username')
    platform_user_id = payload.get('platformUserId')

    if not all([user_id, platform_id, username, platform_user_id]):
        return {'success': False, 'message': 'userId, platformId, username e platformUserId são obrigatórios.'}, 400

    user = get_object_or_404(User, id=user_id)
    platform_data = next((item for item in PLATFORMS if item['id'] == platform_id), None)
    if not platform_data:
        return {'success': False, 'message': 'Plataforma não encontrada.'}, 404

    account = SocialAccount.objects.create(
        user=user,
        platform=platform_id,
        platform_user_id=platform_user_id,
        username=username,
        display_name=payload.get('displayName', username),
        avatar_url=payload.get('avatarUrl', ''),
        access_token=payload.get('accessToken', ''),
        refresh_token=payload.get('refreshToken', ''),
        is_active=True,
    )

    return {
        'success': True,
        'message': f"{platform_data['name']} conectada com sucesso.",
        'platform': platform_id,
        'accountId': account.id,
    }
