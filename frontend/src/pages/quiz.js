import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Link, useParams } from 'react-router-dom';

import '../css/quiz.css'

import Button from 'react-bootstrap/Button';

import Modal from 'react-bootstrap/Modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faArrowRight, faStop,faClock } from '@fortawesome/free-solid-svg-icons'; // Choose appropriate icons

 

 // Import Bootstrap CSS

import { ProgressBar } from 'react-bootstrap'; // Import Bootstrap components

 

 

 

 

function QuizPage() {

  const [quiz, setQuiz] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedOption, setSelectedOption] = useState([]);

  const [quizCompleted, setQuizCompleted] = useState(false);

  const [userScore, setUserScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(600);

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  const { quizId } = useParams();

 

  useEffect(() => {

    fetchQuiz();

  }, []);

 

  useEffect(() => {

 

    if (timeLeft === 0 && !quizCompleted) {

 

      submitQuiz();

 

      setShowTimeoutModal(true); // Show the timeout modal

 

    }

 

  }, [timeLeft, quizCompleted]);

 

 

 

  const handleCloseTimeoutModal = () => {

 

    setShowTimeoutModal(false); // Close the timeout modal

 

  };

 

  useEffect(() => {

 

    if (timeLeft > 0 && !quizCompleted) {

 

      const timerInterval = setInterval(() => {

 

        setTimeLeft(prevTime => prevTime - 1);

 

      }, 1000);

 

 

 

      return () => clearInterval(timerInterval);

 

    } else if (timeLeft === 0 && !quizCompleted) {

 

      submitQuiz();

 

    }

 

  }, [timeLeft, quizCompleted]);

 

  const fetchQuiz = async () => {

    try {

      const token = localStorage.getItem('token');

      const response = await axios.get(`http://localhost:3002/quiz/${quizId}`, {

        headers: {

          Authorization: `Bearer ${token}`,

        },

       

      });

 

      setQuiz(response.data);

      setSelectedOption(new Array(response.data.questions.length).fill(null));

    } catch (error) {

      console.error(error);

    }

  };

 

  const handleOptionSelect = (optionIndex) => {

    const updatedSelectedOptions = [...selectedOption];

    updatedSelectedOptions[currentQuestionIndex] = optionIndex;

    setSelectedOption(updatedSelectedOptions);

  };

 

  const handleNextQuestion = () => {

    if (currentQuestionIndex < quiz.questions.length - 1) {

      setCurrentQuestionIndex(currentQuestionIndex + 1);

      setSelectedOption((prevSelectedOptions) => {

        const updatedSelectedOptions = [...prevSelectedOptions];

        updatedSelectedOptions[currentQuestionIndex] = selectedOption[currentQuestionIndex];

        return updatedSelectedOptions;

      });

    } else {

      submitQuiz();

    }

  };

 

  const submitQuiz = async () => {

    try {

      const token = localStorage.getItem('token');

 

      const answers = quiz.questions.map((question, index) => ({

        questionIndex: index,

        selectedOption: selectedOption[index],

        isCorrect: index === question.correctOption,

      }));

  let score = 0;

      if (timeLeft > 0) {

 

        answers.forEach((userAnswer) => {

 

          if (userAnswer.isCorrect) {

 

            score++;

 

          }

 

        });

 

      } else {

 

        score = 0; // Set the score to 0 if time is reduced to 0

 

      }

 

      const response = await axios.post(

        'http://localhost:3002/submit-quiz',

        { quizId, answers },

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

 

      setUserScore(response.data.score);

      setQuizCompleted(true);

 

      // Send an email to the user with their quiz score

      const emailResponse = await axios.post(

        'http://localhost:3002/send-quiz-score-email', // Create a new backend route for sending email

        { score: response.data.score }, // Send the user's score to the backend

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

     

      console.log(emailResponse.data.message); // You can show this message to the user

 

    } catch (error) {

      console.error(error);

    }

  };

 

  const exitFullscreen = () => {

    if (document.fullscreenElement) {

      document.exitFullscreen();

    }

  };

  return (

    <div className='sai'>

    <div className="container mt-4 sai">

      <div className="timer">

        <FontAwesomeIcon icon={faClock} className="mr-2" />

        {timeLeft > 0 ? (

          <span>

            Time left: {Math.floor(timeLeft / 60)}:

            {timeLeft % 60 < 10 ? "0" : ""}

            {timeLeft % 60}

          </span>

        ) : (

          <span>Time left: 0:00</span>

        )}

      </div>

 

      <div className="actions">

        {!quizCompleted ? (

           <button

           className="btn btn-danger mr-3 end-btn"

           onClick={() => {

             submitQuiz();

             exitFullscreen(); // Exit fullscreen on "End Test"

           }}

         >

           End Test

         </button>

        ) : (

          <Link to="/leaderboard">

            <button className="btn btn-danger mr-3 end-btn"  onClick={() => {

           

             exitFullscreen(); // Exit fullscreen on "End Test"

           }}>End Test</button>

          </Link>

        )}

      </div>

 

      {quiz ? (

        <div className="quiz-content">

          <div className="question-section">

            <h2 className="mb-3">{quiz.title}</h2>

            <ProgressBar

              now={(currentQuestionIndex + 1) / quiz.questions.length * 100}

              label={`${currentQuestionIndex + 1} / ${quiz.questions.length}`}

              className="mb-3 progress-bar-animated"

            />

            <p className="quiz-question">

              {quiz.questions[currentQuestionIndex].question}

            </p>

            <ul className="list-group quiz-options">

              {quiz.questions[currentQuestionIndex].options.map((option, index) => (

                <li

                  key={index}

                  className={`list-group-item ${

                    selectedOption[currentQuestionIndex] === index

                      ? selectedOption[currentQuestionIndex] === quiz.questions[currentQuestionIndex].correctOption

                        ? 'correct'

                        : 'incorrect'

                      : ''

                  }`}

                >

                  <div className="form-check">

                    <input

                      className="form-check-input"

                      type="radio"

                      id={`option${index}`}

                      checked={selectedOption[currentQuestionIndex] === index}

                      onChange={() => handleOptionSelect(index)}

                    />

                    <label className="form-check-label" htmlFor={`option${index}`}>

                      {option}

                    </label>

                  </div>

                </li>

              ))}

            </ul>

          </div>

 

          {!quizCompleted ? (

            <Button

              variant="danger"

              onClick={

                currentQuestionIndex < quiz.questions.length - 1

                  ? handleNextQuestion

                  : submitQuiz

              }

              className="end-btn next-nextbut"

              disabled={selectedOption[currentQuestionIndex] === null}

            >

              <FontAwesomeIcon icon={faArrowRight} className="mr-2" />

              {currentQuestionIndex < quiz.questions.length - 1

                ? 'Next Question'

                : 'Submit'}

            </Button>

          ) : (

            <div className="quiz-completed">

              <p>Quiz completed! Your score: {userScore}</p>

            </div>

          )}

        </div>

      ) : (

        <p>Quiz not uploaded...</p>

      )}

 

      <Modal show={showTimeoutModal} onHide={handleCloseTimeoutModal} animation={true}>

        <Modal.Header closeButton>

          <Modal.Title>Time's Up!</Modal.Title>

        </Modal.Header>

        <Modal.Body>Your quiz submission has been automatically submitted due to timeout.</Modal.Body>

        <Modal.Footer>

          <Button variant="secondary" onClick={handleCloseTimeoutModal}>

            Close

          </Button>

        </Modal.Footer>

      </Modal>

    </div>

  </div>

  );

}

 

export default QuizPage;

 