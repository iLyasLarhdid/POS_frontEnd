import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { ADD_TO_CART } from "store/actions";

import config from 'config';
import { useQuery } from 'react-query';

const fetchData = async (key)=>{
  const id = key.queryKey[1];
  const res = await fetch(`${config.host}/api/v1/products/id/${id}`,{
      headers: {
          'Content-Type' : 'application/json'
      }
  } )
  return res.json();
};

const CartItem = ({ item }) => {
    const customization = useSelector((state) => state.customization);
    const dispatch = useDispatch();

    const {data} = useQuery(['product',item.id],fetchData)
    console.log("data for cart----------------->",data);

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
            setCookies('cart', [[product.id,product.name,quantity]], { path: '/', maxAge: 604800 });
            dispatch({ type: ADD_TO_CART , cart: [[product.id,product.name,quantity]] });}
        
        console.log(customization);
    }

    const removeFromCart = (product, quantity=1) => {
        // useCookies works similare to redux it shanges on every time we change the cookies so maybe if i didn't find a good reason to keep the cart in redux ill just use cookies
        if(cookies.cart !== undefined && cookies.cart !== [] ){
            const unrepeatedProduct = cookies.cart.filter(oldProduct=>oldProduct[0]!==product.id);
            const repeatedProduct = cookies.cart.filter(oldProduct=>oldProduct[0]===product.id);

            let newQuantity = quantity;
            if(repeatedProduct.length > 0){
                newQuantity = repeatedProduct[0][2]-quantity;
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
        
        console.log(customization);
    }
//todo : add smooth transition when adding deleting product 
  return (
    <>
    {data && data.name !== undefined && 
      <Card raised={true} sx={{ maxWidth: 345 }}>
          <CardMedia
          component="img"
          height="140"
          image={data.pictures && data.pictures.length >0 ? `${config.host}/upload/viewFile/${data.pictures[0].title}` : ''}
          alt="product image"
          />
          <CardContent>
          <Typography gutterBottom variant="h5" component="div">
              <b style={{ textAlign:"right", color:"orangered", fontSize:"1.2rem" }}>{data.name}</b>
              {data.discount ? 
                  <>
                  <del style={{ textAlign:"right", color:"orange" }}> {data.price}DH</del>
                  <b style={{ textAlign:"right", color:"orange", fontSize:"1.5rem" }}> {data.price-(data.price*data.discount.percentage/100)}DH</b>
                  </>
              :
                  <b style={{ textAlign:"right", color:"orange", fontSize:"1.5rem" }}> {data.price}DH</b>
              }
          </Typography>
          <Typography>
          <Button
              size="small"
              fullWidth
              disableElevation
              color="secondary"
              variant="contained"
              onClick={()=>removeFromCart(item)}
            >
              -
            </Button>
            <center><b>{item.quantity}</b></center>
              <Button
              fullWidth
              size="small"
              color="secondary"
              disableElevation
              variant="contained"
              onClick={()=>addToCart(item)}
            >
              +
            </Button>
          </Typography>
      </CardContent>
  </Card>
  }
  </>
  );
};

export default CartItem;
