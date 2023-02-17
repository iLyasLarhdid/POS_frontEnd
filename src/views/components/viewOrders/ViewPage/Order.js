import React from 'react';
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import config from "config";
import { Avatar, Button, Card, Paper, styled, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { Box } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';


const fetchData = async (key)=>{
    const token = key.queryKey[1];
    const id = key.queryKey[2];
    console.log(key);
    const res = await fetch(`${config.host}/api/v1/orders/id/${id}`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        textAlign:'center'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        textAlign:'center'
    },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
'&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
},
// hide last border
'&:last-child td, &:last-child th': {
    border: 0,
},
}));
const Order = ({id})=>{

    //get the id from index page and retrieve data based on it
    const [cookie] = useCookies([]);
    const history = useHistory();
    const {data} = useQuery(['posts',cookie.smailToken,id],fetchData);
    const { enqueueSnackbar } = useSnackbar();

    console.log(data);

    //this is to change the state of our order into accepted
    const delever = () => {
        const url = `${config.host}/api/v1/orders`;
        // setIsButtonLoading(true);
        fetch(url, {
            method: 'put',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': cookie.smailToken
            },
            body: JSON.stringify({ id, orderState:1 })
            })
            .then((response) => {
                console.log(response);
                if (!response.ok) throw Error('Something went wrong');
                else {
                    console.log('hello we just updated your order state');
                }
                return response.json();
            })
            .then((data) => {
                console.log("data",data);
                enqueueSnackbar('the order has been delevered!', {variant: 'success',});
                history.push("/viewOrders");
            })
            .catch((err) => {
                console.error(err.message);
                enqueueSnackbar('something went wrong !', {variant: 'error',});
            });
    };

    return(
    <div className="container">
    <div className="row">
    <Card>
    <Box 
        sx={{ mt: 2}} 
        style={{ borderRadius:"10px", padding:"1rem",marginBottom:"1rem"}}
        autoComplete="off"
        noValidate
        >
            <h1>Order N°{id}</h1>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell>Img</StyledTableCell>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell align="right">name</StyledTableCell>
                        <StyledTableCell align="right">price</StyledTableCell>
                        <StyledTableCell align="right">Quantity</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data && data.products.map(row=>(
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell component="th" scope="row">
                                        <Avatar variant="square" src={`${config.host}/upload/viewFile/${row.product.pictures[0].title}`}/>
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.id}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.product.name}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.price}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.quantity}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <h2 style={{display: 'flex',alignItems: 'center' }}><PointOfSaleIcon/> total : { data && data.products.map(row =>row.price * row.quantity).reduce((oldVal,newVal)=>oldVal+newVal) }</h2>
            <Button onClick={delever} >Delivered</Button>
        </Box>
    </Card>
        
    </div>
    </div>)
}

export default Order;