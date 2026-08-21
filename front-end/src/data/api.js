// API centralizada com todos os endpoints prontos para invocação
// Este ficheiro oferece uma interface unificada para todas as operações

import { endpoints } from './endpoints'
 const AuthToken = localStorage.getItem('authToken') || null
// Função auxiliar para fazer requisições
async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(AuthToken ? { Authorization: `Bearer ${AuthToken}` } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Erro ao consultar a API'

    try {
      const errorBody = await response.json()
      message = errorBody?.detail ?? errorBody?.message ?? message
    } catch {
      console.error('Erro na resposta da API:', response.status)
    }

    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

// ==================== LIVE ====================
export const live = {
  getSalas: () => request(endpoints.live.salas()),
  createSala: (payload) => request(endpoints.live.criarSala(), { method: 'POST', body: JSON.stringify(payload) }),
  getSala: (id) => request(endpoints.live.obterSala(id)),
  updateSala: (id, payload) => request(endpoints.live.atualizarSala(id), { method: 'PUT', body: JSON.stringify(payload) }),
  deleteSala: (id) => request(endpoints.live.eliminarSala(id), { method: 'DELETE' }),
  enterSala: (id) => request(endpoints.live.entrarSala(id), { method: 'POST' }),
  leaveSala: (id) => request(endpoints.live.sairSala(id), { method: 'POST' }),
}

// ==================== PUBLICAÇÕES ====================
export const publicacoes = {
  getAll: () => request(endpoints.publicacoes.todas()),
  create: (payload) => request(endpoints.publicacoes.criar(), { method: 'POST', body: JSON.stringify(payload) }),
  get: (id) => request(endpoints.publicacoes.obter(id)),
  update: (id, payload) => request(endpoints.publicacoes.atualizar(id), { method: 'PUT', body: JSON.stringify(payload) }),
  delete: (id) => request(endpoints.publicacoes.eliminar(id), { method: 'DELETE' }),
  getFeed: () => request(endpoints.publicacoes.feed()),
  getBySala: (salaId) => request(endpoints.publicacoes.porSala(salaId)),
}

// ==================== COMENTÁRIOS ====================
export const comentarios = {
  get: (publicacaoId) => request(endpoints.comentarios.obter(publicacaoId)),
  create: (publicacaoId, payload) => request(endpoints.comentarios.criar(publicacaoId), { method: 'POST', body: JSON.stringify(payload) }),
  update: (publicacaoId, comentarioId, payload) => request(endpoints.comentarios.atualizar(publicacaoId, comentarioId), { method: 'PUT', body: JSON.stringify(payload) }),
  delete: (publicacaoId, comentarioId) => request(endpoints.comentarios.eliminar(publicacaoId, comentarioId), { method: 'DELETE' }),
}

// ==================== REAÇÕES ====================
export const reacoes = {
  get: (publicacaoId) => request(endpoints.reacoes.obter(publicacaoId)),
  add: (publicacaoId, payload) => request(endpoints.reacoes.adicionar(publicacaoId), { method: 'POST', body: JSON.stringify(payload) }),
  remove: (publicacaoId, reacaoId) => request(endpoints.reacoes.remover(publicacaoId, reacaoId), { method: 'DELETE' }),
}

// ==================== AUTENTICAÇÃO ====================
export const autenticacao = {
  login: (payload) => request(endpoints.autenticacao.login(), { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request(endpoints.autenticacao.logout(), { method: 'POST' }),
  registro: (payload) => request(endpoints.autenticacao.registro(), { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request(endpoints.autenticacao.me()),
  updateMe: (payload) => request(endpoints.autenticacao.me(), { method: 'PUT', body: JSON.stringify(payload) }),
  getPerfil: (userId) => request(endpoints.autenticacao.perfil(userId)),
}

// ==================== UTILIZADORES ====================
export const utilizadores = {
  getMe: () => request(endpoints.autenticacao.me()),
  get: (id) => request(endpoints.autenticacao.perfil(id)),
  updateMe: (payload) => request(endpoints.autenticacao.me(), { method: 'PUT', body: JSON.stringify(payload) }),
}

// ==================== PARTICIPAÇÕES ====================
export const participacoes = {
  getMinhas: () => request(endpoints.participacoes.minhas()),
  aderir: (salaId) => request(endpoints.participacoes.aderir(salaId), { method: 'POST' }),
  sair: (salaId) => request(endpoints.participacoes.sair(salaId), { method: 'POST' }),
  getMembrosSala: (salaId) => request(endpoints.participacoes.membrosSala(salaId)),
}

// ==================== DESCOBRIR ====================
export const descobrir = {
  getFeed: () => request(endpoints.descobrir.feed()),
  procurarSalas: (query) => request(endpoints.descobrir.procurarSalas(query)),
  procurarPublicacoes: (query) => request(endpoints.descobrir.procurarPublicacoes(query)),
  getSalasTrending: () => request(endpoints.descobrir.salasTrending()),
  getPublicacoesTrending: () => request(endpoints.descobrir.publicacoesTrending()),
}

// ==================== NOTIFICAÇÕES ====================
export const notificacoes = {
  get: () => request(endpoints.notificacoes.obter()),
  marcarLida: (id) => request(endpoints.notificacoes.marcarLida(id), { method: 'POST' }),
  delete: (id) => request(endpoints.notificacoes.eliminar(id), { method: 'DELETE' }),
}

// Exportar toda a API num único objeto
export const api = {
  live,
  publicacoes,
  comentarios,
  reacoes,
  utilizadores,
  participacoes,
  autenticacao,
  descobrir,
  notificacoes,
}

export default api
