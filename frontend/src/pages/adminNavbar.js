import React from "react";
import { AppBar, Toolbar, Button, IconButton, Box, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { styled } from '@mui/material/styles';
import {BiSolidUser} from 'react-icons/bi';
import {IoStatsChart} from 'react-icons/io5';
import {BsFillTrophyFill} from 'react-icons/bs';
import {BiSolidHome} from 'react-icons/bi';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#ab1212',
  marginBottom: '40px', // Add margin at the bottom
});

const StyledButton = styled(Button)({
  color: 'white',
  '&:hover': {
    backgroundColor: 'white',
    color: '#ab1212',
  },
  
});

const StyledIconButton = styled(IconButton)({
  color: 'white',
  '&:hover': {
    backgroundColor: 'white',
    color: '#ab1212',
  },
});

const LogoLink = styled(Link)({
  marginRight: '16px',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'white',
});

const NavItemLink = styled(Link)({
  marginRight: '16px',
  textDecoration: 'none',
});

const NavbarBox = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  width: '100%',
});

const LogoImage = styled("img")({
  width: "auto",
  height: "40px",
  marginRight: "8px",
});



function AdminNavbar() {
  const userEmail = localStorage.getItem('userEmailID'); // Get user's email from localStorage
  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <LogoLink to='/dash'>
          <LogoImage src="https://www.justaftermidnight247.com/wp-content/uploads/2020/02/Perficient-300-x-180.png" alt="MDB Logo" />
          <Typography variant="h6" component="div" width={'250px'} >
            Perficient Challenge Portal
          </Typography>
        </LogoLink>
        

        <NavbarBox>
          <NavItemLink to='/aq'>
            <StyledButton><BiSolidHome size={17}/><span style={{ marginLeft: '5px' }}/>Dashboard</StyledButton>
          </NavItemLink>
          <NavItemLink to='/AdminLeaderboard'>
            <StyledButton><BsFillTrophyFill /><span style={{ marginLeft: '5px' }}/>LeaderBoard</StyledButton>
          </NavItemLink>
          <NavItemLink to='/adminAnalytics'>
            <StyledButton><IoStatsChart  size={15}/><span style={{ marginLeft: '5px' }}/>Analytics</StyledButton>
          </NavItemLink>
          <NavItemLink to='/adminprofile'>
            <StyledButton><BiSolidUser  size={17} /> <span style={{ marginLeft: '5px' }}/>Profile</StyledButton>
          </NavItemLink>
          <NavItemLink to='/'>
            <StyledIconButton>
              <PowerSettingsNewIcon />
            </StyledIconButton>
          </NavItemLink>
        </NavbarBox>
      </Toolbar>
    </StyledAppBar>
  );
}

export default AdminNavbar;
