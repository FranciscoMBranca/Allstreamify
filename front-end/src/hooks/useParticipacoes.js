// Hooks do TanStack Query para Participações
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as participacoesApi from '../lib/participacoesApi'

const PARTICIPACOES_QUERIES = {
  all: ['participacoes'],
  minhas: () => [...PARTICIPACOES_QUERIES.all, 'minhas'],
  membrosSala: (salaId) => [...PARTICIPACOES_QUERIES.all, 'sala', salaId, 'membros'],
}

// Query: Obter minhas participações
export function useMinhasParticipacoes() {
  return useQuery({
    queryKey: PARTICIPACOES_QUERIES.minhas(),
    queryFn: participacoesApi.fetchMinhasParticipacoes,
  })
}

// Query: Obter membros de uma sala
export function useMembrosSala(salaId) {
  return useQuery({
    queryKey: PARTICIPACOES_QUERIES.membrosSala(salaId),
    queryFn: () => participacoesApi.fetchMembrosSala(salaId),
    enabled: !!salaId,
  })
}

// Mutation: Aderir a uma sala
export function useAderirSala() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: participacoesApi.aderirSala,
    onSuccess: (_, salaId) => {
      queryClient.invalidateQueries({
        queryKey: PARTICIPACOES_QUERIES.minhas(),
      })
      queryClient.invalidateQueries({
        queryKey: PARTICIPACOES_QUERIES.membrosSala(salaId),
      })
    },
  })
}

// Mutation: Sair de uma sala
export function useSairSala() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: participacoesApi.sairSala,
    onSuccess: (_, salaId) => {
      queryClient.invalidateQueries({
        queryKey: PARTICIPACOES_QUERIES.minhas(),
      })
      queryClient.invalidateQueries({
        queryKey: PARTICIPACOES_QUERIES.membrosSala(salaId),
      })
    },
  })
}
