from __future__ import annotations

from typing import Optional

from ninja import ModelSchema, Schema

from .models import SocialAccount


class ContaSocialSchema(ModelSchema):
    class Meta:
        model = SocialAccount
        fields = '__all__'


class ContaSocialCriacaoSchema(Schema):
    user_id: int
    team_id: Optional[int] = None
    platform: str
    platform_user_id: str
    username: str
    display_name: Optional[str] = ''
    avatar_url: Optional[str] = ''
    bio: Optional[str] = ''
    followers_count: int = 0
    following_count: int = 0
    posts_count: int = 0
    access_token: Optional[str] = ''
    refresh_token: Optional[str] = ''
    token_expires_at: Optional[str] = None
    scopes: Optional[str] = ''
    is_active: bool = True
