import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import { useParams } from "react-router-dom";
import { gridSpacing } from 'store/constant';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import FormProduct from './addProduct/FormProduct';
import ProductPictureUpload from './addProduct/ProductPictureUpload';
import { useQuery } from 'react-query';
import config from 'config';

const fetchData = async (key)=>{
    const token = key.queryKey[1];
    const id = key.queryKey[2];
    if(id === undefined)
        return null;
        
    const res = await fetch(`${config.host}/api/v1/products/id/${id}`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
};

const AddProducts = () => {
    const {id} = useParams();
    const [isLoading, setLoading] = useState(true);
    const [cookies] = useCookies();
    const history = useHistory();
    const [fileList, setFileList] = useState([]);

    const {data} = useQuery(['product_update',cookies.smailToken,id],fetchData)
    console.log("dataa for update----------------->",data);

    console.log(`${history} / ${cookies} / ${isLoading}`);
    useEffect(() => {
        setLoading(false);
    }, []);
    
    //todo : get the path id if it exists and get the data based on that id so that the user can update the product

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    {(cookies.principal_role === "SUPER_ADMIN" || cookies.principal_role === "RESTAURANTS") && <>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <ProductPictureUpload product={data} fileList={fileList} setFileList={setFileList}/>
                    </Grid>
                    <Grid item lg={9} md={6} sm={6} xs={12}>
                        {data!==undefined &&
                            <FormProduct product={data} fileList={fileList} setFileList={setFileList} />
                        }
                    </Grid> </>}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AddProducts;
