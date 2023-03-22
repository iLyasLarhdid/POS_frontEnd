import { Button, Checkbox, CircularProgress, FormControlLabel, Grid, Input, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { gridSpacing } from "store/constant";
import MainCard from "ui-component/cards/MainCard";
import CartItem from "./CartItem";
import config from 'config';
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

///////////////////////////////// FOR SPEECH ////////////////////////////////
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {metaphone} from 'metaphone'
import { useDispatch, useSelector } from "react-redux";
import { ADD_TO_CART, RESET_CART } from "store/actions";
import pluralize from "pluralize";
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
const fetchLastOrder = async (key)=>{
    const licensPlate = key.queryKey[1];
    if(licensPlate!==null){
        const res = await fetch(`${config.host}/api/v1/orders/lastOrder`,{
            headers: {
                'Content-Type' : 'application/json'
            }
        } )
        return res.json();
    }
    return undefined; 
};

//here you need to use useSuery to get the product from database then pass it to the cartItem for display
const Cart = ()=>{
    const [cookies,setCookies] = useCookies();
    const [phoneNumber, setPhoneNumber] = useState("+212");
    const [delivery, setDelivery] = useState(false);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState(0);
    const { enqueueSnackbar } = useSnackbar();
    const msg = new SpeechSynthesisUtterance();
    const [speech, setSpeech] = useState(null);
    const [licensPlate, setLicensPlate] = useState(null);
    const [lastOrder, setLastOrder] = useState(null);

    const url = `${config.host}/ws`;
    const {data} = useQuery(['cities'],fetchData);
    useEffect(()=>{
        const sock = new SockJS(url);
        const stompClient = Stomp.over(sock);
        stompClient.reconnect_delay=5000;
        stompClient.connect({"Authorization": "token"},(frame)=>{
            stompClient.subscribe(`/queue/to/mac1`
                ,(response)=>{
                let data = JSON.parse(response.body);
                console.log("conversation that got the new message ",data);
                msg.text = data.message;
                if(data && data.id!==undefined&& data.id!==null){
                    setLicensPlate(old=>data.id);
                    setLastOrder(old=>data.lastOrder);
                }
                window.speechSynthesis.speak(msg)
                }
            );
        })
    },[url]);
    
    //const {data : lastOrder} = useQuery(['orders',licensPlate],fetchLastOrder);

    // useEffect(()=>{
    //     const sock = new SockJS(url);
    //     const stompClient = Stomp.over(sock);
    //     stompClient.reconnect_delay=5000;
    //     stompClient.connect({"Authorization": null},(frame)=>{
    //         stompClient.subscribe(`/queue/to/mac1`
    //             ,(response)=>{
    //                 console.log("recieved d",response);
    //                 let data = JSON.parse(response.body);
    //                 msg.text = data.message;
    //                 window.speechSynthesis.speak(msg)
    //             },{}
    //         );
    //     }) 
    // },[url]);

    //console.log("cities ",data);

    const order = (values) => {
        console.log("the values are ",values);
        if(cookies.cart !== undefined && cookies.cart.length!==0){
            enqueueSnackbar('saving the product!', {
                variant: 'info',
                action:()=><CircularProgress color="success" />,
                key: 100}
                );
    
            const productsDtoList = cookies.cart && cookies.cart.map((product)=>{return {id:product[0],quantity:product[2]}});
            const cityId = city;
            const carId = licensPlate
            const url = `${config.host}/api/v1/orders`;
            
            fetch(url, {
                method: 'post',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': cookies.smailToken
                },
                body: JSON.stringify({ productsDtoList,address,phoneNumber,cityId,carId:licensPlate })
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
                    setSpeech(old=>"would you like anything else")
                })
                .catch((err) => {
                    console.error(err.message);
                    enqueueSnackbar('the product couldn\'t be saved!', {variant: 'error',preventDuplicate: true, key: 200});
                    enqueueSnackbar('try again!', {variant: 'error',preventDuplicate: true, key: 300});
                });
        }
    };

    //////////////////// FOR VOICE ///////////////////////////////
    //todo  :
    /* (you should add voice so your app can speak, also commands that can be excuted like confirm and abort "do you confirm the order : {expecting yes/no/product}")
    -get the product names from the backend turn them into phonetics
    -when the user says 'order' start filling the tarnscript
    -loop through names looking for the product names that the user mentioned 
    (product name can be multiple words we get the phonetic of thos words saperatly and we search only by the first word, if we found then we continue search for other upcoming words untill we find the product, if we found multiple products with the name we present them and let the user choose by 'number_of_product')
    -if nothing was found ask again 'application will speak and ask the user to repeat'
    */
    const dispatch = useDispatch();
    const customization = useSelector((state) => state.customization);

    console.log("customization",customization.cart);
    const [names, setNames] = useState([]);
    const [myTextPhon, setMyTextPhon] = useState([]); //phonetic representation of the text captured from the user
    

    useEffect(() => {
        if(speech!==null){
            msg.text = speech;
            window.speechSynthesis.speak(msg)
        }
      }, [speech]);

    useEffect(()=>{
        SpeechRecognition.startListening({continuous:true})
    },[]);
    //console.log("namesssssssssssssss",names, "text phon : ",myTextPhon );
    
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();

    // get products names
    const {data : products} = useQuery(['products'],fetchProducts);
    
    useEffect(()=>{
        // set a timer when the user stops talking for 10 seconds it means he finished talking
        // if no word was recognized ask him again and delete the previous text in transcript = ""
        if(transcript){
            setMyTextPhon(transcript.split(" ").map(item=>metaphone(pluralize.singular(item))));
        }

    },[transcript]);
    useEffect(()=>{
        if(products){
            // first products with multiple words
            setNames(products.map(item=>{
                const splittedItem = item.name.split(" ");
                if(splittedItem.length===1){
                    return metaphone(item.name)  
                }
                return splittedItem.map(si=>metaphone(si));
            }));//todo : for multi word products we get BG BURGR with space between words
        }
    },[products])
    
    const addToCart = (products, quantity) => {
        if(products!==undefined){    
            if(quantity === undefined){
                quantity = products.map(item=>1);
            }
            if(cookies.cart !== undefined && cookies.cart !== [] ){
                //const unrepeatedProduct = cookies.cart.filter(oldProduct=>oldProduct[0]!==product.id);
                //const repeatedProduct = cookies.cart.filter(oldProduct=>oldProduct[0]===product.id);
                const unrepeatedProduct = cookies.cart.filter(oldProduct=>{
                    if(oldProduct===undefined || oldProduct === null){
                        return true;
                    }
                    return !products.map(item=>item.id).includes(oldProduct[0])
                });
                //const repeatedProduct = cookies.cart.filter(oldProduct=>products.map(item=>item.id).includes(oldProduct[0]));
                const repeatedProduct = cookies.cart.filter(oldProduct=>{
                    if(oldProduct===undefined || oldProduct === null){
                        return false;
                    }
                    return products.map(item=>item.id).includes(oldProduct[0]);
                    
                });
                
                const addedToCart = products.filter((item,key)=>{
                    let newQuantity = quantity[key] !== undefined ? quantity[key] : 1;
                    if(repeatedProduct.length > 0){
                        newQuantity = repeatedProduct[0][2]+newQuantity;
                    }
                    if(newQuantity<=0){
                        return false;
                    }
                    return true;
                }).map((item,key)=>{
                    let newQuantity = quantity[key] !== undefined ? quantity[key] : 1;
                    if(repeatedProduct.length > 0){
                        newQuantity = repeatedProduct[0][2]+newQuantity;
                    }
                    if(newQuantity>0){
                        return [item.id,item.name,newQuantity];
                    }
                });
                setCookies('cart', [...unrepeatedProduct, ...addedToCart], { path: '/', maxAge: 86400 });
                dispatch({ type: ADD_TO_CART , cart: [...unrepeatedProduct, ...addedToCart] });
                console.log("add toooo cart 1 ",products , " unrepeated : ",unrepeatedProduct);
                //////////////////npm i pluralize/////////////////////////
            }
            else {
                const addedToCart = products.map((item,key)=>{
                    let newQuantity = quantity[key] !== undefined ? quantity[key] : 1;
                    return [item.id,item.name,newQuantity];
                });
                setCookies('cart', addedToCart, { path: '/', maxAge: 86400 });
                dispatch({ type: ADD_TO_CART , cart: addedToCart });
                console.log("add toooo cart 3",products);
            }
        }
    };
    const resetCart=()=>{
        setCookies('cart', [], { path: '/', maxAge: 1 });
        dispatch({ type: RESET_CART , cart: [] });
    }

    useEffect(()=>{
        const tt = transcript.toLowerCase().split(" ");
        const numbers = {"one":1,"two":2,"three":3,"four":4,"five":5,"six":6,"seven":7,"eight":8,"nine":9,"ten":10,"eleven":11,"twelve":12,"thirteen":13,"fourteen":14,"fifteen":15};
        let quantities=[]
        let orderedProds = [];
        
        if(myTextPhon[myTextPhon.length-1]===metaphone("please")){
            if(lastOrder && myTextPhon[myTextPhon.length-2]===metaphone("yes")){
                lastOrder.products.map(prod=>{
                    orderedProds[orderedProds.length] = prod.product;
                    quantities[quantities.length]= prod.quantity;
                    return;
                })
            }
            if(tt.includes("remove")){
                tt.map(item=>{
                    if(typeof item === "string" && !isNaN(item)){
                        quantities[quantities.length]= -parseInt(item);
                    }
                    else if(numbers[item]!==undefined ){
                        quantities[quantities.length]= -numbers[item];
                    }else if(names.includes(item)){
                        quantities[quantities.length]= -1;
                    }
                    return 0;
                });
                myTextPhon.map(item=>{
                    if(names.includes(item)){
                        orderedProds[orderedProds.length] = products[names.indexOf(item)];
                    }
                    return 0;
                });
                console.log("ordered prods :",orderedProds, " quanitities : ", quantities, "trans : ", transcript);
            }
            else{
                tt.map(item=>{
                    if(typeof item === "string" && !isNaN(item)){
                        quantities[quantities.length]= parseInt(item);
                    }
                    else if(numbers[item]!==undefined){
                        quantities[quantities.length]= numbers[item];
                    }
                    return 0;
                });
                
                console.log(";;;;;",names);
                for(let i = 0; i<myTextPhon.length;i++){
                    const indexOfItem = names.indexOf(myTextPhon[i])
                    if(indexOfItem>=0){
                        orderedProds[orderedProds.length] = products[indexOfItem];
                    }
                    else{
                        for(let j = 0; j<names.length; j++){
                            let instanceOfProductTitle = 0;
                            if(Array.isArray(names[j]) && myTextPhon[i] === names[j][0]){
                                console.log("hello names ",names[j]);
                                for(let k=i; k<(names[j].length)+i; k++){
                                    console.log("inc ",instanceOfProductTitle);
                                    if(names[j].includes(myTextPhon[k])){
                                        instanceOfProductTitle++;
                                    }
                                }
                                if(instanceOfProductTitle === names[j].length){
                                    console.log("success");
                                    orderedProds[orderedProds.length] = products[j];
                                }
                            }
                        }
                    }
                }
            }
            addToCart(orderedProds,quantities);
            console.log("ordered prods :",orderedProds, " quanitities : ", quantities, "trans : ", transcript);
            resetTranscript();
            setMyTextPhon("");
        }
        if(tt[tt.length-1]==="reset"){
            resetCart();
            resetTranscript();
            setMyTextPhon("");
        }
        if(tt[tt.length-1]==="order" || (tt[tt.length-2]==="that's" && (tt[tt.length-1]==="all" || tt[tt.length-1]==="it"))){
            order();
            resetTranscript();
            setMyTextPhon("");
        }
        if(tt[tt.length-2]==="thank" && tt[tt.length-1]==="you"){
            order();
            setSpeech(old=>"thank you, have a good day");
            resetTranscript();
            setMyTextPhon("");
        }
    },[transcript,myTextPhon, names]);
    /////////////////////////////////////////////////////////////

    return(
<MainCard>
    <Grid container spacing={gridSpacing}>
        {/* <button onClick={()=>setTranscript("2 coffee 3 big mac please")}>click me</button> */}
    {/* <p>{transcript}</p> */}
        {/* {browserSupportsSpeechRecognition && 
        <div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={()=>SpeechRecognition.startListening({continuous:true})}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <p>{transcript}</p>
            <p>{myTextPhon && myTextPhon.map(item=><span>{item} </span>)}</p>
        </div>
        } */}
        {cookies.cart && cookies.cart.map((product)=>{
            if(product!==null){
                return(
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <CartItem item={{id:product[0],name:product[1],quantity:product[2]}} />
                    </Grid>
                );
            }
            return "";
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
                <Button disabled={(delivery && (phoneNumber.length<10 || !cookies.cart.length>0 || address === "" || city === 0)  )?true:false} variant='outlined' color='primary' style={{ marginTop:"2em" }}onClick={order}>Order now</Button>
            </Grid>
        </Grid>
    </Grid>
</MainCard>
    );
}


export default Cart;