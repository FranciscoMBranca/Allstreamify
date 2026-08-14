// Card de publicação social (estilo Facebook) usado no feed da página Descobrir.
// Recebe os dados de uma live agendada e os dados da sala relacionada,
// e mostra tudo no formato de "post": cabeçalho, mídia, texto, estatísticas e ação.
import './postCard.css'

// Componente funcional. Props recebidas do componente pai (a página Discover):
// - publicacao: objeto com os dados da live agendada (título, autor, descrição, etc.)
// - sala: objeto com os dados da sala associada a essa publicação (pode ser undefined)
// - aoAlternarParticipacao: função chamada quando o utilizador clica no botão de ação
function PostCard({ publicacao, sala, aoAlternarParticipacao }) {
  // Define se o utilizador ainda pode aderir à sala (true) ou já participa (false).
  // Se não houver sala associada, assumimos que não é possível aderir.
  const podeAderir = sala ? !sala.joined : false

  // Texto do rótulo mostrado no cabeçalho do card (canto direito),
  // indicando se o utilizador já participa da sala ou se ela está aberta.
  const rotuloParticipacao = sala?.joined ? 'Participando' : 'Aberta'

  // Texto do botão principal do card, que muda de acordo com o estado de participação.
  const rotuloBotaoAcao = podeAderir ? 'Aderir à sala' : 'Entrar na live'

  // Função chamada ao clicar no botão principal.
  // Só notifica o componente pai se houver uma sala válida associada.
  function lidarComCliqueNaAcao() {
    if (sala) {
      aoAlternarParticipacao(sala.id)
    }
  }

  return (
    // Contêiner principal do post, equivalente a um "post" do Facebook.
    <article className="post-card">
      {/* Cabeçalho: avatar do autor, nome, data/hora e emblema de status */}
      <header className="post-card-header">
        <div className="post-card-avatar">{publicacao.host.charAt(0)}</div>

        <div className="post-card-autor">
          <span className="post-card-nome">{publicacao.host}</span>
          <span className="post-card-data">{publicacao.when}</span>
        </div>

        <span className="post-card-emblema">{rotuloParticipacao}</span>
      </header>

      {/* Título da publicação (nome da live agendada) */}
      <h3 className="post-card-titulo">{publicacao.title}</h3>

      {/* Texto descritivo da publicação */}
      <p className="post-card-texto">{publicacao.description}</p>

      {/* Área de mídia, semelhante à imagem/vídeo de um post do Facebook */}
      <div className="post-card-midia" aria-hidden="true">
        <img src={publicacao.thumbnail} alt="foto indisponível" id="post-thumbnail" />
      </div>

      {/* Linha de estatísticas de engajamento (reações, comentários e interessados) */}
      <div className="post-card-estatisticas">
        <span className="post-card-estatistica">
          <a href=''> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20.5L10.4 19C5 14.2 2 11.2 2 7.6 2 4.3 4.5 2 7.8 2c1.9 0 3.6 1 4.7 2.4C13.6 3 15.3 2 17.2 2 20.5 2 23 4.3 23 7.6c0 3.6-3 6.6-8.4 11.4L12 20.5Z" fill="currentColor" fill-opacity="0.15"/>
              <path d="M12 20.5L10.4 19C5 14.2 2 11.2 2 7.6 2 4.3 4.5 2 7.8 2c1.9 0 3.6 1 4.7 2.4C13.6 3 15.3 2 17.2 2 20.5 2 23 4.3 23 7.6c0 3.6-3 6.6-8.4 11.4L12 20.5Z"/>
            </svg>  
          </a> 
    {publicacao.comments} comentários
        </span>
        <span className="post-card-estatistica">
          <a href=''>❤️</a> {publicacao.reactions} reações
        </span>
        <span className="post-card-estatistica">
          <a href=''>🔔</a> {sala?.members || 0} interessados
        </span>
      </div>

      {/* Linha divisória, igual à que separa estatísticas das ações no Facebook */}
      <div className="post-card-divisor" />

      {/* Botão de ação principal, ocupando a largura do card, estilo "call to action" */}
      <button
        type="button"
        className={`post-card-botao-acao ${podeAderir ? '' : 'post-card-botao-acao-secundario'}`}
        onClick={lidarComCliqueNaAcao}
      >
        {rotuloBotaoAcao}
      </button>
    </article>
  )
}

export default PostCard
