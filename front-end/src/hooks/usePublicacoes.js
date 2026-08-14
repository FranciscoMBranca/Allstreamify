// Hooks do TanStack Query para Publicações
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as publicacoesApi from '../lib/publicacoesApi'

const PUBLICACOES_QUERIES = {
  all: ['publicacoes'],
  lists: () => [...PUBLICACOES_QUERIES.all, 'list'],
  list: (filters) => [...PUBLICACOES_QUERIES.lists(), { ...filters }],
  feed: () => [...PUBLICACOES_QUERIES.all, 'feed'],
  bySala: (salaId) => [...PUBLICACOES_QUERIES.all, 'sala', salaId],
  details: () => [...PUBLICACOES_QUERIES.all, 'detail'],
  detail: (id) => [...PUBLICACOES_QUERIES.details(), id],
}

// Query: Obter todas as publicações
export function usePublicacoes() {
  return useQuery({
    queryKey: PUBLICACOES_QUERIES.list({}),
    queryFn: publicacoesApi.fetchPublicacoes,
  })
}

// Query: Obter feed
export function useFeed() {
  return useQuery({
    queryKey: PUBLICACOES_QUERIES.feed(),
    queryFn: publicacoesApi.fetchFeed,
  })
}

// Query: Obter publicações por sala
export function usePublicacoesPorSala(salaId) {
  return useQuery({
    queryKey: PUBLICACOES_QUERIES.bySala(salaId),
    queryFn: () => publicacoesApi.fetchPublicacoesPorSala(salaId),
    enabled: !!salaId,
  })
}

// Query: Obter detalhes de uma publicação
export function usePublicacao(publicacaoId) {
  return useQuery({
    queryKey: PUBLICACOES_QUERIES.detail(publicacaoId),
    queryFn: () => publicacoesApi.getPublicacao(publicacaoId),
    enabled: !!publicacaoId,
  })
}

// Mutation: Criar publicação
export function useCreatePublicacao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: publicacoesApi.createPublicacao,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PUBLICACOES_QUERIES.feed(),
      })
    },
  })
}

// Mutation: Atualizar publicação
export function useUpdatePublicacao(publicacaoId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => publicacoesApi.updatePublicacao(publicacaoId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PUBLICACOES_QUERIES.detail(publicacaoId),
      })
      queryClient.invalidateQueries({
        queryKey: PUBLICACOES_QUERIES.feed(),
      })
    },
  })
}

// Mutation: Eliminar publicação
export function useDeletePublicacao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: publicacoesApi.deletePublicacao,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PUBLICACOES_QUERIES.feed(),
      })
    },
  })
}
