from __future__ import annotations

from datetime import datetime
from typing import Optional

from django.contrib.auth.models import User
from ninja import ModelSchema, Schema

from .models import Plan, Subscription, Team, UserProfile


class UsuarioLoginSchema(Schema):
    email: str
    password: str


class UsuarioRegistroSchema(Schema):
    email: str
    username: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UsuarioPerfilSchema(Schema):
    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    bio: Optional[str] = None
    avatar: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    timezone: str
    language: str
    email_verified: bool
    two_factor_enabled: bool
    onboarding_done: bool
    created_at: datetime
    updated_at: datetime


class UsuarioAtualizacaoSchema(Schema):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    timezone: Optional[str] = None
    language: Optional[str] = None


class TokenSchema(Schema):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = 'Bearer'
    user: UsuarioPerfilSchema


class PlanoSchema(ModelSchema):
    class Meta:
        model = Plan
        fields = '__all__'


class PlanoCriacaoSchema(Schema):
    name: str
    slug: str
    stripe_price_id: str = ''
    price_monthly: float = 0
    price_yearly: float = 0
    max_social_accounts: int = 1
    max_scheduled_posts: int = 10
    max_team_members: int = 1
    storage_gb: int = 1
    has_ai_features: bool = False
    has_analytics: bool = False
    has_live_streaming: bool = False
    has_auto_reply: bool = False
    has_api_access: bool = False
    is_active: bool = True


class PerfilSchema(ModelSchema):
    class Meta:
        model = UserProfile
        fields = [
            'id',
            'user',
            'bio',
            'avatar',
            'phone',
            'website',
            'timezone',
            'language',
            'plan',
            'plan_expires_at',
            'stripe_customer_id',
            'email_verified',
            'two_factor_enabled',
            'onboarding_done',
            'created_at',
            'updated_at',
        ]


class PerfilCriacaoSchema(Schema):
    username: str
    email: str
    first_name: Optional[str] = ''
    last_name: Optional[str] = ''
    bio: Optional[str] = ''
    avatar: Optional[str] = ''
    phone: Optional[str] = ''
    website: Optional[str] = ''
    timezone: str = 'America/Sao_Paulo'
    language: str = 'pt-br'
    plan_id: Optional[int] = None
    plan_expires_at: Optional[datetime] = None
    stripe_customer_id: Optional[str] = ''
    email_verified: bool = False
    two_factor_enabled: bool = False
    onboarding_done: bool = False


class EquipeSchema(ModelSchema):
    class Meta:
        model = Team
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'avatar',
            'owner',
            'plan',
            'plan_expires_at',
            'is_active',
            'created_at',
        ]


class EquipeCriacaoSchema(Schema):
    name: str
    slug: str
    description: Optional[str] = ''
    avatar: Optional[str] = ''
    owner_id: int
    plan_id: Optional[int] = None
    is_active: bool = True


class AssinaturaSchema(ModelSchema):
    class Meta:
        model = Subscription
        fields = '__all__'


class AssinaturaCriacaoSchema(Schema):
    user_id: int
    plan_id: Optional[int] = None
    stripe_subscription_id: Optional[str] = ''
    status: str = 'active'
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool = False
    is_active: bool = True
