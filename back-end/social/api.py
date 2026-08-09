from __future__ import annotations

from typing import Optional

import ninja
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from accounts.models import Team
from .models import SocialAccount
from .platforms import get_platform_payload_normalizer
from .schemas import ContaSocialCriacaoSchema, ContaSocialSchema

router = ninja.Router(tags=['social'])


def montar_dados_conta_social(payload: ContaSocialCriacaoSchema, user: User, team: Optional[Team]) -> dict:
    """Transforma um payload de conexão em um dicionário pronto para salvar no modelo."""
    dados_payload = payload.dict(exclude={'user_id', 'team_id'})
    plataforma = dados_payload.get('platform', '').strip().lower()
    normalizador = get_platform_payload_normalizer(plataforma)

    dados_normalizados = normalizador(dados_payload)
    dados_normalizados['user'] = user

    if team is not None:
        dados_normalizados['team'] = team

    dados_normalizados['platform'] = plataforma
    return dados_normalizados


@router.get('/contas', response=list[ContaSocialSchema])
def list_contas(request):
    """Retorna todas as contas sociais conectadas."""
    return SocialAccount.objects.select_related('team', 'user').all()


@router.get('/contas/{conta_id}', response=ContaSocialSchema)
def retrieve_conta(request, conta_id: int):
    """Retorna os detalhes de uma conta social específica."""
    return get_object_or_404(SocialAccount, id=conta_id)


@router.post('/contas', response=ContaSocialSchema)
def create_conta(request, payload: ContaSocialCriacaoSchema):
    """Registra uma nova conta social conectada."""
    usuario = get_object_or_404(User, id=payload.user_id)
    equipe = None

    if payload.team_id:
        equipe = get_object_or_404(Team, id=payload.team_id)

    dados_conta = montar_dados_conta_social(payload, usuario, equipe)
    return SocialAccount.objects.create(**dados_conta)
