import { Box, Button, FormControl, Grid, OutlinedInput, useMediaQuery } from "@mui/material";
import React from "react";
import { useTheme } from '@mui/material/styles';

import { gridSpacing } from "../../../store/constant";

import Rocket from '../../../assets/images/rocket.svg';

const PageTop =()=>{
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    return(
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item lg={6} md={6} sm={6} xs={12} style={{ height:"500px"  }}>
                            <h1 style={{ marginTop:'20%', color:"orangered" }}><b>The best Products</b></h1>
                            <Box component="form" noValidate autoComplete="off">
                                <FormControl sx={{ width: matchDownSM ? '80vw':'40vw' }}>
                                    <OutlinedInput placeholder="Please enter text" />
                                    <Button sx={{ width: '20vw', borderRadius:12,marginTop:2, color:"orangered" }} variant="outlined">send</Button>
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12} style={{ height:"500px", backgroundImage:`url(${Rocket})`, backgroundPosition:'center',backgroundSize:'contain', backgroundRepeat:"no-repeat", display:matchDownSM? 'none' : '' }}>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default PageTop;