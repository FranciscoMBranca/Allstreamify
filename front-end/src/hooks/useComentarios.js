// Hooks do TanStack Query para Comentários
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as comentariosApi from '../lib/comentariosApi'

const COMENTARIOS_QUERIES = {
  all: ['comentarios'],
  byPublicacao: (publicacaoId) => [...COMENTARIOS_QUERIES.all, 'publicacao', publicacaoId],
  details: (publicacaoId) => [...COMENTARIOS_QUERIES.byPublicacao(publicacaoId), 'detail'],
  detail: (publicacaoId, comentarioId) => [...COMENTARIOS_QUERIES.details(publicacaoId), comentarioId],
}

// Query: Obter comentários de uma publicação
export function useComentarios(publicacaoId) {
  return useQuery({
    queryKey: COMENTARIOS_QUERIES.byPublicacao(publicacaoId),
    queryFn: () => comentariosApi.fetchComentarios(publicacaoId),
    enabled: !!publicacaoId,
  })
}

// Mutation: Criar comentário
export function useCreateComentario(publicacaoId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => comentariosApi.createComentario(publicacaoId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COMENTARIOS_QUERIES.byPublicacao(publicacaoId),
      })
    },
  })
}

// Mutation: Atualizar comentário
export function useUpdateComentario(publicacaoId, comentarioId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => comentariosApi.updateComentario(publicacaoId, comentarioId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COMENTARIOS_QUERIES.byPublicacao(publicacaoId),
      })
    },
  })
}

// Mutation: Eliminar comentário
export function useDeleteComentario(publicacaoId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (comentarioId) => comentariosApi.deleteComentario(publicacaoId, comentarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COMENTARIOS_QUERIES.byPublicacao(publicacaoId),
      })
    },
  })
}
