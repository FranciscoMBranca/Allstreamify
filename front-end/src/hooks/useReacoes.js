// Hooks do TanStack Query para Reações
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as reacoesApi from '../lib/reacoesApi'

const REACOES_QUERIES = {
  all: ['reacoes'],
  byPublicacao: (publicacaoId) => [...REACOES_QUERIES.all, 'publicacao', publicacaoId],
  details: (publicacaoId) => [...REACOES_QUERIES.byPublicacao(publicacaoId), 'detail'],
  detail: (publicacaoId, reacaoId) => [...REACOES_QUERIES.details(publicacaoId), reacaoId],
}

// Query: Obter reações de uma publicação
export function useReacoes(publicacaoId) {
  return useQuery({
    queryKey: REACOES_QUERIES.byPublicacao(publicacaoId),
    queryFn: () => reacoesApi.fetchReacoes(publicacaoId),
    enabled: !!publicacaoId,
  })
}

// Mutation: Adicionar reação
export function useAdicionarReacao(publicacaoId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => reacoesApi.adicionarReacao(publicacaoId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REACOES_QUERIES.byPublicacao(publicacaoId),
      })
    },
  })
}

// Mutation: Remover reação
export function useRemoverReacao(publicacaoId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reacaoId) => reacoesApi.removerReacao(publicacaoId, reacaoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REACOES_QUERIES.byPublicacao(publicacaoId),
      })
    },
  })
}
