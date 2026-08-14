// Hooks do TanStack Query para Utilizadores
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as utilizadoresApi from '../lib/utilizadoresApi'

const UTILIZADORES_QUERIES = {
  all: ['utilizadores'],
  me: () => [...UTILIZADORES_QUERIES.all, 'me'],
  detail: (id) => [...UTILIZADORES_QUERIES.all, id],
  bySala: (salaId) => [...UTILIZADORES_QUERIES.all, 'sala', salaId],
}

// Query: Obter perfil do utilizador actual
export function usePerfilAtual() {
  return useQuery({
    queryKey: UTILIZADORES_QUERIES.me(),
    queryFn: utilizadoresApi.fetchPerfilAtual,
  })
}

// Query: Obter detalhes de um utilizador
export function useUtilizador(utilizadorId) {
  return useQuery({
    queryKey: UTILIZADORES_QUERIES.detail(utilizadorId),
    queryFn: () => utilizadoresApi.getUtilizador(utilizadorId),
    enabled: !!utilizadorId,
  })
}

// Query: Obter utilizadores de uma sala
export function useUtilizadoresSala(salaId) {
  return useQuery({
    queryKey: UTILIZADORES_QUERIES.bySala(salaId),
    queryFn: () => utilizadoresApi.fetchUtilizadoresPorSala(salaId),
    enabled: !!salaId,
  })
}

// Mutation: Atualizar perfil
export function useUpdatePerfilAtual() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: utilizadoresApi.updatePerfilAtual,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: UTILIZADORES_QUERIES.me(),
      })
    },
  })
}
