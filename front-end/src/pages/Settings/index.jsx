import { useState, useEffect } from 'react'
import { usePerfilAtual, useUpdatePerfilAtual } from '../../hooks/useUtilizadores'
import './styles.css'

const Perfil = () => {
  const { data: usuario, isLoading, error } = usePerfilAtual()
  const { mutate: atualizarPerfil, isPending } = useUpdatePerfilAtual()
  
  // Estados para edição
  const [editando, setEditando] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    phone: '',
    website: '',
    timezone: '',
    language: '',
  })

  // Preencher formulário com dados do usuário
  useEffect(() => {
    if (usuario) {
      setFormData({
        first_name: usuario.first_name || '',
        last_name: usuario.last_name || '',
        bio: usuario.bio || '',
        phone: usuario.phone || '',
        website: usuario.website || '',
        timezone: usuario.timezone || '',
        language: usuario.language || '',
      })
    }
  }, [usuario])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    atualizarPerfil(formData, {
      onSuccess: () => {
        setEditando(false)
        alert('Perfil atualizado com sucesso!')
      },
      onError: (error) => {
        alert('Erro ao atualizar perfil: ' + error.message)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="perfil-container">
        <div className="loading">Carregando perfil...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="perfil-container">
        <div className="error">Erro ao carregar perfil: {error.message}</div>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="perfil-container">
        <div className="error">Nenhum perfil disponível. Por favor, faça login.</div>
      </div>
    )
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h1>Meu Perfil</h1>
        <button 
          className="btn-editar"
          onClick={() => setEditando(!editando)}
          type="button"
        >
          {editando ? 'Cancelar' : 'Editar Perfil'}
        </button>
      </div>

      {/* Seção de Avatar e Informações Básicas */}
      <div className="perfil-card">
        <div className="avatar-section">
          <div className="avatar-grande">
            {usuario.avatar ? (
              <img src={usuario.avatar} alt={usuario.username} />
            ) : (
              <div className="avatar-placeholder">
                {usuario.first_name?.charAt(0) || usuario.username?.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="info-basica">
            <h2>{usuario.first_name} {usuario.last_name}</h2>
            <p className="username">@{usuario.username}</p>
            <p className="email">{usuario.email}</p>
            
            <div className="status-badges">
              {usuario.email_verified && (
                <span className="badge badge-success">✓ Email verificado</span>
              )}
              {usuario.two_factor_enabled && (
                <span className="badge badge-info">🔒 2FA ativado</span>
              )}
              {usuario.onboarding_done && (
                <span className="badge badge-info">✓ Onboarding completo</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Edição ou Visualização */}
      {editando ? (
        <form className="perfil-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Informações Pessoais</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">Nome</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="last_name">Sobrenome</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Seu sobrenome"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Fale um pouco sobre você"
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Telefone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+55 (11) 99999-9999"
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://seu-site.com"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Preferências</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="timezone">Fuso horário</label>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                >
                  <option value="Africa/Luanda">Africa/Luanda</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Europe/Paris">Europe/Paris</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                  <option value="Australia/Sydney">Australia/Sydney</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="language">Idioma</label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setEditando(false)}
              disabled={isPending}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="perfil-info">
          <div className="info-section">
            <h3>Sobre</h3>
            <p>{usuario.bio || 'Nenhuma bio adicionada'}</p>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Telefone</span>
              <span className="info-value">{usuario.phone || 'Não informado'}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Website</span>
              {usuario.website ? (
                <a href={usuario.website} target="_blank" rel="noopener noreferrer" className="info-value">
                  {usuario.website}
                </a>
              ) : (
                <span className="info-value">Não informado</span>
              )}
            </div>

            <div className="info-item">
              <span className="info-label">Fuso Horário</span>
              <span className="info-value">{usuario.timezone}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Idioma</span>
              <span className="info-value">
                {usuario.language === 'pt' ? 'Português' : usuario.language}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Membro desde</span>
              <span className="info-value">
                {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Última atualização</span>
              <span className="info-value">
                {new Date(usuario.updated_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Perfil
