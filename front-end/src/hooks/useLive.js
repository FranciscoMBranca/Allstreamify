// Hooks do TanStack Query para Live
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as liveApi from './liveApi'

const LIVE_QUERIES = {
  all: ['live'],
  rooms: () => [...LIVE_QUERIES.all, 'rooms'],
  room: (id) => [...LIVE_QUERIES.rooms(), id],
}

// Query: Obter todas as salas de live
export function useLiveRooms() {
  return useQuery({
    queryKey: LIVE_QUERIES.rooms(),
    queryFn: liveApi.fetchLiveRooms,
  })
}

// Query: Obter detalhes de uma sala específica
export function useLiveRoom(salaId) {
  return useQuery({
    queryKey: LIVE_QUERIES.room(salaId),
    queryFn: () => liveApi.getLiveRoom(salaId),
    enabled: !!salaId,
  })
}

// Mutation: Criar sala de live
export function useCreateLiveRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: liveApi.createLiveRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIVE_QUERIES.rooms(),
      })
    },
  })
}

// Mutation: Atualizar sala de live
export function useUpdateLiveRoom(salaId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => liveApi.updateLiveRoom(salaId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIVE_QUERIES.room(salaId),
      })
      queryClient.invalidateQueries({
        queryKey: LIVE_QUERIES.rooms(),
      })
    },
  })
}

// Mutation: Eliminar sala de live
export function useDeleteLiveRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: liveApi.deleteLiveRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIVE_QUERIES.rooms(),
      })
    },
  })
}

// Mutation: Entrar numa sala de live
export function useEnterLiveRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: liveApi.enterLiveRoom,
    onSuccess: (_, salaId) => {
      queryClient.invalidateQueries({
        queryKey: LIVE_QUERIES.room(salaId),
      })
    },
  })
}

// Mutation: Sair de uma sala de live
export function useLeaveLiveRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: liveApi.leaveLiveRoom,
    onSuccess: (_, salaId) => {
      queryClient.invalidateQueries({
        queryKey: LIVE_QUERIES.room(salaId),
      })
    },
  })
}
