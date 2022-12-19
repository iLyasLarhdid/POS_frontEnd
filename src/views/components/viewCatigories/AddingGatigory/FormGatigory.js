import React from 'react';
import { useCookies } from "react-cookie";
import config from "config";
import { Button, Card, FormControl, FormHelperText, InputLabel, OutlinedInput, useTheme } from '@mui/material';
import { Box } from '@mui/system';

import { Formik } from 'formik';
import * as Yup from 'yup';
import useScriptRef from 'hooks/useScriptRef';
import { useSnackbar } from 'notistack';


const FormGatigory = ({setReload})=>{

    const [cookie] = useCookies([]);
    const scriptedRef = useScriptRef();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();

    const addCatigory = (values) => {
        console.log(values);
        const name = values.title;
        const url = `${config.host}/api/v1/productType`;
        // setIsButtonLoading(true);
        fetch(url, {
            method: 'post',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': cookie.smailToken
            },
            body: JSON.stringify({ name })
            })
            .then((response) => {
                console.log(response);
                if (!response.ok) throw Error('either check your email to activate your account or your email or password incorrect');
                else {
                    console.log('hello we just added your product');
                }
                // setIsButtonLoading(false);
                setReload(old=>!old);
                return response.json();
            })
            .then((data) => {
                console.log("data",data);
                enqueueSnackbar('the catigory is added!', {variant: 'success',});
            })
            .catch((err) => {
                console.error(err.message);
                enqueueSnackbar('something went wrong !', {variant: 'error',});
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
                            addCatigory(values);
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
                                Add Catigory
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

export default FormGatigory;