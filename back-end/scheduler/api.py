from __future__ import annotations

from typing import Any

import ninja

router = ninja.Router(tags=["scheduler"])


@router.get("/posts", response=list[dict[str, Any]])
def list_posts(request):
    """Lista os posts agendados."""
    return [
        {"id": 1, "title": "Live de lançamento", "status": "pending", "publishAt": "2026-08-02T20:00:00Z"},
        {"id": 2, "title": "Conteúdo de bastidores", "status": "scheduled", "publishAt": "2026-08-03T18:30:00Z"},
    ]


@router.post("/posts", response=dict[str, Any])
def create_post(request, payload: dict[str, Any]):
    """Cria um novo agendamento."""
    return {
        "id": 77,
        "title": payload.get("title", "Novo post"),
        "status": "pending",
        "publishAt": payload.get("publishAt", "2026-08-02T20:00:00Z"),
    }
