import { useEffect, useState } from 'react'
import './App.css'
import Home from './pages/Home.jsx'
import Discover from './pages/Discover.jsx'
import Schedule from './pages/Schedule.jsx'
import Analytics from './pages/Analytics.jsx'
import Settings from './pages/Settings.jsx'
import logoImg from './assets/logo.svg'
import houseImg from './assets/house.svg'
import streamImg from './assets/stream.svg'
import settingImg from './assets/setting.svg'

// Menu items displayed in the sidebar
const navigationItems = [
  { id: 'home', label: 'Início', icon: houseImg },
  { id: 'discover', label: 'Descobrir', icon: streamImg },
  { id: 'schedule', label: 'Agenda', icon: streamImg },
  { id: 'analytics', label: 'Analytics', icon: settingImg },
  { id: 'settings', label: 'Configurações', icon: settingImg },
]

const pageComponents = {
  home: Home,
  discover: Discover,
  schedule: Schedule,
  analytics: Analytics,
  settings: Settings,
}

function App() {
  // Sidebar open state: desktop opens by default, mobile starts closed
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.innerWidth > 900
  })

  // Current page shown in the main content
  const [activePage, setActivePage] = useState('home')
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState('00:00:00')

  // Alterna a visibilidade da barra lateral
  function alternarBarra() {
    setSidebarOpen((aberto) => !aberto)
  }

  // Carrega os dados do dashboard do backend quando o app monta
  useEffect(() => {
    async function carregarDashboard() {
      try {
        const resposta = await fetch('http://127.0.0.1:8000/api/dashboard')
        if (!resposta.ok) {
          throw new Error('Não foi possível carregar o painel')
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

  // Contador regressivo para o próximo evento ao vivo
  useEffect(() => {
    function getNextEventDate() {
      const agora = new Date()
      const proximo = new Date(agora)
      proximo.setHours(20, 0, 0, 0)

      if (proximo <= agora) {
        proximo.setDate(proximo.getDate() + 1)
      }

      return proximo
    }

    function formatDuration(ms) {
      if (ms <= 0) return 'Ao vivo'

      const total = Math.floor(ms / 1000)
      const horas = Math.floor(total / 3600)
      const minutos = Math.floor((total % 3600) / 60)
      const segundos = total % 60

      return [horas, minutos, segundos]
        .map((valor) => String(valor).padStart(2, '0'))
        .join(':')
    }

    const target = getNextEventDate()
    const interval = window.setInterval(() => {
      const diff = target - new Date()
      setTimeLeft(formatDuration(diff))
    }, 1000)

    return () => window.clearInterval(interval)
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
          <span className="pilula-superior">No ar — Multistream</span>
          <div className="user-chip" aria-label="Usuário autenticado">
            <img
              className="user-avatar"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
              alt="Foto de perfil"
            />
            <div id="user-info">
              <div className="user-name">Marta Silva</div>
              <div className="user-role">Produtora</div>
            </div>
          </div>
          <button className="btn-primario" type="button">
            Transmitir agora
          </button>
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
                    <img src={item.icon} alt="" />
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      <main className="conteudo-principal">
        <ActivePage dashboard={dashboard} loading={loading} timeLeft={timeLeft} />
      </main>

      <footer className="rodape">
        <p>&copy; 2026 Streamify. Todos os direitos reservados.</p>
      </footer>
      </div>
  )
}

export default App
