const baseUrl = 'http://localhost:8000/api';

async function conectarApi () {
   const resposta= await fetch(`${baseUrl}/health`);

    if (resposta.ok) {
        console.log('Conectado com sucesso à API');
    } else {
        alert('Erro ao conectar à API\nVerifique se o backend está em execução e se a URL da API está correta.');
    
    }
    return [baseUrl, resposta];
};
export default conectarApi;


