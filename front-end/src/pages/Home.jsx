import SocialPlatformCard from '../SocialPlatformCard'
import PlatformTabs from '../PlatformTabs'
import { useSocialPlatforms } from '../../hooks/useSocialPlatforms'
import './home.css'

const Home = () => {
  const { connectedPlatforms, loading, connectPlatform, disconnectPlatform } =
    useSocialPlatforms()

  const platforms = [
    {
      id: 'youtube',
      platform: 'YouTube',
      title: 'YouTube',
      description:
        'Transmita em tempo real para seu canal YouTube com qualidade até 4K e gerenciamento completo de transmissão ao vivo.',
      icon: 'https://api.iconify.design/mdi:youtube.svg?color=%23FF0000',
    },
    {
      id: 'linkedin',
      platform: 'LinkedIn',
      title: 'LinkedIn',
      description:
        'Conecte seu perfil ou página LinkedIn para transmitir eventos profissionais e alcançar sua rede de negócios.',
      icon: 'https://api.iconify.design/mdi:linkedin.svg?color=%230A66C2',
    },
    {
      id: 'twitch',
      platform: 'Twitch',
      title: 'Twitch',
      description:
        'Transmita para Twitch com suporte a moderação, chat integrado e monetização de conteúdo.',
      icon: 'https://api.iconify.design/mdi:twitch.svg?color=%239146FF',
    },
  ]

  const tabs = platforms.map((platform) => ({
    label: platform.title,
    icon: platform.icon,
    badge: connectedPlatforms[platform.id] ? null : '!',
  }))

  return (
    <div className="home">
      <section className="connect-platforms-section">
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

        <PlatformTabs tabs={tabs} defaultTab={0}>
          {platforms.map((platform) => (
            <div key={platform.id} className="platform-content">
              <SocialPlatformCard
                platform={platform.platform}
                icon={platform.icon}
                title={platform.title}
                description={platform.description}
                isConnected={!!connectedPlatforms[platform.id]}
                accountInfo={connectedPlatforms[platform.id]}
                onConnect={() => connectPlatform(platform.id)}
                onDisconnect={() => disconnectPlatform(platform.id)}
                isLoading={loading === platform.id}
              />
            </div>
          ))}
        </PlatformTabs>

        <div className="platforms-grid">
          {platforms.map((platform) => (
            <SocialPlatformCard
              key={platform.id}
              platform={platform.platform}
              icon={platform.icon}
              title={platform.title}
              description={platform.description}
              isConnected={!!connectedPlatforms[platform.id]}
              accountInfo={connectedPlatforms[platform.id]}
              onConnect={() => connectPlatform(platform.id)}
              onDisconnect={() => disconnectPlatform(platform.id)}
              isLoading={loading === platform.id}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
