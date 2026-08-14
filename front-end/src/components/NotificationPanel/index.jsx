function NotificationPanel({ open, panelType, onClose }) {
  const contentByType = {
    messages: {
      title: 'Mensagens',
      subtitle: 'Conversa rápida com sua equipe',
      items: [
        {
          title: 'Equipe de conteúdo',
          description: 'O próximo post já está pronto para revisão.',
          highlight: true,
        },
        {
          title: 'André',
          description: 'Enviei as legendas para análise.',
          highlight: false,
        },
        {
          title: 'Marina',
          description: 'Confirmou a agenda de lives desta semana.',
          highlight: false,
        },
      ],
    },
    notifications: {
      title: 'Notificações',
      subtitle: 'Alertas recentes do painel',
      items: [
        {
          title: 'Nova integração',
          description: 'As plataformas do social já estão prontas para conexão.',
          highlight: true,
        },
        {
          title: 'Engajamento',
          description: 'O público cresceu 12% esta semana.',
          highlight: false,
        },
        {
          title: 'Agenda',
          description: 'Uma live está agendada para daqui a 2 horas.',
          highlight: false,
        },
      ],
    },
  }

  const activeContent = contentByType[panelType] || contentByType.messages

  return (
    <aside className={`painel-lateral ${open ? 'ativo' : ''}`} aria-label="Painel de mensagens e notificações">
      <div className="painel-lateral-cabecalho">
        <div>
          <p className="painel-lateral-titulo">{activeContent.title}</p>
          <span className="painel-lateral-subtitulo">{activeContent.subtitle}</span>
        </div>

        <button type="button" className="painel-fechar" onClick={onClose} aria-label="Fechar painel">
          ×
        </button>
      </div>

      <div className="painel-lateral-corpo">
        {activeContent.items.map((item) => (
          <div key={item.title} className={`painel-item ${item.highlight ? 'painel-item-destaque' : ''}`}>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default NotificationPanel
