import './pages.css'
import { dashboardData } from '../data/dashboardData.js'

function Home({ dashboard, loading, timeLeft }) {
  const data = dashboard ?? dashboardData

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
            <button className="btn-primario" type="button">
              Abrir checklist
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Home
