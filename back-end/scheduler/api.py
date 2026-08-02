from __future__ import annotations

from typing import Optional

import ninja
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from accounts.models import Team
from social.models import SocialAccount
from .models import PublicationResult, ScheduledPost
from .schemas import (
    PublicacaoAgendadaCriacaoSchema,
    PublicacaoAgendadaSchema,
    ResultadoPublicacaoSchema,
)

router = ninja.Router(tags=['scheduler'])


@router.get('/posts', response=list[PublicacaoAgendadaSchema])
def list_posts(request):
    """Retorna todas as publicações agendadas."""
    posts = ScheduledPost.objects.prefetch_related('accounts').all()
    return [
        PublicacaoAgendadaSchema(
            id=post.id,
            user=post.user_id,
            team=post.team_id,
            accounts=list(post.accounts.values_list('id', flat=True)),
            content=post.content,
            content_per_platform=post.content_per_platform,
            hashtags=post.hashtags,
            first_comment=post.first_comment,
            scheduled_at=post.scheduled_at,
            timezone=post.timezone,
            status=post.status,
            published_at=post.published_at,
            retry_count=post.retry_count,
            error_message=post.error_message,
            ai_generated=post.ai_generated,
            ai_prompt=post.ai_prompt,
            created_at=post.created_at,
            updated_at=post.updated_at,
        )
        for post in posts
    ]


@router.post('/posts', response=PublicacaoAgendadaSchema)
def create_post(request, payload: PublicacaoAgendadaCriacaoSchema):
    """Cria uma nova publicação agendada."""
    dados = payload.dict(exclude={'account_ids'})
    post = ScheduledPost.objects.create(
        user=get_object_or_404(User, id=payload.user_id),
        team=get_object_or_404(Team, id=payload.team_id) if payload.team_id else None,
        **dados,
    )
    contas = [get_object_or_404(SocialAccount, id=account_id) for account_id in payload.account_ids]
    post.accounts.set(contas)
    return PublicacaoAgendadaSchema(
        id=post.id,
        user=post.user_id,
        team=post.team_id,
        accounts=list(post.accounts.values_list('id', flat=True)),
        content=post.content,
        content_per_platform=post.content_per_platform,
        hashtags=post.hashtags,
        first_comment=post.first_comment,
        scheduled_at=post.scheduled_at,
        timezone=post.timezone,
        status=post.status,
        published_at=post.published_at,
        retry_count=post.retry_count,
        error_message=post.error_message,
        ai_generated=post.ai_generated,
        ai_prompt=post.ai_prompt,
        created_at=post.created_at,
        updated_at=post.updated_at,
    )


@router.get('/results', response=list[ResultadoPublicacaoSchema])
def list_results(request):
    """Retorna todos os resultados de publicação."""
    results = PublicationResult.objects.all()
    return [
        ResultadoPublicacaoSchema(
            id=result.id,
            post=result.post_id,
            account=result.account_id,
            platform_post_id=result.platform_post_id,
            platform_post_url=result.platform_post_url,
            status=result.status,
            error_code=result.error_code,
            error_message=result.error_message,
            response=result.response,
            published_at=result.published_at,
            created_at=result.created_at,
        )
        for result in results
    ]
