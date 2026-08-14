// Camada de comunicação com a API de publicações
import { publicacoesEndpoints } from '../data/endpoints'

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Erro ao consultar a API de publicações.'

    try {
      const errorBody = await response.json()
      message = errorBody?.detail ?? errorBody?.message ?? message
    } catch {
      console.error('Erro ao consultar a API de publicações:', response.status)
    }

    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

// Obter todas as publicações
export async function fetchPublicacoes() {
  return request(publicacoesEndpoints.todas())
}

// Criar nova publicação
export async function createPublicacao(payload) {
  return request(publicacoesEndpoints.criar(), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Obter detalhes de uma publicação
export async function getPublicacao(publicacaoId) {
  return request(publicacoesEndpoints.obter(publicacaoId))
}

// Atualizar publicação
export async function updatePublicacao(publicacaoId, payload) {
  return request(publicacoesEndpoints.atualizar(publicacaoId), {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

// Eliminar publicação
export async function deletePublicacao(publicacaoId) {
  return request(publicacoesEndpoints.eliminar(publicacaoId), {
    method: 'DELETE',
  })
}

// Obter feed
export async function fetchFeed() {
  return request(publicacoesEndpoints.feed())
}

// Obter publicações por sala
export async function fetchPublicacoesPorSala(salaId) {
  return request(publicacoesEndpoints.porSala(salaId))
}
