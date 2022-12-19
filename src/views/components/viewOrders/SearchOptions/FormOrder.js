import { Box, Button, Card, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useState } from "react";


const FormOrder = ()=>{
    const [category, setCategory] = useState();
    const [search, setSearch] = useState();
    const data = ["CAT1","CAT2","CAT3"];
    const resetFields = ()=>{
        setCategory(0);
        setSearch("");
    }
    return(
        <>
        <Card>
            <Box 
                sx={{ mt: 2}} 
                style={{ borderRadius:"10px", padding:"1rem",marginBottom:"1rem"}}
                autoComplete="off"
                noValidate
            >
                <Stack spacing={2}>
                    <center><h3>Search Opetions</h3></center>
                    <FormControl fullWidth>
                        <TextField
                            variant="outlined" 
                            id="demo-simple-select"
                            value={search}
                            label="Search"
                            name="Search"
                            onChange={(event)=>{setSearch(event.target.value)}}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="CategoriesID">Category</InputLabel>
                        <Select
                            labelId="CategoriesID"
                            id="demo-simple-select"
                            value={category}
                            label="Category"
                            name="category"
                            onChange={(event)=>{setCategory(event.target.value)}}
                        >
                            <MenuItem value={0} key={0}>all</MenuItem>
                            {data.map(item=>{
                                return (<MenuItem value={item} key={item}>{item}</MenuItem>)
                            })}
                            
                        </Select>
                    </FormControl>
                    <Button variant="outlined" onClick={resetFields}>Reset</Button>
                </Stack>
            </Box>
        </Card>
        </>
    );
}   

export default FormOrder;