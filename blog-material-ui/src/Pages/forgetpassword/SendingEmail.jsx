import React, { useEffect, useState } from 'react'
import { Grid, TextField, Button, Box, Alert, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import validate from "./../../components/Validition/resetpassValidation/resetpassword";
import requests from "./../../apis/forgetPassword/requests";
const focusedColor = "#0d69d5";
const useStyles = makeStyles({
  root: {
    // input label when focused
    "& label.Mui-focused": {
      color: focusedColor,
    },
    // focused color for input with variant='standard'
    "& .MuiInput-underline:after": {
      borderBottomColor: focusedColor,
    },
    // focused color for input with variant='filled'
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: focusedColor,
    },
    // focused color for input with variant='outlined'
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: focusedColor,
      },
    },
  },
  
  Header:{
    backgroundColor: "lightblue" ,
    textAlign:"center",
    color:"teal",
    padding:"10px 0",
    marginBottom:"100px !important",

  },
});
const ResetPassword = (props) => {
    const classes = useStyles(props);
    const [value, setValue] = useState({
        email: ""
      });
      const [errors, setErrors] = useState({});
      const [submitted, setSubmitted] = useState(false);
      const [ValidationStatus, setValidationStatus] = useState(false);
    const [notification, setNotification] = useState({
        show: false,
        type: "warning",
        text: "",
      });

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValue({
          ...value,
          [name]: value,
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        //validation
    
        const email = value.email ? value.email.trim() : value.email;
    
    
        const validationErrors = validate(email);
        setErrors(validationErrors);
        let validStatus = Object.values(validationErrors).every((x) => x === "");
        if (validStatus) {
          setValidationStatus(true);
        } else {
          setValidationStatus(false);
        }
      };
      useEffect(() => {
        const sendUser = async (dataToSend) => {
          const results = await requests.sendingemail(dataToSend);
    
          const { response, data } = results;
    
          console.log(response, data);
          if (response.ok) {
            setNotification({
              show: true,
              type: "success",
              text: data.message,
            });
         
        
          } else if (data) {
            const err = data.message || {};
            if (err) {
              setNotification({
                show: true,
                type: "warning",
                text: err,
              });
            }
          } else {
            setNotification({
              show: true,
              type: "error",
              text: "unknownerror",
            });
          }
        };
        try {
          if (submitted) {
            if (ValidationStatus) {
              //for frontend before backend
    
              sendUser(value);
              setValidationStatus(false);
            }
            setSubmitted(false);
          }
    
          // validation-start-frontend
    
          // validation-end-frontend
        } catch (error) {
          console.log(error);
        }
      }, [submitted]);
  return (
    <div>    <Grid container justifyContent='center'>
    <Grid item sm={6} xs={12}>
    <Grid item  xs={12} >
              <Typography component="h3" variant ="h4" gutterBottom className={classes.Header}>

                Sending-Mail-To-Reset-Password
              </Typography>

          </Grid>
      <Box component='form' 
      noValidate 
      sx={{ mt: 1 }} 
      id='password-reset-email-form' 
      onSubmit={handleSubmit}
      className={classes.root}
      >
        <TextField margin='normal'
         required fullWidth
          id='email'
           name='email'
            label='Email Address'
            value={value.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email && errors.email}
             />
        <Box textAlign='center' >
          <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Send</Button>
        </Box>
        {notification.show ? <Alert severity={notification.type}>{notification.text}</Alert> : ''}
      </Box>
    </Grid>
  </Grid></div>
  )
}

export default ResetPassword