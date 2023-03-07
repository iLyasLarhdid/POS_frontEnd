import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from '../../../../store/constant';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import config from 'config';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const fetchData = async (key)=>{
    const token = key.queryKey[1];
    const res = await fetch(`${config.host}/api/v1/orders/stats`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
};

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const [cookies] = useCookies();
    const history = useHistory();
    const {data} = useQuery(['stats',cookies.smailToken],fetchData)
    console.log("dataa for update----------------->",data);
    useEffect(() => {
        if (cookies.smailToken === undefined) {
            console.warn('youre not logged in!');
            window.location.reload(false);
        }
        setLoading(false);
    }, [cookies, history]);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} xs={12}>
                        <EarningCard isLoading={isLoading} data={data}/>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                        <TotalOrderLineChartCard isLoading={isLoading} data ={data} />
                    </Grid>
                    
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <TotalGrowthBarChart isLoading={isLoading} data={data} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
