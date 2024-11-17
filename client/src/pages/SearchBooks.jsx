import { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { useMutation } from '@apollo/client'; // Apollo Mutation Hook
import { SAVE_BOOK } from '../utils/mutations'; // GraphQL mutation for saving books
import { saveBookIds, getSavedBookIds } from '../utils/localStorage'; // Local Storage utilities
import { searchGoogleBooks } from '../utils/API'; // Utility to fetch books from Google Books API

const SearchBooks = () => {
  // State for holding returned Google API data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // State for holding the search input
  const [searchInput, setSearchInput] = useState('');
  // State for holding saved book IDs
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // Apollo Mutation Hook for saving a book
  const [saveBook] = useMutation(SAVE_BOOK);

  // Effect to save `savedBookIds` to localStorage on unmount
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // Method to search for books and update state
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // Function to save a book to the database
  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    if (!Auth.loggedIn()) {
      return false;
    }

    try {
      await saveBook({
        variables: { bookData: bookToSave }, // Pass book data to the mutation
      });

      // Add book ID to savedBookIds in state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
      console.log('Book saved successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => (
            <Col md="4" key={book.bookId}>
              <Card border="dark">
                {book.image && (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                )}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some(
                        (savedBookId) => savedBookId === book.bookId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveBook(book.bookId)}
                    >
                      {savedBookIds?.some(
                        (savedBookId) => savedBookId === book.bookId
                      )
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;