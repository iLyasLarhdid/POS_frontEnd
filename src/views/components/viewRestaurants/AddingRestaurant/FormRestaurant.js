import React, { useState } from 'react';
import { useCookies } from "react-cookie";
import config from 'config';
import { Button, Card, FormControl, FormHelperText, InputLabel, OutlinedInput, TextField, useTheme } from '@mui/material';
import { Box } from '@mui/system';

import { Formik } from 'formik';
import * as Yup from 'yup';
import useScriptRef from 'hooks/useScriptRef';
import { useSnackbar } from 'notistack';
import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';

const FormRestaurant = ({setReload})=>{

    //get the id from index page and retrieve data based on it
    const [fileList, setFileList]= useState([]);
    const [cookie] = useCookies([]);
    const scriptedRef = useScriptRef();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const [preview, setPreview] = useState({previewImage:'',previewVisible: false,previewTitle: ''});

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        console.log("file list");
        console.log(fileList);
      };

    function getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }
    const onPreview = async file => {
        console.log(file);
        console.log(preview);
        let src = file.url;
        if (!src) {
          file.preview = await getBase64(file.originFileObj);
        }
        setPreview({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
          });
      };

    const uploadFile = (id)=>{
        console.log("file");
        console.log(fileList[0]);
        const formData = new FormData();
        formData.append("file",fileList[0].originFileObj);
        //in the url or body you send your product id to be uploaded
        const url = `${config.host}/upload/restaurant/id/${id}`;
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
            setReload(old=>!old);
        }).catch(err=>{
            setFileList([]);
            console.log("err ",err);
            enqueueSnackbar('the image couldn\'t be saved!', {variant: 'error',});
        });
    }
    const addRestaurant = (values) => {
        console.log(values);
        const title = values.title;
        const openTime = values.openTime;
        const closeTime = values.closeTime;
        const url = `${config.host}/api/v1/restaurants`;
        // setIsButtonLoading(true);
        fetch(url, {
            method: 'post',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': cookie.smailToken
            },
            body: JSON.stringify({ title, openTime, closeTime })
            })
            .then((response) => {
                console.log(response);
                if (!response.ok) throw Error('either check your email to activate your account or your email or password incorrect');
                else {
                    console.log('hello we just added your restau');
                }
                // setIsButtonLoading(false);
                return response.json();
            })
            .then((data) => {
                console.log("data",data);
                enqueueSnackbar('the restaurant is saved!', {variant: 'success',});
                //todo : you should send the id of the product so that  the picture can be updated for that product

                // another approch is after saving this product the page changes to the upload of picture and he can upload the picture to that product

                //or you can let him stay in the same page and disable all the input fields and enable the upload picture button
                if(fileList.length>0)
                    uploadFile(data.id);
                else
                    setReload(old=>!old);
            })
            .catch((err) => {
                console.error(err.message);
                enqueueSnackbar('something went wrong with restaurant!', {variant: 'error',});
            });
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
                    title: "",
                    openTime: "00:00",
                    closeTime:"00:00",
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string().max(255).required('Title is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                            addRestaurant(values);
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
                        <FormControl fullWidth error={Boolean(touched.title && errors.title)} sx={{ ...theme.typography.customInput }}>
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

                        <InputLabel htmlFor="outlined-adornment-email-login">open time : </InputLabel>
                        <FormControl fullWidth error={Boolean(touched.openTime && errors.openTime)} sx={{ ...theme.typography.customInput }}>
                            
                            <TextField
                                id="time"
                                type="time"
                                name="openTime"
                                value={values.openTime}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                inputProps={{
                                step: 300, // 5 min
                                }}
                                sx={{ width: 150 }}
                            />
                        </FormControl>

                        <InputLabel htmlFor="outlined-adornment-email-login">close time : </InputLabel>
                        <FormControl fullWidth error={Boolean(touched.closeTime && errors.closeTime)} sx={{ ...theme.typography.customInput }}>
                            
                            <TextField
                                id="time"
                                type="time"
                                name="closeTime"
                                value={values.closeTime}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                inputProps={{
                                step: 300, // 5 min
                                }}
                                sx={{ width: 150 }}
                            />
                        </FormControl>

                        <FormControl>
                            <ImgCrop rotate grid>
                                <Upload
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={onChange}
                                    onPreview={onPreview}
                                    style={{ width:"250" }}
                                >
                                    {fileList.length < 1 && '+ Upload'}
                                </Upload>
                            </ImgCrop>
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

export default FormRestaurant;