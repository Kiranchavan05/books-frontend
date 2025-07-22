import React from 'react';

const BookItem = ({ book, setCurrentBook, deleteBook }) => {
  const { _id, title, author, publication_year } = book;

  return (
    <div className="book-item">
      <h3>{title}</h3>
      <p>by {author}</p>
      {publication_year && <p>Published: {publication_year}</p>}
      <button onClick={() => setCurrentBook(book)}>Edit</button>
      <button onClick={() => deleteBook(_id)}>Delete</button>
    </div>
  );
};

export default BookItem; 