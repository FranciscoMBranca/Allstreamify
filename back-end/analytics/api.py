import ninja
from typing import Any

router = ninja.Router(tags=["analytics"])
@router.get("/metrics", response=list[dict[str, Any]])
def list_metrics(request):
    """Retorna métricas de exemplo para a área de analytics."""
    return [
        {"platform": "youtube", "views": 18200, "likes": 430, "comments": 58},
        {"platform": "twitch", "views": 9800, "likes": 220, "comments": 34},
    ]
