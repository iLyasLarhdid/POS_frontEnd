import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import FormGatigory from './AddingGatigory/FormGatigory';
import ViewRestaurant from './ViewPage/ViewGatigories';

const ViewCatories = () => {
    const [isLoading, setLoading] = useState(true);
    const [cookies] = useCookies();
    const history = useHistory();
    const [reload, setReload] = useState(false);
    console.log(`${history} / ${cookies} / ${isLoading}`);
    useEffect(() => {
        setLoading(false);
    }, []);
    
    //todo : get the path id if it exists and get the data based on that id so that the user can update the product

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <FormGatigory setReload={ setReload }/>
                    </Grid>
                    <Grid item lg={9} md={6} sm={6} xs={12}>
                        <ViewRestaurant reload={ reload }/>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ViewCatories;
