import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Chart } from 'react-google-charts';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/side-navbar';
import "../css/analytics.css";
import SearchBar from "../components/searchbar.js";
import Header from "./header.js";
import { Logout } from '@mui/icons-material';
import LogoutBar from '../components/Logoutbar';
import { Button } from 'react-bootstrap';

 
const calculateAnswerPercentage = (quiz) => {

  const totalQuestions = quiz.quiz.questions.length;

  const correctAnswers = quiz.questionResults.filter((result) => result.isCorrect).length;

  const wrongAnswers = totalQuestions - correctAnswers;

  const correctPercentage = (correctAnswers / totalQuestions) * 100;

  const wrongPercentage = (wrongAnswers / totalQuestions) * 100;

  return [

    ['Answers', 'Percentage'],

    ['Correct', correctPercentage],

    ['Wrong', wrongPercentage],

  ];

};

 

const UserAnalytics = () => {

  const [assignedQuizzes, setAssignedQuizzes] = useState([]);

  const [expandedQuizzes, setExpandedQuizzes] = useState([]);

 

  useEffect(() => {

    fetchAssignedQuizzes();

  }, []);

 

  const fetchAssignedQuizzes = async () => {

    try {

      const response = await axios.get('http://localhost:3002/user/challenges', {

        headers: {

          Authorization: `Bearer ${localStorage.getItem('token')}`,

        },

      });

      setAssignedQuizzes(response.data.assignedQuizzes);

    } catch (error) {

      console.error('Error fetching assigned quizzes:', error);

    }

  };

 

  const toggleExpand = (quizId) => {

    if (expandedQuizzes.includes(quizId)) {

      setExpandedQuizzes(expandedQuizzes.filter(id => id !== quizId));

    } else {

      setExpandedQuizzes([...expandedQuizzes, quizId]);

    }

  };

 

  return (
    <div>
      <Navbar>
        <LogoutBar></LogoutBar>
        <Header
          pageTitle="User Analytics"
          dashboardTitle="Dashboard"
          analyticsTitle="User Analytics"
        />
        <div className="user-analytics container" style={{ width: '80%' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Score</th>
                <th>Submitted Answers</th>
                <th>Correct Options</th>
                <th>Answer Distribution</th>
              </tr>
            </thead>
            <tbody>
              {assignedQuizzes.map((quiz) => (
                <React.Fragment key={quiz.quiz._id}>
                  <tr>
                    <td>                      
                        {quiz.quiz.title}                      
                    </td>
                    <td>{quiz.score}</td>
                    <td>
                      {quiz.completed ? (
                        <Button variant="link" 
                        onClick={() => toggleExpand(quiz.quiz._id)}
                        style={{ color: 'maroon' }} >
                          See Answers
                        </Button>
                      ) : (
                        'Quiz not attended'
                      )}
                    </td>
                    <td>
                      {quiz.completed ? (
                        <Button variant="link"
                        onClick={() => toggleExpand(quiz.quiz._id)}
                        style={{ color: 'maroon' }} className="cursor-pointer">
                          See Correct Options
                        </Button>
                      ) : (
                        'Quiz not attended'
                      )}
                    </td>
                    <td>
                      {quiz.completed && (
                        <Chart
                          width={'100%'}
                          height={'100px'}
                          chartType="PieChart"
                          loader={<div>Loading Chart...</div>}
                          data={calculateAnswerPercentage(quiz)}
                          options={{
                            title: 'Answer Distribution',
                            is3D: true,
                          }}
                          rootProps={{ 'data-testid': '2' }}
                        />
                        
                      )}
                    </td>
                  </tr>
                  {expandedQuizzes.includes(quiz.quiz._id) && (
                    <tr>
                      <td colSpan="5">

                      {quiz.completed ? (

                        <div>

                          <ul className="list-unstyled">

                            {/* Display submitted answers */}

                            {quiz.questionResults.map((result, index) => (

                              <li key={index} className="hover cursor-pointer">

                                Question {result.questionIndex + 1}: Selected Option{' '}

                                {result.selectedOption}{' '}

                                {result.isCorrect ? (

                                  <FaCheck className="text-success" />

                                ) : (

                                  <FaTimes className="text-danger" />

                                )}

                              </li>

                            ))}

                          </ul>

                          {/* Display correct options */}

                          <ul className="list-unstyled">

                            {quiz.quiz.questions.map((question, index) => (

                              <li key={index}>

                                Question {index + 1}: {question.question}

                                <ul>

                                  {question.options.map((option, optionIndex) => (

                                    <li key={optionIndex}>

                                      {optionIndex === question.correctOption ? (

                                        <strong>{option}</strong>

                                      ) : (

                                        option

                                      )}

                                    </li>

                                  ))}

                                </ul>

                              </li>

                            ))}

                          </ul>

                        </div>

                      ) : (

                        <p>Quiz not attended</p>

                      )}

                    </td>

                  </tr>

                )}

              </React.Fragment>

            ))}

          </tbody>

        </table>      

      </div>

      <div className="chart-section" style={{width:'80%',marginLeft:'110px',marginBottom:'40px'}}>

        <Chart

          border={'1px solid black'}

          width={'100%'}

          height={'400px'}

          chartType="ColumnChart"

          loader={<div>Loading Chart...</div>}

          data={[

            ['Quiz Title', 'Score'],

            ...assignedQuizzes.map((quiz) => [quiz.quiz.title, quiz.score]),

          ]}

          options={{

            title: 'Quiz Scores',

            hAxis: {

              title: 'Quiz',

            },

            vAxis: {

              title: 'Score',

              minValue: 0,

            },

            colors: ['#ab1212'],

          }}

          rootProps={{ 'data-testid': '1' }}

        />

      </div>

      </Navbar>

    </div>  

     

   

  );

};

 

export default UserAnalytics;