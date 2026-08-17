// Página Descobrir: feed central de lives com painel fixo de sala e usuário
import './styles.css'
import { useEffect, useState } from 'react'
// Card de publicação reutilizável, com o visual de post estilo Facebook
import post1 from '../../assets/Microsoft_Windows_10_Desktop_Wallpaper_medium.jpg'
import PostCard from '../../components/PostCard'


function Discover() {
  // Lista de salas disponíveis, carregada no useEffect abaixo
  const [salas, definirSalas] = useState([])
  // Id da sala atualmente exibida em destaque na barra lateral
  const [idSalaSelecionada, definirIdSalaSelecionada] = useState(null)
  // Lista de lives agendadas, mostradas como publicações no feed central
  const [agendadas, definirAgendadas] = useState([])

  // Efeito executado uma única vez, ao montar o componente,
  // para simular o carregamento inicial de salas e lives agendadas.
  useEffect(() => {
    // Dados iniciais das salas (viriam de uma API no futuro)
    const salasIniciais = [
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

    // Guarda as salas no estado
    definirSalas(salasIniciais)
    // Seleciona por padrão a primeira sala da qual o usuário já participa;
    // se nenhuma, cai para a primeira sala da lista; se a lista estiver vazia, null.
    definirIdSalaSelecionada(salasIniciais.find((sala) => sala.joined)?.id || salasIniciais[0]?.id || null)

    // Dados iniciais das lives agendadas (viriam de uma API no futuro)
    definirAgendadas([
      {
        id: 's1',
        roomId: 'r1',
        title: 'Lançamento novo EP',
        when: '10 ago · 20:00',
        host: 'Canal A',
        description: 'Live com bastidores, pré-escuta e interação com o público em tempo real.',
        reactions: '1,2k',
        comments: '248',
        thumbnail: `${post1}`,
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

  // Alterna se o usuário participa (joined) ou não de uma sala específica.
  function alternarParticipacao(idSala) {
    definirSalas((salasAtuais) =>
      salasAtuais.map((sala) => (sala.id === idSala ? { ...sala, joined: !sala.joined } : sala)),
    )
  }

  // Sala atualmente em destaque na barra lateral: a selecionada,
  // ou a primeira da lista, ou null se não houver nenhuma sala.
  const salaSelecionada = salas.find((sala) => sala.id === idSalaSelecionada) || salas[0] || null

  return (
    <section className="discover-shell">
      {/* Cabeçalho da página, com título e subtítulo explicativo */}
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
        {/* Barra lateral fixa: perfil do usuário e detalhes da sala selecionada */}
        <aside className="discover-sidebar">
          {/* Cartão de perfil do usuário logado */}
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

          {/* Cartão com o destaque da sala selecionada e a lista completa de salas */}
          <section className="discover-section discover-room-card">
            {/* Mostra o destaque apenas quando existe uma sala selecionada */}
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
                  <button
                    type="button"
                    className="discover-action-btn"
                    onClick={() => alternarParticipacao(salaSelecionada.id)}
                  >
                    {salaSelecionada.joined ? 'Entrar' : 'Aderir'}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Lista de todas as salas, permitindo trocar a sala em destaque */}
            <div className="discover-room-list">
              {salas.map((sala) => (
                <button
                  key={sala.id}
                  type="button"
                  className={`discover-room-item ${idSalaSelecionada === sala.id ? 'active' : ''}`}
                  onClick={() => definirIdSalaSelecionada(sala.id)}
                >
                  <div className="discover-room-item-title">
                    <strong>{sala.title}</strong>
                    <span>{sala.status}</span>
                  </div>
                  <p>{sala.members} membros</p>
                </button>
              ))}
            </div>
          </section>
        </aside>

        {/* Feed central com as publicações (lives agendadas) */}
        <main className="discover-feed">
          <section className="discover-section discover-feed-card">
            <div className="discover-section-header">
              <div>
                <h2>Lives agendadas</h2>
                <p>Conteúdo em destaque para sua comunidade.</p>
              </div>
              {/* Contador com o total de publicações no feed */}
              <span className="discover-pill">{agendadas.length}</span>
            </div>

            {/* Lista de publicações, cada uma renderizada pelo componente PostCard */}
            <div className="discover-feed-list">
              {agendadas.map((publicacao) => {
                // Sala associada a esta publicação, usada para mostrar membros e status
                const salaDaPublicacao = salas.find((sala) => sala.id === publicacao.roomId)

                return (
                  <PostCard
                    key={publicacao.id}
                    publicacao={publicacao}
                    sala={salaDaPublicacao}
                    aoAlternarParticipacao={alternarParticipacao}
                  />
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
