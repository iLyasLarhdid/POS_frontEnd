import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import config from 'config';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from '../../../../ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import chartData from './chart-data/total-growth-bar-chart';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];


const fetchData = async (key)=>{
    const token = key.queryKey[1];
    const res = await fetch(`${config.host}/api/v1/orders/stats/pods`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
};
// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //
const chartD = (data)=> {

    let months = data.map(item=>{
        let d = item.day.split('/')[1]
        if('01' === d){
            return item.soldProds;
        }if('02' === d){
            return item.soldProds;
        }if('03' === d){
            return item.soldProds;
        }if('04' === d){
            return item.soldProds;
        }if('05' === d){
            return item.soldProds;
        }if('06' === d){
            return item.soldProds;
        }if('07' === d){
            return item.soldProds;
        }if('08' === d){
            return item.soldProds;
        }if('09' === d){
            return item.soldProds;
        }if('10' === d){
            return item.soldProds;
        }if('11' === d){
            return item.soldProds;
        }if('12' === d){
            return item.soldProds;
        }
    })
    return (
        {
            height: 480,
            type: 'bar',
            options: {
                chart: {
                    id: 'bar-chart',
                    stacked: true,
                    toolbar: {
                        show: true
                    },
                    zoom: {
                        enabled: true
                    }
                },
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: 'bottom',
                                offsetX: -10,
                                offsetY: 0
                            }
                        }
                    }
                ],
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '50%'
                    }
                },
                xaxis: {
                    type: 'category',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                legend: {
                    show: true,
                    fontSize: '14px',
                    fontFamily: `'Roboto', sans-serif`,
                    position: 'bottom',
                    offsetX: 20,
                    labels: {
                        useSeriesColors: false
                    },
                    markers: {
                        width: 16,
                        height: 16,
                        radius: 5
                    },
                    itemMargin: {
                        horizontal: 15,
                        vertical: 8
                    }
                },
                fill: {
                    type: 'solid'
                },
                dataLabels: {
                    enabled: false
                },
                grid: {
                    show: true
                }
            },
            series: [
                {
                    name: 'Sold products',
                    data: months
                }
            ]
        }
    )
    
};

const TotalGrowthBarChart = ({ isLoading, data }) => {
    const [value, setValue] = useState('today');
    const theme = useTheme();
    const [cookies] = useCookies();
    const customization = useSelector((state) => state.customization);

    const {data : stats} = useQuery(['statsTotal',cookies.smailToken],fetchData)

    const { navType } = customization;
    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;

    useEffect(() => {
        if(stats!==undefined){
            const newChartData = {
                ...chartD(stats).options,
                colors: [primary200, primaryDark, secondaryMain, secondaryLight],
                xaxis: {
                    labels: {
                        style: {
                            colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                        }
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: [primary]
                        }
                    }
                },
                grid: {
                    borderColor: grey200
                },
                tooltip: {
                    theme: 'light'
                },
                legend: {
                    labels: {
                        colors: grey500
                    }
                }
            };
    
            // do not load chart when loading
            if (!isLoading) {
                ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
            }
        }
    }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500]);

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Total Growth</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3"> {data && data.map(item=>item.soldProds).reduce((o,n)=>o+n)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="standard-select-currency"
                                        select
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    >
                                        {status.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            {stats && <Chart {...chartD(stats)} />}
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
