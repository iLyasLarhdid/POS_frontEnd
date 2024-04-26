import React from 'react';
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import config from "config";
import { Button, Card, Grid, Tooltip, tooltipClasses, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import { gridSpacing } from 'store/constant';

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

const fetchData = async (key)=>{
    const token = key.queryKey[1];
    const page = key.queryKey[2];
    console.log(key);
    const res = await fetch(`${config.host}/api/v1/orders/page/${page}`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
}


const ViewOrderPage = ()=>{

    //get the id from index page and retrieve data based on it
    const [cookie] = useCookies([]);
    const {data} = useQuery(['posts',cookie.smailToken,0],fetchData);
    const history = useHistory();

    console.log(data);

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
            <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
            {data && data.content !== undefined && 
                data.content.map(order=>{
                    return (
                        <Grid item lg={2} md={3} sm={3} xs={6}>
                        <div key={order.id}>
                            <HtmlTooltip
                                
                                title={
                                    <React.Fragment>
                                        <Typography color="inherit">Order N°{order.id} Info</Typography>
                                        <div>
                                            <b>{'address : '}</b>
                                            <span style={{ color:'blue' }}>{order.address}</span>
                                        </div>
                                        <div>
                                            <b>{'Phone number : '}</b>
                                            <span style={{ color:'blue' }}>{order.phoneNumber}</span>
                                        </div>
                                        <div>
                                            <b>{'Total price : '}</b>
                                            <span style={{ color:'blue' }}>{order.products.reduce(
                                                (oldProd, newProd)=>newProd.price*newProd.quantity + oldProd,
                                                0
                                                )}Dh</span>
                                        </div>
                                        <div>
                                            <b>{'Number of products : '}</b>
                                            <span style={{ color:'blue' }}>{order.products.length}</span>
                                        </div>
                                        <div>
                                            <b>{'State : '}</b>
                                            <span style={{ color:'blue' }}>{order.orderState.toLowerCase()}</span>
                                        </div>
                                        
                                        
                                    </React.Fragment>
                                }
                                placement="top-end"
                            >
                                {order.orderState==="WAITING"
                                ?
                                    <Button style={{ marginTop:10, backgroundColor:"#096dd9" }} variant="contained" color="secondary" onClick={()=>history.push(`/order/${order.id}`)} fullWidth>order N°{order.id}</Button>
                                :
                                    <Button style={{ marginTop:10, backgroundColor:"#4eb61b" }} variant="contained" color="secondary" onClick={()=>history.push(`/order/${order.id}`)} fullWidth>order N°{order.id}</Button>}

                                {/* <Button style={{ marginTop:10 }} variant="contained" color="secondary" onClick={()=>history.push(`/order/${order.id}`)}>order N°{order.id}</Button> */}
                            </HtmlTooltip>
                            
                        </div>
                        </Grid>
                    );
                })
            }
            </Grid>
            </Grid>
            </Grid>
        </Box>
    </Card>
        
    </div>
    </div>)
}   

export default ViewOrderPage;