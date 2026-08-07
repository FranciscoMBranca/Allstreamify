// Utilitários da live para padronizar o formato dos dados vindos do backend.
// Isso evita que cada componente lide com nomes de propriedades diferentes.
export function normalizeLiveRoom(room = {}) {
  return {
    id: room.id ?? null,
    title: room.title ?? 'Live sem título',
    room_code: room.room_code ?? room.roomCode ?? '',
    agora_channel: room.agora_channel ?? room.agoraChannel ?? room.room_code ?? '',
    status: room.status ?? 'scheduled',
    room_type: room.room_type ?? 'live',
    host: room.host ?? null,
    host_id: room.host_id ?? room.host ?? null,
    max_participants: room.max_participants ?? 50,
    is_private: Boolean(room.is_private ?? room.isPrivate ?? false),
    password: room.password ?? '',
    recording_enabled: Boolean(room.recording_enabled ?? room.recordingEnabled ?? false),
    recording_url: room.recording_url ?? room.recordingUrl ?? '',
    scheduled_at: room.scheduled_at ?? room.scheduledAt ?? null,
    started_at: room.started_at ?? room.startedAt ?? null,
    ended_at: room.ended_at ?? room.endedAt ?? null,
    created_at: room.created_at ?? room.createdAt ?? null,
  }
}

export function buildLiveRoomPayload({
  hostId,
  title,
  roomCode,
  agoraChannel,
  roomType = 'live',
  status = 'scheduled',
  maxParticipants = 50,
  isPrivate = false,
  password = '',
  recordingEnabled = false,
  recordingUrl = '',
  scheduledAt = null,
}) {
  return {
    host_id: Number(hostId),
    room_code: roomCode,
    title,
    room_type: roomType,
    status,
    max_participants: Number(maxParticipants),
    is_private: Boolean(isPrivate),
    password,
    recording_enabled: Boolean(recordingEnabled),
    recording_url: recordingUrl,
    agora_channel: agoraChannel ?? roomCode,
    scheduled_at: scheduledAt,
  }
}
