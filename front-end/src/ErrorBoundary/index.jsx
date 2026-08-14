  // Error boundary para capturar erros de renderização nas páginas
  import  { Component } from 'react'
  class ErrorBoundary extends Component {
    constructor(props) {
      super(props)
      this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error }
    }

    componentDidCatch(error, info) {
      console.error('Erro capturado pelo ErrorBoundary:', error, info)
    }

    render() {
      if (this.state.hasError) {
        return (
          <div style={{ padding: 24 }}>
            <h2>Erro ao renderizar a página</h2>
            <pre style={{ whiteSpace: 'pre-wrap', color: 'red' }}>{String(this.state.error)}</pre>
          </div>
        )
      }

      return this.props.children
    }
  }


  export default ErrorBoundary