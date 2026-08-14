// Camada de comunicação com a API de autenticação
import { autenticacaoEndpoints } from '../data/endpoints'

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Erro ao consultar a API de autenticação.'

    try {
      const errorBody = await response.json()
      message = errorBody?.detail ?? errorBody?.message ?? message
    } catch {
      console.error('Erro ao consultar a API de autenticação:', response.status)
    }

    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

// Login
export async function login(payload) {
  return request(autenticacaoEndpoints.login(), {
    method: 'POST',
    body: JSON.stringify(payload),
    
  })
}

// Logout
export async function logout() {
  return request(autenticacaoEndpoints.logout(), {
    method: 'POST',
  })
}

// Registar novo utilizador
export async function registar(payload) {
  return request(autenticacaoEndpoints.registar(), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Refresh token
export async function refreshToken() {
  return request(autenticacaoEndpoints.refresh(), {
    method: 'POST',
  })
}

// Verificar email
export async function verificarEmail(payload) {
  return request(autenticacaoEndpoints.verificarEmail(), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
