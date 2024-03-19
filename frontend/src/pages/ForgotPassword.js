import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import axios from 'axios';

import CancelIcon from '@mui/icons-material/Cancel';

import { useNavigate } from 'react-router-dom';

import '../css/ForgotPassword.css'

import { Box, Paper, TextField } from '@mui/material';

import { Button } from '@mui/material';

import { ToastContainer,toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

 

function ForgotPassword() {

  const [email, setEmail] = useState('');

  const [resetSuccess, setResetSuccess] = useState(false);

  const [error, setError] = useState('');

 

  const navigate= useNavigate();

  const handleResetPassword = async (e) => {

    e.preventDefault();

    if (!email) {

      toast.error('Please enter your email.');

      return;

    }

   

    try {

      const response = await axios.post('http://127.0.0.1:3002/forgot-password', { email });

      if (response.status === 200) {

        toast.success('Email sent Successful!')

       

      }

    } catch (error) {

      toast.error('Failed to reset password. Please check the email address.');

    }

  };

  const handleCancelClick = () => {

    navigate("/");

};

 

 

  return (

 

    <Paper style={{paddingTop:"13%",height:"100vh",backgroundColor:"#e8e8e8"}}>

      <Box style={{backgroundColor:"#deeaee",width:"40%",height:"300px",padding:"30px",marginLeft:"30%",boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.3)"}}>

      <CancelIcon onClick={handleCancelClick} style={{ cursor: "pointer",marginLeft:"90%" }} />

      <h2 style={{textAlign:"center" ,marginLeft:"0px"}}>Forgot Password</h2>

      {resetSuccess ? (

        <p style={{padding:"30px"}}>An email with instructions to reset your password has been sent to your email address.</p>

      ) : (

        <form onSubmit={handleResetPassword}>

          <div className="item">

            <label htmlFor="email"></label>

            <TextField style={{margin:"15px",width:"70%"}} type="email" value={email} onChange={(e) => setEmail(e.target.value)} variant="filled" label="Enter your email" />

          </div>

          <Button style={{backgroundColor:"#9d0f0f",width:"30%" ,padding:"10px",margin:"20px"}} variant="contained" type="submit" className='reset-button'>Submit</Button>

         

        </form>

      )}

    </Box>

    <ToastContainer />

    </Paper>

  );

}

 

 

 

export default ForgotPassword;