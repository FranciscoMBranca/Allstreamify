// Camada de comunicação com a API de utilizadores
import { endpoints } from '../data/endpoints'

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Erro ao consultar a API de utilizadores.'

    try {
      const errorBody = await response.json()
      message = errorBody?.detail ?? errorBody?.message ?? message
    } catch {
      console.error('Erro ao consultar a API de utilizadores:', response.status)
    }

    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

// Obter perfil do utilizador actual
export async function fetchPerfilAtual() {
  return request(endpoints.autenticacao.me())
}

// Obter detalhes de um utilizador
export async function getUtilizador(utilizadorId) {
  return request(endpoints.autenticacao.perfil(utilizadorId))
}

// Atualizar perfil
export async function updatePerfilAtual(payload) {
  return request(endpoints.autenticacao.me(), {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

// Obter utilizadores por sala
export async function fetchUtilizadoresPorSala(salaId) {
  return request(endpoints.participacoes.membrosSala(salaId))
}
