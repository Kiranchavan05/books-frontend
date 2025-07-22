import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Pagination from '@mui/material/Pagination';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Header from './components/Header';
import BookDialog from './components/BookDialog';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// const API_URL = 'http://localhost:5000/api/books';
const API_URL='https://books-backend-9bms.onrender.com/api/books'

const sortOptions = [
  // { value: 'date', label: 'Date Added' },
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'publication_year', label: 'Year' },
];

function App() {
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0); // MUI TablePagination is 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('title'); // Default to 'date'
  const [order, setOrder] = useState('asc'); // Default to 'desc'
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [page, rowsPerPage, sortBy, order, search]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(API_URL, {
        params: { page: page + 1, limit: rowsPerPage, sortBy, order, search },
      });
      setBooks(res.data.books);
      setTotal(res.data.total);
    } catch (err) {
      setSnackbar({ open: true, message: 'Error fetching books', severity: 'error' });
    }
  };

  const handleAdd = () => {
    setEditBook(null);
    setDialogOpen(true);
  };

  const handleEdit = (book) => {
    setEditBook(book);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditBook(null);
  };

  const handleSave = async (book) => {
    try {
      if (editBook) {
        // Update
        const res = await axios.put(`${API_URL}/${editBook._id}`, book);
        setSnackbar({ open: true, message: 'Book updated!', severity: 'success' });
      } else {
        // Add
        const res = await axios.post(API_URL, book);
        setSnackbar({ open: true, message: 'Book added!', severity: 'success' });
      }
      setDialogOpen(false);
      fetchBooks();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error saving book', severity: 'error' });
    }
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return;
    try {
      await axios.delete(`${API_URL}/${bookToDelete._id}`);
      setSnackbar({ open: true, message: 'Book deleted!', severity: 'success' });
      setDeleteDialogOpen(false);
      setBookToDelete(null);
      if (books.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchBooks();
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error deleting book', severity: 'error' });
      setDeleteDialogOpen(false);
      setBookToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '97.5vh', py: 1 }}>
      <Header onAdd={handleAdd} />
      <Container maxWidth="md" sx={{ mt: 2 }}>
        {/* Search and Sort Controls */}
        <Card sx={{  mb: 2, borderRadius:'8px'  }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary">Search Books</Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Search by title or author..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(0); }}
                />
              </Box>
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="caption" color="text.secondary">Sort By</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                  >
                    {sortOptions.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="caption" color="text.secondary">Order</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={order}
                    onChange={e => setOrder(e.target.value)}
                  >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Book List Table */}
        <Card sx={{borderRadius:'8px'}}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h6" sx={{ mb: 1, p: 1 }}>Books Collection</Typography>
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table stickyHeader>
                <TableBody>
                  {books.length === 0 ? (
                    <TableRow>
                      <TableCell> 
                        <Typography>No books found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    books.map(book => (
                      <TableRow key={book._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{book.title}</Typography>
                          <Typography variant="body2" color="text.secondary">by {book.author}</Typography>
                          {book.publication_year && (
                            <Typography variant="caption" color="text.secondary">
                              {book.publication_year}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Button startIcon={<EditIcon />} onClick={() => handleEdit(book)} size="small" sx={{ mr: 1 }}>Edit</Button>
                          <Button startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(book)} color="error" size="small">Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      {/* Add/Edit Dialog */}
      <BookDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        handleSave={handleSave}
        initialBook={editBook}
      />
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this book?</Typography>
          {bookToDelete && (
            <Typography sx={{ fontWeight: 'bold', mt: 1 }}>{bookToDelete.title}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="secondary" sx={{border:'1px solid grey'}}>No</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" sx={{backgroundColor:'black'}}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
