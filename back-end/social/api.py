from __future__ import annotations

from typing import Optional

import ninja
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from accounts.models import Team
from .models import SocialAccount
from .schemas import ContaSocialCriacaoSchema, ContaSocialSchema

router = ninja.Router(tags=['social'])


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
    dados = payload.dict(exclude={'user_id', 'team_id'})
    dados['user'] = get_object_or_404(User, id=payload.user_id)
    if payload.team_id:
        dados['team'] = get_object_or_404(Team, id=payload.team_id)
    return SocialAccount.objects.create(**dados)
