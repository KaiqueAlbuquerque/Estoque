import React, { Component } from 'react';
import MaterialTable from 'material-table';

import ProdutoService from '../../Service/ProdutoService.js';
import Toast from '../../Componentes/Toast.js';

import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

class GerenciarEstoque extends Component {
    constructor(props) {
        super(props);

        this.state = {
            toast: {
                open: false,
                mensagem: '',
                tipo: ''
            },
            columns: [
                { title: 'CÓD', field: 'externalId' },
                { title: 'Descrição', field: 'description', width: 250 },
                { title: 'Descrição Nota', field: 'noteDescription' },
                { title: 'Código Barras', field: 'barCode' },
                { title: 'UNI.', field: 'measuredUnit' },
                { title: 'Quantidade', field: 'quantity', type: 'numeric', cellStyle: { textAlign: 'center' } },
                { title: 'Preço', field: 'value', type: 'currency', cellStyle: { textAlign: 'left' } },
                { title: 'Id', field: 'id', width: 0, hidden: true},
                { title: 'Active', field: 'active', width: 0, hidden: true },
            ],
            data: [],
        }
    }

    componentDidMount() {
        ProdutoService.ListaProdutos()
            .then(res => {
                if(res != null)
                    this.setState({
                        data: [...this.state.data, ...res]
                    })
            })
            .catch(err => {
                this.setState({
                    toast: { 
                        open: true,
                        mensagem: `Ocorreu um erro inesperado. ${err}. Entre em contato com o suporte.`,
                        tipo: 'error'
                    }
                });
            })
    }

    validaProduto(produto) {
        if(produto.externalId == null)
        {
            this.apresentaToast('error', 'O CÓD. é obrigatório.')
            return false;
        }
        if(produto.measuredUnit == null)
        {
            this.apresentaToast('error', 'A UNI. é obrigatória.')
            return false;
        }
        if(produto.description == null)
        {
            this.apresentaToast('error', 'A descrição do produto é obrigatória.')
            return false;
        }
        /*if(produto.noteDescription == null)
        {
            this.apresentaToast('error', 'A descrição na nota é obrigatória.')
            return false;
        }*/       
        if(produto.noteDescription != null && produto.noteDescription.length > 17)
        {
            this.apresentaToast('error', 'A descrição na nota deve ter no máximo 17 caracteres.')
            return false;
        }
        /*if(produto.quantity == null)
        {
            this.apresentaToast('error', 'A quantidade do produto em estoque é obrigatória.')
            return false;
        }*/
        if(produto.quantity != null && isNaN(produto.quantity))
        {
            this.apresentaToast('error', 'A quantidade não pode conter texto.')
            return false;
        }
        /*if(produto.value == null)
        {
            this.apresentaToast('error', 'O valor do produto é obrigatório.')
            return false;
        }*/
        if(produto.value != null && isNaN(produto.value))
        {
            this.apresentaToast('error', 'O valor do produto não pode conter texto.')
            return false;
        }        
        if(produto.barCode == null)
        {
            this.apresentaToast('error', 'O código de barras do produto é obrigatório.')
            return false;
        }

        return true;
    }
    
    apresentaToast(tipo, mensagem){
        this.setState({
            toast: { 
                open: true,
                mensagem,
                tipo
            }
        });
    }

    render(){
        return(
            <div>
                <Toast
                    open={this.state.toast.open}
                    handleClose={() =>
                        this.setState({ toast: { open: false } })
                    }
                    severity={this.state.toast.tipo}
                >
                    {this.state.toast.mensagem}
                </Toast>

                <MaterialTable
                    options={{headerStyle:{textAlign: 'left'}}}
                    icons={tableIcons}
                    title="Produtos"
                    columns={this.state.columns}
                    data={this.state.data}
                    editable={{

                        onRowAdd: newData =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                    
                                    resolve();
                                    
                                    if(this.validaProduto(newData))
                                    {
                                        if(newData.value != null)
                                            newData.value = newData.value.toString().replace(',','.');
                                        
                                        ProdutoService.CriaProduto(newData)
                                            .then(res => {
                                                if(res != null){
                                                    this.setState({data: [...this.state.data, res]});
                                                    this.apresentaToast('success',  'Produto cadastrado com sucesso.');
                                                }
                                            })
                                            .catch(err => 
                                                this.apresentaToast('error', `Ocorreu um erro inesperado. ${err.message}. Entre em contato com o suporte.`)
                                            )
                                    }
                                }, 600);
                            }),

                        onRowUpdate: (newData, oldData) =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                    
                                    resolve();
                                    
                                    if (oldData) {
                                        
                                        if(this.validaProduto(newData))
                                        {
                                            if(newData.value != null){
                                                newData.value = newData.value.toString().replace(',','.');
                                                newData.value = parseFloat(newData.value);
                                            }
                                            else{
                                                newData.value = parseFloat(0);
                                            }

                                            ProdutoService.AtualizaProduto(newData.id, newData)
                                                .then(res => {
                                                    if(res != null){
                                                        this.setState({data: this.state.data.map(
                                                            (produto) => {
                                                                if(produto === oldData)
                                                                    return newData;
                                                                else
                                                                    return produto;
                                                            })
                                                        });
                                                        this.apresentaToast('success',  'Produto alterado com sucesso.');
                                                    }
                                                })
                                                .catch(err => 
                                                    this.apresentaToast('error', `Ocorreu um erro inesperado. ${err.message}. Entre em contato com o suporte.`)
                                                )
                                        }
                                    }
                                }, 600);
                            }),

                        onRowDelete: oldData =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                    
                                    resolve();

                                    oldData.active = false;

                                    ProdutoService.AtualizaProduto(oldData.id, oldData)
                                        .then(res => {
                                            if(res != null){
                                                this.setState({data: this.state.data.filter(
                                                    (produto) => {
                                                        return produto !== oldData;
                                                    })
                                                });
                                                this.apresentaToast('success', 'Produto excluido com sucesso.');
                                            }
                                        })
                                        .catch(err => 
                                            this.apresentaToast('error', `Ocorreu um erro inesperado. ${err.message}. Entre em contato com o suporte.`)
                                        )
                                }, 600);
                            }),
                    }}
                    
                    localization={{
                        pagination: {
                            labelDisplayedRows: '{from}-{to} de {count}',
                            labelRowsSelect: 'Linhas',
                            labelRowsPerPage: 'Linhas por página',
                            firstAriaLabel: 'Primeira página',
                            firstTooltip: 'Primeira página',
                            previousAriaLabel: 'Página anterior',
                            previousTooltip: 'Página anterior',
                            nextAriaLabel: 'Próxima página',
                            nextTooltip: 'Próxima página',
                            lastAriaLabel: 'Última página',
                            lastTooltip: 'Última página'
                        },
                        toolbar: {
                            nRowsSelected: '{0} linha(s) selecionada(s)',
                            searchTooltip: 'Procurar',
                            searchPlaceholder: 'Procurar'
                        },
                        header: {
                            actions: 'Ações'
                        },
                        body: {
                            addTooltip: 'Adicionar',
                            deleteTooltip: 'Excluir',
                            editTooltip: 'Editar',
                            emptyDataSourceMessage: 'Nenhum Registro',
                            filterRow: {
                                filterTooltip: 'Filtro'
                            },
                            editRow: {
                                deleteText: 'Deseja Excluir este produto?',
                                cancelTooltip: 'Cancelar',
                                saveTooltip: 'Salvar'
                            }
                        }
                    }}
                />
            </div>
        )
    }
}

export default GerenciarEstoque;   