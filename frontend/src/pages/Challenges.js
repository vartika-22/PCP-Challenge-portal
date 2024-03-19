import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import HelpIcon from '@mui/icons-material/Help';
import Navbar from '../components/side-navbar';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import {
  Modal,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Box,
  Divider,
} from '@mui/material';

import InstructionsPopup from './InstructionPopup';
import LogoutBar from '../components/Logoutbar';

function ChallengesPage() {
  const cardStyle = {
    height: '300px',
    boxShadow: '0px 4px 6px grey',
    paddingBottom: '10px',
    padding: '10px',
    width: '30%',
    marginBottom: '50px',
    marginTop: '10px',
  };

  const buttonStyle = {
    backgroundColor: '#9d0f0f',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    marginTop: '10px',
  };

  const boxStyle = {
    height: '100px',
    padding: '15%',
    margin: '30px',
    marginBottom: '5px',
    color: 'white',
    borderRadius: '10px',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', // Better box shadow
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  };

  const pstyle = { marginTop: '3%', padding: '15px', color: '#9d0f0f', fontSize: '75px' };
  const emojiStyle = { fontSize: '94px', color: '#9d0f0f', marginTop: '-7px' };
  const instStyle = {
    marginBottom: '5px',
    backgroundColor: 'white',
    color: '#9d0f0f',
    boxShadow: '0px 4px 6px grey',
    borderRadius: '10px',
    height: '45px',
  };
  const containerStyle = { backgroundColor: '#edf0f5', margin: '0px' };
  const bStyle = { margin: '10px', paddingBottom: '5px' };

  const cardStyleWithBorderRadius = {
    ...cardStyle,
    borderRadius: '10px',
  };

  const instructionDivStyle = {
    marginTop: '20px',
    width: '200px',
    position: 'relative',
    left: '395px',
  };

  const totalScoreBoxStyle = {
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0px 4px 6px grey',
    width: '150px',
    position: 'relative',
    left: '420px',
    marginTop: '10px',
  };

  const [assignedQuizzes, setAssignedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userTotalScore, setUserTotalScore] = useState(0);
  const token = localStorage.getItem('token');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignedQuizzes();
    fetchUserTotalScore();
  }, []);

  const fetchAssignedQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:3002/user/challenges', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAssignedQuizzes(response.data.assignedQuizzes);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserTotalScore = async () => {
    try {
      const response = await axios.get('http://localhost:3002/user/total-score', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserTotalScore(response.data.totalScore);
    } catch (error) {
      console.error(error);
    }
  };

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function getCardBackgroundColor(quizId) {
    const savedColors = JSON.parse(localStorage.getItem('cardColors')) || {};
    if (savedColors[quizId]) {
      return savedColors[quizId];
    } else {
      const color = getRandomColor();
      const newColors = { ...savedColors, [quizId]: color };
      localStorage.setItem('cardColors', JSON.stringify(newColors));
      return color;
    }
  }

  return (
    <Navbar>
      <LogoutBar></LogoutBar>
      <Container style={containerStyle}>
        <Container>
          <Box style={instructionDivStyle}>
            <Button style={instStyle} onClick={() => setShowPopup(true)}>
              <HelpIcon /> Instructions
            </Button>
            <Modal open={showPopup} onClose={() => setShowPopup(false)}>
              <div>
                <InstructionsPopup onClose={() => setShowPopup(false)} />
              </div>
            </Modal>
          </Box>
          <Box style={totalScoreBoxStyle}>
            <Typography variant="body1">Total Score: {userTotalScore}</Typography>
          </Box>
          {loading ? (
            <Typography variant="body1" style={{ marginTop: '100px', paddingBottom: '200px' }}>
              <CircularProgress style={{ color: '#ab1212' }} />
            </Typography>
          ) : assignedQuizzes.length === 0 ? (
            <Typography variant="body1">No assigned quizzes available.</Typography>
          ) : (
            <Box style={bStyle}>
              <ul
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginTop: '5%',
                }}
              >
                {assignedQuizzes.map((quiz) => (
                  <Card
                    key={quiz._id}
                    style={{
                      ...cardStyleWithBorderRadius,
                      marginBottom: '20px',
                      marginRight: '0px',
                    }}
                  >
                    <Box
                      style={{
                        ...boxStyle,
                        backgroundColor: getCardBackgroundColor(quiz._id),
                        boxShadow:'0px 4px 6px rgba(0, 0, 0, 0.6)'
                      }}
                    >
                      {getCardBackgroundColor(quiz._id) !== '#9d0f0f' &&
                      getCardBackgroundColor(quiz._id) !== '#FFFFFF' && (
                        <p style={{ fontSize: '15px'}}>
                        {quiz.quiz.title}
                        </p>
                      )}
                    </Box>
                    <Divider
                      style={{
                        width: '70%',
                        marginTop: '15px',
                        borderBottom: '1.5px solid black',
                        marginLeft: '40px',
                      }}
                    />
                    <CardContent>
                      <Typography variant="h6" style={{ marginTop: '0px' }}>
                        {quiz.quiz.title}
                      </Typography>
                      <Typography variant="body2">{quiz.quiz.questions.length} questions</Typography>
                      <CardActions>
                      <Button

                      variant="contained"
                    
                      color="primary"
                    
                      size="medium"
                    
                      style={buttonStyle}
                    
                      onClick={() => {
                    
                        navigate(`/quiz/${quiz.quiz._id}`);
                    
                        document.documentElement.requestFullscreen();
                    
                      }}
                    
                      disabled={quiz.completed}
                    
                    >
                    
                      {quiz.completed ? 'Quiz Completed' : 'Start Quiz'} <KeyboardDoubleArrowRightIcon/>
                    
                    </Button>
                      </CardActions>
                    </CardContent>
                  </Card>
                ))}
              </ul>
            </Box>
          )}
        </Container>
      </Container>
    </Navbar>
  );
}

export default ChallengesPage;
