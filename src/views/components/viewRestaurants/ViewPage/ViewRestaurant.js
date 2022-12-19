import React from 'react';
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import config from "config";
import { Box } from '@mui/system';
import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { gridSpacing } from 'store/constant';

const fetchData = async (key)=>{
    const token = key.queryKey[1];
    console.log(key);
    const res = await fetch(`${config.host}/api/v1/restaurants/getAll`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
}

const ViewRestaurant = ({reload})=>{

    //get the id from index page and retrieve data based on it
    const [cookie] = useCookies([]);
    const {data} = useQuery(['restaurants',cookie.smailToken,reload],fetchData)

    console.log('my data',data);

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
            {data && data.map(restaurant=>{
                return (
                    <>
                    <Grid item lg={4} md={6} sm={12} xs={12} key={restaurant.id}>
                        <Card raised={true}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={`${config.host}/upload/viewFile/${restaurant.picture}`}
                                alt="green iguana"
                                />
                                <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {restaurant.title}
                                </Typography>
                            </CardContent>
                        </Card>
                        </Grid>
                    </>
                )
            })}
            </Grid></Grid></Grid>
        </Box>
    </Card>
        
    </div>
    </div>
    )
}   

export default ViewRestaurant;