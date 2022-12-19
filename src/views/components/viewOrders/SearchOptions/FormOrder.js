import { Box, Button, Card, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";


const FormOrder = ()=>{

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
                    <div>restaurents: </div>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">restaurant</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={10}
                            label="restaurant"
                        >
                            <MenuItem value={0} key={0}>all</MenuItem>
                            <MenuItem value={20} key={20}>mcdonalds</MenuItem>
                            <MenuItem value={30} key={30}>pizza hut</MenuItem>
                            <MenuItem value={40} key={40}>quick</MenuItem>
                            
                        </Select>
                    </FormControl>
                    <Button variant="outlined">Reset</Button>
                </Stack>
            </Box>
        </Card>
        </>
    );
}   

export default FormOrder;