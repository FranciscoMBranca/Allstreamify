from __future__ import annotations

from typing import Optional

from ninja import ModelSchema, Schema

from .models import LiveParticipant, LiveRoom


class SalaSchema(ModelSchema):
    class Meta:
        model = LiveRoom
        fields = [
            'id',
            'host',
            'room_code',
            'title',
            'room_type',
            'status',
            'max_participants',
            'is_private',
            'password',
            'recording_enabled',
            'recording_url',
            'agora_channel',
            'scheduled_at',
            'started_at',
            'ended_at',
            'created_at',
        ]


class SalaCriacaoSchema(Schema):
    host_id: int
    room_code: str
    title: str
    room_type: str = 'live'
    status: str = 'scheduled'
    max_participants: int = 50
    is_private: bool = False
    password: Optional[str] = ''
    recording_enabled: bool = False
    recording_url: Optional[str] = ''
    agora_channel: Optional[str] = ''
    scheduled_at: Optional[str] = None


class ParticipanteSalaSchema(ModelSchema):
    class Meta:
        model = LiveParticipant
        fields = '__all__'
