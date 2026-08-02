from __future__ import annotations

from typing import Any, Optional

from ninja import ModelSchema, Schema

from .models import AIGenerationLog, HashtagCache


class RegistroGeracaoAISchema(ModelSchema):
    class Meta:
        model = AIGenerationLog
        fields = '__all__'


class RegistroGeracaoAICriacaoSchema(Schema):
    user_id: Optional[int] = None
    prompt: str
    model_name: Optional[str] = ''
    output: str
    metadata: Optional[dict[str, Any]] = None


class HashtagCacheSchema(ModelSchema):
    class Meta:
        model = HashtagCache
        fields = '__all__'


class HashtagCacheCriacaoSchema(Schema):
    query: str
    hashtags: Optional[dict[str, Any]] = None
    source: Optional[str] = ''
