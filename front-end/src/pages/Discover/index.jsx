// Página Descobrir: feed central de lives com painel fixo de sala e usuário
import './styles.css'
import { useEffect, useState } from 'react'

function Discover() {
  const [rooms, setRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [scheduled, setScheduled] = useState([])

  useEffect(() => {
    const roomSeed = [
      {
        id: 'r1',
        title: 'Sala de Música',
        description: 'Converse com criadores, compartilhe lançamentos e encontre público para suas próximas transmissões.',
        audience: 'Indie',
        members: 84,
        joined: true,
        status: 'Aberta',
      },
      {
        id: 'r2',
        title: 'Room de Games',
        description: 'Organize eventos, hype de partidas e discussões rápidas sobre o próximo campeonato.',
        audience: 'Gamers',
        members: 132,
        joined: false,
        status: 'Quase cheia',
      },
      {
        id: 'r3',
        title: 'Studio Creativo',
        description: 'Espaço para equipe de vídeo, branding e planejamento de campanhas.',
        audience: 'Equipe',
        members: 18,
        joined: true,
        status: 'Seu espaço',
      },
    ]

    setRooms(roomSeed)
    setSelectedRoomId(roomSeed.find((room) => room.joined)?.id || roomSeed[0]?.id || null)

    setScheduled([
      {
        id: 's1',
        roomId: 'r1',
        title: 'Lançamento novo EP',
        when: '10 ago · 20:00',
        host: 'Canal A',
        description: 'Live com bastidores, pré-escuta e interação com o público em tempo real.',
        reactions: '1,2k',
        comments: '248',
        thumbnail: '🎧',
      },
      {
        id: 's2',
        roomId: 'r2',
        title: 'Entrevista exclusiva',
        when: '12 ago · 18:30',
        host: 'Canal B',
        description: 'Conversando com convidados especiais sobre crescimento, alcance e estratégia de comunidade.',
        reactions: '894',
        comments: '136',
        thumbnail: '🎥',
      },
      {
        id: 's3',
        roomId: 'r3',
        title: 'Campanha de lançamento',
        when: '15 ago · 19:00',
        host: 'Streamify',
        description: 'Momento para revisar criativos, mensagens e tweets com a equipe antes da estreia.',
        reactions: '632',
        comments: '79',
        thumbnail: '✨',
      },
    ])
  }, [])

  function alternarParticipacao(roomId) {
    setRooms((itens) => itens.map((room) => (room.id === roomId ? { ...room, joined: !room.joined } : room)))
  }

  const salaSelecionada = rooms.find((room) => room.id === selectedRoomId) || rooms[0] || null

  return (
    <section className="discover-shell">
      <header className="discover-header">
        <div>
          <p className="discover-eyebrow">Descobrir</p>
          <h1>Explore salas e lives como em um feed social</h1>
          <p className="discover-subtitle">
            Veja o contexto da sala e acompanhe as lives agendadas no centro da tela, com cards ricos, reações e comentários.
          </p>
        </div>
      </header>

      <div className="discover-layout">
        <aside className="discover-sidebar">
          <section className="discover-section discover-profile-card">
            <div className="discover-profile-top">
              <div className="discover-avatar discover-avatar-strong">F</div>
              <div>
                <h2>Francisco Branca</h2>
                <p>Produtor · Estratégia</p>
              </div>
            </div>

            <div className="discover-profile-stats">
              <span>12 salas</span>
              <span>4 lives</span>
              <span>90% engaj.</span>
            </div>
          </section>

          <section className="discover-section discover-room-card">
            {salaSelecionada ? (
              <div className="discover-room-highlight">
                <div className="discover-room-title-row">
                  <div className="discover-avatar discover-avatar-soft">
                    {salaSelecionada.title.charAt(0)}
                  </div>
                  <div>
                    <h3>{salaSelecionada.title}</h3>
                    <p>{salaSelecionada.audience} · {salaSelecionada.members} membros</p>
                  </div>
                </div>

                <p className="discover-card-description">{salaSelecionada.description}</p>

                <div className="discover-card-actions">
                  <button type="button" className="discover-action-btn" onClick={() => alternarParticipacao(salaSelecionada.id)}>
                    {salaSelecionada.joined ? 'Entrar' : 'Aderir'}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="discover-room-list">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  className={`discover-room-item ${selectedRoomId === room.id ? 'active' : ''}`}
                  onClick={() => setSelectedRoomId(room.id)}
                >
                  <div className="discover-room-item-title">
                    <strong>{room.title}</strong>
                    <span>{room.status}</span>
                  </div>
                  <p>{room.members} membros</p>
                </button>
              ))}
            </div>
          </section>
        </aside>

        <main className="discover-feed">
          <section className="discover-section discover-feed-card">
            <div className="discover-section-header">
              <div>
                <h2>Lives agendadas</h2>
                <p>Conteúdo em destaque para sua comunidade.</p>
              </div>
              <span className="discover-pill">{scheduled.length}</span>
            </div>

            <div className="discover-feed-list">
              {scheduled.map((item) => {
                const roomInfo = rooms.find((room) => room.id === item.roomId)
                const canJoin = roomInfo ? !roomInfo.joined : false

                return (
                  <article key={item.id} className="discover-post-card">
                    <div className="discover-post-header">
                      <div className="discover-avatar discover-avatar-strong">{item.host.charAt(0)}</div>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.host} · {item.when}</p>
                      </div>
                      <span className="discover-post-badge">{roomInfo?.joined ? 'Participando' : 'Aberta'}</span>
                    </div>

                    <div className="discover-thumbnail" aria-hidden="true">
                      <span>{item.thumbnail}</span>
                    </div>

                    <p className="discover-card-description">{item.description}</p>

                    <div className="discover-card-stats">
                      <span>❤️ {item.reactions}</span>
                      <span>💬 {item.comments}</span>
                      <span>🔔 {roomInfo?.members || 0} interessados</span>
                    </div>

                    <div className="discover-card-actions">
                      <button
                        type="button"
                        className={`discover-action-btn ${canJoin ? '' : 'discover-action-btn-secondary'}`}
                        onClick={() => {
                          if (roomInfo) {
                            alternarParticipacao(roomInfo.id)
                          }
                        }}
                      >
                        {canJoin ? 'Aderir à sala' : 'Entrar na live'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </main>
      </div>
    </section>
  )
}

export default Discover
