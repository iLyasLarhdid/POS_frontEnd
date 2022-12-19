import { lazy, useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import { useCookies } from 'react-cookie';
import { useHistory, useParams } from 'react-router-dom';
import ViewOrderPage from './ViewPage/ViewOrderPage';
import Loadable from 'ui-component/Loadable';
const FormOrder = Loadable(lazy(() => import('./SearchOptions/FormOrder')));
const Order = Loadable(lazy(() => import('./ViewPage/Order')));

const ViewOrders = () => {
    const [isLoading, setLoading] = useState(true);
    const [cookies] = useCookies();
    const history = useHistory();
    const {id} = useParams();

    console.log(`${history} / ${cookies} / ${isLoading}/ id : ${id}`);
    useEffect(() => {
        setLoading(false);
    }, []);
    
    if(cookies.principal_role !== "SUPER_ADMIN" && cookies.principal_role !== "COURIER"){
        history.push('/');
    }
    
    //todo : get the path id if it exists and get the data based on that id so that the user can update the product

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    {!id && <Grid item lg={3} md={6} sm={6} xs={12}>
                        <FormOrder />
                    </Grid>}
                    <Grid item lg={id ? 12 : 9} md={id ? 12 : 6} sm={id ? 12 : 6} xs={12}>
                        {id ? <Order id={id}/> : <ViewOrderPage />}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ViewOrders;
