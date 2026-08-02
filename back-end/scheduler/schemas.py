from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from ninja import Schema


class PublicacaoAgendadaSchema(Schema):
    id: int
    user: int
    team: Optional[int]
    accounts: list[int]
    content: str
    content_per_platform: Optional[dict[str, str]]
    hashtags: str
    first_comment: str
    scheduled_at: datetime
    timezone: str
    status: str
    published_at: Optional[datetime]
    retry_count: int
    error_message: str
    ai_generated: bool
    ai_prompt: str
    created_at: datetime
    updated_at: datetime


class PublicacaoAgendadaCriacaoSchema(Schema):
    user_id: int
    team_id: Optional[int] = None
    account_ids: list[int]
    content: str
    content_per_platform: Optional[dict[str, str]] = None
    hashtags: Optional[str] = ''
    first_comment: Optional[str] = ''
    scheduled_at: datetime
    timezone: str = 'America/Sao_Paulo'
    status: str = 'draft'
    ai_generated: bool = False
    ai_prompt: Optional[str] = ''


class ResultadoPublicacaoSchema(Schema):
    id: int
    post: int
    account: int
    platform_post_id: str
    platform_post_url: str
    status: str
    error_code: str
    error_message: str
    response: Optional[dict[str, Any]]
    published_at: Optional[datetime]
    created_at: datetime
