import { Card, CardActionArea, CardActions, CardContent, CardMedia, Chip, Grid, IconButton, Typography } from "@mui/material";

import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_TO_CART } from '../../../../store/actions';
import config from 'config';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from "notistack";


const ProductCard = ({product})=>{
    let history = useHistory();
    
    const customization = useSelector((state) => state.customization);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    
    const [cookies, setCookies] = useCookies();

    const addToCart = (product, quantity=1) => {
        // useCookies works similare to redux it shanges on every time we change the cookies so maybe if i didn't find a good reason to keep the cart in redux ill just use cookies
        if(cookies.cart !== undefined && cookies.cart !== [] ){
            const unrepeatedProduct = cookies.cart.filter(oldProduct=>oldProduct[0]!==product.id);
            const repeatedProduct = cookies.cart.filter(oldProduct=>oldProduct[0]===product.id);

            let newQuantity = quantity;
            if(repeatedProduct.length > 0){
                newQuantity = repeatedProduct[0][2]+quantity;
            }
            console.log("new quantity ========== ", newQuantity);
            if(newQuantity>0){
                setCookies('cart', [...unrepeatedProduct, [product.id,product.name,newQuantity]], { path: '/', maxAge: 86400 });
                dispatch({ type: ADD_TO_CART , cart: [...cookies.cart, [product.id,product.name,newQuantity]] });
            }
            else{
                setCookies('cart', [...unrepeatedProduct], { path: '/', maxAge: 86400 });
                dispatch({ type: ADD_TO_CART , cart: [ ...cookies.cart ] });
            }
        }
        else {
            setCookies('cart', [[product.id,product.name,quantity]], { path: '/', maxAge: 86400 });
            dispatch({ type: ADD_TO_CART , cart: [[product.id,product.name,quantity]] });}
        
        console.log(customization);
    };

    const deleteProduct = (productId) =>{
        const url = `${config.host}/api/v1/products/delete`;
        const id = productId;
        fetch(url,{
            method:"put",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookies.smailToken
            },
            body:JSON.stringify({ id })
        })
        .then(response =>{ 
            if(!response.ok){
                throw Error("somethign went wrong");
            }
            return response.json();
        }).then(data=>{
            console.log(data);
            enqueueSnackbar('the product has been deleted!', {variant: 'success',});
        }).catch(err=>{
            console.log("err ",err);
            enqueueSnackbar('the product couldn\'t be deleted!', {variant: 'error',});
        });
    };

    return (
    <Grid item lg={4} md={6} sm={6} xs={12}>
        <Card sx={{ maxWidth: 345 }} elevation={2}>
            <CardActionArea onClick={()=>history.push(`/product/${product.id}`)}>
                <CardMedia
                component="img"
                height="200"
                image={product.pictures.length >0 ? `${config.host}/upload/viewFile/${product.pictures[0].title}` : ''}
                alt="product image"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    <b style={{ textAlign:"right", color:"orangered", fontSize:"1.2rem" }}>{product.name}</b>
                    {product.discount ? 
                        <>
                        <del style={{ textAlign:"right", color:"orange" }}> {product.price}DH</del>
                        <b style={{ textAlign:"right", color:"orange", fontSize:"1.5rem" }}> {product.price-(product.price*product.discount.percentage/100)}DH</b>
                        </>
                    :
                        <b style={{ textAlign:"right", color:"orange", fontSize:"1.5rem" }}> {product.price}DH</b>
                    }
                </Typography>
                <Typography style={{ position:"absolute", top:"1px", right:"1px" }}>{product.discount && <b><Chip label={`Discount ${product.discount.percentage}%`} color="warning" /></b>}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.description.substring(0,50)}...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.types && product.types.map((prod)=><Chip label={`${prod.name}`} color="secondary" key={prod.id}/>)}
                </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <IconButton color="primary" onClick={()=>addToCart(product)}>
                    <AddShoppingCartIcon />
                </IconButton>
                {cookies.principal_role === "SUPER_ADMIN" 
                    &&
                    <>
                    <IconButton color="error" onClick={()=>deleteProduct(product.id)}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={()=>history.push(`/addProduct/${product.id}`)}>
                        <EditIcon />
                    </IconButton>
                    </>
                }
            </CardActions>
        </Card>
    </Grid>);
};

export default ProductCard;