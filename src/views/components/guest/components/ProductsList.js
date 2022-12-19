import { Box, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { gridSpacing } from "store/constant";

import ProductCard from '../components/ProductCard';

const ProductsList = ({products, typeOfData, options}) => {

    const [startsEnds, setStartsEnds] = useState([0,3]);
    const [showMore, setShowMore] = useState(false);
    useEffect(()=>{
        if(showMore){
            setStartsEnds([0,9]);
        }
        if(!showMore){
            setStartsEnds([0,3]);
        }
    },[showMore]);
    console.log(products);
    return(
        <>
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    {products && products.content !== undefined && products.content.slice(startsEnds[0],startsEnds[1]).map(product => <ProductCard product={product} key={product.id}/>)}
                </Grid>
            </Grid>
            {typeOfData !== "products_page" &&
                <Grid item xs={12}>
                    <Grid>
                        <Box sx={{ mt: 2}}>
                            <Button
                                variant="outlined"
                                disableElevation
                                fullWidth
                                onClick={()=>setShowMore(oldval=>!oldval)}
                                size="small"
                                type="submit"
                                color="primary"
                            >
                                {showMore ? <>See less</> : <>See more</>}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            }
        </Grid>
        </>
    );
}

 export default ProductsList;
