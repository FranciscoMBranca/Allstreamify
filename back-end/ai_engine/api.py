from __future__ import annotations

from typing import Any

import ninja
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .models import AIGenerationLog, HashtagCache
from .schemas import HashtagCacheCriacaoSchema, HashtagCacheSchema, RegistroGeracaoAICriacaoSchema, RegistroGeracaoAISchema

router = ninja.Router(tags=['ai_engine'])


@router.get('/sugestoes', response=list[RegistroGeracaoAISchema])
def listar_sugestoes(request):
    """Lista as gerações reais de conteúdo por IA, ordenadas por data."""
    return AIGenerationLog.objects.select_related('user').all()[:20]


@router.post('/sugestoes', response=RegistroGeracaoAISchema)
def criar_sugestao(request, payload: RegistroGeracaoAICriacaoSchema):
    """Cria um registro real de geração de conteúdo por IA."""
    user = get_object_or_404(User, id=payload.user_id) if payload.user_id else None
    return AIGenerationLog.objects.create(
        user=user,
        prompt=payload.prompt,
        model_name=payload.model_name,
        output=payload.output,
        metadata=payload.metadata or {},
    )


@router.get('/hashtags', response=list[HashtagCacheSchema])
def listar_hashtags(request):
    """Lista as hashtags armazenadas em cache no sistema."""
    return HashtagCache.objects.all()[:20]


@router.post('/hashtags', response=HashtagCacheSchema)
def criar_hashtag(request, payload: HashtagCacheCriacaoSchema):
    """Cria um registro de cache de hashtags para consultas futuras."""
    return HashtagCache.objects.create(
        query=payload.query,
        hashtags=payload.hashtags or {},
        source=payload.source,
    )
