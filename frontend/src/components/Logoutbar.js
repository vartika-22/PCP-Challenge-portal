import React from 'react';
import { AppBar, Toolbar, IconButton, Box, Avatar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#ab1212',
  marginBottom: '10px',
});

const NavbarBox = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '0 16px',
  marginLeft: 'auto', // This will push the content to the right
});

const LogoImage = styled("img")({
  width: "auto",
  height: "40px",
  marginRight: "8px",
});

const LogoutButton = styled(IconButton)({
  color: 'white',
  '&:hover': {
    backgroundColor: 'white',
    color: '#ab1212',
  },
});

const ProfileButton = styled(IconButton)({
  color: 'white',
  '&:hover': {
    backgroundColor: 'white',
    color: '#ab1212',
  },
  marginRight: '10px',
});

const RectangularAvatar = styled(Avatar)({
  width: '60px',
  height: '60px',
  marginRight: '8px',
});

const PortalName = styled(Typography)({
  color: 'white',
  fontWeight: 'bold',
  marginRight: '16px',
});

const LogoLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'white',
});

function LogoutBar() {
  const userEmail = localStorage.getItem('userEmailID'); // Get user's email from localStorage
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <LogoLink to='/dash'>
          <LogoImage src="https://www.justaftermidnight247.com/wp-content/uploads/2020/02/Perficient-300-x-180.png" alt="MDB Logo" />
          <Typography variant="h6" component="div" width={'250px'}>
            Perficient Challenge Portal
          </Typography>
        </LogoLink>
        <NavbarBox>
        {userEmail && (

          <Typography variant="subtitle1" component="div" color="white">

            {userEmail}

          </Typography>

        )}
          <Link to='/profile' style={{ textDecoration: 'none' }}>
            <ProfileButton>
              <PersonIcon />
            </ProfileButton>
          </Link>
          <Link to='/' style={{ textDecoration: 'none' }}>
            <LogoutButton>
              <PowerSettingsNewIcon />
            </LogoutButton>
          </Link>
        </NavbarBox>
      </Toolbar>
    </StyledAppBar>
  );
}

export default LogoutBar;
