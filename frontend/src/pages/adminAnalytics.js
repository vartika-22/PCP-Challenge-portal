import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Card, Dropdown } from 'react-bootstrap';
import AdminNavbar from './adminNavbar';
import '../css/AdminAnalytics.css';
import Header from './header';
const AdminAnalytics = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3002/users-analytics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user analytics:', error);
    }
  };

  const renderQuizDetails = (quiz) => {
    return (
      <Card key={quiz._id} className="quiz-card">
        <Card.Body>
          <Card.Title>{quiz.quiz.title}</Card.Title>
          <Card.Text>
            Score: {quiz.completed ? quiz.score : 'not attended'}
          </Card.Text>
          {/* Display more details about the quiz if needed */}
        </Card.Body>
      </Card>
    );
  };

  const TableRow = ({ user }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <React.Fragment key={user._id}>
        <tr>
          <td>{user.email}</td>
          <td>{user.assignedQuizzes.length}</td>
          <td>{user.totalScore}</td>
          <td>
            <button
              className="dropdown-button"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Hide Quiz Details' : 'View Quiz Details'}
            </button>
          </td>
        </tr>
        {expanded && (
          <tr>
            <td colSpan="4">
              <div className="quiz-details">
                {user.assignedQuizzes.map((quiz) => (
                  <div key={quiz._id}>
                    {renderQuizDetails(quiz)}
                  </div>
                ))}
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  return (
    <Container className="admin-analytics">
      <AdminNavbar />
      <Header
      pageTitle="Analytics"
      dashboardTitle="Dashboard"
      analyticsTitle="Leaderboard"
      sx={{marginBottom:'50px', position:'relative',bottom:'30px'}}
    />
      <Table  responsive striped bordered hover>
        <thead>
          <tr>
            <th>User Email</th>
            <th>No. of Quizzes Assigned</th>
            <th>Overall Total Score</th>
            <th>View Quiz Details</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <TableRow key={user._id} user={user} />
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminAnalytics;