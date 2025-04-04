
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Create an http link for the GraphQL endpoint
const httpLink = createHttpLink({
  uri: 'http://localhost:8080/modules/graphql', // Replace with your actual GraphQL endpoint
});

// Create and export the Apollo Client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
