import { Button, Checkbox, CircularProgress, FormControlLabel, Grid, Input, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { gridSpacing } from "store/constant";
import MainCard from "ui-component/cards/MainCard";
import CartItem from "./CartItem";
import config from 'config';
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";

///////////////////////////////// FOR SPEECH ////////////////////////////////
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {metaphone} from 'metaphone'
/////////////////////////////////////////////////////////////////////////////

const fetchData = async (key)=>{
    const res = await fetch(`${config.host}/api/v1/cities`,{
        headers: {
            'Content-Type' : 'application/json'
        }
    } )
    return res.json();
}
const fetchProducts = async (key)=>{
    const res = await fetch(`${config.host}/api/v1/products`,{
        headers: {
            'Content-Type' : 'application/json'
        }
    } )
    return res.json();
};

//here you need to use useSuery to get the product from database then pass it to the cartItem for display
const Cart = ()=>{
    const [cookies,setCookies] = useCookies();
    const [phoneNumber, setPhoneNumber] = useState("+212");
    const [delivery, setDelivery] = useState(false);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState(0);
    const { enqueueSnackbar } = useSnackbar();
    //////////////////// FOR VOICE ///////////////////////////////
    //todo  :
    /* (you should add voice so your app can speak, also commands that can be excuted like confirm and abort "do you confirm the order : {expecting yes/no/product}")
    -get the product names from the backend turn them into phonetics
    -when the user says 'order' start filling the tarnscript
    -loop through names looking for the product names that the user mentioned 
    (product name can be multiple words we get the phonetic of thos words saperatly and we search only by the first word, if we found then we continue search for other upcoming words untill we find the product, if we found multiple products with the name we present them and let the user choose by 'number_of_product')
    -if nothing was found ask again 'application will speak and ask the user to repeat'
    */
    const [names, setNames] = useState([]);
    const [myTextPhon, setMyTextPhon] = useState([]); //phonetic representation of the text captured from the user
    const [myProdPhon, setMyProdPhon] = useState([]); //phonetic representation of the products names

    console.log("namesssssssssssssss",names, "text phon : ",myTextPhon );
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();
    
    // get products names
    const {data : products} = useQuery(['products'],fetchProducts);

    console.log("products -------------",products);
    useEffect(()=>{
        // set a timer when the user stops talking for 10 seconds it means he finished talking
        // if no word was recognized ask him again and delete the previous text in transcript = ""
        if(transcript){
            setMyTextPhon(transcript.split(" ").map(item=>metaphone(item)));
        }
    },[transcript]);
    useEffect(()=>{
        if(products){
            setNames(products.map(item=>metaphone(item)));
        }
    },[products])

    useEffect(()=>{
        myTextPhon.map(item=>console.log(item," in my list === ",names.includes(item)))
    },[transcript,myTextPhon, names]);
    /////////////////////////////////////////////////////////////
    
    const {data} = useQuery(['cities'],fetchData)

    console.log("cities ",data);

    const addProduct = (values) => {
        console.log(values);
        enqueueSnackbar('saving the product!', {
            variant: 'info',
            action:()=><CircularProgress color="success" />,
            key: 100}
            );

        const productsDtoList = cookies.cart && cookies.cart.map((product)=>{return {id:product[0],quantity:product[2]}});
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
        {browserSupportsSpeechRecognition && 
        <div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={()=>SpeechRecognition.startListening({continuous:true})}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <p>{transcript}</p>
            <p>{myTextPhon && myTextPhon.map(item=><span>{item} </span>)}</p>
        </div>
        }
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
                {
                delivery && 
                <>
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
                            label="city"
                            name="city"
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
                </>
                }
                <FormControlLabel control={<Checkbox onClick={()=>setDelivery(old=>!old)}/>} label="Home delivery" /><br/>
                <Button disabled={(delivery && (phoneNumber.length<10 || !cookies.cart.length>0 || address === "" || city === 0)  )?true:false} variant='outlined' color='primary' style={{ marginTop:"2em" }}onClick={addProduct}>Order now</Button>
            </Grid>
        </Grid>
    </Grid>
</MainCard>
    );
}


export default Cart;