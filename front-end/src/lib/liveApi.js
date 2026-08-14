// Camada de comunicação com a API de live.
// Todas as requisições da interface passam por este arquivo para manter o fluxo
// de dados organizado e centralizado na aplicação.
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
      
    },
    ...options,
  })
  

  if (!response.ok) {
    let message = 'Erro ao consultar a API de live.'

    try {
      const errorBody = await response.json()
      message = errorBody?.detail ?? errorBody?.message ?? message
    } catch {
      // sem corpo de erro
      console.error('Erro ao consultar a API de live, sem corpo de erro:', response.status)
    }

    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export async function fetchLiveRooms() {
  return request('/live/salas')
}

export async function createLiveRoom(payload) {
  return request('/live/salas', {
    method: 'POST',
   
    body: JSON.stringify(payload),
  })
}
