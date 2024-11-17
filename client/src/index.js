import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Assuming your main app component is named App.js
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: '/graphql', // Backend GraphQL server endpoint
  cache: new InMemoryCache(), // Caching mechanism for Apollo
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root') // Ensure this matches your index.html div ID
);