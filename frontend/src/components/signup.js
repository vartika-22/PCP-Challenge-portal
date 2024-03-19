import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Grid, Paper, Avatar, Box, TextField, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LSimage from "../Images/image.svg";

function SignUp() {
  const paperStyle = { padding: 30, height: "610px" };
  const buttonStyle = {
    backgroundColor: "#9d0f0f",
    margin: "15px",
    padding: "10px 60px",
    textAlign: "center"
  };
  const textfieldStyle = { color: "#9d0f0f", width: "70%", textAlign: "center" };
  const avatar = { backgroundColor: "#9d0f0f", marginTop: "40px", marginBottom: "20px" };
  const pstyle = { marginLeft: "20px" };
  const h2Style = { marginLeft: "0px" };
  const logoStyle = {
    margin: "80px",
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

  const { handleSubmit } = useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState("");

  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return pattern.test(email);
  };
  const checkPasswordStrength = (password) => {
    if (password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      setPasswordStrength("strong");
    } else if (password.length >= 6 && /[A-Za-z0-9]/.test(password)) {
      setPasswordStrength("moderate");
    } else {
      setPasswordStrength("weak");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value === "") {
      setPasswordStrength("");
    } else {
      checkPasswordStrength(e.target.value);
    }
  };

  const handleSignup = async () => {
    console.log("Submitting form...");

    if (!email || !password || !confirmPassword) {
      console.log("Fields are missing");
      toast.error("Email, password, and confirm password are required");
      return;
    }
    if (!isValidEmail(email)) {
      console.log("Invalid email format");
      toast.error("Invalid email format. Please use a valid Gmail address.");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    try {
      console.log("Sending API request...");
      const response = await axios.post("http://127.0.0.1:3002/signup", {
        email,
        password
      });

      console.log("Response from server:", response.data);

      if (response.status === 201) {
        console.log("Sign up successful");

        const successToastId = toast.success("Sign up successful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });

        setTimeout(() => {
          toast.dismiss(successToastId);
          navigate('/');
        }, 3000); // Adjust the timeout value as needed
      }
    } catch (error) {
      console.log("Error:", error);

      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error;

        if (errorMessage === "Email already exists") {
          console.log("Email already exists");
          toast.error("Email already exists");
        } else {
          console.log("Other validation errors");
          // Handle other validation errors if needed
        }
      } else {
        console.error("An error occurred on the server.");
        toast.error("An error occurred on the server.");
      }
    }
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={7} style={grid1Style}>
          <Box>
            <h1 style={logoStyle}>Perficient</h1>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Box display="flex" justifyContent="flex-end">
            <Paper elevation={20} style={paperStyle}>
              <Grid align="center">
                <Avatar style={avatar}>{/* Avatar content */}</Avatar>
                <h2 style={h2Style}>User Sign-Up</h2>
              </Grid>
              <form onSubmit={handleSubmit(handleSignup)}>
                <Box
                  component="div"
                  sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextField
                      label="Email"
                      type="email"
                      placeholder="Enter email (e.g user@gmail.com)"
                      variant="filled"
                      style={textfieldStyle}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      label="Password"
                      type="password"
                      placeholder="Enter Password"
                      autoComplete="current-password"
                      variant="filled"
                      style={textfieldStyle}
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <TextField
                      label="Confirm Password"
                      type="password"
                      placeholder="Confirm Password"
                      autoComplete="current-password"
                      variant="filled"
                      style={textfieldStyle}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordsMatch(e.target.value === password);
                      }}
                    />
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
                  </div>
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  style={buttonStyle}
                  disabled={!passwordsMatch} // Disable the button if passwords don't match
                >
                  Sign Up
                </Button>
              </form>
              <p style={pstyle}>
                Already have an account?{" "}
                <Link to="/" style={{ color: "#9d0f0f" }}>
                  Sign In
                </Link>
              </p>
              <p style={pstyle}>
                Signup as Admin{" "}
                <Link to="/admin" style={{ color: "#9d0f0f" }}>
                  Sign up
                </Link>
              </p>
            </Paper>
          </Box>
          <ToastContainer />
        </Grid>
      </Grid>
    </div>
  );
}

export default SignUp;
