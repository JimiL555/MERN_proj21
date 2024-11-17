const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # User type definition
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  # Book type definition
  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  # Auth type definition for handling user authentication
  type Auth {
    token: ID
    user: User
  }

  # Input type for book data (used in mutations)
  input BookInput {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  # Query definitions
  type Query {
    me: User
  }

  # Mutation definitions
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;