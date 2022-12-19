import { Grid } from "@mui/material";
import { gridSpacing } from "../../../store/constant";
import ProductCard from "./components/ProductCard";

const Products = ({options}) => {
    //pull the data 
    const data = ProductsApi({options});

    return(
        <>
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    {data && data.map(product=><ProductCard product={product} key={product.id} />)}
                </Grid>
            </Grid>
        </Grid>
        </>
    );
}

 export default Products;
