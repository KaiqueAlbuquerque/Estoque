import React from 'react';
import { withStyles } from '@material-ui/core/styles';

//Tabela
import Tabela from '../../Componentes/Tabela'

//Grid
import Grid from '@material-ui/core/Grid';

//Container
import Container from '@material-ui/core/Container';

//Inputs
import TextField from '@material-ui/core/TextField';

//Modal
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

//Botão
import Fab from '@material-ui/core/Fab';

//Icone botão
import AddIcon from '@material-ui/icons/Add';

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
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Vendas extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            produtos: [],
            invoiceTotal: 0,
            open: false
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
        if(document.activeElement.id === "codBarras")
        {
            if(event.keyCode === 13) {
                this.setState({produtos: [...this.state.produtos, createRow('Paperclips (Box)', 100, 1.15)]});
                this.setState({invoiceTotal: total([...this.state.produtos])})
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
        this.setState({open: false});
        this.setState({produtos: []});
        this.setState({invoiceTotal: 0});
    };

    render(){
        const { classes } = this.props;
        return(
            <div>
                <Fab onClick={this.handleClickOpen} className={classes.fab} color="primary">
                    <AddIcon />
                </Fab>
    
                <Dialog fullScreen open={this.state.open} onClose={this.handleClose} TransitionComponent={Transition}>                
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Nova Venda
                            </Typography>
                            <Button autoFocus color="inherit" onClick={this.handleClose}>
                                Finalizar Venda
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Container>
                        <form className={classes.root}>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <TextField fullWidth type="number" id="quantidade" label="Quantidade" variant="outlined" />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField autoFocus fullWidth id="codBarras" label="Código de Barras" variant="outlined" />
                                </Grid>  
                                <Grid item xs={5}>
                                    <Typography variant="h3" className={classes.title} align="right">
                                        TOTAL: R${this.state.invoiceTotal.toFixed(2)}
                                    </Typography> 
                                </Grid>                                                     
                            </Grid>
                        </form>
    
                        <Tabela 
                            rows={this.state.produtos}
                            invoiceTotal={this.state.invoiceTotal}
                        />
                    </Container>            
                </Dialog>
            </div>
        )
    }
}

export default withStyles(useStyles)(Vendas)  