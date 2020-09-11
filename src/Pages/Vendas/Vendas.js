import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import ProdutoService from '../../Service/ProdutoService.js';
import VendaService from '../../Service/VendaService.js';
import Toast from '../../Componentes/Toast.js';

//Card
import Card from '@material-ui/core/Card';

//Tabela
import Tabela from '../../Componentes/Tabela'

//Grid
import Grid from '@material-ui/core/Grid';

//Container
import Container from '@material-ui/core/Container';

//Inputs
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

//Modal
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

//Botão
import Fab from '@material-ui/core/Fab';

//Icone botão
import AddIcon from '@material-ui/icons/Add';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import StorageIcon from '@material-ui/icons/Storage';

//Tooltip
import Tooltip from '@material-ui/core/Tooltip';

//Funções Tabela
function priceRow(qty, unit) {
    return qty * unit;
}

function createRow(desc, qty, unit) {
    const price = priceRow(qty, unit);
    return { desc, qty, unit, price };
}

function total(items) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const useStyles = theme => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    form: {
        margin: theme.spacing(1),
    },
    card: {
        padding: theme.spacing(1),
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    root: {
        '& > *': {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
    },
    tituloCard: {
        fontSize: 25,
        fontWeight: "bold"
    },
    descCard: {
        fontSize: 20
    }
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Vendas extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            toast: {
                open: false,
                mensagem: '',
                tipo: ''
            },
            produtos: [],
            produtosCompra: {
                totalValue: "",
                formOfPayment: "",
                amountPaid: "",
                change: "",
                productSales: []
            },
            invoiceTotal: 0,
            open: false,
            openConfirm: false,
            openFinalizaCompra: false,
            quantidade: '',
            codBarras: '',
            pago: '',
            troco: 0,
            formaPagamento: ''
        }
    }

    keyFunction = (event) => {
        if(event.keyCode === 113) {
            event.preventDefault()
            document.getElementById("quantidade").focus();
        }
        if(event.keyCode === 99) {
            event.preventDefault()
            document.getElementById("codBarras").focus();
        }        
        if(event.keyCode === 102) {
            event.preventDefault();
            this.finalizarCompra();
        }
        if(document.activeElement.id === "codBarras")
        {
            if(event.keyCode === 13) {

                ProdutoService.ListaProdutoCodBarra(document.activeElement.value)
                .then(res => {
                    if(res != null){
                        let quantidade = document.getElementById("quantidade").value === "" ? 1 : document.getElementById("quantidade").value; 
                        this.setState({produtos: [createRow(res.description, quantidade, res.value.toFixed(2)), ...this.state.produtos]});
                        this.setState({
                            produtosCompra: {
                                totalValue: 0,
                                formOfPayment: "",
                                amountPaid: 0,
                                change: 0,
                                productSales: [...this.state.produtosCompra.productSales, {
                                    productId: res.id, 
                                    quantity: quantidade, 
                                    total: (res.value * quantidade).toFixed(2)
                                }]
                            }
                        });
                        this.setState({invoiceTotal: total([...this.state.produtos])});
                        this.setState({quantidade: ''});
                        this.setState({codBarras: ''});
                    }
                })
                .catch(err => {
                    if(err.message === "Error: 404")
                        this.setState({
                            toast: { 
                                open: true,
                                mensagem: "Produto não encontrado.",
                                tipo: 'error'
                            }
                        });
                    else
                    this.setState({
                        toast: { 
                            open: true,
                            mensagem: `Ocorreu um erro inesperado. ${err.message}. Entre em contato com o suporte.`,
                            tipo: 'error'
                        }
                    });
                });
            }
            else if(event.keyCode < 48 || event.keyCode > 57)
                event.preventDefault()
        }   
        if(document.activeElement.id === "quantidade")
            if(event.keyCode === 101)
                event.preventDefault()
    };

    componentDidMount() {
        document.addEventListener("keypress", this.keyFunction, false);
    }

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.handleClickOpenConfirm();
    };

    handleClickOpenConfirm = () => {
        this.setState({openConfirm: true});
    };

    handleCloseConfirm = () => {
        this.setState({produtos: []});
        this.setState({invoiceTotal: 0});
        this.setState({quantidade: ''});
        this.setState({codBarras: ''});
        this.setState({pago: ''});
        this.setState({troco: 0});

        this.setState({openConfirm: false});
        this.setState({open: false});

        document.getElementById("codBarras").focus();
    };

    handleCloseConfirmCancel = () => {
        this.setState({openConfirm: false});
    };

    handleCloseFinalizaCompra = () => {
        this.setState({
            produtosCompra: {
                totalValue: this.state.invoiceTotal,
                formOfPayment: this.state.formaPagamento,
                amountPaid: this.state.pago,
                change: this.state.troco,
                productSales: [...this.state.produtosCompra.productSales]
            }
        }, () => {
            VendaService.CriaVenda(this.state.produtosCompra)
                .then(res => {
                    if(res != null)
                    {
                        this.setState({
                            toast: { 
                                open: true,
                                mensagem: "Venda finalizada com sucesso.",
                                tipo: 'success'
                            }
                        });    
                        this.setState({troco: 0});
                        this.setState({pago: ''});
                        this.setState({openFinalizaCompra: false});
                        this.setState({openFinalizaCompra: false});
                    }
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
        });
    };

    handleCloseFinalizaCompraCancel = () => {
        this.setState({troco: 0});
        this.setState({pago: ''});
        this.setState({openFinalizaCompra: false});
    }

    changeQuantidade = (e) => {
        this.setState({quantidade: e.target.value});
    };

    changeCodBarras = (e) => {
        this.setState({codBarras: e.target.value});
    };

    changePago = (e) => {
        this.setState({pago: e.target.value});
        this.setState({troco: e.target.value - this.state.invoiceTotal});
    };

    changeFormaPagamento = (e) => {
        this.setState({formaPagamento: e.target.value});
    };

    finalizarCompra = () => {
        if(this.state.produtos.length > 0)
            this.setState({openFinalizaCompra: true});
        else
            this.setState({
                toast: { 
                    open: true,
                    mensagem: "É necessário ter algum produto para finalizar a compra.",
                    tipo: 'error'
                }
            });
    };

    render(){
        const { classes } = this.props;
        return(
            <div>
                <Container>
                    <Grid container 
                          spacing={2} 
                          direction="row"
                          alignItems="center"
                          style={{ minHeight: '70vh' }}
                    >
                        <Grid item xs={3}>
                            <Card raised className={classes.card}>
                                <Typography align="center">
                                    <MoneyOffIcon fontSize="large"/>
                                </Typography>
                                <Typography fontWeight="fontWeightBold" align="center" className={classes.tituloCard}>
                                    Vendas Ontem
                                </Typography>
                                <Typography align="center" className={classes.descCard}>
                                    R$ 15.000,00
                                </Typography>
                            </Card>            
                        </Grid>
                        <Grid item xs={3}>
                            <Card raised className={classes.card}>
                                <Typography align="center">
                                    <AttachMoneyIcon fontSize="large"/>
                                </Typography>
                                <Typography align="center" className={classes.tituloCard}>
                                    Vendas Hoje
                                </Typography>
                                <Typography align="center" className={classes.descCard}>
                                    R$ 17.800,00
                                </Typography>
                            </Card>            
                        </Grid>
                        <Grid item xs={3}>
                            <Card raised className={classes.card}>
                                <Typography align="center">
                                    <AddShoppingCartIcon fontSize="large"/>
                                </Typography>
                                <Typography align="center" className={classes.tituloCard}>
                                    Items Vendidos
                                </Typography>
                                <Typography align="center" className={classes.descCard}>
                                    300
                                </Typography>
                            </Card>            
                        </Grid>
                        <Grid item xs={3}>
                            <Card raised className={classes.card}>
                                <Typography align="center">
                                    <StorageIcon fontSize="large"/>
                                </Typography>
                                <Typography align="center" className={classes.tituloCard}>
                                    Items em Estoque
                                </Typography>
                                <Typography align="center" className={classes.descCard}>
                                    100
                                </Typography>
                            </Card>            
                        </Grid>
                    </Grid>
                </Container>
                
                <Tooltip title="Nova Venda">
                    <Fab onClick={this.handleClickOpen} className={classes.fab} color="primary">
                        <AddIcon />
                    </Fab>
                </Tooltip>

                <Dialog disableBackdropClick disableEscapeKeyDown fullScreen open={this.state.open} onClose={this.handleClose} TransitionComponent={Transition}>                
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <Tooltip title="Cancelar Venda">
                                <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                            <Typography variant="h6" className={classes.title}>
                                Nova Venda
                            </Typography>
                            <Button color="inherit" onClick={this.finalizarCompra}>
                                Finalizar Venda
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Container>
                        <form className={classes.root}>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <TextField value={this.state.quantidade} 
                                               onChange={this.changeQuantidade} 
                                               fullWidth type="number" 
                                               id="quantidade" 
                                               label="Quantidade" 
                                               variant="outlined" 
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField value={this.state.codBarras} 
                                               onChange={this.changeCodBarras}
                                               autoFocus 
                                               fullWidth 
                                               id="codBarras" 
                                               label="Código de Barras" 
                                               variant="outlined" 
                                    />
                                </Grid>  
                                <Grid item xs={5}>
                                    <Typography variant="h3" className={classes.title} align="center">
                                        TOTAL: R$ {this.state.invoiceTotal.toFixed(2)}
                                    </Typography> 
                                </Grid>                                                     
                            </Grid>
                        </form>
    
                        <Tabela 
                            rows={this.state.produtos}
                            invoiceTotal={this.state.invoiceTotal}
                        />
                    </Container>
                    <Dialog
                        disableBackdropClick
                        disableEscapeKeyDown
                        open={this.state.openConfirm}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={this.handleCloseConfirm}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">{"Tem certeza que deseja cancelar a compra?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                Cuidado, esta ação não poderá ser desfeita, causando assim a perca de todo o progesso até este momento. Tem certeza de que deseja prosseguir?
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={this.handleCloseConfirmCancel} color="primary">
                                Não
                            </Button>
                            <Button onClick={this.handleCloseConfirm} color="primary">
                                Sim
                            </Button>
                        </DialogActions>
                    </Dialog>   
                    <Dialog disableBackdropClick
                            disableEscapeKeyDown
                            open={this.state.openFinalizaCompra} 
                            onClose={this.handleCloseFinalizaCompra}
                            TransitionComponent={Transition}>
                        <DialogTitle id="form-dialog-title">Finalizar Compra</DialogTitle>
                        <DialogContent>
                            <FormControl variant="outlined" fullWidth className={classes.form}>
                                <InputLabel htmlFor="outlined-age-native-simple">Forma de Pagamento</InputLabel>
                                <Select
                                    onChange={this.changeFormaPagamento}
                                    native
                                    value={this.state.formaPagamento}
                                    label="Forma de Pagamento"
                                    inputProps={{
                                        name: 'Forma de Pagamento',
                                        id: 'outlined-age-native-simple',
                                    }}
                                >
                                    <option aria-label="None" value="" />
                                    <option value={1}>Dinheiro</option>
                                    <option value={2}>Débito</option>
                                    <option value={3}>Crédito</option>
                                </Select>
                            </FormControl>
                            <TextField
                                autoComplete="off"
                                className={classes.form}
                                value={this.state.pago} 
                                onChange={this.changePago}
                                id="pago"
                                label="Valor Pago"
                                fullWidth
                                variant="outlined"
                            />
                            <Typography align="right" variant="h6">
                                Valor Total: R$ {this.state.invoiceTotal.toFixed(2)}
                            </Typography>
                            <Typography align="right" variant="h6">
                                Troco: R$ {this.state.troco.toFixed(2)}
                            </Typography>    
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCloseFinalizaCompraCancel} color="primary">
                                Voltar
                            </Button>
                            <Button onClick={this.handleCloseFinalizaCompra} color="primary">
                                Finalizar Compra
                            </Button>
                        </DialogActions>
                    </Dialog>   

                    <Toast
                        open={this.state.toast.open}
                        handleClose={() =>
                            this.setState({ toast: { open: false } })
                        }
                        severity={this.state.toast.tipo}
                    >
                        {this.state.toast.mensagem}
                    </Toast> 
                </Dialog>
            </div>
        )
    }
}

export default withStyles(useStyles)(Vendas)  