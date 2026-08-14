// Camada de comunicação com a API de notificações
import { notificacoesEndpoints } from '../data/endpoints'

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Erro ao consultar a API de notificações.'

    try {
      const errorBody = await response.json()
      message = errorBody?.detail ?? errorBody?.message ?? message
    } catch {
      console.error('Erro ao consultar a API de notificações:', response.status)
    }

    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

// Obter notificações
export async function fetchNotificacoes() {
  return request(notificacoesEndpoints.obter())
}

// Marcar como lida
export async function marcarNotificacaoLida(notificacaoId) {
  return request(notificacoesEndpoints.marcarLida(notificacaoId), {
    method: 'POST',
  })
}

// Eliminar notificação
export async function eliminarNotificacao(notificacaoId) {
  return request(notificacoesEndpoints.eliminar(notificacaoId), {
    method: 'DELETE',
  })
}
