import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import BookIcon from '@mui/icons-material/MenuBook';

const Header = ({ onAdd }) => (
  <AppBar position="static" color="default" >
    <Toolbar>
      <BookIcon sx={{ mr: 1, color: 'black' }} />
      <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
        BookManager
      </Typography>
      <Button variant="contained" sx={{background:'black'}} onClick={onAdd}>
        + Add Book
      </Button>
    </Toolbar>
  </AppBar>
);

export default Header; 