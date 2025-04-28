import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { provideApolloClient } from '@vue/apollo-composable';
import {setContext} from "@apollo/client/link/context";

const host = import.meta.env.VITE_API_HOST || 'localhost';
const port  = import.meta.env.VITE_API_PORT || '3000';

const httpLink = createHttpLink({
  uri: `http://${host}:${port}/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await window.Clerk.session.getToken();

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    }
  }
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

provideApolloClient(apolloClient);

export default apolloClient;
