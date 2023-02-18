import React from 'react';
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { Button, Card, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import { Box } from '@mui/system';
import config from 'config';

import { Formik } from 'formik';
import * as Yup from 'yup';
import useScriptRef from 'hooks/useScriptRef';
import { useSnackbar } from 'notistack';

const fetchData = async (key)=>{
    const token = key.queryKey[1];
    const res = await fetch(`${config.host}/api/v1/products/options`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
}

const FormProduct = ({product, fileList, setFileList})=>{

    //get the id from index page and retrieve data based on it
    const [cookie] = useCookies([]);
    const scriptedRef = useScriptRef();
    const { enqueueSnackbar } = useSnackbar();

    const {data} = useQuery(['product_options',cookie.smailToken],fetchData);

    console.log("dtaa----------------->",data,product);
    
    const uploadFile = (id)=>{
        console.log("file");
        console.log(fileList[0]);
        const formData = new FormData();
        fileList.map(file=>formData.append("file",file.originFileObj));
        //in the url or body you send your product id to be uploaded
        const url = `${config.host}/upload/product/id/${id}`;
        fetch(url,{
            method:"post",
            headers: {
                'Authorization': cookie.smailToken
            },
            body:formData
        })
        .then(response =>{ 
            if(!response.ok){
                throw Error("somethign went wrong");
            }
            return response.json();
        }).then(data=>{
            console.log("upload=>");
            console.log(data);
            enqueueSnackbar('the image is saved!', {variant: 'success',});
            //const index = JSON.stringify(data);
            setFileList([]);
        }).catch(err=>{
            setFileList([]);
            console.log("err ",err);
            enqueueSnackbar('the image couldn\'t be saved!', {variant: 'error',});
        });
    }
    const addProduct = (values) => {
        console.log(values);

        enqueueSnackbar('saving the product!', {
            variant: 'info',
            action:()=><CircularProgress color="success" />,
            key: 100}
            );

        const name = values.title;
        const price = values.price;
        const description = values.description;
        //const restaurantId = values.restaurant;
        const productTypeIds = values.category;
        const discountDto = {percentage:values.discount,endDate:values.endDate};;
        const url = `${config.host}/api/v1/products`;
        // setIsButtonLoading(true);
        console.log("productTypeId",productTypeIds);
        fetch(url, {
            method: 'post',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': cookie.smailToken
            },
            body: JSON.stringify({ name, price, description, productTypeIds, discountDto })
            })
            .then((response) => {
                console.log(response);
                if (!response.ok) throw Error('either check your email to activate your account or your email or password incorrect');
                else {
                    console.log('hello we just added your product');
                }
                // setIsButtonLoading(false);
                return response.json();
            })
            .then((data) => {
                console.log("data 9456464646",data);
                enqueueSnackbar('the product has been saved!',
                    {variant: 'success',
                    preventDuplicate: true,
                    key: 200}
                );
                if(fileList.length !== 0)
                    uploadFile(data.id);
            })
            .catch((err) => {
                console.error(err.message);
                enqueueSnackbar('the product couldn\'t be saved!', {variant: 'error',preventDuplicate: true, key: 200});
                enqueueSnackbar('try again!', {variant: 'error',preventDuplicate: true, key: 300});
            });
    };

    const uploadFileUpdate = (id)=>{
        const formData = new FormData();
        fileList.map(file=>formData.append("file",file.originFileObj));
        //in the url or body you send your product id to be uploaded
        const url = `${config.host}/upload/product/id/${id}`;
        fetch(url,{
            method:"put",
            headers: {
                'Authorization': cookie.smailToken
            },
            body:formData
        })
        .then(response =>{ 
            if(!response.ok){
                throw Error("somethign went wrong");
            }
            return response.json();
        }).then(data=>{
            console.log("upload=>");
            console.log(data);
            enqueueSnackbar('the image is updated!', {variant: 'success',});
            //const index = JSON.stringify(data);
            setFileList([]);
        }).catch(err=>{
            setFileList([]);
            console.log("err ",err);
            enqueueSnackbar('the image couldn\'t be updated!', {variant: 'error',});
        });
    }

    const updateProduct = (values) => {
        console.log(values);

        enqueueSnackbar('updating the product!', {
            variant: 'info',
            action:()=><CircularProgress color="success" />,
            key: 100}
            );

        const id = product.id;
        const name = values.title;
        const price = values.price;
        const description = values.description;
        //const restaurantId = values.restaurant;
        const productTypeIds = values.category;
        const discountDto = {percentage:values.discount,endDate:values.endDate};;
        const url = `${config.host}/api/v1/products`;
        // setIsButtonLoading(true);
        console.log("productTypeId",productTypeIds);
        fetch(url, {
            method: 'put',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': cookie.smailToken
            },
            body: JSON.stringify({ id, name, price, description, productTypeIds, discountDto })
            })
            .then((response) => {
                console.log(response);
                if (!response.ok) throw Error('either check your email to activate your account or your email or password incorrect');
                else {
                    console.log('hello we just added your product');
                }
                // setIsButtonLoading(false);
                return response.json();
            })
            .then((data) => {
                console.log("data 9456464646",data);
                enqueueSnackbar('the product has been saved!',
                    {variant: 'success',
                    preventDuplicate: true,
                    key: 200}
                );
                if(fileList.length !== 0)
                    uploadFileUpdate(data.id);
            })
            .catch((err) => {
                console.error(err.message);
                enqueueSnackbar('the product couldn\'t be saved!', {variant: 'error',preventDuplicate: true, key: 200});
                enqueueSnackbar('try again!', {variant: 'error',preventDuplicate: true, key: 300});
            });
    };

    const isAddOrUpdate=(values)=>{
        if(product!==null){
            updateProduct(values);
        }
        else{
            addProduct(values);
        }
    };
    
    return(
    <div className="container">
    <div className="row">
    <Card>
    <Box 
        sx={{ mt: 2}} 
        style={{ borderRadius:"10px", padding:"1rem",marginBottom:"1rem"}}
        autoComplete="off"
        noValidate
        >
            <Formik
                initialValues={{
                    title: product ? product.name : "",
                    price:  product ? product.price : "",
                    description: product ? product.description : "",
                    //restaurant: product ? product.restaurant.id : 0,
                    category: product ? product.types.map((type)=>type.id) : [],
                    discount: product && product.discount!=null ? product.discount.percentage : 0,
                    endDate:product && product.discount!=null ? product.discount.endDate : "",
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string().max(255).required('Title is required'),
                    price: Yup.number().min(1).required('Price is required'),
                    discount: Yup.number().min(0).max(100).required('discount is required'),
                    category: Yup.array().required('category is required'),
                    //restaurant: Yup.string().max(500).required('restaurant is required'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                            isAddOrUpdate(values);
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <FormControl fullWidth error={Boolean(touched.title && errors.title)} style={{ marginBottom:"1em" }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Title</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-title-login"
                                type="text"
                                value={values.title}
                                name="title"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Title"
                                inputProps={{}}
                            />
                            {touched.title && errors.title && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.title}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.price && errors.price)} style={{ marginBottom:"1em" }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Price</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="number"
                                value={values.price}
                                name="price"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Price"
                                inputProps={{}}
                            />
                            {touched.price && errors.price && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.price}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth error={Boolean(touched.description && errors.description)} style={{ marginBottom:"1em" }}>
                            <InputLabel id="Desc">Description</InputLabel>
                            <OutlinedInput
                                id="Desc"
                                type="text"
                                value={values.description}
                                name="description"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Description"
                                inputProps={{}}
                                multiline
                            />
                            {touched.description && errors.description && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.description}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.discount && errors.discount)} style={{ marginBottom:"1em" }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">discount</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="number"
                                value={values.discount}
                                name="discount"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="discount"
                                inputProps={{}}
                            />
                            {touched.discount && errors.discount && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.discount}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {values.discount>0 && 
                            <>
                            <FormControl fullWidth error={Boolean(touched.endDate && errors.endDate)} style={{ marginBottom:"1em" }}>
                                <TextField
                                    id="endDate"
                                    type="datetime-local"
                                    name="endDate"
                                    label="Discount Expiration Date :"
                                    value={values.endDate}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    inputProps={{
                                    step: 300, // 5 min
                                    }}
                                />
                            </FormControl>
                            </>
                        }
                        <FormControl fullWidth error={Boolean(touched.category && errors.category)} style={{ marginBottom:"1em" }}>
                            <InputLabel id="selectCat">Select catigory</InputLabel>
                            <Select
                                labelId="selectCat"
                                id="selectCat"
                                value={values.category}
                                label="Select catigory"
                                name="category"
                                multiple
                                onBlur={handleBlur}
                                onChange={handleChange}
                            >
                                {data && data.categories && 
                                    data.categories.map(cat=>
                                        <MenuItem value={cat.id} key={cat.id}>     
                                            {cat.name}
                                        </MenuItem>
                                    )
                                }
                            </Select>
                            {touched.category && errors.category && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.category}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="secondary"
                            >
                                Add product
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    </Card>
        
    </div>
    </div>)
}   

export default FormProduct;