from __future__ import annotations

from datetime import datetime
from typing import Optional

from ninja import ModelSchema, Schema

from .models import AutoReplyRule, InboxMessage, InboxReply


class MensagemInboxSchema(ModelSchema):
    class Meta:
        model = InboxMessage
        fields = '__all__'


class MensagemInboxCriacaoSchema(Schema):
    user_id: int
    account_id: Optional[int] = None
    platform_message_id: str
    message_type: str = 'dm'
    sender_platform_id: Optional[str] = ''
    sender_username: Optional[str] = ''
    sender_display_name: Optional[str] = ''
    sender_avatar_url: Optional[str] = ''
    content: str
    media_url: Optional[str] = ''
    is_read: bool = False
    is_replied: bool = False
    auto_replied: bool = False
    is_hidden: bool = False
    sentiment: Optional[str] = ''
    language: Optional[str] = ''
    received_at: datetime


class RespostaInboxSchema(ModelSchema):
    class Meta:
        model = InboxReply
        fields = '__all__'


class RespostaInboxCriacaoSchema(Schema):
    message_id: int
    user_id: int
    reply_text: str


class RegraAutoRespostaSchema(ModelSchema):
    class Meta:
        model = AutoReplyRule
        fields = '__all__'


class RegraAutoRespostaCriacaoSchema(Schema):
    user_id: int
    name: str
    applies_to: str = 'dm'
    trigger_type: str = 'keyword'
    trigger_keywords: Optional[str] = ''
    reply_mode: str = 'fixed'
    fixed_reply: Optional[str] = ''
    ai_instructions: Optional[str] = ''
    ai_tone: Optional[str] = ''
    max_per_hour: int = 0
    max_per_day: int = 0
    active_hours_start: int = 0
    active_hours_end: int = 23
    is_active: bool = True
