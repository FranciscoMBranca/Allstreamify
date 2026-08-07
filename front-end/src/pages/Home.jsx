import { useEffect, useState } from 'react'
import './pages.css'
import { dashboardData } from '../data/dashboardData.js'
import LiveStudio from '../components/LiveStudio'
import { fetchLiveRooms, createLiveRoom } from '../lib/liveApi.js'
import { buildLiveRoomPayload, normalizeLiveRoom } from '../lib/liveUtils.js'

function Home({ dashboard, loading, timeLeft }) {
  const data = dashboard ?? dashboardData
  const [liveRooms, setLiveRooms] = useState([])
  const [roomError, setRoomError] = useState('')
  const [creatingRoom, setCreatingRoom] = useState(false)

  useEffect(() => {
    async function loadRooms() {
      try {
        const rooms = await fetchLiveRooms()
        setLiveRooms(rooms.map(normalizeLiveRoom))
      } catch (error) {
        console.error('Erro ao carregar salas de live:', error)
      }
    }

    loadRooms()
  }, [])

  async function handleCreateLive() {
    try {
      setCreatingRoom(true)
      setRoomError('')

      const roomCode = `stream-${Date.now()}`
      const payload = buildLiveRoomPayload({
        hostId: 1,
        title: 'Nova live do painel',
        roomCode,
        agoraChannel: roomCode,
        maxParticipants: 50,
        isPrivate: false,
        password: '',
        recordingEnabled: false,
        recordingUrl: '',
        scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      })

      const newRoom = await createLiveRoom(payload)
      setLiveRooms((previous) => [normalizeLiveRoom(newRoom), ...previous])
    } catch (error) {
      console.error('Erro ao criar sala:', error)
      setRoomError(error.message ?? 'Não foi possível criar a sala de live.')
    } finally {
      setCreatingRoom(false)
    }
  }

  const metrics = [
    { label: 'Plataformas conectadas', value: data.summary?.connectedPlatforms ?? 0 },
    { label: 'Visualizações semanais', value: data.summary?.weeklyViews ?? '0' },
    { label: 'Tempo médio', value: data.summary?.avgWatchTime ?? '0m' },
    { label: 'Próximo evento', value: timeLeft ?? '00:00:00' },
  ]

  return (
    <section className="page-shell">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Visão geral</p>
          <h1>Seu centro de comando para transmissão</h1>
          <p className="page-subtitle">
            Acompanhe status, conexões e próximos eventos em um único painel.
          </p>
        </div>
        <div className="page-badge">{loading ? 'Carregando...' : 'Tudo em dia'}</div>
      </header>

      <div className="stats-grid">
        {metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <span className="metric-label">{metric.label}</span>
            <strong className="metric-value">{metric.value}</strong>
          </article>
        ))}
      </div>

      <div className="panel-grid">
        <article className="panel">
          <div className="panel-header">
            <h2>Plataformas ativas</h2>
            <span className="tag">{data.summary?.connectedPlatforms ?? 0} conectadas</span>
          </div>

          <ul className="list-stack">
            {data.platforms?.map((platform) => (
              <li key={platform.id} className="list-item">
                <div>
                  <strong>{platform.title}</strong>
                  <p>{platform.description}</p>
                </div>
                <span className={`status-pill ${platform.isConnected ? 'online' : 'offline'}`}>
                  {platform.isConnected ? 'Conectada' : 'Pendente'}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Próximo conteúdo</h2>
            <span className="tag">Hoje às 20:00</span>
          </div>

          <div className="hero-card">
            <h3>Live de lançamento</h3>
            <p>Prepare a transmissão, a campanha de chat e o cronograma de anúncios.</p>
            <button className="btn-primario" type="button" onClick={handleCreateLive} disabled={creatingRoom}>
              {creatingRoom ? 'Criando...' : 'Transmitir agora'}
            </button>
          </div>
        </article>
      </div>

      <article className="panel">
        <div className="panel-header">
          <h2>Salas de live</h2>
          <span className="tag">{liveRooms.length} ativas</span>
        </div>

        {roomError ? <p className="form-error">{roomError}</p> : null}

        {liveRooms.length === 0 ? (
          <p className="empty-state">Nenhuma live cadastrada no momento.</p>
        ) : (
          <div className="live-list">
            {liveRooms.map((room) => (
              <div key={room.id} className="live-room-card">
                <div>
                  <p className="live-label">{room.status?.toUpperCase()}</p>
                  <h3>{room.title}</h3>
                  <p>{room.room_code}</p>
                </div>
                <LiveStudio room={room} />
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  )
}

export default Home
