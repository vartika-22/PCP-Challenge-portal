import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import '../css/takechallenge.css';

const TakeChallenge = () => {
  return (
    <Container
      style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        marginTop: '20px',
        marginBottom: '20px',
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
        height: '150px',
        width: '95%',
      }}
    >
      <div className='content-takechallenge' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" style={{ fontFamily: 'Poppins, sans-serif', color: '#9D0F0F', marginRight: '20px' }}>
          Bring the Fun back to Corporate Trainings <br></br>with <span>PCP</span>
        </Typography>
        <Button
          component={Link}
          to="/challenges"
          variant="contained"
          
          className='takechallenge-button'
          sx={{
            backgroundColor: '#9D0F0F',
            color: 'white',
            fontSize: '1.5em',
            fontWeight: 400,
            fontFamily: 'Poppins, sans-serif',
            transition: 'background-color 0.3s, color 0.3s', // Adding transition for hover effect
            '&:hover': {
              backgroundColor: 'white', // Background turns white on hover
              color: '#9D0F0F', // Text turns red on hover
            },
          }}
        >
          Challenges
        </Button>
      </div>
    </Container>
  );
};

export default TakeChallenge;
