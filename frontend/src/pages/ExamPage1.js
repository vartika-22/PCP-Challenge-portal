import React, { useState,  useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselComponent from '../components/carousel';


const ExamPage1 = () => {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const totalMarks = 3;
  const [scoreMessage, setScoreMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [endTestEnabled, setEndTestEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
const [submittedAnswers, setSubmittedAnswers] = useState({});

  const questions = [
    {
      id: 'q1',
      question: '1. What is the capital of india? (1 Mark)',
      options: ['Paris', 'Berlin', 'Madrid', 'Rome'],
      correctAnswer: 'Berlin',
    },
    {
      id: 'q2',
      question: '2. What is the smallest planet in our solar system? (1 Mark)',
      options: ['Jupiter', 'Mars', 'Saturn', 'Venus'],
      correctAnswer: 'Saturn',
    },
    {
      id: 'q3',
      question: '3. What is the smallest ocean on Earth? (1 Mark)',
      options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'],
      correctAnswer: 'Arctic',
    },
  ];

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: selectedOption,
    }));
};

  const handleSubmit = event => {
    event.preventDefault();
    const submittedAnswersCopy = { ...answers };
    setSubmittedAnswers(submittedAnswersCopy);

    const score = questions.reduce((totalScore, question) => {
      return (
        totalScore +
        (submittedAnswersCopy[question.id] === question.correctAnswer ? 1 : 0)
      );
    }, 0);

    const message = `Successfully completed training! You scored ${score} out of ${totalMarks} marks.`;
    setScoreMessage(message);
    setFormSubmitted(true);
    setEndTestEnabled(true);
    localStorage.setItem('scoredMarks', score.toString());
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
  
  const isSubmitEnabled = Object.keys(answers).length === totalMarks;

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

      <h1 style={{ textAlign: 'center' }}>Cyber Security</h1>
      <form onSubmit={handleSubmit}>
      {questions.map(question => (
          <div key={question.id} className="question">
            <p className="bold-question">{question.question}</p>
            <div className="options-container">
              {question.options.map(option => (
                <label key={option} className="option-label">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    onChange={() => handleAnswerChange(question.id, option)}
                  />
                  {option}
                  {submittedAnswers[question.id] && submittedAnswers[question.id] === option && (
                    <span className={submittedAnswers[question.id] === question.correctAnswer ? 'correct-answer' : 'wrong-answer'}>
                      {submittedAnswers[question.id] === question.correctAnswer ? ' ✓' : ' ✗'}
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

export default ExamPage1;
