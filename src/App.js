import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

//Icones
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import StorageIcon from '@material-ui/icons/Storage';

//Rotas
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';

//Pages
import GerenciarEstoque from './Pages/GerenciarEstoque/GerenciarEstoque';
import Vendas from './Pages/Vendas/Vendas';
import NotFound from './Pages/NotFound/NotFound';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  retiraCssDefault: {
    color: 'black', 
    textDecoration: 'none'
  }
}));

export default function ClippedDrawer() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              PDV
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          <List>
            {[
              {texto: 'Gerenciar Estoque', icone: <StorageIcon />, to: '/gerenciarEstoque'}, 
              {texto: 'Vendas', icone: <BusinessCenterIcon />, to: '/vendas'}
            ].map((text, index) => (
              <NavLink key={text.to} to={text.to} className={classes.retiraCssDefault}>
                <ListItem button key={text.texto}>
                  <ListItemIcon>{text.icone}</ListItemIcon>
                  <ListItemText>{text.texto}</ListItemText>
                </ListItem>
              </NavLink>              
            ))}
          </List>
        </Drawer>
        
        <main className={classes.content}>
          <div className={classes.toolbar} />
            <Switch>
              <Route path='/' exact component={Vendas} />
              <Route path='/vendas' exact component={Vendas} />
              <Route path='/gerenciarEstoque' component={GerenciarEstoque} />
              <Route component={NotFound} />                
            </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
}