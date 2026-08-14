// Hooks do TanStack Query para Notificações
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as notificacoesApi from '../lib/notificacoesApi'

const NOTIFICACOES_QUERIES = {
  all: ['notificacoes'],
  list: () => [...NOTIFICACOES_QUERIES.all, 'list'],
  detail: (id) => [...NOTIFICACOES_QUERIES.all, 'detail', id],
}

// Query: Obter notificações
export function useNotificacoes() {
  return useQuery({
    queryKey: NOTIFICACOES_QUERIES.list(),
    queryFn: notificacoesApi.fetchNotificacoes,
  })
}

// Mutation: Marcar notificação como lida
export function useMarcarNotificacaoLida() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificacoesApi.marcarNotificacaoLida,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICACOES_QUERIES.list(),
      })
    },
  })
}

// Mutation: Eliminar notificação
export function useEliminarNotificacao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificacoesApi.eliminarNotificacao,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICACOES_QUERIES.list(),
      })
    },
  })
}
