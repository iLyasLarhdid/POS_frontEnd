// ===========================|| DASHBOARD - TOTAL GROWTH BAR CHART ||=========================== //

const chartData = (data)=> {

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
export default chartData;
