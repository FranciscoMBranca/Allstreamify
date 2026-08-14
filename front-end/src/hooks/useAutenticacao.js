// Hooks do TanStack Query para Autenticação
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as autenticacaoApi from '../lib/autenticacaoApi'

const AUTH_QUERIES = {
  all: ['auth'],
  sessions: () => [...AUTH_QUERIES.all, 'sessions'],
}

// Mutation: Login
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: autenticacaoApi.login,
    onSuccess: () => {
      // Invalidar queries relacionadas após login bem-sucedido
      queryClient.invalidateQueries({
        queryKey: ['utilizadores'],
      })
    },
  })
}

// Mutation: Logout
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: autenticacaoApi.logout,
    onSuccess: () => {
      // Limpar cache após logout
      queryClient.clear()
    },
  })
}

// Mutation: Registar
export function useRegistar() {
  return useMutation({
    mutationFn: autenticacaoApi.registar,
  })
}

// Mutation: Refresh token
export function useRefreshToken() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: autenticacaoApi.refreshToken,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: AUTH_QUERIES.sessions(),
      })
    },
  })
}

// Mutation: Verificar email
export function useVerificarEmail() {
  return useMutation({
    mutationFn: autenticacaoApi.verificarEmail,
  })
}
