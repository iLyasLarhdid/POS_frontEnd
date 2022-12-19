import React from 'react';
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import config from "config";
import { Card, Chip } from '@mui/material';
import { Box } from '@mui/system';


const fetchData = async (key)=>{
    const token = key.queryKey[1];
    const res = await fetch(`${config.host}/api/v1/productType`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
}

const ViewGatigories = ({reload})=>{

    //get the id from index page and retrieve data based on it
    const [cookie] = useCookies([]);
    const {data} = useQuery(['catigories',cookie.smailToken,reload],fetchData)

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
            {data && data.map(catigory=>{
                return (
                    <>
                        <Chip label={catigory.name} color="warning" />
                    </>
                )
            })}
        </Box>
    </Card>
        
    </div>
    </div>)
}   

export default ViewGatigories;