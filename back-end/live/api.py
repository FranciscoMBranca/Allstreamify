from __future__ import annotations

from typing import Any

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from ninja import Router

from .models import LiveParticipant, LiveRoom
from .schemas import ParticipanteSalaSchema, SalaCriacaoSchema, SalaSchema

router = Router(tags=['live'])


@router.get('/salas', response=list[SalaSchema])
def listar_salas(request):
    """Lista as salas de live cadastradas."""
    return LiveRoom.objects.select_related('host').all()


@router.post('/salas', response=SalaSchema)
def criar_sala(request, payload: SalaCriacaoSchema):
    """Cria uma nova sala de live."""
    return LiveRoom.objects.create(
        host=get_object_or_404(User, id=payload.host_id),
        room_code=payload.room_code,
        title=payload.title,
        room_type=payload.room_type,
        status=payload.status,
        max_participants=payload.max_participants,
        is_private=payload.is_private,
        password=payload.password,
        recording_enabled=payload.recording_enabled,
        recording_url=payload.recording_url,
        agora_channel=payload.agora_channel,
        scheduled_at=payload.scheduled_at,
    )


@router.get('/salas/{sala_id}/participantes', response=list[ParticipanteSalaSchema])
def listar_participantes(request, sala_id: int):
    """Lista os participantes da sala."""
    sala = get_object_or_404(LiveRoom, id=sala_id)
    return LiveParticipant.objects.filter(room=sala).select_related('user').all()
