const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth'); // Import authMiddleware

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Initialize Apollo Server
const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => authMiddleware({ req }), // Pass authMiddleware to context
  });

  await server.start(); // Start the Apollo Server
  server.applyMiddleware({ app }); // Apply Apollo Server as middleware

  // Default route for client build
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  // Start the database connection and server listener
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`🚀 GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// Call the function to start Apollo Server
startApolloServer();