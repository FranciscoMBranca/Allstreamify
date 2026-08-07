// Página de IA.
// Centraliza as sugestões criadas pela inteligência artificial e o fluxo de geração.
import './pages.css'

// Página de IA. O backend expõe /api/ai/sugestoes e /api/ai/hashtags.
function AI() {
  const suggestions = [
    {
      title: 'Roteiro de transmissão',
      detail: 'Sugestão gerada pela IA para abrir a live com foco em conversão.',
    },
    {
      title: 'Hashtags de campanha',
      detail: '#streamify #multistream #livebrand #engajamento',
    },
    {
      title: 'Mensagem de follow-up',
      detail: 'A IA pode gerar comentários e respostas após a transmissão.',
    },
  ]

  return (
    <section className="page-shell">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">AI</p>
          <h1>Conteúdo assistido por IA</h1>
          <p className="page-subtitle">
            Esta área representa o módulo de geração de texto, hashtags e sugestões de conteúdo.
          </p>
        </div>
      </header>

      <div className="panel-grid">
        <article className="panel">
          <div className="panel-header">
            <h2>Sugestões</h2>
            <span className="tag">Geradas</span>
          </div>

          <ul className="list-stack">
            {suggestions.map((item) => (
              <li key={item.title} className="list-item">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Ferramenta de IA</h2>
            <span className="tag">Assistida</span>
          </div>
          <div className="hero-card">
            <h3>Fluxo de geração</h3>
            <p>
              O frontend envia prompt para o backend; o Django guarda o log e devolve a resposta para a UI.
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}

export default AI
