// Hooks do TanStack Query para Descobrir
import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as descobrirApi from '../lib/descobrirApi'

const DESCOBRIR_QUERIES = {
  all: ['descobrir'],
  feed: () => [...DESCOBRIR_QUERIES.all, 'feed'],
  search: () => [...DESCOBRIR_QUERIES.all, 'search'],
  searchSalas: (query) => [...DESCOBRIR_QUERIES.search(), 'salas', query],
  searchPublicacoes: (query) => [...DESCOBRIR_QUERIES.search(), 'publicacoes', query],
  trending: () => [...DESCOBRIR_QUERIES.all, 'trending'],
  trendingSalas: () => [...DESCOBRIR_QUERIES.trending(), 'salas'],
  trendingPublicacoes: () => [...DESCOBRIR_QUERIES.trending(), 'publicacoes'],
}

// Query: Obter feed de descobrir
export function useFeedDescobrir() {
  return useQuery({
    queryKey: DESCOBRIR_QUERIES.feed(),
    queryFn: descobrirApi.fetchFeedDescobrir,
  })
}

// Query: Procurar salas
export function useProcurarSalas(query) {
  return useQuery({
    queryKey: DESCOBRIR_QUERIES.searchSalas(query),
    queryFn: () => descobrirApi.procurarSalas(query),
    enabled: !!query && query.length > 0,
  })
}

// Query: Procurar publicações
export function useProcurarPublicacoes(query) {
  return useQuery({
    queryKey: DESCOBRIR_QUERIES.searchPublicacoes(query),
    queryFn: () => descobrirApi.procurarPublicacoes(query),
    enabled: !!query && query.length > 0,
  })
}

// Query: Salas trending
export function useSalasTrending() {
  return useQuery({
    queryKey: DESCOBRIR_QUERIES.trendingSalas(),
    queryFn: descobrirApi.fetchSalasTrending,
  })
}

// Query: Publicações trending
export function usePublicacoesTrending() {
  return useQuery({
    queryKey: DESCOBRIR_QUERIES.trendingPublicacoes(),
    queryFn: descobrirApi.fetchPublicacoesTrending,
  })
}
