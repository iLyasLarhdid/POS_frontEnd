import React, { useState } from 'react';
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import config from "config";
import { Card, Grid, Pagination, Stack } from '@mui/material';
import { Box } from '@mui/system';
import UsersCard from './UsersCard';
import { gridSpacing } from 'store/constant';

const fetchData = async (key)=>{
    const page = key.queryKey[1];
    const token = key.queryKey[2];
    const res = await fetch(`${config.host}/api/v1/users/page/${page}`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
}

const UsersPage = ({reload})=>{
    //get the id from index page and retrieve data based on it
    const [cookie] = useCookies([]);
    const [pageNumber, setPageNumber] = useState(1);

    const {data} = useQuery(['posts',pageNumber-1,cookie.smailToken,reload],fetchData)

    console.log("users : ",data);

    const changePage = (event, value) => {
        setPageNumber(value);
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
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            
                            {data &&
                                data.content.map(user=><Grid item lg={4} md={6} sm={6} xs={12}><UsersCard user={user} /></Grid>)
                            }
                            
                        </Grid>
                    </Grid>
                </Grid>
        </Box>   
    </Card>

    {data && 
        <Card sx={{ mt: 2}}>
        <Box style={{ padding:10 }}>
            <Stack spacing={2}>
                <Pagination 
                count={data.totalPages} 
                variant="outlined" 
                shape="rounded"
                page={pageNumber}
                onChange={changePage}
                    />
            </Stack>
        </Box>
        </Card>
    }
        
    </div>
    </div>)
}   

export default UsersPage;