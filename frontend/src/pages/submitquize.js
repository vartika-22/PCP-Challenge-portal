import React, { useState } from 'react';
import axios from 'axios';

function QuizSubmission() {
  const [selectedOptions, setSelectedOptions] = useState(new Array(quiz.questions.length).fill(null));
  const [userScore, setUserScore] = useState(0);

  const handleOptionSelect = (questionIndex, optionIndex) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[questionIndex] = optionIndex;
    setSelectedOptions(updatedSelectedOptions);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');

      const answers = selectedOptions.map((selectedOption, questionIndex) => ({
        questionIndex,
        selectedOption,
        isCorrect: selectedOption === quiz.questions[questionIndex].correctOption,
      }));

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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Render questions and options here, similar to your QuizPage */}
      {/* Provide option selection handlers and display user-selected options */}
      {/* Render a Submit button to trigger handleSubmit */}
      {userScore > 0 && <p>Your score: {userScore}</p>}
    </div>
  );
}

export default QuizSubmission;
