import './pages.css'

// Página que mostra o estado das contas sociais conectadas.
// O backend expõe /api/social/contas e /api/platforms/connect.
function Social() {
  const accounts = [
    {
      platform: 'YouTube',
      username: '@streamify',
      status: 'Conectada',
      color: 'online',
    },
    {
      platform: 'Twitch',
      username: '@streamify_live',
      status: 'Pendente',
      color: 'offline',
    },
    {
      platform: 'LinkedIn',
      username: 'Streamify Media',
      status: 'Conectada',
      color: 'online',
    },
  ]

  return (
    <section className="page-shell">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Social</p>
          <h1>Contas e conexões</h1>
          <p className="page-subtitle">
            Aqui ficam as contas conectadas aos canais, o mesmo fluxo usado no endpoint de conectividade do backend.
          </p>
        </div>
      </header>

      <div className="panel-grid">
        <article className="panel">
          <div className="panel-header">
            <h2>Plataformas conectadas</h2>
            <span className="tag">{accounts.length}</span>
          </div>

          <ul className="list-stack">
            {accounts.map((account) => (
              <li key={account.platform} className="list-item">
                <div>
                  <strong>{account.platform}</strong>
                  <p>{account.username}</p>
                </div>
                <span className={`status-pill ${account.color}`}>
                  {account.status}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Fluxo de conexão</h2>
            <span className="tag">OAuth</span>
          </div>
          <div className="hero-card">
            <h3>Como funciona</h3>
            <p>
              O front chama o endpoint /api/platforms/connect, o Django valida os dados e grava a conta social no modelo SocialAccount.
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Social
