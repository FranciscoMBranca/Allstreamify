from __future__ import annotations

from typing import Any

import ninja

router = ninja.Router(tags=["ai_engine"])


@router.get("/suggestions", response=list[dict[str, Any]])
def list_suggestions(request):
    """Sugestões de conteúdo para a produção."""
    return [
        {"id": 1, "title": "Criar teaser para a próxima live", "tone": "dinâmico"},
        {"id": 2, "title": "Gerar legendas para o episódio", "tone": "profissional"},
    ]
