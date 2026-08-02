import './pages.css'

function Schedule() {
  return (
    <section className="page-shell">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Agenda</p>
          <h1>Organize sua agenda de conteúdo</h1>
          <p className="page-subtitle">
            Planeje lives, posts e campanhas sem perder o ritmo do calendário.
          </p>
        </div>
      </header>

      <div className="panel-grid">
        <article className="panel">
          <div className="panel-header">
            <h2>Próximos eventos</h2>
            <span className="tag">3 esta semana</span>
          </div>
          <ul className="list-stack">
            <li className="list-item">
              <div>
                <strong>Live de lançamento</strong>
                <p>Quarta-feira · 20:00</p>
              </div>
            </li>
            <li className="list-item">
              <div>
                <strong>Q&amp;A com audiência</strong>
                <p>Sexta-feira · 19:30</p>
              </div>
            </li>
          </ul>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Checklist</h2>
            <span className="tag">Ajustes rápidos</span>
          </div>
          <div className="hero-card">
            <h3>Revisão de rotina</h3>
            <p>Confirme sinais, câmera, iluminação e materiais de apoio.</p>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Schedule
