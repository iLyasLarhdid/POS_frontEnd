// material-ui
import { Typography, Box, Stack, Pagination, Grid } from '@mui/material';
import { lazy, useState } from 'react';

import MainCard from '../../../ui-component/cards/MainCard';
import Loadable from '../../../ui-component/Loadable';
import ProductsOptions from './components/ProductsOptions';

import config from "config";
import { useQuery } from 'react-query';

const ProductsList = Loadable(lazy(()=>import ('./components/ProductsList')));

const fetchData = async (key)=>{
    const options = key.queryKey[1];
    const res = await fetch(`${config.host}/api/v1/products/page/${options.page-1}/options?productName=${options.productName}&typeId=${options.type.id}`,{
        headers: {
            'Content-Type' : 'application/json'
        }
    } )
    return res.json();
};

const ProductPage = () => {
    const defaultOptions = { page:1, productName:'', type:{id:'0',name:'all'} };
    const [options, setOptions] = useState({ ...defaultOptions });

    const {data} = useQuery(['homeProducts',options],fetchData);
    console.log("data for profuct page -----------------> ",data);
    
    const changePage = (event, value) => {
        setOptions(oldOptions => {return {...oldOptions,page:value}});
    };

    console.log("options ::::::::::::: ",options);
    return (
        <>
        <Grid container spacing={5}>
            <Grid container item spacing={3}>
                <Grid item xs={12} md={3}>
                    <MainCard title={<h3 style={{ margin:0 }}>Options</h3>}>
                        <ProductsOptions options={options} setOptions={setOptions} defaultOptions={defaultOptions}/>
                    </MainCard>
                </Grid>
                
                <Grid item xs={12} md={9} spacing={3}>
                    <MainCard>
                        {data && 
                            <Typography variant="body2">
                                <ProductsList products={data} typeOfData={"products_page"} options={options} />
                                
                                <Box sx={{ mt: 2}}>
                                    <Stack spacing={2}>
                                        <Pagination 
                                        count={data.totalPages} 
                                        variant="outlined" 
                                        shape="rounded"
                                        page={options.page} 
                                        onChange={changePage}
                                        />
                                    </Stack>
                                </Box>
                            </Typography>
                        }
                    </MainCard>                
                </Grid>
            </Grid>
        </Grid>
        
        </>
    );
};

export default ProductPage;
