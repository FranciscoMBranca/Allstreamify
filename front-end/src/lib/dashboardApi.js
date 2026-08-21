import { endpoints } from '../data/endpoints.js'

async function request(caminho, opcoes = {}) {
  const resposta = await fetch(caminho, {
    headers: {
      'Content-Type': 'application/json',
      ...(opcoes.headers ?? {}),
    },
    ...opcoes,
  })

  if (!resposta.ok) {
    throw new Error('Erro ao consultar a API')
  }

  return resposta.json()
}

async function obterdashboard() {
  return request(endpoints.dashboard.obter(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export { obterdashboard }



