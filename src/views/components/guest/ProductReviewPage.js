// material-ui
import { Typography, Grid, Button } from '@mui/material';
import { lazy, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from "react-router-dom";

import MainCard from '../../../ui-component/cards/MainCard';
import Loadable from '../../../ui-component/Loadable';

import config from "config";
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

const ProductCard = Loadable(lazy(()=>import('./components/ProductReviewCard')))

const ProductReviewPage = () => {
    const {id} = useParams();
    const history = useHistory();
    const {data} = useQuery(['homeProducts',id],fetchData);

    useEffect(()=>{
        if(data && data.status !== undefined){
            history.goBack();
        }
    },[data,history]);

    return (
        <>
        <Grid container spacing={5}>
            <Grid container item spacing={3}>
                <Grid item xs={12} md={7}>
                    <MainCard>
                        {data && data.status===undefined && <ProductCard product={data} key={data.id}/>}
                    </MainCard>
                </Grid>
                
                <Grid item xs={12} md={5} spacing={3}>
                    <MainCard>
                        {/* <Typography variant="body2">
                            call us 0646568956
                        </Typography> */}
                        <Typography variant="body2">
                            <Button>Order Now</Button>
                        </Typography>
                    </MainCard>                
                </Grid>
            </Grid>
        </Grid>
        
        </>
    );
};

export default ProductReviewPage;
