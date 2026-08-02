from __future__ import annotations

from typing import Any

import ninja

router = ninja.Router(tags=["inbox"])


@router.get("/messages", response=list[dict[str, Any]])
def list_messages(request):
    """Lista mensagens da caixa de entrada."""
    return [
        {"id": 1, "sender": "Twitch Chat", "content": "Ótima live hoje!", "isRead": False},
        {"id": 2, "sender": "YouTube", "content": "Novo comentário recebido", "isRead": True},
    ]
