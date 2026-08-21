from __future__ import annotations
from ninja_jwt.authentication import JWTAuth, JWTTokenUserAuth
from ninja_jwt.tokens import RefreshToken

import ninja
from django.contrib import auth
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from ninja.errors import HttpError
from ninja_jwt.tokens import RefreshToken

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
    TokenSchema,
    UsuarioAtualizacaoSchema,
    UsuarioLoginSchema,
    UsuarioPerfilSchema,
    UsuarioRegistroSchema,
)

router = ninja.Router(tags=['accounts'])


def preparar_perfil_user(user):
    """Prepara dados do perfil publicamente retornados pela API."""
    try:
        perfil = UserProfile.objects.get(user=user)
    except UserProfile.DoesNotExist:
        perfil = UserProfile.objects.create(user=user)

    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'bio': perfil.bio,
        'avatar': perfil.avatar.url if perfil.avatar else None,
        'phone': perfil.phone,
        'website': perfil.website,
        'timezone': perfil.timezone,
        'language': perfil.language,
        'email_verified': perfil.email_verified,
        'two_factor_enabled': perfil.two_factor_enabled,
        'onboarding_done': perfil.onboarding_done,
        'created_at': user.date_joined,
        'updated_at': perfil.updated_at,
    }

@router.post('/login', response=TokenSchema)
def logar(request, data: UsuarioLoginSchema):
    """Faz login com email e senha."""
    if not data.email or not data.password:
        raise HttpError(400, 'Email e senha são obrigatórios')
    
    try:
        user=auth.authenticate(request, username=data.email, password=data.password)
        
        
    except User is None:
        raise HttpError(401, 'Email ou senha incorretos')

    
    token = RefreshToken.for_user(user)
    return {
        'access_token': str(token.access_token),
        'refresh_token': str(token),
        'token_type': 'Bearer',
        'user': preparar_perfil_user(user),
    }


@router.post('/register', response=TokenSchema)
def registrar(request, data: UsuarioRegistroSchema):
    """Regista um novo utilizador."""

    dados=dict(data)
    
    if User.objects.filter(email=dados['email']).exists():
         raise HttpError(400, 'Este email já está registado')

    dados['username'] = dados['email'].split("@")[0]
    if User.objects.filter(username=dados['username']).exists():
         raise HttpError(400, 'Este nome de utilizador já existe')
    
    
    try:
        user = User.objects.create_user(
            username=dados['username'] ,
            first_name=data.first_name ,
            email=data.email,
            password=data.password,
            last_name=data.last_name ,
        )
    except IntegrityError as exc:
        raise HttpError(400, str(exc))
    
    token = RefreshToken.for_user(user)
    return {
        'access_token': token.access_token(),
        'refresh_token': token.refresh_token(),
        'token_type': 'Bearer',
        'user': preparar_perfil_user(user),
    }


@router.get('/me', response=UsuarioPerfilSchema)
def obter_perfil(request):
    """Obtém o perfil do utilizador autenticado."""
    if not request.user.is_authenticated:
        raise HttpError(401, 'Utilizador não autenticado')

    return preparar_perfil_user(request.user)


@router.put('/me', response=UsuarioPerfilSchema)
def atualizar_perfil(request, data: UsuarioAtualizacaoSchema):
    """Atualiza o perfil do utilizador autenticado."""
    if not request.user.is_authenticated:
        raise HttpError(401, 'Utilizador não autenticado')

    user = request.user
    perfil = UserProfile.objects.get(user=user)

    if data.first_name is not None:
        user.first_name = data.first_name
    if data.last_name is not None:
        user.last_name = data.last_name
    user.save()

    if data.bio is not None:
        perfil.bio = data.bio
    if data.phone is not None:
        perfil.phone = data.phone
    if data.website is not None:
        perfil.website = data.website
    if data.timezone is not None:
        perfil.timezone = data.timezone
    if data.language is not None:
        perfil.language = data.language
    perfil.save()

    return preparar_perfil_user(user)


@router.get('/{user_id}', response=UsuarioPerfilSchema)
def obter_perfil_usuario(request, user_id: int):
    """Obtém o perfil de um utilizador específico."""
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise HttpError(404, 'Utilizador não encontrado')

    return preparar_perfil_user(user)


@router.post('/logout', auth=JWTAuth())
def logout(request):
    """Faz logout do utilizador autenticado."""
    if not request.user.is_authenticated:
        raise HttpError(401, 'Utilizador não autenticado')

    auth.logout(request.user)
    return {'message': 'Logout realizado com sucesso'}


@router.get('/planos', response=list[PlanoSchema])
def list_planos(request):
    """Retorna todos os planos de assinatura ativos."""
    return Plan.objects.filter(is_active=True).order_by('price_monthly')


@router.post('/planos', response=PlanoSchema, auth=JWTAuth)
def create_plano(request, payload: PlanoCriacaoSchema):
    """Cria um novo plano de assinatura."""
    return Plan.objects.create(**payload.dict())


@router.get('/perfis', response=list[PerfilSchema], auth=JWTAuth)
def list_perfis(request):
    """Retorna todos os perfis de usuário."""
    if request.user.is_superuser():
        return UserProfile.objects.select_related('user', 'plan').all()
    return HttpError(401, "Usuário não autorizado!")


@router.post('/perfis', response=PerfilSchema, auth=JWTAuth())
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


@router.post('/equipes', response=EquipeSchema, auth=JWTAuth())
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
