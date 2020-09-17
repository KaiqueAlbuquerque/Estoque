import React from 'react';

//Tabela
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

//Funções para Tabela
function ccyFormat(num) {
    return `${num.toFixed(2)}`;
}

const Tabela = props => {
    const { rows, invoiceTotal } = props;

    return(
        <TableContainer component={Paper}>
            <Table aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell align="right">Quantidade</TableCell>
                        <TableCell align="right">Valor Unitário</TableCell>
                        <TableCell align="right">Valor Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row, index) => (
                    <TableRow key={++index}>
                        <TableCell>{index}</TableCell>
                        <TableCell>{row.desc}</TableCell>
                        <TableCell align="right">{row.qty}</TableCell>
                        <TableCell align="right">R${row.unit}</TableCell>
                        <TableCell align="right">R${ccyFormat(row.price)}</TableCell>
                    </TableRow>
                ))}

                <TableRow>
                    <TableCell rowSpan={3} />
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell align="right">R${ccyFormat(invoiceTotal)}</TableCell>
                </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Tabela