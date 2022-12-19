import { Button, CircularProgress, Grid, Input, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { gridSpacing } from "store/constant";
import MainCard from "ui-component/cards/MainCard";
import CartItem from "./CartItem";
import config from 'config';
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";

const fetchData = async (key)=>{
    const res = await fetch(`${config.host}/api/v1/cities`,{
        headers: {
            'Content-Type' : 'application/json'
        }
    } )
    return res.json();
}


//here you need to use useSuery to get the product from database then pass it to the cartItem for display
const Cart = ()=>{
    const [cookies,setCookies] = useCookies();
    const [phoneNumber, setPhoneNumber] = useState("+212");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState(0);
    const { enqueueSnackbar } = useSnackbar();

    const {data} = useQuery(['cities'],fetchData)

    console.log("cities ",data);

    const addProduct = (values) => {
        console.log(values);

        enqueueSnackbar('saving the product!', {
            variant: 'info',
            action:()=><CircularProgress color="success" />,
            key: 100}
            );

        const productsDtoList = cookies.cart.map((product)=>{return {id:product[0],quantity:product[2]}});
        const cityId = city;

        const url = `${config.host}/api/v1/orders`;
        
        fetch(url, {
            method: 'post',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': cookies.smailToken
            },
            body: JSON.stringify({ productsDtoList,address,phoneNumber,cityId })
            })
            .then((response) => {
                console.log(response);
                if (!response.ok) throw Error('either check your email to activate your account or your email or password incorrect');
                else {
                    console.log('hello we just added your product');
                }
                // setIsButtonLoading(false);
                return response.json();
            })
            .then((data) => {
                console.log("data 9456464646",data);
                enqueueSnackbar('the product has been saved!',
                    {variant: 'success',
                    preventDuplicate: true,
                    key: 200}
                );
                setAddress("");
                setPhoneNumber("+212");
                setCity(0);
                setCookies('cart', [], { path: '/', maxAge: 86400 });
            })
            .catch((err) => {
                console.error(err.message);
                enqueueSnackbar('the product couldn\'t be saved!', {variant: 'error',preventDuplicate: true, key: 200});
                enqueueSnackbar('try again!', {variant: 'error',preventDuplicate: true, key: 300});
            });
    };


    return(
<MainCard>
    <Grid container spacing={gridSpacing}>
        
        {cookies.cart && cookies.cart.map((product)=>{
            console.log('prod : :::: : ',product);
            return(
                <Grid item lg={4} md={6} sm={6} xs={12}>
                    <CartItem item={{id:product[0],name:product[1],quantity:product[2]}} />
                </Grid>
            );
        })}
        <Grid item xs={12} md={12}>
            <Grid center spacing={gridSpacing} style={{ marginTop:"2em" }}>
                <div>Address : 
                    <Input value={address} onChange={(values)=>setAddress(values.target.value)} />
                </div>
                <div style={{ marginTop:"2em" }}>Phone N° : 
                    <Input value={phoneNumber} onChange={(values)=>setPhoneNumber(values.target.value)} />
                </div>
                <div style={{ marginTop:"2em" }}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={city}
                        autoWidth
                        label="restaurant"
                        name="restaurant"
                        onChange={(values)=>setCity(values.target.value)}
                    >
                        <MenuItem value={0} key={20} disabled>select city</MenuItem>
                        {data && 
                            data.map(city=>
                                <MenuItem value={city.id} key={city.id}>     
                                    {city.name}
                                </MenuItem>
                            )
                        }
                    
                    </Select>
                </div>
                <Button disabled={(phoneNumber.length<10 || !cookies.cart.length>0 || address === "" || city === 0  )?true:false} variant='outlined' color='primary' style={{ marginTop:"2em" }}onClick={addProduct}>Order now</Button>
            </Grid>
        </Grid>
    </Grid>
</MainCard>
    );
}


export default Cart;