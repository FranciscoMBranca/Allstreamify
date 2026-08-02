from __future__ import annotations
from typing import Any

import ninja

router = ninja.Router(tags=["live"])

class SalaSchema(Modelschema):
    id:int


@router.get("/rooms", response=list[dict[str, Any]])
def list_rooms(request):
    """Lista salas de live disponíveis."""
    return [
        {"id": 1, "name": "Sala de produção", "status": "live"},
        {"id": 2, "name": "Sala de bastidores", "status": "idle"},
    ]
