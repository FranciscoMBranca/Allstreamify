from __future__ import annotations

from typing import Any

import ninja
from django.db.models import Q

from .models import PlatformMetric

router = ninja.Router(tags=['analytics'])


class MetricSchema(ninja.Schema):
    platform: str
    range_name: str
    views: int
    likes: int
    comments: int
    engagement: int


class MetricPointSchema(ninja.Schema):
    label: str
    value: int


class AnalyticsResponseSchema(ninja.Schema):
    platform: str
    range_name: str
    summary: dict[str, Any]
    bars: list[MetricPointSchema]
    trend: list[MetricPointSchema]


@router.get('/metricas', response=list[MetricSchema])
def listar_metricas(request):
    """Retorna todas as métricas persistidas para o painel analítico."""
    metricas = PlatformMetric.objects.all()[:20]
    return [
        MetricSchema(
            platform=item.platform,
            range_name=item.range_name,
            views=item.views,
            likes=item.likes,
            comments=item.comments,
            engagement=item.engagement,
        )
        for item in metricas
    ]


@router.get('/painel', response=AnalyticsResponseSchema)
def painel_analytics(request, platform: str = 'YouTube', range_name: str = 'Semana'):
    """Retorna o resumo em gráficos a partir das métricas reais do sistema."""
    queryset = PlatformMetric.objects.filter(Q(platform__iexact=platform) & Q(range_name__iexact=range_name)).order_by('-captured_at')[:7]
    labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

    if not queryset.exists():
        return AnalyticsResponseSchema(
            platform=platform,
            range_name=range_name,
            summary={
                'totalViews': 0,
                'totalLikes': 0,
                'totalComments': 0,
                'peakEngagement': 0,
            },
            bars=[],
            trend=[],
        )

    barras = [MetricPointSchema(label=labels[index], value=int(item.engagement)) for index, item in enumerate(queryset)]
    tendencia = [MetricPointSchema(label=labels[index], value=int(item.views)) for index, item in enumerate(queryset)]

    resumo = {
        'totalViews': sum(item.views for item in queryset),
        'totalLikes': sum(item.likes for item in queryset),
        'totalComments': sum(item.comments for item in queryset),
        'peakEngagement': max((item.engagement for item in queryset), default=0),
    }

    return AnalyticsResponseSchema(
        platform=platform,
        range_name=range_name,
        summary=resumo,
        bars=barras,
        trend=tendencia,
    )
