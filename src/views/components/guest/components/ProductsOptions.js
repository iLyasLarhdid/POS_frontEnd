import { Box, Button, FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import config from 'config';
import { useQuery } from "react-query";

const fetchData = async (key)=>{
    const res = await fetch(`${config.host}/api/v1/products/options`,{
        headers: {
            'Content-Type' : 'application/json'
        }
    } )
    return res.json();
}

const ProductsOptions =({options,setOptions,defaultOptions})=>{

    const {data} = useQuery(['product_options'],fetchData);

    console.log(data);
    return(
        <>
        <Box sx={{ mt: 2}}>
            <Stack spacing={2}>
                {options && <>
                    <FormControl fullWidth>
                    <InputLabel htmlFor="productSearch">search</InputLabel>
                        <OutlinedInput
                            id="productSearch"
                            type="text"
                            value={options.productName}
                            name="search"
                            onChange={(event)=>{setOptions({...options, productName:event.target.value});}}
                            label="search"
                            inputProps={{}}
                        />
                    </FormControl>
                    {/* <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">restaurant</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={options.restaurants.id}
                            label="restaurant"
                            onChange={(event)=>{setOptions({...options, restaurants:{id:event.target.value, name:event.target.name}});}}
                        >
                            <MenuItem value={0} key={0}>All restaurants</MenuItem>
                            {data && 
                                data.restaurant.map(resto=><MenuItem value={resto.id} key={resto.id}>{resto.title}</MenuItem>)
                            }
                            
                        </Select>
                    </FormControl> */}
                    <Button variant="outlined" onClick={()=>setOptions(defaultOptions)}>Reset</Button>
                </>}
            </Stack>
        </Box>
        
        </>
    );
}
export default ProductsOptions;
