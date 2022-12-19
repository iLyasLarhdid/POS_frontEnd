
import React from 'react';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { Formik } from 'formik';

import * as Yup from 'yup';
/*

    <Box
      sx={{
        '& .MuiTextField-root': { m: 1, width: matchDownSM ? '80vw' : '45vw' },
      }}
    >
*/
// project imports

import MainCard from '../../../../ui-component/cards/MainCard';
import useScriptRef from '../../../../hooks/useScriptRef';
const JoinUsForm = ({ ...others }) => {

    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    
    const scriptedRef = useScriptRef();
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    
    const loginSubmit = (values) => {
        console.log(values);
    };

    return (
        <MainCard
        style={{ width:matchDownSM? '85vw': '45vw' }}
        sx={{
            '& > *': {
                flexGrow: 1,
                flexBasis: '50%'
            }
        }}
        content={false}
        >
        <Box sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>
        <div>
        <Formik
            initialValues={{
                email: '',
                topic: '',
                message:'',
                address:'',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    if (scriptedRef.current) {
                        loginSubmit(values);
                        await sleep(2000);
                        setStatus({ success: true });
                        setSubmitting(false);
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
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address"
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.address && errors.address)} sx={{ ...theme.typography.customInput }} >
                            <InputLabel 
                            htmlFor="outlined-adornment-address">address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-address"
                                type="text"
                                value={values.address}
                                name="address"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="address"
                                inputProps={{}}
                            />
                            {touched.address && errors.address && (
                                <FormHelperText error id="standard-weight-helper-text-address">
                                    {errors.address}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.topic && errors.topic)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-topic">Topic</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-topic"
                                type="text"
                                value={values.topic}
                                name="topic"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Topic"
                                inputProps={{}}
                            />
                            {touched.topic && errors.topic && (
                                <FormHelperText error id="standard-weight-helper-text-topic">
                                    {errors.topic}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.message && errors.message)} sx={{ ...theme.typography.customInput }} >
                            <InputLabel 
                            htmlFor="outlined-adornment-message">{values.message.length===0 ? 'message' : ''}</InputLabel>
                            <OutlinedInput
                                multiline
                                id="outlined-adornment-message"
                                type="text"
                                value={values.message}
                                name="message"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="message"
                                inputProps={{}}
                            />
                            {touched.message && errors.message && (
                                <FormHelperText error id="standard-weight-helper-text-message">
                                    {errors.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                send
                            </Button>
                        </Box>
                    </form>
                )}
        </Formik>
        
      </div>
      </Box>
    </MainCard>
      );
};

export default JoinUsForm;