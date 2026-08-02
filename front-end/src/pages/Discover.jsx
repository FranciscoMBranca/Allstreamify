import './pages.css'

function Discover() {
  return (
    <section className="page-shell">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Descobrir</p>
          <h1>Encontre novas oportunidades de alcance</h1>
          <p className="page-subtitle">
            Explore tendências, formatos e comunidades para ampliar sua presença.
          </p>
        </div>
      </header>

      <div className="panel-grid">
        <article className="panel">
          <div className="panel-header">
            <h2>Trending agora</h2>
            <span className="tag">+18% esta semana</span>
          </div>
          <ul className="list-stack">
            <li className="list-item">
              <div>
                <strong>Conteúdo ao vivo em rede</strong>
                <p>Mais engajamento em transmissões com múltiplas plataformas.</p>
              </div>
            </li>
            <li className="list-item">
              <div>
                <strong>Shorts de bastidores</strong>
                <p>Reaproveite a energia da live em vídeos curtos.</p>
              </div>
            </li>
          </ul>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Próximo lançamento</h2>
            <span className="tag">Recomendado</span>
          </div>
          <div className="hero-card">
            <h3>Campanha de comunidade</h3>
            <p>Monte uma rotina de posts e eventos para fortalecer o público.</p>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Discover
