const urlBase = 'http://localhost/pdv/api/sales'
//const urlBase = 'http://192.168.0.10/pdv-back/api/sales'
//const urlBase = 'https://localhost:44346/api/sales'

const consomeApi = (parametro = '', method = 'GET', body) => {
    let obj = JSON.stringify(body);
    return fetch(`${urlBase}/${parametro}`, {
            method,
            headers: { 'content-type': 'application/json' },
            body: obj
        })
        .then(res => VendaService.TrataErros(res))
        .then(res => res.json())
        .catch(err => {
            throw Error(err)
        })
}

const VendaService = {
    ListaVendas: () => consomeApi(),
    CriaVenda: venda => consomeApi('', 'POST', venda),
    ListaVenda: id => consomeApi(id),
    TrataErros: res => {
        if (!res.ok) {
            throw Error(res.responseText);
        }
        return res;
    }
}
export default VendaService