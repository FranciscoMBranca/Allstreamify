// Guia de implementação da API e TanStack Query
// Documentação completa do sistema de API, hooks e caching

/**
 * ============================================================
 * ESTRUTURA IMPLEMENTADA
 * ============================================================
 * 
 * 1. ENDPOINTS (data/endpoints.js)
 *    - Definição centralizada de todos os endpoints
 *    - Organização por categoria (live, publicacoes, etc.)
 *    - Fácil manutenção e reutilização
 * 
 * 2. SERVIÇOS DE API (lib/*Api.js)
 *    - liveApi.js - Gerenciamento de salas de live
 *    - publicacoesApi.js - Gestão de publicações
 *    - comentariosApi.js - Sistema de comentários
 *    - reacoesApi.js - Gestão de reações
 *    - utilizadoresApi.js - Perfis de utilizadores
 *    - participacoesApi.js - Participações em salas
 *    - autenticacaoApi.js - Autenticação e autorização
 *    - descobrirApi.js - Descoberta de conteúdo
 *    - notificacoesApi.js - Sistema de notificações
 * 
 * 3. HOOKS REACT QUERY (hooks/use*.js)
 *    - useLive.js - Queries e mutations para lives
 *    - usePublicacoes.js - Queries e mutations para publicações
 *    - useComentarios.js - Queries e mutations para comentários
 *    - useReacoes.js - Queries e mutations para reações
 *    - useUtilizadores.js - Queries e mutations para utilizadores
 *    - useParticipacoes.js - Queries e mutations para participações
 *    - useAutenticacao.js - Mutations para autenticação
 *    - useDescobrir.js - Queries para descoberta
 *    - useNotificacoes.js - Queries e mutations para notificações
 * 
 * 4. CONFIGURAÇÃO
 *    - lib/queryClient.js - Configuração do TanStack Query
 *    - main.jsx - Integração do QueryClientProvider
 * 
 * 5. DADOS MOCK (data/mockData.js)
 *    - Dados de teste para desenvolvimento offline
 *    - Simula respostas reais da API
 *
 * ============================================================
 * COMO USAR
 * ============================================================
 * 
 * EXEMPLO 1: Usar um hook de query
 * ---------------------------------
 * import { useFeed } from '@/hooks/usePublicacoes'
 * 
 * function MinhaComponente() {
 *   const { data: publicacoes, isLoading, error } = useFeed()
 * 
 *   if (isLoading) return <p>Carregando...</p>
 *   if (error) return <p>Erro: {error.message}</p>
 * 
 *   return (
 *     <div>
 *       {publicacoes?.map(pub => (
 *         <PostCard key={pub.id} publicacao={pub} />
 *       ))}
 *     </div>
 *   )
 * }
 * 
 * EXEMPLO 2: Usar um hook de mutation
 * ------------------------------------
 * import { useCreatePublicacao } from '@/hooks/usePublicacoes'
 * 
 * function CriarPublicacao() {
 *   const { mutate: criar, isPending } = useCreatePublicacao()
 * 
 *   function handleSubmit(dados) {
 *     criar(dados, {
 *       onSuccess: () => alert('Publicação criada!'),
 *       onError: (err) => alert('Erro: ' + err.message)
 *     })
 *   }
 * 
 *   return (
 *     <form onSubmit={(e) => {
 *       e.preventDefault()
 *       handleSubmit({ title: 'Teste' })
 *     }}>
 *       <button disabled={isPending}>
 *         {isPending ? 'Enviando...' : 'Criar'}
 *       </button>
 *     </form>
 *   )
 * }
 * 
 * EXEMPLO 3: Usar chamadas diretas de API
 * -----------------------------------------
 * import * as publicacoesApi from '@/lib/publicacoesApi'
 * 
 * // Se preferir chamar diretamente sem React Query:
 * async function carregarPublicacoes() {
 *   const dados = await publicacoesApi.fetchPublicacoes()
 *   console.log(dados)
 * }
 * 
 * ============================================================
 * ENDPOINTS DISPONÍVEIS
 * ============================================================
 * 
 * LIVE
 * ----
 * endpoints.live.salas()              - GET /live/salas
 * endpoints.live.criarSala()          - POST /live/salas
 * endpoints.live.obterSala(id)        - GET /live/salas/{id}
 * endpoints.live.atualizarSala(id)    - PUT /live/salas/{id}
 * endpoints.live.eliminarSala(id)     - DELETE /live/salas/{id}
 * endpoints.live.entrarSala(id)       - POST /live/salas/{id}/entrar
 * endpoints.live.sairSala(id)         - POST /live/salas/{id}/sair
 * 
 * PUBLICAÇÕES
 * -----------
 * endpoints.publicacoes.todas()       - GET /publicacoes
 * endpoints.publicacoes.criar()       - POST /publicacoes
 * endpoints.publicacoes.obter(id)     - GET /publicacoes/{id}
 * endpoints.publicacoes.atualizar(id) - PUT /publicacoes/{id}
 * endpoints.publicacoes.eliminar(id)  - DELETE /publicacoes/{id}
 * endpoints.publicacoes.feed()        - GET /publicacoes/feed
 * endpoints.publicacoes.porSala(id)   - GET /publicacoes/sala/{id}
 * 
 * COMENTÁRIOS
 * -----------
 * endpoints.comentarios.obter(pubId)       - GET /publicacoes/{pubId}/comentarios
 * endpoints.comentarios.criar(pubId)       - POST /publicacoes/{pubId}/comentarios
 * endpoints.comentarios.atualizar(pubId, id) - PUT /publicacoes/{pubId}/comentarios/{id}
 * endpoints.comentarios.eliminar(pubId, id)  - DELETE /publicacoes/{pubId}/comentarios/{id}
 * 
 * REAÇÕES
 * -------
 * endpoints.reacoes.obter(pubId)      - GET /publicacoes/{pubId}/reacoes
 * endpoints.reacoes.adicionar(pubId)  - POST /publicacoes/{pubId}/reacoes
 * endpoints.reacoes.remover(pubId, id) - DELETE /publicacoes/{pubId}/reacoes/{id}
 * 
 * UTILIZADORES
 * -------------
 * endpoints.utilizadores.perfilAtual()     - GET /utilizadores/me
 * endpoints.utilizadores.obter(id)        - GET /utilizadores/{id}
 * endpoints.utilizadores.atualizarPerfil() - PUT /utilizadores/me
 * endpoints.utilizadores.porSala(salaId)  - GET /salas/{salaId}/utilizadores
 * 
 * PARTICIPAÇÕES
 * --------------
 * endpoints.participacoes.minhas()       - GET /participacoes
 * endpoints.participacoes.aderir(salaId) - POST /salas/{salaId}/aderir
 * endpoints.participacoes.sair(salaId)   - POST /salas/{salaId}/sair
 * endpoints.participacoes.membros(salaId) - GET /salas/{salaId}/membros
 * 
 * AUTENTICAÇÃO
 * --------- ----
 * endpoints.autenticacao.login()          - POST /auth/login
 * endpoints.autenticacao.logout()         - POST /auth/logout
 * endpoints.autenticacao.registar()       - POST /auth/registar
 * endpoints.autenticacao.refresh()        - POST /auth/refresh
 * endpoints.autenticacao.verificarEmail() - POST /auth/verificar-email
 * 
 * DESCOBRIR
 * ---------
 * endpoints.descobrir.feed()              - GET /descobrir/feed
 * endpoints.descobrir.procurarSalas(q)   - GET /descobrir/salas?search={q}
 * endpoints.descobrir.procurarPublicacoes(q) - GET /descobrir/publicacoes?search={q}
 * endpoints.descobrir.salasTrending()    - GET /descobrir/salas/trending
 * endpoints.descobrir.publicacoesTrending() - GET /descobrir/publicacoes/trending
 * 
 * NOTIFICAÇÕES
 * -------  ----
 * endpoints.notificacoes.obter()          - GET /notificacoes
 * endpoints.notificacoes.marcarLida(id)  - POST /notificacoes/{id}/lida
 * endpoints.notificacoes.eliminar(id)    - DELETE /notificacoes/{id}
 * 
 * ============================================================
 * RECURSOS DO TANSTACK QUERY IMPLEMENTADOS
 * ============================================================
 * 
 * 1. CACHING AUTOMÁTICO
 *    - staleTime: 5 minutos (dados considerados "fresh")
 *    - gcTime: 10 minutos (tempo de manutenção em cache)
 * 
 * 2. RETRY AUTOMÁTICO
 *    - 1 tentativa por padrão
 *    - Delay exponencial entre tentativas
 * 
 * 3. INVALIDAÇÃO DE CACHE
 *    - Mutations invalidam queries relacionadas automaticamente
 *    - Exemplo: criar publicação invalida o feed
 * 
 * 4. ESTADO DE LOADING/ERROR
 *    - Cada hook fornece isLoading, error, data
 *    - Para mutations: isPending, error, data
 * 
 * 5. QUERY KEYS ESTRUTURADAS
 *    - Organização hierárquica para invalidação em massa
 *    - Exemplo: ['publicacoes', 'feed'] é subconjunto de ['publicacoes']
 * 
 * ============================================================
 * MIGRANDO DO MOCK PARA REAL
 * ============================================================
 * 
 * 1. Definir VITE_API_BASE_URL no .env
 *    VITE_API_BASE_URL=http://seu-backend.com/api
 * 
 * 2. Os serviços de API já leem esta variável
 * 
 * 3. Tudo continua funcionando sem mudanças de código
 * 
 * 4. Opcional: remover dados mock ou usar como fallback
 * 
 * ============================================================
 * BOAS PRÁTICAS
 * ============================================================
 * 
 * 1. SEMPRE USE HOOKS EM COMPONENTES
 *    ✓ import { useFeed } from '@/hooks/usePublicacoes'
 *    ✗ import * as api from '@/lib/publicacoesApi'
 * 
 * 2. GERENCIE ESTADOS COM REACT QUERY
 *    ✓ const { data, isLoading, error } = useFeed()
 *    ✗ const [data, setData] = useState(); useEffect(() => { ... })
 * 
 * 3. CONFIGURE CALLBACKS DE MUTAÇÕES
 *    ✓ criar(dados, { onSuccess, onError })
 *    ✗ await criar(dados)
 * 
 * 4. USE QUERY KEYS CORRETAS
 *    ✓ PUBLICACOES_QUERIES.detail(id)
 *    ✗ ['publicacao', id]
 * 
 * 5. ATIVE REFETCH APENAS QUANDO NECESSÁRIO
 *    ✓ queryClient.invalidateQueries({ queryKey: [...] })
 *    ✗ refetchOnMount, refetchOnWindowFocus
 * 
 * ============================================================
 */

export {}
