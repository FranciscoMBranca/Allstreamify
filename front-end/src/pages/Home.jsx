import { useMemo } from 'react'
import SocialPlatformCard from '../components/SocialPlatformCard'
import PlatformTabs from '../components/PlatformTabs'
import { useSocialPlatforms } from '../hooks/useSocialPlatforms'
import './home.css'

const Home = ({ dashboard, loading: initialLoading }) => {
  const { connectedPlatforms, loading, connectPlatform, disconnectPlatform } = useSocialPlatforms()

  const platforms = useMemo(() => {
    if (!dashboard?.platforms) {
      return []
    }

    return dashboard.platforms.map((platform) => ({
      id: platform.id,
      platform: platform.name,
      title: platform.title,
      description: platform.description,
      icon: platform.icon,
      isConnected: platform.isConnected,
      accountInfo: platform.accountInfo,
    }))
  }, [dashboard])

  const tabs = platforms.map((platform) => ({
    label: platform.title,
    icon: platform.icon,
    badge: platform.isConnected ? null : '!',
  }))

  return (
    <div className="home">
      <section className="connect-platforms-section">
        <div className="section-header">
          <div>
            <h2>Conectar plataformas sociais</h2>
            <p>Gerencie as conexões do seu fluxo de transmissão a partir de um painel único.</p>
          </div>
          <div className="connected-count">
            <span className="count">{dashboard?.summary?.connectedPlatforms ?? 0}</span>
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
                isConnected={platform.isConnected || !!connectedPlatforms[platform.id]}
                accountInfo={platform.accountInfo ?? connectedPlatforms[platform.id]}
                onConnect={() => connectPlatform(platform.id)}
                onDisconnect={() => disconnectPlatform(platform.id)}
                isLoading={loading === platform.id || initialLoading}
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
              isConnected={platform.isConnected || !!connectedPlatforms[platform.id]}
              accountInfo={platform.accountInfo ?? connectedPlatforms[platform.id]}
              onConnect={() => connectPlatform(platform.id)}
              onDisconnect={() => disconnectPlatform(platform.id)}
              isLoading={loading === platform.id || initialLoading}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
