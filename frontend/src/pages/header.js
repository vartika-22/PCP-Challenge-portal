import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';

function Header(props) {
  const { pageTitle, dashboardTitle, analyticsTitle } = props;

  return (
    <Box
      sx={{
        backgroundColor: 'rgb(220, 223, 226)',
        padding: '15px',
        marginTop: '20px',
        marginBottom: '40px',
        borderRadius: '5px',
        width: '90%',
        margin: '20px auto 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.4)', // Adding box shadow
      }}
    >
      <Typography variant="h6" gutterBottom style={{ color: '#ab1212', fontWeight: 'bold' }}>
        {pageTitle}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <DashboardIcon sx={{ marginRight: '5px', color: '#ab1212' }} />
        <Typography variant="subtitle1" style={{ color: '#ab1212' }}>
          {dashboardTitle}
        </Typography>
        <Divider orientation="vertical" sx={{ mx: '5px', width: '2px' }} />
        <BarChartIcon sx={{ marginRight: '5px', color: '#ab1212' }} />
        <Typography variant="subtitle1" style={{ color: '#ab1212' }}>
          {analyticsTitle}
        </Typography>
      </Box>
    </Box>
  );
}

export default Header;
