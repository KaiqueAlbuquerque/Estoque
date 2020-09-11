const urlBase = 'https://localhost:44346/api/products'

const consomeApi = (parametro = '', method = 'GET', body) => {
    let obj = JSON.stringify(body);
    return fetch(`${urlBase}/${parametro}`, {
            method,
            headers: { 'content-type': 'application/json' },
            body: obj
        })
        .then(res => ProdutoService.TrataErros(res))
        .then(res => res.json())
        .catch(err => {
            throw Error(err)
        })
}

const ProdutoService = {
    ListaProdutos: () => consomeApi(),
    CriaProduto: produto => consomeApi('', 'POST', produto),
    ListaProdutoCodBarra: codigoBarra => consomeApi(`getByBarCode?barCode=${codigoBarra}`, 'GET'),
    ListaProduto: id => consomeApi(id),
    AtualizaProduto: (id, produto) => consomeApi(id, 'PUT', produto),
    TrataErros: res => {
        if(res.status === 404){
            throw Error('404');
        }
        if (!res.ok) {
            throw Error(res.responseText);
        }
        return res;
    }
}
export default ProdutoService