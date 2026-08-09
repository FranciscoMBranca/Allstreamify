// Página Inbox: mensagens, salas e chats
import { useState } from 'react'
import './styles.css'

function Inbox() {
  const [activeTab, setActiveTab] = useState('mensagens')

  const tabs = [
    { id: 'mensagens', label: 'Mensagens' },
    { id: 'salas', label: 'Salas' },
    { id: 'chats', label: 'Chats' },
    { id: 'notificacoes', label: 'Notificações' },
  ]

  const messages = [
    { author: 'Francisco', channel: 'YouTube', preview: 'Vimos o seu último comentário e já estamos a preparar a follow-up.' },
    { author: 'Pedro', channel: 'Instagram', preview: 'Recebemos uma pergunta sobre a próxima live de lançamento.' },
    { author: 'Nina', channel: 'Twitch', preview: 'O chat está muito ativo e pedem mais conteúdo exclusivo.' },
  ]

  const rooms = [
    { title: 'Room #1', subtitle: 'Discussão de lançamento', status: 'Ao vivo' },
    { title: 'Room #2', subtitle: 'Estratégia de conteúdo', status: 'Agendada' },
    { title: 'Room #3', subtitle: 'Design e identidade', status: 'Gravada' },
  ]

  const chatThreads = [
    { user: 'Mateus', lastMessage: 'Preciso de atualizar os quadros de agenda.' },
    { user: 'Larissa', lastMessage: 'A live de amanhã foi confirmada.' },
    { user: 'André', lastMessage: 'Temos feedback sobre as notificações push.' },
  ]

  const notifications = [
    { title: 'Novo comentário', description: 'O vídeo de hoje recebeu 23 comentários.' },
    { title: 'Meta atualizada', description: 'A meta de inscritos foi alcançada em 82%.' },
    { title: 'Regras de IA ativas', description: 'Resposta automática ativada para mensagens.' },
  ]

  return (
    <section className="page-shell">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Inbox</p>
          <h1>Mensagens e interações</h1>
          <p className="page-subtitle">Esta página representa o fluxo de mensagens vindas das redes sociais e da gestão de comentários.</p>
        </div>
      </header>

      <div className="inbox-tabs">
        <div className="inbox-tab-list" role="tablist" aria-label="Abas de Inbox">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="inbox-tab-panel">
          {activeTab === 'mensagens' && (
            <article className="panel inbox-panel">
              <div className="panel-header">
                <h2>Mensagens recentes</h2>
                <span className="tag">{messages.length}</span>
              </div>
              <ul className="list-stack">
                {messages.map((message) => (
                  <li key={`${message.author}-${message.channel}`} className="list-item">
                    <div>
                      <strong>{message.author}</strong>
                      <p>{message.channel}</p>
                    </div>
                    <p>{message.preview}</p>
                  </li>
                ))}
              </ul>
            </article>
          )}

          {activeTab === 'salas' && (
            <article className="panel inbox-panel">
              <div className="panel-header">
                <h2>Salas</h2>
                <span className="tag">{rooms.length}</span>
              </div>
              <ul className="list-stack">
                {rooms.map((room) => (
                  <li key={room.title} className="list-item">
                    <div>
                      <strong>{room.title}</strong>
                      <p>{room.subtitle}</p>
                    </div>
                    <span className={`status-pill ${room.status === 'Ao vivo' ? 'online' : room.status === 'Agendada' ? 'offline' : ''}`}>
                      {room.status}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          )}

          {activeTab === 'chats' && (
            <article className="panel inbox-panel">
              <div className="panel-header">
                <h2>Chats</h2>
                <span className="tag">{chatThreads.length}</span>
              </div>
              <ul className="list-stack">
                {chatThreads.map((thread) => (
                  <li key={thread.user} className="list-item">
                    <div>
                      <strong>{thread.user}</strong>
                      <p>Última mensagem</p>
                    </div>
                    <p>{thread.lastMessage}</p>
                  </li>
                ))}
              </ul>
            </article>
          )}

          {activeTab === 'notificacoes' && (
            <article className="panel inbox-panel">
              <div className="panel-header">
                <h2>Notificações</h2>
                <span className="tag">{notifications.length}</span>
              </div>
              <div className="list-stack">
                {notifications.map((notification) => (
                  <div key={notification.title} className="notification-item">
                    <strong>{notification.title}</strong>
                    <p>{notification.description}</p>
                  </div>
                ))}
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  )
}

export default Inbox
