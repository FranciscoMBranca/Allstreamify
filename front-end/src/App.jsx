import { useEffect, useState } from 'react'
import './App.css'
import Home from './pages/Home.jsx'
import logoImg from './assets/logo.svg'
import houseImg from './assets/house.svg'
import streamImg from './assets/stream.svg'
import settingImg from './assets/setting.svg'


function App() {
  const [barraMin, setBarraMin] = useState(false)
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  function alternarBarra() {
    setBarraMin((valor) => !valor)
  }

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

  


  return (
    <div className={`app-estrutura ${barraMin ? 'barra-minimizada' : ''}`}>

    
      <header className="barra-superior">
        <div className="marca">
          <button
            className="btn-toggle"
            onClick={alternarBarra}
            aria-label="Alternar barra lateral"
            aria-expanded={!barraMin}
            type="button"
          >
            ☰
          </button>
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
                <span>Início</span>
              </a>
            </li>
            <li>
              <a className="link-navegacao" href="#discover">
                <img src={streamImg} alt="Descobrir" />
                <span>Descobrir</span>
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
        <Home dashboard={dashboard} loading={loading} />

    
      </main>

      <footer className="rodape">
        <p>&copy; 2026 Streamify. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}

export default App
      