// Cartão genérico usado para destacar conteúdos ou módulos do produto.
// Mantém a UI reutilizável e com visual simples para os painéis.
import './card.css'

const Card = ({ title, description, tag }) => {
  return (
    <article className="cartao">
      <span className="etiqueta-cartao">{tag}</span>
      <h3>{title}</h3>
      <p>{description}</p>

      <div className="cartao-botoes">
        <button type="button" className="btn-cartao">Acessar painel</button>
        <button type="button" className="btn-cartao-sec">Ver detalhes</button>
      </div>
    </article>
  )
}

export default Card
