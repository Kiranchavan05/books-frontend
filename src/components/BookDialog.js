import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => (currentYear - i).toString());

const BookDialog = ({ open, handleClose, handleSave, initialBook }) => {
  const [book, setBook] = useState({ title: '', author: '', publication_year: '' });

  useEffect(() => {
    if (initialBook) {
      setBook(initialBook);
    } else {
      setBook({ title: '', author: '', publication_year: '' });
    }
  }, [initialBook, open]);

  const onChange = e => setBook({ ...book, [e.target.name]: e.target.value });

  const onYearChange = (event, value) => {
    setBook({ ...book, publication_year: value || '' });
  };

  const onSubmit = e => {
    e.preventDefault();
    handleSave(book);
  };

  const isValid =
    book.title.trim() !== '' &&
    book.author.trim() !== '' &&
    years.includes(book.publication_year);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{paddingBottom:'2px !important'}} >{initialBook ? 'Edit Book' : 'Add Book'}</DialogTitle>
      <form  onSubmit={onSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={book.title}
            onChange={onChange}
            required
            fullWidth
          />
          <TextField
            label="Author"
            name="author"
            value={book.author}
            onChange={onChange}
            required
            fullWidth
          />
          <Autocomplete
            options={years}
            value={book.publication_year}
            onChange={onYearChange}
            renderInput={(params) => (
              <TextField {...params} label="Publication Year" fullWidth required />
            )}
            isOptionEqualToValue={(option, value) => option === value}
            disableClearable={false}
            freeSolo={false}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" sx={{border:'1px solid grey'}}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{backgroundColor:'black'}} disabled={!isValid}>
            {initialBook ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BookDialog; 