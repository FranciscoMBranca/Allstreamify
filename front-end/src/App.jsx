// App principal do painel Streamify.
// Este componente controla a navegação entre páginas, o estado do menu lateral
// e os dados gerais do dashboard consumidos pela interface.
import { useEffect, useState } from 'react'
import './App.css'
import ErrorBoundary from './ErrorBoundary'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Schedule from './pages/Schedule'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Social from './pages/Social'
import Inbox from './pages/Inbox'
import AI from './pages/AI'
import logoImg from './assets/logo.svg'
import streamImg from './assets/stream.svg'
import graceImg from './assets/grace.jpg'
import NotificationPanel from './components/NotificationPanel'
import LoginSignupForm from './pages/LoginSigin'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

// Menu lateral do produto. Cada item mapeia para uma rota de página e um endpoint do backend.
const navigationItems = [
  {
    id: 'home',
    label: 'Início',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-5H9v5H4a1 1 0 0 1-1-1v-9.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'discover',
    label: 'Descobrir',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.3" fill="none" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M15 8 9.5 13.5l1.5 4.5 5.5-3.5L15 8Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'schedule',
    label: 'Agenda',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 2.5v4M16 2.5v4M7 10.5h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 18v-6M10 18v-2M14 18v-4M18 18v-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'social',
    label: 'Social',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v14H4z" fill="none" stroke="currentColor" strokeWidth="1.8" rx="2"/>
        <path d="M8 8h8M8 12h8M8 16h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'inbox',
    label: 'Inbox',
    badge: '3',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 7H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z" fill="none" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'ai',
    label: 'IA',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.5 9.5h9M7.5 14.5h9M12 8.5v7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="8.5" cy="8.5" r="1.2" fill="none" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="15.5" cy="8.5" r="1.2" fill="none" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="15.5" r="1.2" fill="none" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M4.6 12.8h2.7M16.7 12.8h2.7M12 4.6v2.7M12 16.7v2.7M6.6 6.6l1.9 1.9M15.5 15.5l1.9 1.9M6.6 17.4l1.9-1.9M15.5 8.5l1.9-1.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const pageComponents = {
  home: Home,
  discover: Discover,
  schedule: Schedule,
  analytics: Analytics,
  social: Social,
  inbox: Inbox,
  ai: AI,
  settings: Settings,
}

function App() {
  // Agrupa os atalhos do header para manter o topo organizado e centrado.
  const headerActions = [
    {
      id: 'live',
      label: 'Live',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="7" width="12.5" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M16 10.2 20.5 8v8l-4.5-2.2v-3.6Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 'messages',
      label: 'Mensagens',
      badge: '5',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 6.75A2.75 2.75 0 0 1 7.75 4h8.5A2.75 2.75 0 0 1 19 6.75v6.5A2.75 2.75 0 0 1 16.25 16H10l-5 4v-4.25A2.75 2.75 0 0 1 5 13.25v-6.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 9h7M8.5 12h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: 'notifications',
      label: 'Notificações',
      badge: '11',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4.5a5 5 0 0 1 5 5v3.2l1.3 3.3H5.7l1.3-3.3V9.5a5 5 0 0 1 5-5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 18a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: 'groups',
      label: 'Grupos',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Zm8 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5ZM3.5 17.5a4.5 4.5 0 0 1 9 0M11.5 17.5a4.5 4.5 0 0 1 9 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ]

  // A barra lateral inicia minimizada para deixar o dashboard mais limpo.
  // O usuário pode expandi-la manualmente com o botão do topo.
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelType, setPanelType] = useState('messages')

  // Current page shown in the main content
  const [activePage, setActivePage] = useState('home')
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState('pt')
  const languageLabels = { pt: 'Português', en: 'English', es: 'Español' }

  // Alterna a visibilidade da barra lateral
  function alternarBarra() {
    setSidebarOpen((aberto) => !aberto)
  }
  function handleLogout() {
    // Implementar logout real com backend quando disponível
    console.log('Logout solicitado')
    alert('Terminar sessão - ação simulada')
  }

  function cycleLanguage() {
    const order = ['pt', 'en', 'es']
    const currentIndex = order.indexOf(language)
    const next = order[(currentIndex + 1) % order.length]
    setLanguage(next)
    console.log('Idioma alterado para', next)
  }

  function abrirPainel(tipo) {
    setPanelType(tipo)
    setPanelOpen(true)
  }

  function fecharPainel() {
    setPanelOpen(false)
  }

  // Faz a primeira carga do dashboard. O mesmo padrão se repete em outras páginas: a UI chama o backend e renderiza o resultado.
  useEffect(() => {
    async function carregarDashboard() {
      try {
        const resposta = await fetch(`${API_BASE_URL}/dashboard`)
        if (!resposta.ok) {
          console.error('Erro ao carregar dashboard:', resposta.statusText)
          throw new Error('Não foi possível carregar o painel');
          
        }

        const dados = await resposta.json()
        setDashboard(dados)
      } catch (erro) {
        console.error('Erro ao carregar dashboard:', erro)
      } finally {
        setLoading(false)
      }
    }

    carregarDashboard()
  }, [])

  const ActivePage = pageComponents[activePage] ?? Home



  return (
    <div className={`app-estrutura ${sidebarOpen ? '' : 'barra-minimizada'}`}>
      <header className="barra-superior">
        <div className="marca">
          <button
            className="btn-toggle"
            onClick={alternarBarra}
            aria-label="Alternar barra lateral"
            aria-expanded={sidebarOpen}
            type="button"
          >
            ☰
          </button>
          <img className="icone-marca" src={streamImg} alt="Ícone Streamify" />
          <img className="logo-marca" src={logoImg} alt="Logotipo Streamify" />
        </div>

        <div className="acoes-superior">
          

          <div className="header-actions" aria-label="Ações do usuário">
            {headerActions.map((action) => (
              <button
                key={action.id}
                className="header-icon-button"
                type="button"
                aria-label={action.label}
                title={action.label}
                onClick={() => {
                  if (action.id === 'messages' || action.id === 'notifications') {
                    abrirPainel(action.id)
                  }
                }}
              >
                {action.icon}
                {action.badge ? <sup>{action.badge}</sup> : null}
              </button>
            ))}
          </div>

          <div className="user-chip" aria-label="Usuário autenticado">
            <img
              className="user-avatar"
              src={graceImg}
              alt="Foto de perfil"
            />
            <div id="user-info">
              <div className="user-name">Francisco Brança</div>
              <div className="user-role">desenvolvedor</div>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'active' : ''}`}
        onClick={alternarBarra}
        aria-hidden="true"
      />

      <aside className={`barra-lateral ${sidebarOpen ? '' : 'minimizada'}`}>
        <nav className="nav-lateral" aria-label="Navegação principal">
          <ul>
            {navigationItems.map((item) => {
              const isActive = activePage === item.id

              return (
                <li key={item.id}>
                  <button
                    className={`link-navegacao ${isActive ? 'active' : ''}`}
                    type="button"
                    onClick={() => {
                      setActivePage(item.id)
                      if (window.matchMedia('(max-width: 900px)').matches) {
                        setSidebarOpen(false)
                      }
                    }}
                  >
                    <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                    <span className='link-navegacao-label'>{item.label}</span>
                    {item.badge ? <sup className="nav-badge">{item.badge}</sup> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar-footer" aria-label="Ações da conta">
          <ul className="footer-nav">
            <li>
              <button type="button" className="link-navegacao" onClick={cycleLanguage} aria-label="Mudar idioma">
                <span className="nav-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5 12h-3.5a12 12 0 0 1-1.5 4.5A8 8 0 0 0 17 14zM7 14a8 8 0 0 0 5 2.5V14H7zM7 10h5V7.5A8 8 0 0 0 7 10zM12 4.5V7h5a8 8 0 0 0-5-2.5z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="link-navegacao-label">{languageLabels[language] || 'Idioma'}</span>
              </button>
            </li>

            <li>
              <button type="button" className="link-navegacao" onClick={handleLogout} aria-label="Terminar sessão">
                <span className="nav-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M16 3h5v18h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 12h12M11 8l-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="link-navegacao-label">Terminar sessão</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <main className="conteudo-principal">
        <ErrorBoundary>
          <ActivePage dashboard={dashboard} loading={loading} /> 
          {/* <LoginSignupForm/> */}
        </ErrorBoundary>
      </main>

      <NotificationPanel open={panelOpen} panelType={panelType} onClose={fecharPainel} />

      <footer className="rodape">
        <p>&copy; 2026 Streamify. Todos os direitos reservados.</p>
      </footer>
      </div>
  )
}

export default App
