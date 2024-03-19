import React, { useState } from "react";
import { useNavigate} from 'react-router-dom'; // Import useHistory
import LSimage from '../Images/image.svg';
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Grid, Paper, Avatar, Box, TextField, Button} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"; // Import Axios
import jwt_decode from 'jwt-decode';

function Login() {
    const paperStyle = { padding: 20, height: '610px', justifyContent: 'flex-end',width:"100%" };
    const avatarStyle ={backgroundColor: '#9d0f0f', marginTop: '80px' }
    const buttonStyle = { backgroundColor: '#9d0f0f', margin: '15px', padding: '10px 70px', textalign:"center" };
    const textfieldStyle = { color: '#9d0f0f', width: '60%' ,textalign:"center",marginTop:"20px"};
    const h2Style={marginTop:"20px",marginLeft:"0px"};
    const pStyle={marginLeft:"10px"};
    const logoStyle = {
    margin: '80px',
    fontSize: '90px',
    color: '#fff',
    transition: 'opacity 0.4s ease-in-out',
    display: 'inline-block',
    };
    const grid1Style = {
    backgroundColor: '#9d0f0f',
    backgroundImage: `url(${LSimage})`,
    backgroundSize: '60%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '45px 82%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate(); // Initialize useHistory
    const {handleSubmit, formState: { errors } } = useForm();
    const [loginError, setLoginError] = useState(""); // State to store login error message
    

    const handleLogin = async (e, data) => {
      if (!email || !password) {
        toast.error("Please enter email and password", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return; // Don't proceed if fields are empty
      }
      try {
        const response = await axios.post("http://localhost:3002/login", {
          email,      // Make sure this matches your input field for email
          password,   // Make sure this matches your input field for password
        });
    
        const token = response.data.token;
        const decodedToken = jwt_decode(token);
        localStorage.setItem('token', token);
        localStorage.setItem('isAdmin', decodedToken.isAdmin);
        localStorage.setItem("userEmailID", email); // 'email' should be the user's email
        localStorage.setItem('userName', decodedToken.name);
    
        setLoginError(""); // Clear login error if successful
        localStorage.setItem('isLoggedIn', 'true');
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
    
        // Delay redirection by 3000ms (3 seconds) to match the toast autoClose time
        setTimeout(() => {
          if (decodedToken.isAdmin) {
            navigate('/aq'); // Redirect to admin page
          } else {
            navigate('/dash'); // Redirect to user dashboard page
          }
        }, 2500);
      } catch (error) {
        console.error(error.response);
        setLoginError("Invalid email or password");
        toast.error("Invalid email or password", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };
    

 

  // ... (rest of your code)


    return ( 
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
              <Avatar style={avatarStyle}>
                </Avatar>
                <h2 style={h2Style}>Sign In</h2>
              </Grid>
              <form onSubmit={handleSubmit(handleLogin)}>
                <Box  sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                  <div>
                    <TextField
                      label="Email"
                      type="email"
                      placeholder="Enter email"
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
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </Box>
                
                  <Button type="submit" variant="contained" style={buttonStyle}>
                    Sign In
                  </Button>
                  
              </form>
              
                <p style={pStyle}>Don't have an account? <Link to="/signup" style={{ color: '#9d0f0f' }}>Sign-Up</Link>
                </p>
              
                <Link to='/forgot-Password'><p>Forgot Password?</p></Link>
            </Paper>
          </Box>
          <ToastContainer />
        </Grid>
      </Grid>
     );
}
export default Login;
