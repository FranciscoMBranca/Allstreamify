// Camada de comunicação com a API de reações
import { reacoesEndpoints } from '../data/endpoints'

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Erro ao consultar a API de reações.'

    try {
      const errorBody = await response.json()
      message = errorBody?.detail ?? errorBody?.message ?? message
    } catch {
      console.error('Erro ao consultar a API de reações:', response.status)
    }

    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

// Obter reações de uma publicação
export async function fetchReacoes(publicacaoId) {
  return request(reacoesEndpoints.obter(publicacaoId))
}

// Adicionar reação
export async function adicionarReacao(publicacaoId, payload) {
  return request(reacoesEndpoints.adicionar(publicacaoId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Remover reação
export async function removerReacao(publicacaoId, reacaoId) {
  return request(reacoesEndpoints.remover(publicacaoId, reacaoId), {
    method: 'DELETE',
  })
}
