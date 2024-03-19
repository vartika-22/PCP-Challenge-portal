import React, { useState,  useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ExamPage2 = () => {
  const [dataanswers, setdataAnswers] = useState({});
  const navigate = useNavigate();
  const totalMarks = 3;
  const [scoreMessage, setScoreMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [endTestEnabled, setEndTestEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
const [submittedAnswers, setSubmittedAnswers] = useState({});

  const questionss = [
    {
      id: 'q1',
      questionData: '1. What is the capital of France? (1 Mark)',
      options: ['Paris', 'Berlin', 'Madrid', 'Rome'],
      correctAnswer: 'Paris',
    },
    {
      id: 'q2',
      questionData: '2. What is the largest planet in our solar system? (1 Mark)',
      options: ['Jupiter', 'Mars', 'Saturn', 'Venus'],
      correctAnswer: 'Mars',
    },
    {
      id: 'q3',
      questionData: '3. What is the largest ocean on Earth? (1 Mark)',
      options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'],
      correctAnswer: 'Indian',
    },
  ];

  const handleAnswerChange = (questionId, selectedOption) => {
    setdataAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    const submittedAnswersCopy = { ...dataanswers };
    setSubmittedAnswers(submittedAnswersCopy);

    const score = questionss.reduce((totalScore, questionData) => {
      return (
        totalScore +
        (submittedAnswersCopy[questionData.id] === questionData.correctAnswer ? 1 : 0)
      );
    }, 0);

    const message = `Successfully completed training! You scored ${score} out of ${totalMarks} marks.`;
    setScoreMessage(message);
    setFormSubmitted(true);
    setEndTestEnabled(true);
    localStorage.setItem('scoredMarksdata', score.toString());
    localStorage.setItem('isCompleted', 'completed');
  };

  useEffect(() => {
    if (timeLeft > 0 && !formSubmitted) {
      const timerInterval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
  
      return () => clearInterval(timerInterval);
    } else if (timeLeft === 0 && !formSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, formSubmitted]);
  


  const isSubmitEnabled = Object.keys(dataanswers).length === totalMarks;

  return (
    <div className="Cyberbox">
      <div className="timer">
        Total Time: 10:00<br></br>
        Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}
        {timeLeft % 60}
      </div>

      <button
        className={`btn btn-danger ${endTestEnabled ? '' : ' disabled'}`}
        onClick={() => navigate('/')}
        disabled={!endTestEnabled} >
        End Test
      </button>
      <h1 style={{ textAlign: 'center' }}>Data Security</h1>
      <form onSubmit={handleSubmit}>
      {questionss.map(questionData => (
  <div key={questionData.id} className="questionData">
    <p>{questionData.questionData}</p>
    <div className="options-container">
              {questionData.options.map(option => (
                <label key={option} className="option-label">
                  <input
                    type="radio"
                    name={questionData.id}
                    value={option}
                    onChange={() => handleAnswerChange(questionData.id, option)}
                  />
                  {option}
                  {submittedAnswers[questionData.id] && submittedAnswers[questionData.id] === option && (
                    <span className={submittedAnswers[questionData.id] === questionData.correctAnswer ? 'correct-answer' : 'wrong-answer'}>
                      {submittedAnswers[questionData.id] === questionData.correctAnswer ? ' ✓' : ' ✗'}
                    </span>
                  )}
        </label>
      ))}
    </div>
  </div>
))}
<button
          className="btn btn-success"
          type="submit"
          disabled={!isSubmitEnabled || formSubmitted || timeLeft === 0}
        >
          Submit
        </button>
        {scoreMessage && <div className="score-message">{scoreMessage}</div>}
      </form>
    </div>
  );
}

export default ExamPage2;
