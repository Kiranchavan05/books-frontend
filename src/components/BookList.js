import React from 'react';
import BookItem from './BookItem';

const BookList = ({ books, setCurrentBook, deleteBook }) => {
  return (
    <div className="book-list">
      {books.map(book => (
        <BookItem key={book._id} book={book} setCurrentBook={setCurrentBook} deleteBook={deleteBook} />
      ))}
    </div>
  );
};

export default BookList; 