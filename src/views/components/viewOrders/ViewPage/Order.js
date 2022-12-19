import React from 'react';
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import config from "config";
import { Card } from '@mui/material';
import { Box } from '@mui/system';


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


const Order = ({id})=>{

    //get the id from index page and retrieve data based on it
    const [cookie] = useCookies([]);
    const {data} = useQuery(['posts',cookie.smailToken,id],fetchData);

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
            hello {id}
            <a href="https://github.com/iLyasLarhdid">my github</a>
            <input type="email" formTarget0="_blank"/>
            <table>
                <tr>
                    <td>id</td>
                    <td>name</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
        </Box>
    </Card>
        
    </div>
    </div>)
}   

export default Order;