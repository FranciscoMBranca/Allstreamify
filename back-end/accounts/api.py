from __future__ import annotations

from typing import Any

import ninja

router = ninja.Router(tags=["accounts"])


@router.get("/profiles", response=list[dict[str, Any]])
def list_profiles(request):
    """Retorna perfis de exemplo para o painel inicial."""
    return [
        {"id": 1, "name": "Maria Silva", "email": "maria@streamify.dev", "plan": "pro"},
        {"id": 2, "name": "João Costa", "email": "joao@streamify.dev", "plan": "free"},
    ]


@router.post("/profiles", response=dict[str, Any])
def create_profile(request, payload: dict[str, Any]):
    """Cria um novo perfil de exemplo."""
    return {
        "id": 99,
        "name": payload.get("name", "Novo usuário"),
        "email": payload.get("email", "novo@streamify.dev"),
        "plan": payload.get("plan", "free"),
    }
