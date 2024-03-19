import React from 'react';
import { InputAdornment, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Import the logout icon
import { styled } from '@mui/material/styles';
import { Link, NavLink } from 'react-router-dom';
import '../css/searchbar.css';
import { Height } from '@mui/icons-material';

const StyledTextField = styled(TextField)({
  marginBottom: '16px',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
  zIndex: '11',
  backgroundColor: 'white',
  height:'50px',
  '& input': {
    height: '30px',
    alignitems:'center', // Adjust the height value as needed
  },
  
  
});

const SearchBar = ({ placeholder, onChange }) => {
  return (
    <StyledTextField
      placeholder={placeholder}
      variant="outlined"
      size="large"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: ( // Add this part for the logout icon
          <InputAdornment position="end">
            <IconButton>
            <NavLink className='logout-link' to={'/'}><i  class="fa-solid fa-power-off"></i></NavLink>
            </IconButton>
          </InputAdornment>
        )
      }}
      onChange={onChange}
    />
  );
};

export default SearchBar;
