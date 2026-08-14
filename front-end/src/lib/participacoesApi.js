// Camada de comunicação com a API de participações
import { participacoesEndpoints } from '../data/endpoints'

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Erro ao consultar a API de participações.'

    try {
      const errorBody = await response.json()
      message = errorBody?.detail ?? errorBody?.message ?? message
    } catch {
      console.error('Erro ao consultar a API de participações:', response.status)
    }

    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

// Obter participações do utilizador actual
export async function fetchMinhasParticipacoes() {
  return request(participacoesEndpoints.minhas())
}

// Aderir a uma sala
export async function aderirSala(salaId) {
  return request(participacoesEndpoints.aderir(salaId), {
    method: 'POST',
  })
}

// Sair de uma sala
export async function sairSala(salaId) {
  return request(participacoesEndpoints.sair(salaId), {
    method: 'POST',
  })
}

// Obter membros de uma sala
export async function fetchMembrosSala(salaId) {
  return request(participacoesEndpoints.membros(salaId))
}
