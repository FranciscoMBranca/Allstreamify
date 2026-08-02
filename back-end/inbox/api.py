from __future__ import annotations

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
import ninja

from social.models import SocialAccount
from .models import AutoReplyRule, InboxMessage, InboxReply
from .schemas import (
    MensagemInboxCriacaoSchema,
    MensagemInboxSchema,
    RegraAutoRespostaCriacaoSchema,
    RegraAutoRespostaSchema,
    RespostaInboxCriacaoSchema,
    RespostaInboxSchema,
)

router = ninja.Router(tags=['inbox'])


@router.get('/mensagens', response=list[MensagemInboxSchema])
def list_mensagens(request):
    """Retorna todas as mensagens da caixa de entrada."""
    return InboxMessage.objects.select_related('account', 'user').all()


@router.post('/mensagens', response=MensagemInboxSchema)
def create_mensagem(request, payload: MensagemInboxCriacaoSchema):
    """Registra uma nova mensagem de inbox."""
    dados = payload.dict(exclude={'user_id', 'account_id'})
    dados['user'] = get_object_or_404(User, id=payload.user_id)
    if payload.account_id:
        dados['account'] = get_object_or_404(SocialAccount, id=payload.account_id)
    return InboxMessage.objects.create(**dados)


@router.get('/respostas', response=list[RespostaInboxSchema])
def list_respostas(request):
    """Retorna todas as respostas de inbox."""
    return InboxReply.objects.select_related('message', 'user').all()


@router.post('/respostas', response=RespostaInboxSchema)
def create_resposta(request, payload: RespostaInboxCriacaoSchema):
    """Registra uma nova resposta a uma mensagem."""
    return InboxReply.objects.create(
        message=get_object_or_404(InboxMessage, id=payload.message_id),
        user=get_object_or_404(User, id=payload.user_id),
        reply_text=payload.reply_text,
    )


@router.get('/regras', response=list[RegraAutoRespostaSchema])
def list_regras(request):
    """Retorna todas as regras de auto-resposta."""
    return AutoReplyRule.objects.select_related('user').all()


@router.post('/regras', response=RegraAutoRespostaSchema)
def create_regra(request, payload: RegraAutoRespostaCriacaoSchema):
    """Cria uma nova regra de auto-resposta."""
    return AutoReplyRule.objects.create(
        user=get_object_or_404(User, id=payload.user_id),
        name=payload.name,
        applies_to=payload.applies_to,
        trigger_type=payload.trigger_type,
        trigger_keywords=payload.trigger_keywords,
        reply_mode=payload.reply_mode,
        fixed_reply=payload.fixed_reply,
        ai_instructions=payload.ai_instructions,
        ai_tone=payload.ai_tone,
        max_per_hour=payload.max_per_hour,
        max_per_day=payload.max_per_day,
        active_hours_start=payload.active_hours_start,
        active_hours_end=payload.active_hours_end,
        is_active=payload.is_active,
        reply_count=payload.reply_count,
    )
