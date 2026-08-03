import test from 'node:test'
import assert from 'node:assert/strict'

import { normalizeLiveRoom, buildLiveRoomPayload } from './liveUtils.js'

test('normalizeLiveRoom converte dados da API para o formato do front-end', () => {
  const room = normalizeLiveRoom({
    id: 12,
    title: 'Live de lançamento',
    room_code: 'launch-001',
    agora_channel: 'launch-001',
    status: 'live',
    host: 1,
  })

  assert.equal(room.id, 12)
  assert.equal(room.title, 'Live de lançamento')
  assert.equal(room.room_code, 'launch-001')
  assert.equal(room.agora_channel, 'launch-001')
  assert.equal(room.status, 'live')
})

test('buildLiveRoomPayload monta o payload esperado pelo backend', () => {
  const payload = buildLiveRoomPayload({
    hostId: 1,
    title: 'Nova live',
    roomCode: 'room-22',
    agoraChannel: 'room-22',
    maxParticipants: 25,
    isPrivate: true,
    password: '1234',
    recordingEnabled: true,
    recordingUrl: 'https://example.com/recording.mp4',
    scheduledAt: '2026-08-02T20:00:00Z',
  })

  assert.equal(payload.host_id, 1)
  assert.equal(payload.title, 'Nova live')
  assert.equal(payload.room_code, 'room-22')
  assert.equal(payload.max_participants, 25)
  assert.equal(payload.is_private, true)
  assert.equal(payload.password, '1234')
  assert.equal(payload.recording_enabled, true)
  assert.equal(payload.agora_channel, 'room-22')
})
