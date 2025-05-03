import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { provideApolloClient } from '@vue/apollo-composable';
import {setContext} from "@apollo/client/link/context";

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

const httpLink = createHttpLink({
  uri: `${API_URL}/graphql`,
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
