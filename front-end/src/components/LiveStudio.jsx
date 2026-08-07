import { useEffect, useMemo, useRef, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import {
  AgoraRTCProvider,
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  useRTCClient,
} from 'agora-rtc-react'

// O App ID do Agora deve vir de variável de ambiente em produção.
// O token real deve ser gerado no backend e não deixado hardcoded no frontend.
const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID || '39daf989def242ec96e7ad08179d1aa1'
const AGORA_TOKEN = import.meta.env.VITE_AGORA_TOKEN || null

function LivePlayer({ room }) {
  const client = useRTCClient()
  const { localMicrophoneTrack } = useLocalMicrophoneTrack()
  const { localCameraTrack } = useLocalCameraTrack()
  const remoteUsers = useRemoteUsers()

  const [joined, setJoined] = useState(false)
  const [status, setStatus] = useState('Pronto para entrar')
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    if (!client) return

    const handleConnectionStateChange = (currentState, previousState) => {
      if (currentState === 'CONNECTED') {
        setStatus('Live ativa')
      } else if (currentState === 'CONNECTING') {
        setStatus('Conectando à sala...')
      } else if (currentState === 'DISCONNECTED') {
        setStatus('Desconectado')
      } else {
        setStatus(`Estado: ${currentState}`)
      }
    }

    client.on('connection-state-change', handleConnectionStateChange)
    return () => {
      client.off('connection-state-change', handleConnectionStateChange)
    }
  }, [client])

  useJoin(
    {
      appid: AGORA_APP_ID,
      channel: room?.agora_channel || room?.room_code || 'streamify',
      token: AGORA_TOKEN,
      uid: 0,
    },
    joined && !!client && !joining,
    client,
  )

  usePublish([localMicrophoneTrack, localCameraTrack], joined && !!client && !joining, client)

  useEffect(() => {
    if (!joined) return

    const unsub = async () => {
      try {
        if (localMicrophoneTrack) await localMicrophoneTrack.close()
        if (localCameraTrack) await localCameraTrack.close()
      } catch (error) {
        console.error('Erro ao fechar tracks de live:', error)
      }
    }

    return () => {
      unsub()
    }
  }, [joined, localMicrophoneTrack, localCameraTrack])

  const handleToggleJoin = async () => {
    if (!AGORA_APP_ID) {
      setStatus('App ID do Agora não configurado.')
      return
    }

    if (joined) {
      setJoined(false)
      setStatus('Saindo da live...')
      return
    }

    try {
      setJoining(true)
      setStatus('Solicitando acesso à câmera e microfone...')

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      }

      setJoined(true)
      setStatus('Conectando à sala...')
    } catch (error) {
      console.error('Erro ao acessar mídia:', error)
      setStatus('Permita câmera e microfone para iniciar a live.')
    } finally {
      setJoining(false)
    }
  }

  return (
    <div className="live-player-shell">
      <div className="live-player-actions">
        <button type="button" className="btn-primario" onClick={handleToggleJoin} disabled={joining}>
          {joining ? 'Conectando...' : joined ? 'Sair da live' : 'Entrar na live'}
        </button>
        <span className="live-status">{status}</span>
      </div>

      <div className="live-grid">
        <div className="live-video local-video">
          <LocalUser
            micOn={joined}
            cameraOn={joined}
            audioTrack={localMicrophoneTrack}
            videoTrack={localCameraTrack}
            playAudio={joined}
            playVideo={joined}
            style={{ width: '100%', height: '220px' }}
          />
        </div>

        {remoteUsers.map((user) => (
          <div key={user.uid} className="live-video remote-video">
            <RemoteUser user={user} playAudio={true} playVideo={true} style={{ width: '100%', height: '220px' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LiveStudio({ room }) {
  const client = useMemo(() => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }), [])
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && room?.agora_channel) {
      containerRef.current.dataset.channel = room.agora_channel
    }
  }, [room])

  return (
    <div ref={containerRef} className="live-studio" aria-label="Estúdio de live">
      <AgoraRTCProvider client={client}>
        <LivePlayer room={room} />
      </AgoraRTCProvider>
    </div>
  )
}
