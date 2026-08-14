// Configuração do TanStack Query (React Query)
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tempo que os dados são considerados "fresh" (em milisegundos)
      staleTime: 1000 * 60 * 5, // 5 minutos
      
      // Tempo que os dados são mantidos em cache quando fora de uso
      gcTime: 1000 * 60 * 10, // 10 minutos (anteriormente chamado cacheTime)
      
      // Número de tentativas antes de desistir
      retry: 1,
      
      // Delay entre tentativas (em milisegundos)
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Não fazer refetch automaticamente quando a janela recupera o foco
      refetchOnWindowFocus: false,
      
      // Não fazer refetch automaticamente quando o componente monta
      refetchOnMount: false,
    },
    mutations: {
      // Número de tentativas para mutações
      retry: 1,
      
      // Delay entre tentativas para mutações
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

export default queryClient
