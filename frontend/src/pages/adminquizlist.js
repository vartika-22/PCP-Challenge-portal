import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

 

const AdminQuizList = () => {

  const [assignedQuizzes, setAssignedQuizzes] = useState([]);

 

  useEffect(() => {

    fetchAssignedQuizzes();

  }, []);

 

  const fetchAssignedQuizzes = async () => {

    try {

      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:3002/user/challenges', {

        headers: {

          Authorization: `Bearer ${token}`,

        },

      });

      setAssignedQuizzes(response.data.assignedQuizzes);

    } catch (error) {

      console.error('Error fetching assigned quizzes:', error);

    }

  };

 

 

 

  const handleDeleteQuiz = async (quizId) => {

    const confirmDelete = window.confirm(

      'Are you sure you want to delete this quiz? This action will notify all users by email.'

    );

 

    if (confirmDelete) {

      try {

        const token = localStorage.getItem('token');

        await axios.delete(`http://localhost:3002/admin/quiz/${quizId}`, {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        });

        fetchAssignedQuizzes(); // Refresh the list after deletion

        toast.success("Quiz deleted Successfully!!")

      } catch (error) {

        console.error('Error deleting quiz:', error);

      }

    }

  };

 

  return (

    <div>

      <ToastContainer/>

      <h2>Assigned Quizzes</h2>

      <table className="table table-bordered">

        <thead>

          <tr>

            <th>Quiz Title</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {assignedQuizzes.map((quiz) => (

            <tr key={quiz._id}>

              <td>{quiz.quiz.title}</td>

              <td>

                <button

                  className="btn btn-danger btn-sm"

                  onClick={() => handleDeleteQuiz(quiz.quiz._id)}

                >

                  Delete

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

};

 

export default AdminQuizList;