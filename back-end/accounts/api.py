from __future__ import annotations

from typing import Optional

import ninja
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .models import Plan, Subscription, Team, UserProfile
from .schemas import (
    AssinaturaCriacaoSchema,
    AssinaturaSchema,
    EquipeCriacaoSchema,
    EquipeSchema,
    PerfilCriacaoSchema,
    PerfilSchema,
    PlanoCriacaoSchema,
    PlanoSchema,
)

router = ninja.Router(tags=['accounts'])


@router.get('/planos', response=list[PlanoSchema])
def list_planos(request):
    """Retorna todos os planos de assinatura ativos."""
    return Plan.objects.filter(is_active=True).order_by('price_monthly')


@router.post('/planos', response=PlanoSchema)
def create_plano(request, payload: PlanoCriacaoSchema):
    """Cria um novo plano de assinatura."""
    return Plan.objects.create(**payload.dict())


@router.get('/perfis', response=list[PerfilSchema])
def list_perfis(request):
    """Retorna todos os perfis de usuário."""
    return UserProfile.objects.select_related('user', 'plan').all()


@router.post('/perfis', response=PerfilSchema)
def create_perfil(request, payload: PerfilCriacaoSchema):
    """Cria um perfil de usuário e conta Django associada."""
    usuario = User.objects.create(
        username=payload.username,
        email=payload.email,
        first_name=payload.first_name or '',
        last_name=payload.last_name or '',
    )
    dados_perfil = payload.dict(exclude={'username', 'email', 'first_name', 'last_name', 'plan_id'})
    if payload.plan_id:
        dados_perfil['plan'] = get_object_or_404(Plan, id=payload.plan_id)
    perfil = UserProfile.objects.create(user=usuario, **dados_perfil)
    return perfil


@router.get('/equipes', response=list[EquipeSchema])
def list_equipes(request):
    """Retorna todas as equipes cadastradas."""
    return Team.objects.select_related('owner', 'plan').all()


@router.post('/equipes', response=EquipeSchema)
def create_equipe(request, payload: EquipeCriacaoSchema):
    """Cria uma nova equipe de trabalho."""
    owner = get_object_or_404(User, id=payload.owner_id)
    dados_equipe = payload.dict(exclude={'owner_id', 'plan_id'})
    dados_equipe['owner'] = owner
    if payload.plan_id:
        dados_equipe['plan'] = get_object_or_404(Plan, id=payload.plan_id)
    return Team.objects.create(**dados_equipe)


@router.get('/assinaturas', response=list[AssinaturaSchema])
def list_assinaturas(request):
    """Retorna todas as assinaturas ativas."""
    return Subscription.objects.select_related('user', 'plan').all()


@router.post('/assinaturas', response=AssinaturaSchema)
def create_assinatura(request, payload: AssinaturaCriacaoSchema):
    """Registra uma nova assinatura para um usuário."""
    usuario = get_object_or_404(User, id=payload.user_id)
    dados_assinatura = payload.dict(exclude={'user_id', 'plan_id'})
    dados_assinatura['user'] = usuario
    if payload.plan_id:
        dados_assinatura['plan'] = get_object_or_404(Plan, id=payload.plan_id)
    return Subscription.objects.create(**dados_assinatura)
