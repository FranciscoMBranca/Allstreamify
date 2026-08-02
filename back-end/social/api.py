from __future__ import annotations

from typing import Any

import ninja

router = ninja.Router(tags=["social"])


@router.get("/accounts", response=list[dict[str, Any]])
def list_social_accounts(request):
    """Retorna as contas sociais conectadas."""
    return [
        {"id": 1, "platform": "youtube", "username": "streamer_youtube", "followers": 12500, "isActive": True},
        {"id": 2, "platform": "twitch", "username": "streamer_twitch", "followers": 9800, "isActive": True},
    ]


@router.post("/accounts", response=dict[str, Any])
def create_social_account(request, payload: dict[str, Any]):
    """Registra uma conta social conectada."""
    return {
        "id": 10,
        "platform": payload.get("platform", "youtube"),
        "username": payload.get("username", "novo_usuario"),
        "followers": payload.get("followers", 0),
        "isActive": True,
    }
