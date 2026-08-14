// Camada de comunicação com a API de comentários
import { comentariosEndpoints } from '../data/endpoints'

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Erro ao consultar a API de comentários.'

    try {
      const errorBody = await response.json()
      message = errorBody?.detail ?? errorBody?.message ?? message
    } catch {
      console.error('Erro ao consultar a API de comentários:', response.status)
    }

    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

// Obter comentários de uma publicação
export async function fetchComentarios(publicacaoId) {
  return request(comentariosEndpoints.obter(publicacaoId))
}

// Criar novo comentário
export async function createComentario(publicacaoId, payload) {
  return request(comentariosEndpoints.criar(publicacaoId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Atualizar comentário
export async function updateComentario(publicacaoId, comentarioId, payload) {
  return request(comentariosEndpoints.atualizar(publicacaoId, comentarioId), {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

// Eliminar comentário
export async function deleteComentario(publicacaoId, comentarioId) {
  return request(comentariosEndpoints.eliminar(publicacaoId, comentarioId), {
    method: 'DELETE',
  })
}
