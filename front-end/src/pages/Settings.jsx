// Página de configurações do produto.
// Serve como painel de preferências, segurança e ajustes do workspace.
import './pages.css'
function Settings() {
  
  return (
    <section className="page-shell">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Configurações</p>
          <h1>Personalize o seu workspace</h1>
          <p className="page-subtitle">
            Ajuste preferências de canal, notificações e integração das plataformas.
          </p>
        </div>
      </header>

      <div className="panel-grid">
        <article className="panel">
          <div className="panel-header">
            <h2>Preferências</h2>
            <span className="tag">Ativas</span>
          </div>
          <ul className="list-stack">
            <li className="list-item">
              <div>
                <strong>Notificações</strong>
                <p>Receba alertas para eventos importantes e comentários.</p>
              </div>
            </li>
            <li className="list-item">
              <div>
                <strong>Integrações</strong>
                <p>Gerencie conexões e permissões de envio de conteúdo.</p>
              </div>
            </li>
          </ul>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Segurança</h2>
            <span className="tag">Protegido</span>
          </div>
          <div className="hero-card">
            <h3>Autenticação reforçada</h3>
            <p>Mantenha o acesso seguro com validação e controle de sessões.</p>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Settings
