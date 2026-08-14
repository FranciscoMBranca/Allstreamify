// Camada de comunicação com a API de descobrir
import { descobrirEndpoints } from '../data/endpoints'

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Erro ao consultar a API de descobrir.'

    try {
      const errorBody = await response.json()
      message = errorBody?.detail ?? errorBody?.message ?? message
    } catch {
      console.error('Erro ao consultar a API de descobrir:', response.status)
    }

    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

// Obter feed de descobrir
export async function fetchFeedDescobrir() {
  return request(descobrirEndpoints.feed())
}

// Procurar salas
export async function procurarSalas(query) {
  return request(descobrirEndpoints.procurarSalas(query))
}

// Procurar publicações
export async function procurarPublicacoes(query) {
  return request(descobrirEndpoints.procurarPublicacoes(query))
}

// Salas trending
export async function fetchSalasTrending() {
  return request(descobrirEndpoints.salasTrending())
}

// Publicações trending
export async function fetchPublicacoesTrending() {
  return request(descobrirEndpoints.publicacoesTrending())
}
