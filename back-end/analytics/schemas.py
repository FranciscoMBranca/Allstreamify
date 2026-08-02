from __future__ import annotations

from typing import Any

from django.db import models
from ninja import ModelSchema, Schema

from .models import PlatformMetric


class PlatformMetricOutSchema(ModelSchema):
    class Meta:
        model = PlatformMetric
        fields = ["platform", "range_name", "views", "likes", "comments", "engagement"]


class PlatformMetricCreateSchema(Schema):
    platform: str
    range_name: str = "Semana"
    views: int = 0
    likes: int = 0
    comments: int = 0
    engagement: int = 0


class MetricPointSchema(Schema):
    label: str
    value: int


class AnalyticsResponseSchema(Schema):
    platform: str
    range_name: str
    summary: dict[str, Any]
    bars: list[MetricPointSchema]
    trend: list[MetricPointSchema]
    distribution: list[MetricPointSchema]
