import React, { useState } from 'react';
import axios from 'axios';

 

function AssignQuiz() {
  const [user, setUser] = useState('');
  const [quizId, setQuizId] = useState('');

 

  const handleAssignQuiz = async () => {
    const assignmentData = { user, quizId };
    try {
      const response = await axios.post('http://localhost:3002/admin/assign-quiz', assignmentData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

 

  // Render the form to assign quizzes to users here

 

  return (
<div>
      {/* Render form elements for assigning quizzes */}
      <h2>Assign Quizzes to Users</h2>
<select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        {/* Render user options */}
</select>
      {/* Render quiz options */}
<button onClick={handleAssign}>Assign Quizzes</button>
</div>
  );
}

 

export default AssignQuiz;