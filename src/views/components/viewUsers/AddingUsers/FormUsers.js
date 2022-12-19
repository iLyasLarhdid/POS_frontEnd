import React, { useState } from 'react';
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import config from "config";
import { Button, Card, CircularProgress, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';

import { Formik } from 'formik';
import * as Yup from 'yup';
import useScriptRef from 'hooks/useScriptRef';
import { useSnackbar } from 'notistack';
import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';

import { strengthColor, strengthIndicator } from 'utils/password-strength';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RegisterOptions from 'views/components/authentication/register-options';


const fetchData = async (key)=>{
    const token = key.queryKey[1];
    const res = await fetch(`${config.host}/api/v1/cities`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
}

const FormUsers = ({setReload})=>{

    //get the id from index page and retrieve data based on it
    const [fileList, setFileList]= useState([]);
    const [cookie] = useCookies([]);
    const scriptedRef = useScriptRef();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();
    const [cities, roles] = RegisterOptions();
    const [preview, setPreview] = useState({previewImage:'',previewVisible: false,previewTitle: ''});
    const [showPassword, setShowPassword] = useState(false);
    
    const {data} = useQuery(['options',cookie.smailToken],fetchData)

    console.log("options ",data,cities);
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
        const url = `${config.host}/upload/user/${id}`;
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

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    const addUser = (values) => {
        console.log(values);
        enqueueSnackbar('saving the user!', {
            variant: 'info',
            action:()=><CircularProgress color="success" />,
            key: 100}
            );
        const firstName = values.firstName;
        const lastName = values.lastName;
        const email = values.email;
        const password = values.password;
        const role = values.role;
        const cityId = values.city;
        const address = values.address;
        const url = `${config.host}/api/v1/users/superAdmin/register`;
        // setIsButtonLoading(true);
        fetch(url, {
            method: 'post',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': cookie.smailToken
            },
            body: JSON.stringify({ firstName, lastName, email, password, role, cityId, address })
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
                console.log("data",data);
                enqueueSnackbar('the user has been saved!',
                    {variant: 'success',
                    preventDuplicate: true,
                    key: 200}
                );
                if(fileList.length>0)
                    uploadFile(data.id);
                else
                    setReload(old=>!old);
            })
            .catch((err) => {
                console.error(err.message);
                enqueueSnackbar('the user couldn\'t be saved!', {variant: 'error',preventDuplicate: true, key: 200});
                enqueueSnackbar('try again!', {variant: 'error',preventDuplicate: true, key: 300});
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
            <h2>Add user</h2>
            <Formik
                initialValues={{
                    firstName: "",
                    lastName: "",
                    email:"",
                    password: "",
                    city: "",
                    role:"",
                    address:"",
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    firstName: Yup.string().max(255).required('firstName is required'),
                    lastName: Yup.string().max(255).required('lastName is required'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('password is required'),
                    city: Yup.string().max(255).required('city is required'),
                    role: Yup.string().max(255).required('role is required'), address: Yup.string().max(255).required('address is required'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                            addUser(values);
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

                        <Grid container>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    margin="normal"
                                    value={values.firstName}
                                    name="firstName"
                                    type="text"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    sx={{ ...theme.typography.customInput }}
                                />
                                {touched.firstName && errors.firstName && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.firstName}
                                </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    margin="normal"
                                    value={values.lastName}
                                    name="lastName"
                                    type="text"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    sx={{ ...theme.typography.customInput }}
                                />
                                {touched.lastName && errors.lastName && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.lastName}
                                </FormHelperText>
                                )}
                            </Grid>
                        </Grid>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                style={{ backgroundColor: level?.color }}
                                                sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}
                        <Grid container>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-city-label">City</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-city-label"
                                        label="City"
                                        value={values.city}
                                        name="city"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    >
                                        {cities && cities.map((city)=><MenuItem value={city.id} key={city.id}>{city.name}</MenuItem>)
                                        }                                        
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                    <InputLabel id="simple-select-role-label">Role</InputLabel>
                                    <Select
                                        labelId="simple-select-role-label"
                                        value={values.role}
                                        name="role"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="role"
                                    >
                                        {roles && roles.map((role)=><MenuItem value={role.id} key={role.id}>{role.name}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <TextField
                                    fullWidth
                                    label="address"
                                    margin="normal"
                                    value={values.address}
                                    name="address"
                                    type="text"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    sx={{ ...theme.typography.customInput }}
                                />
                        
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}
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
                                Add Courier
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

export default FormUsers;