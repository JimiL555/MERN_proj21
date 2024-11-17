import React from 'react';
import { createRoot } from 'react-dom/client'; // Use createRoot for React 18
import App from './App'; // Assuming your main app component is named App.js
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: '/graphql', // Backend GraphQL server endpoint
  cache: new InMemoryCache(), // Caching mechanism for Apollo
});

// Get the root element from the DOM
const container = document.getElementById('root'); // Ensure this matches your index.html div ID
const root = createRoot(container); // Create a React root

// Render the App within ApolloProvider
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);