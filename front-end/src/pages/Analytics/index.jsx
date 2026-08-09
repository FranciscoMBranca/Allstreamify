// Página Analytics: métricas e gráficos
import { useEffect, useMemo, useState } from 'react'
import './styles.css'


const platforms = ['YouTube', 'Twitch', 'Instagram', 'TikTok', 'LinkedIn','X','Facebook']

function Analytics() {
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0])
  const [selectedRange, setSelectedRange] = useState('Semana')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true)
        const response = await fetch(`http://127.0.0.1:8000/api/analytics/dashboard?platform=${encodeURIComponent(selectedPlatform)}&range_name=${encodeURIComponent(selectedRange)}`)
        if (!response.ok) {
          throw new Error('Falha ao carregar métricas')
        }

        const json = await response.json()
        setData(json)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [selectedPlatform, selectedRange])

  const bars = useMemo(() => data?.bars ?? [], [data])
  const trend = useMemo(() => data?.trend ?? [], [data])
  const distribution = useMemo(() => {
    const values = bars.map((item) => item.value)
    const max = Math.max(...values, 1)
    return bars.map((item) => ({ ...item, height: `${(item.value / max) * 100}%` }))
  }, [bars])

  return (
    <section className="page-shell">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Analytics</p>
          <h1>Métricas de engajamento</h1>
          <p className="page-subtitle">
            Painel visual com múltiplos gráficos para acompanhar o desempenho por plataforma.
          </p>
        </div>
      </header>

      <div className="analytics-controls">
        <label className="control-field">
          <span>Plataforma</span>
          <select value={selectedPlatform} onChange={(event) => setSelectedPlatform(event.target.value)}>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </label>

        <label className="control-field">
          <span>Filtro</span>
          <select value={selectedRange} onChange={(event) => setSelectedRange(event.target.value)}>
            <option value="Hoje">Hoje</option>
            <option value="Semana">Semana</option>
            <option value="Mês">Mês</option>
          </select>
        </label>
      </div>

      <div className="panel-grid">
        <article className="panel analytics-panel">
          <div className="panel-header">
            <h2>{selectedPlatform} · {selectedRange}</h2>
            <span className="tag">Engajamento</span>
          </div>

          <div className="chart-card">
            <div className="chart-bars" aria-label="Gráfico de barras de engajamento">
              {distribution.map((point) => (
                <div key={point.label} className="chart-column">
                  <div className="chart-fill" style={{ height: point.height }} />
                  <span className="chart-label">{point.label}</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Resumo</h2>
            <span className="tag">Comparativo</span>
          </div>
          <ul className="list-stack">
            <li className="list-item">
              <div>
                <strong>Visualizações</strong>
                <p>{data?.summary?.totalViews ?? 0}</p>
              </div>
            </li>
            <li className="list-item">
              <div>
                <strong>Likes</strong>
                <p>{data?.summary?.totalLikes ?? 0}</p>
              </div>
            </li>
            <li className="list-item">
              <div>
                <strong>Comentários</strong>
                <p>{data?.summary?.totalComments ?? 0}</p>
              </div>
            </li>
          </ul>
        </article>
      </div>

      <div className="panel-grid triple-grid">
        <article className="panel">
          <div className="panel-header">
            <h2>Linha de tendência</h2>
            <span className="tag">Pico</span>
          </div>
          <div className="mini-chart" aria-label="Gráfico de linha">
            {trend.map((point) => (
              <div key={point.label} className="mini-chart-item">
                <div className="mini-chart-point" style={{ height: `${Math.max(10, point.value / 12)}px` }} />
                <span>{point.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Distribuição</h2>
            <span className="tag">Mapa</span>
          </div>
          <div className="donut-card">
            <div className="donut" />
            <div className="donut-label">{loading ? 'Carregando...' : `${bars[0]?.value ?? 0} pts`}</div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Resumo rápido</h2>
            <span className="tag">Insights</span>
          </div>
          <div className="insight-box">
            <strong>Maior pico:</strong>
            <p>{bars[bars.length - 1]?.label ?? 'Sem dados'}</p>
            <strong>Engajamento alto:</strong>
            <p>{data?.summary?.peakEngagement ?? 0} pontos</p>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Analytics
