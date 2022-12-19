// material-ui
import { Typography, Divider, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// redux
import { useSelector } from 'react-redux';
import Loadable from '../../../ui-component/Loadable';
import { lazy, Suspense } from 'react';
import config from 'config';
import { useQuery } from 'react-query';

import backGroundImage from "./pic/back.jpg";

const JoinUsForm = Loadable(lazy(()=>import ('./components/JoinUsForm')));
const MainCard = Loadable(lazy(()=>import ('../../../ui-component/cards/MainCard')));
const PageTop = Loadable(lazy(()=>import ('./PageTop')));
const ProductsList = Loadable(lazy(()=>import ('./components/ProductsList')));

const fetchData = async (key)=>{
    const page = key.queryKey[1];
    const res = await fetch(`${config.host}/api/v1/products/home/page/${page}`,{
        headers: {
            'Content-Type' : 'application/json'
        }
    } )
    return res.json();
};

const GuestPage = () => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const {data} = useQuery(['homeProducts',0],fetchData)
    console.log("data for home----------------->",data);
    return (
        <>
        <MainCard>
            <Suspense fallback={<div>loading..</div>}>
                <PageTop />
            </Suspense>
        </MainCard>
        <MainCard title={<center><h3 style={{ margin:0 }}>Food</h3></center>} style={{ marginTop:25, marginBottom:25 }}>
            <Typography variant="body2">
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex'
                    }}
                >
                    <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                    <Button
                        variant="outlined"
                        sx={{
                            cursor: 'unset',
                            m: 2,
                            py: 0.5,
                            px: 7,
                            borderColor: `${theme.palette.grey[100]} !important`,
                            color: `${theme.palette.grey[900]}!important`,
                            fontWeight: 500,
                            borderRadius: `${customization.borderRadius}px`
                        }}
                        disableRipple
                        disabled
                    >
                        Best Deals
                    </Button>

                    <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                </Box>
                    {data &&
                        <Suspense fallback={<div>loading..</div>}>
                            <ProductsList products={data.bestDeals} typeOfData={"best_deals"}/>
                        </Suspense>
                    }
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex'
                    }}
                >
                    <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                    <Button
                        variant="outlined"
                        sx={{
                            cursor: 'unset',
                            m: 2,
                            py: 0.5,
                            px: 7,
                            borderColor: `${theme.palette.grey[100]} !important`,
                            color: `${theme.palette.grey[900]}!important`,
                            fontWeight: 500,
                            borderRadius: `${customization.borderRadius}px`
                        }}
                        disableRipple
                        disabled
                    >
                        Most consumed
                    </Button>

                    <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                </Box>
                
                    {data &&
                        <Suspense fallback={<div>loading..</div>}>
                            <ProductsList products={data.mostConsumed} typeOfData={"best_deals"}/>
                        </Suspense>
                    }
                
            </Typography>
        </MainCard>

        <MainCard title={<center><h3 style={{ margin:0 }}>Join us</h3></center>} style={{ backgroundImage:`url(${backGroundImage})`,backgroundSize:'cover', backgroundRepeat:'no-repeat', backgroundPosition:'center' }}>
            <Suspense fallback={<div>loading..</div>}>
                <JoinUsForm/>
            </Suspense>
        </MainCard>
        </>
    );
};

export default GuestPage;
