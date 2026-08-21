// Endpoints centralizados para toda a API do Streamify
// Este arquivo é a base para todas as chamadas à API

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export const endpoints = {
  // ============================================================
  // AUTENTICAÇÃO
  // ============================================================
  autenticacao: {
    login: () => `${API_BASE}/accounts/login`,
    registro: () => `${API_BASE}/accounts/register`,
    logout: () => `${API_BASE}/accounts/logout`,
    me: () => `${API_BASE}/accounts/me`,
    perfil: (userId) => `${API_BASE}/accounts/${userId}`,
  },

  dashboard: {
    obter: () => `${API_BASE}/dashboard`,
  },

  // ============================================================
  // LIVES (SALAS DE TRANSMISSÃO)
  // ============================================================
  live: {
    salas: () => `${API_BASE}/live/salas`,
    criarSala: () => `${API_BASE}/live/salas`,
    obterSala: (id) => `${API_BASE}/live/salas/${id}`,
    atualizarSala: (id) => `${API_BASE}/live/salas/${id}`,
    eliminarSala: (id) => `${API_BASE}/live/salas/${id}`,
    entrarSala: (id) => `${API_BASE}/live/salas/${id}/entrar`,
    sairSala: (id) => `${API_BASE}/live/salas/${id}/sair`,
  },

  // ============================================================
  // PUBLICAÇÕES
  // ============================================================
  publicacoes: {
    todas: () => `${API_BASE}/publicacoes`,
    criar: () => `${API_BASE}/publicacoes`,
    obter: (id) => `${API_BASE}/publicacoes/${id}`,
    atualizar: (id) => `${API_BASE}/publicacoes/${id}`,
    eliminar: (id) => `${API_BASE}/publicacoes/${id}`,
    feed: () => `${API_BASE}/publicacoes/feed`,
    porSala: (salaId) => `${API_BASE}/publicacoes/sala/${salaId}`,
  },

  // ============================================================
  // COMENTÁRIOS
  // ============================================================
  comentarios: {
    obter: (publicacaoId) => `${API_BASE}/publicacoes/${publicacaoId}/comentarios`,
    criar: (publicacaoId) => `${API_BASE}/publicacoes/${publicacaoId}/comentarios`,
    atualizar: (publicacaoId, comentarioId) => `${API_BASE}/publicacoes/${publicacaoId}/comentarios/${comentarioId}`,
    eliminar: (publicacaoId, comentarioId) => `${API_BASE}/publicacoes/${publicacaoId}/comentarios/${comentarioId}`,
  },

  // ============================================================
  // REAÇÕES
  // ============================================================
  reacoes: {
    
    obter: (publicacaoId) => `${API_BASE}/publicacoes/${publicacaoId}/reacoes`,
    adicionar: (publicacaoId) => `${API_BASE}/publicacoes/${publicacaoId}/reacoes`,
    remover: (publicacaoId, reacaoId) => `${API_BASE}/publicacoes/${publicacaoId}/reacoes/${reacaoId}`,
  },

  // ============================================================
  // PARTICIPAÇÕES
  // ============================================================
  participacoes: {
    minhas: () => `${API_BASE}/participacoes`,
    aderir: (salaId) => `${API_BASE}/salas/${salaId}/aderir`,
    sair: (salaId) => `${API_BASE}/salas/${salaId}/sair`,
    membrosSala: (salaId) => `${API_BASE}/salas/${salaId}/membros`,
  }, 

  // ============================================================
  // DESCOBRIR
  // ============================================================
  descobrir: {
    feed: () => `${API_BASE}/descobrir/feed`,
    procurarSalas: () => `${API_BASE}/descobrir/salas`,
    procurarPublicacoes: () => `${API_BASE}/descobrir/publicacoes`,
    salasTrending: () => `${API_BASE}/descobrir/salas/trending`,
    publicacoesTrending: () => `${API_BASE}/descobrir/publicacoes/trending`,
  },

  // ============================================================
  // NOTIFICAÇÕES
  // ============================================================
  notificacoes: {
    obter: () => `${API_BASE}/notificacoes`,
    marcarLida: (id) => `${API_BASE}/notificacoes/${id}/lida`,
    eliminar: (id) => `${API_BASE}/notificacoes/${id}`,
  },

  // ============================================================
  // SOCIAL (PLATAFORMAS CONECTADAS)
  // ============================================================
  social: {
    contas: () => `${API_BASE}/social/contas`,
    conectar: (plataforma) => `${API_BASE}/social/contas/${plataforma}/conectar`,
    desconectar: (id) => `${API_BASE}/social/contas/${id}`,
    publicacoesAgendadas: () => `${API_BASE}/social/publicacoes/agendar`,
    agendar: () => `${API_BASE}/social/publicacoes/agendar`,
  },

  // ============================================================
  // ANALYTICS
  // ============================================================
  analytics: {
    dashboard: () => `${API_BASE}/analytics/dashboard`,
    publicacao: (publicacaoId) => `${API_BASE}/analytics/publicacoes/${publicacaoId}`,
    plataformas: () => `${API_BASE}/analytics/plataformas`,
  },
}

export default endpoints
