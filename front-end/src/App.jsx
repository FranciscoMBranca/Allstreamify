import './App.css'
import logoImg from './assets/logo.svg'
import houseImg from './assets/house.svg'
import streamImg from './assets/stream.svg'
import Card from './components/Card'
import { useState, useEffect } from 'react'
import settingImg from './assets/setting.svg'

function App() {
  const featuredStreams = [
    {
      title: 'Multistreaming — Transmissão ao Vivo',
      description: 'Transmita simultaneamente para YouTube, Twitch e Facebook com baixa latência e gerenciamento de canais.',
      tag: 'Ao vivo',
    },
    {
      title: 'Produção ao Vivo',
      description: 'Cenas, sobreposições, controle de áudio e convidados — tudo para produção profissional em tempo real.',
      tag: 'Novo',
    },
    {
      title: 'Análise de Audiência',
      description: 'Métricas em tempo real, chat e insights para entender e ampliar seu público.',
      tag: 'Popular',
    },
  ]

  const [barraMin, setBarraMin] = useState(false)
  const [timeLeft, setTimeLeft] = useState('00:00:00')

  function alternarBarra() {
    setBarraMin((s) => !s)
  }

  // Countdown para o próximo evento (20:00 hoje)
  useEffect(() => {
    function getNextEventDate() {
      const now = new Date()
      const next = new Date(now)
      next.setHours(20, 0, 0, 0)
      if (next <= now) {
        // se já passou das 20:00, usar amanhã
        next.setDate(next.getDate() + 1)
      }
      return next
    }

    function formatDuration(ms) {
      if (ms <= 0) return 'Ao vivo'
      const total = Math.floor(ms / 1000)
      const horas = Math.floor(total / 3600)
      const minutos = Math.floor((total % 3600) / 60)
      const segundos = total % 60
      return [horas, minutos, segundos]
        .map((v) => String(v).padStart(2, '0'))
        .join(':')
    }

    const target = getNextEventDate()
    const interval = setInterval(() => {
      const diff = target - new Date()
      setTimeLeft(formatDuration(diff))
    }, 1000)

    // set initial value
    // setTimeLeft(formatDuration(target - new Date()))

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`app-estrutura ${barraMin ? 'barra-minimizada' : ''}`}>
      <header className="barra-superior">
        <div className="marca">
          <button className="btn-toggle" onClick={alternarBarra} aria-label="Alternar barra lateral">☰</button>
          <img className="icone-marca" src={streamImg} alt="Ícone Streamify" />
          <img className="logo-marca" src={logoImg} alt="Logotipo Streamify" />
        </div>

        <div className="acoes-superior">
          <span className="pilula-superior">No ar — Multistream</span>
          <button className="btn-primario" type="button">Transmitir agora</button>
        </div>
      </header>

      <aside className={`barra-lateral ${barraMin ? 'minimizada' : ''}`}>
        <nav>
          <ul>
            <li>
              <a className="link-navegacao active" href="#home">
                <img src={houseImg} alt="Início" />
                <span>Home</span>
              </a>
            </li>
            <li>
              <a className="link-navegacao" href="#discover">
                <img src={streamImg} alt="Descobrir" />
                <span>Descobrir</span>
              </a>
            </li>
            <li>
              <a className="link-navegacao" href="#library">
                <img src={streamImg} alt="Biblioteca" />
                <span>Biblioteca <span className="badge">3</span></span>
              </a>
            </li>
            <li>
              <a className="link-navegacao" href="#groups">
                <img src={streamImg} alt="Grupos" />
                <span>Grupos</span>
              </a>
            </li>
            <li>
              <a className="link-navegacao" href="#settings">
                <img src={settingImg} alt="Configurações" />
                <span>Configurações</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="conteudo-principal">
        <section className="secao-destaque">
          <div className="copia-destaque">
            <p className="rotulo">Transmissão Multiplataforma</p>
            <h1>Transmita ao vivo para todas as plataformas e conecte sua comunidade.</h1>
            <p>
              Transmita em baixa latência, gerencie cenas, convidados e distribua para YouTube, Twitch, Facebook e mais — tudo em um painel único.
            </p>
            <div className="acoes-destaque">
              <button className="btn-primario" type="button">Transmitir agora</button>
              <button className="btn-secundario" type="button">Configurar transmissão</button>
            </div>
          </div>

          <div className="cartao-destaque">
            <h3>Próximo ao vivo</h3>
            <p>Transmissão: Como configurar multistream com produção remota.</p>
            <div className="cartao-cta">
              <span className="contador">{timeLeft}</span>
              <button className="btn-primario" type="button">Entrar na sala</button>
              <button className="btn-secundario" type="button">Gerenciar</button>
            </div>
          </div>
        </section>

        <section className="cabecalho-secao">
          <h2>Transmissões em destaque</h2>
          <a href="#all">Ver tudo</a>
        </section>

        <section className="grelha-cartoes">
          {featuredStreams.map((stream) => (
            <Card
              key={stream.title}
              title={stream.title}
              description={stream.description}
              tag={stream.tag}
            />
          ))}
        </section>
      </main>

      <footer className="rodape">
        <p>&copy; 2026 Streamify. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}

export default App
      