import React, { useState, useEffect } from "react";

import { FaGraduationCap, FaMailBulk, FaSearch, FaTrophy } from "react-icons/fa";

import Header from "./header.js";

import CarouselComponent from "../components/carousel.js";

import axios from "axios";

import "../css/LeaderboardStyle.css";

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

import Navbar from "../components/side-navbar.js";

import SearchBar from "../components/searchbar.js";

import LogoutBar from "../components/Logoutbar.js";

 

const Leaderboard = () => {

  const [searchTerm, setSearchTerm] = useState("");

  const [leaderboardData, setLeaderboardData] = useState([]);

  const [originalOrder, setOriginalOrder] = useState([]); // Store original order

  const [sortedLeaderboardData, setSortedLeaderboardData] = useState([]);

 

  useEffect(() => {

    fetchLeaderboardData();

  }, []);

 

  useEffect(() => {

    const filteredAndSortedData = leaderboardData

      .filter((user) => user.totalScore > 0)

      .filter((user) =>

        user.email.toLowerCase().includes(searchTerm.toLowerCase())

      )

      .sort((a, b) => b.totalScore - a.totalScore);

 

    setSortedLeaderboardData(filteredAndSortedData);

  }, [leaderboardData, searchTerm]);

 

  const fetchLeaderboardData = async () => {

    try {

      const response = await axios.get("http://localhost:3002/leaderboard");

      const sortedData = response.data.sort((a, b) => b.totalScore - a.totalScore);

      setLeaderboardData(sortedData);

      setOriginalOrder(sortedData); // Store the original order

    } catch (error) {

      console.error(error);

    }

  };

 

  // Calculate rank based on the original order

  const calculateRank = (email) => {

    const originalIndex = originalOrder.findIndex(user => user.email === email);

    return originalIndex !== -1 ? originalIndex + 1 : "-";

  };

 

  return (

    <div>

      <Navbar>

        <LogoutBar></LogoutBar>

        <Header

          pageTitle="Leaderboard"

          dashboardTitle="Dashboard"

          analyticsTitle="Leaderboard"

        />

        <div className="leaderboard">

          <div className="card search-card">

            <div className="search-input">

              <div className="search-icon">

                <FaSearch className="icon" />

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

                        <FaGraduationCap className="score-icon" />

                        User Score

                      </div>

                    </th>

                    <th>

                      <div className="centered-content">

                        <FaMailBulk className="mail-icon" />

                        User Email

                      </div>

                    </th>

                  </tr>

                </thead>

                <tbody>

                  {sortedLeaderboardData.map((user) => (

                    <tr key={user.email}>

                      <td>{calculateRank(user.email)}</td>

                      <td>{user.totalScore}</td>

                      <td>{user.email}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </Navbar>

    </div>

  );

};

 

export default Leaderboard;