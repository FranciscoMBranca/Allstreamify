import { useState } from 'react'
import PlatformTabs from '../PlatformTabs'
import SocialPlatformCard from '../SocialPlatformCard'
import './connectPlatforms.css'

const ConnectPlatforms = ({ platforms = [] }) => {
  const [connectedPlatforms, setConnectedPlatforms] = useState({})

  const defaultPlatforms = [
    {
      id: 'youtube',
      platform: 'YouTube',
      title: 'YouTube',
      description: 'Transmita em tempo real para seu canal YouTube com qualidade até 4K e gerenciamento completo de transmissão ao vivo.',
      icon: '/assets/youtube-icon.svg',
    },
    {
      id: 'linkedin',
      platform: 'LinkedIn',
      title: 'LinkedIn',
      description: 'Conecte seu perfil ou página LinkedIn para transmitir eventos profissionais e alcançar sua rede de negócios.',
      icon: '/assets/linkedin-icon.svg',
    },
    {
      id: 'twitch',
      platform: 'Twitch',
      title: 'Twitch',
      description: 'Transmita para Twitch com suporte a moderação, chat integrado e monetização de conteúdo.',
      icon: '/assets/twitch-icon.svg',
    },
  ]

  const platformsToDisplay = platforms.length > 0 ? platforms : defaultPlatforms

  const handleConnect = (platformId) => {
    // Simular conexão - em produção, isso iniciaria o fluxo OAuth
    console.log(`Iniciando conexão com ${platformId}...`)
    
    // Simular resposta bem-sucedida após "autenticação"
    setTimeout(() => {
      setConnectedPlatforms({
        ...connectedPlatforms,
        [platformId]: {
          username: `usuario_${platformId}`,
          followers: Math.floor(Math.random() * 10000) + 1000,
          connectedAt: new Date().toISOString(),
        },
      })
    }, 1000)
  }

  const handleDisconnect = (platformId) => {
    const newConnected = { ...connectedPlatforms }
    delete newConnected[platformId]
    setConnectedPlatforms(newConnected)
  }

  const tabs = platformsToDisplay.map((platform) => ({
    label: platform.title,
    icon: platform.icon,
    badge: connectedPlatforms[platform.id] ? null : '!',
  }))

  return (
    <section className="connect-platforms">
      <div className="section-header">
        <div>
          <h2>Conectar Plataformas Sociais</h2>
          <p>Gerencie suas transmissões em múltiplas plataformas a partir de um único painel</p>
        </div>
        <div className="connected-count">
          <span className="count">{Object.keys(connectedPlatforms).length}</span>
          <span className="text">Conectado</span>
        </div>
      </div>

      <PlatformTabs tabs={tabs}>
        {platformsToDisplay.map((platform) => (
          <div key={platform.id} className="platform-content">
            <SocialPlatformCard
              platform={platform.platform}
              icon={platform.icon}
              title={platform.title}
              description={platform.description}
              isConnected={!!connectedPlatforms[platform.id]}
              accountInfo={connectedPlatforms[platform.id]}
              onConnect={() => handleConnect(platform.id)}
              onDisconnect={() => handleDisconnect(platform.id)}
            />
          </div>
        ))}
      </PlatformTabs>

      <div className="platforms-grid">
        {platformsToDisplay.map((platform) => (
          <SocialPlatformCard
            key={platform.id}
            platform={platform.platform}
            icon={platform.icon}
            title={platform.title}
            description={platform.description}
            isConnected={!!connectedPlatforms[platform.id]}
            accountInfo={connectedPlatforms[platform.id]}
            onConnect={() => handleConnect(platform.id)}
            onDisconnect={() => handleDisconnect(platform.id)}
          />
        ))}
      </div>
    </section>
  )
}

export default ConnectPlatforms
