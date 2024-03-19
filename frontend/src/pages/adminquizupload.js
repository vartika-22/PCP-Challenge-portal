import React, { useState,useEffect } from 'react';

import { Button, Container, Typography, Paper, TextField, Grid, Box } from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import axios from 'axios';

import AdminNavbar from './adminNavbar';

import AdminQuizList from './adminquizlist';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

 

const UploadAndAssignQuiz = () => {

  const [file, setFile] = useState(null);

  const [uploadMessage, setUploadMessage] = useState('');

 

  const handleFileChange = (e) => {

    setFile(e.target.files[0]);

  };

 

  const handleUpload = async () => {

    if (!file) {

      toast.error('Please select a file before uploading.');

      return;

    }

   

    try {

      const formData = new FormData();

      formData.append('file', file);

 

      const token = localStorage.getItem('token');

 

      await axios.post('http://localhost:3002/admin/aq', formData, {

        headers: {

          Authorization: `Bearer ${token}`,

          'Content-Type': 'multipart/form-data',

        },

      });

 

      // After successfully uploading the quiz, assign it to existing users

      await axios.post('http://localhost:3002/assign-quizzes-to-existing-users', null, {

        headers: {

          Authorization: `Bearer ${token}`,

        },

      });

 

      // Send a request to trigger email notifications

      await axios.post('http://localhost:3002/admin/send-quiz-upload-emails', null, {

        headers: {

          Authorization: `Bearer ${token}`,

        },

      });

 

      toast.success("Quiz uploaded, assigned, and email notifications sent.");

     

    } catch (error) {

      console.error('Error during upload:', error);

      console.error('Error response data:', error.response.data);

      toast.error('An error occurred during upload.');

    }

  };

 

  return (

    <Container   >

      <AdminNavbar />

      <ToastContainer/>

        <Grid container style={{backgroundColor:"#F5F5F5",padding:"50px",marginTop:"150px",boxShadow: '0px 4px 6px grey'}}>

            <Grid xs={5}>

              <Paper

                elevation={3}

                sx={{

                  display: 'flex',

                  flexDirection: 'column',

                  alignItems: 'center',

                  padding: 3,

                  height:"300px"

                 

                 

                }}

              >

                <Box style={{padding:"20px"}}>

                <Typography style={{padding:"10px"}} variant="h4">Upload and Assign Quiz</Typography>

                <input type="file" variant='filled' accept=".json" onChange={handleFileChange} />

                <Button

                  variant="contained"

                  style={{backgroundColor:"#ab1212"}}

                  startIcon={<CloudUploadIcon />}

                  sx={{ marginY: 2 }}

                  onClick={handleUpload}

                >

                  Upload and Assign

                </Button>

                <Typography>{uploadMessage}</Typography>

                </Box>

              </Paper>

            </Grid>

            <Grid xs={7}>

              <Paper elevation={3} style={{marginLeft:"20px",padding:"20px",width:"100%",maxHeight: '300px',minHeight: '300px', overflowY: 'auto'}}>

                <AdminQuizList/>

              </Paper>

            </Grid>

        </Grid>

     

    </Container>

  );

};

 

export default UploadAndAssignQuiz;