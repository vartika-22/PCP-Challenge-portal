import React, { useState } from "react";
 
import axios from "axios";

 
import { useForm } from "react-hook-form";
 
import { Link,useNavigate } from "react-router-dom";
 
import LSimage from "../Images/image.svg";
 
import { ToastContainer, toast } from "react-toastify";
 
import "react-toastify/dist/ReactToastify.css";
 
import { Grid, Paper, Box, TextField, Button, Avatar } from "@mui/material";
 
 
 
function AdminSignup() {
 
  const paperStyle = { padding: 30, height: "auto" };
 
  const buttonStyle = {
 
    backgroundColor: "#9d0f0f",
 
    margin: "15px",
 
    padding: "10px 60px",
 
    textAlign: "center"
 
  };
 
  const textfieldStyle = { color: "#9d0f0f", width: "70%", textAlign: "center", margin: "10px" };
 
  const avatar = { backgroundColor: "#9d0f0f", marginTop: "30px", marginBottom: "20px", alignItems: "center", textAlign: "center", marginLeft: "40%" };
 
  const h2Style = { marginLeft: "0px" };
 
  const logoStyle = {
 
    marginTop: "80px",
 
    fontSize: "90px",
 
    color: "#fff",
 
    transition: "opacity 0.4s ease-in-out",
 
    display: "inline-block"
 
  };
 
  const grid1Style = {
 
    backgroundColor: "#9d0f0f",
 
    backgroundImage: `url(${LSimage})`,
 
    backgroundSize: "60%",
 
    backgroundRepeat: "no-repeat",
 
    backgroundPosition: "45px 82%",
 
    display: "flex",
 
    flexDirection: "column",
 
    alignItems: "center"
 
  };
 
  const {
 
    register,
    handleSubmit,watch
 
  } = useForm();
 
  const navigate = useNavigate();
 
  const [signupSuccess, setSignupSuccess] = useState(false); 
  const [passwordHelpText, setPasswordHelpText] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const handleConfirmPasswordChange = (event) => {
    const confirmPassword = event.target.value;
    const password = watch("password");
    if (confirmPassword !== password) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };
 
  const handlePasswordChange = (event) => {
    const password = event.target.value;
 
    // Check password criteria and update help text accordingly
    if (password.length < 8) {
      setPasswordHelpText("Password must be at least 8 characters long.");
    } else if (!/[a-z]/.test(password)) {
      setPasswordHelpText("Password must contain at least 1 lowercase letter.");
    } else if (!/[A-Z]/.test(password)) {
      setPasswordHelpText("Password must contain at least 1 uppercase letter.");
    } else if (!/\d/.test(password)) {
      setPasswordHelpText("Password must contain at least 1 digit.");
    } else if (!/[!@#$%^&*]/.test(password)) {
      setPasswordHelpText("Password must contain at least 1 special symbol (!@#$%^&*).");
    } else {
      setPasswordHelpText("");
    }
    handleConfirmPasswordChange({ target: { value: watch("confirmPassword")} });
  };
  const isValidEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    const repeatedPattern = /@gmail\.com.*@gmail\.com/;
    
    return pattern.test(email) && !repeatedPattern.test(email);
  };
  
  
 
 
  const onSubmitAdmin = async (data) => {
 
    if (!data.email || !data.password) {
 
      // Handle empty email or password
 
      toast.error("Please fill in both email and password fields.");
 
      return;
 
    }
    if (!isValidEmail(data.email)) {
      toast.error("Invalid email format.");
      return;
    } 
 
    try {
 
      const response = await axios.post(
 
        "http://127.0.0.1:3002/admin/signup",
 
        data
 
      );
 
 
 
      // Send admin approval request email
 
      const approvalResponse = await axios.post(
 
        "http://127.0.0.1:3002/admin/send-approval-request",
 
        {
 
          email: data.email,
 
          description: data.description,
 
        }
 
      );
 
 
 
      setSignupSuccess(true);
 
      toast.success("Successfully signed up as admin. An approval request has been sent to the admin.",{autoClose:3500});
 
      setTimeout(() => {
 
       
 
        window.location.reload();
 
      }, 3500);
 
    } catch (error) {
 
      console.error(error);
 
      if (error.response && error.response.status === 400) {
 
        // Handle invalid email or password error
 
        toast.error("Invalid email or password. Please check your input and try again.");
 
 
      }
 
      else if (error.response.status === 500) {
 
        // Handle user already exists error
 
        toast.error("User already exists. Please choose a different email or log in.");
 
      } else {
 
        toast.error("An error occurred. Please try again later.");
 
      }
 
   
 
    }
 
  };
 
 
 
  return (
 
    <Grid container>
 
      <Grid item xs={7} style={grid1Style}>
 
        <Box>
 
          <h1 style={logoStyle}>Perficient</h1>
         
 
        </Box>
 
      </Grid>
 
      <Grid item xs={5}>
 
        <Paper elevation={3} style={paperStyle}>
 
          <Avatar style={avatar}></Avatar>
 
          <h2 style={h2Style}>Admin Signup</h2>
 
          <form onSubmit={handleSubmit(onSubmitAdmin)}>
 
            <div className="admin-item">
 
              <TextField
 
                label="Email"
 
                type="email"
 
                variant="filled"
 
                style={textfieldStyle}
 
                {...register("email")}
 
              />
 
            </div>
 
            <div className="admin-item">
 
              <TextField
 
                label="Password"
 
                type="password"
 
                variant="filled"
 
                style={textfieldStyle}
 
                {...register("password")}
                onChange={handlePasswordChange}
                />
 
            </div>
            <TextField
                label="Confirm Password"
                type="password"
                variant="filled"
                style={textfieldStyle}
                {...register("confirmPassword")}
                onChange={handleConfirmPasswordChange}
              />
              <p style={{ color: "#ab1212", fontSize: "12px", marginTop: "5px" }}>
              {passwordHelpText}
            </p>
              {!passwordsMatch && (
                <p style={{ color: "#9d0f0f" }}>Passwords do not match.</p>
              )}
              {passwordStrength && passwordStrength === "weak" && (
                <p style={{ color: "#9d0f0f" }}>Password is weak.</p>
              )}
              {passwordStrength === "moderate" && (
                <p style={{ color: "#9d0f0f" }}>Password is moderate.</p>
              )}
              {passwordStrength === "strong" && (
                <p style={{ color: "#4caf50" }}>Password is strong.</p>
              )}
 
            <div className="admin-item">
 
              <TextField
 
                label="Description"
 
                type="txt"
 
                padding="10px"
 
                variant="filled"
 
                style={textfieldStyle}
 
                {...register("description")}
 
              />
 
            </div>
 
            <div className="admin-item">
 
              <Button
 
                type="submit"
 
                variant="contained"
 
                className="admin-submit"
 
                style={buttonStyle}
 
                disabled={signupSuccess}
 
              >
 
                Sign Up as Admin
 
              </Button>
 
             
 
              <p>
 
                <small>
 
                  Already Have an Account?<Link to="/">Log-In</Link>
 
                </small>
 
              </p>
 
              {signupSuccess && (
 
                <p style={{color:"#ab1212"}}>
 
                  Contact Admin for approval
 
                </p>
 
              )}
 
            </div>
 
          </form>
 
        </Paper>
 
      </Grid>
 
      <ToastContainer />
 
    </Grid>
 
  );
 
}
 
 
 
export default AdminSignup;