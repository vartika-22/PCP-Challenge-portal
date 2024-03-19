import React, { useState, useEffect } from "react";
import { FaGraduationCap, FaMailBulk, FaSearch, FaTrophy } from "react-icons/fa";
// import {FcSearch} from 'react-icons';
import { FcSearch } from "react-icons/fc";
import Header from "./header.js";

import axios from "axios";
import "../css/LeaderboardStyle.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await axios.get("http://localhost:3002/leaderboard");
      setLeaderboardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredData = leaderboardData
    .filter((user) => user.totalScore > 0)
    .filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
     
        
        <div className="leaderboard">
          <div className="card search-card">
            <div className="search-input">
              <div className="search-icon">
                <FcSearch size={20}/>
              </div>
              <input
                type="text"
                placeholder="Search by user email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="card leaderboard-card">
            <div className="table-responsive">
              <table className="table table-striped">
              <thead>
                  <tr>
                    <th>
                    <div className="centered-content">
                  <FaTrophy className="rank-icon" />
                  User Rank
                  </div>
                  </th>
                    <th>
                    <div className="centered-content"> 
                  <FaGraduationCap className="score-icon"/>
                  User Score
                  </div>
                  </th>
                    <th>
                    <div className="centered-content">                
                  <FaMailBulk className="mail-icon"/>
                  User Email
                  </div>
                  </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{user.totalScore}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
     
    </div>
  );
};

export default Leaderboard;
