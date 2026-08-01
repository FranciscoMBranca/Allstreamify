import './socialPlatformCard.css'

const SocialPlatformCard = ({
  platform,
  icon,
  title,
  description,
  isConnected,
  onConnect,
  onDisconnect,
  accountInfo,
  isLoading = false,
}) => {
  return (
    <div className={`social-card ${isConnected ? 'connected' : ''} ${isLoading ? 'loading' : ''}`}>
      <div className="social-card-header">
        <img src={icon} alt={platform} className="social-icon" />
        <div className="social-info">
          <h3>{title}</h3>
          <p className="platform-name">{platform}</p>
        </div>
        <div className={`status-badge ${isConnected ? 'active' : 'inactive'}`}>
          {isLoading ? '⟳ Processando...' : isConnected ? '✓ Conectado' : 'Não conectado'}
        </div>
      </div>

      <div className="social-card-body">
        <p className="description">{description}</p>
        
        {isConnected && accountInfo && (
          <div className="account-info">
            <div className="info-item">
              <span className="label">Conta:</span>
              <span className="value">{accountInfo.username}</span>
            </div>
            {accountInfo.followers && (
              <div className="info-item">
                <span className="label">Seguidores:</span>
                <span className="value">{accountInfo.followers.toLocaleString()}</span>
              </div>
            )}
            {accountInfo.connectedAt && (
              <div className="info-item">
                <span className="label">Conectado em:</span>
                <span className="value">{new Date(accountInfo.connectedAt).toLocaleDateString('pt-PT')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="social-card-actions">
        {isConnected ? (
          <>
            <button className="btn-secondary" onClick={onDisconnect} disabled={isLoading}>
              Desconectar
            </button>
            <button className="btn-primary" disabled={isLoading}>
              Gerenciar
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={onConnect} disabled={isLoading}>
            {isLoading ? 'Conectando...' : `Conectar ${platform}`}
          </button>
        )}
      </div>
    </div>
  )
}

export default SocialPlatformCard
