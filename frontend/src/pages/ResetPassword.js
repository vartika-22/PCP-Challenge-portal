import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate= useNavigate();
 
  const [passwordHelpText, setPasswordHelpText] = useState('');
 
  const handleNewPasswordChange = (event) => {
    const newPassword = event.target.value;
 
    // Check password criteria and update help text accordingly
    if (newPassword.length < 8) {
      setPasswordHelpText('Password must be at least 8 characters long.');
    } else if (!/[a-z]/.test(newPassword)) {
      setPasswordHelpText('Password must contain at least 1 lowercase letter.');
    } else if (!/[A-Z]/.test(newPassword)) {
      setPasswordHelpText('Password must contain at least 1 uppercase letter.');
    } else if (!/\d/.test(newPassword)) {
      setPasswordHelpText('Password must contain at least 1 digit.');
    } else if (!/[!@#$%^&*]/.test(newPassword)) {
      setPasswordHelpText('Password must contain at least 1 special symbol (!@#$%^&*).');
    } else {
      setPasswordHelpText('');
    }
 
    setNewPassword(newPassword); // Update the newPassword state
  };
 
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error("Please enter a new password", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return; // Don't proceed if newPassword is empty
    }
   
 
    try {
      const response = await axios.post(`http://127.0.0.1:3002/reset-password/${token}`, { newPassword });
      if (response.status === 200) {
        setResetSuccess(true);
        setError('');
        toast.success("Password has been reset successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      setError('Failed to reset password. Please try again.');
     
    }
  };
  const handleCancelClick = () => {
    navigate("/");
};
 
  return (
 
    <Paper style={{paddingTop:"13%",height:"100vh",backgroundColor:"#e8e8e8"}}>
        <Box style={{backgroundColor:"#deeaee",width:"40%",height:"300px",padding:"30px",marginLeft:"30%",boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.3)"}}>
            <CancelIcon onClick={handleCancelClick} style={{ cursor: "pointer",marginLeft:"90%" }} />
            <h2 style={{textAlign:"center" ,marginLeft:"0px"}}>Reset Password</h2>
            {resetSuccess ? (
            <p style={{padding:"30px"}}>Your password has been successfully reset.<Link to="/"><Button style={{backgroundColor:"#9d0f0f",width:"40%" ,padding:"5px",marginTop:"20px"}} variant="contained" >Back To Sign-In</Button></Link></p>
            ) : (
 
            <form onSubmit={handleResetPassword}>
            <div className="item">
                <label htmlFor="newPassword"></label>
                <TextField style={{margin:"15px",width:"70%"}} type="password" value={newPassword} onChange={handleNewPasswordChange} variant="filled" label="Enter new Password" />
 
                <p style={{ color: "#ab1212", fontSize: "12px", marginTop: "5px" }}>
              {passwordHelpText}
            </p>
            </div>
            <Button style={{backgroundColor:"#9d0f0f",width:"30%" ,padding:"10px"}} variant="contained" type="submit">Reset</Button>
                {error && <p className="error">{error}</p>}
                </form>
        )}
        <ToastContainer/>
        </Box>
    </Paper>
  );
}
export default ResetPassword;