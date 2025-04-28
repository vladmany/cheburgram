import apolloClient from "src/apollo/apolloClient.js";

export async function makeQuery(query, variables = {}) {
  try {
    const { data } = await apolloClient.query({
      query,
      variables,
    });
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('GraphQL Query Error:', error);
    throw error;
  }
}

export async function makeMutation(mutation, variables = {}) {
  try {
    const { data } = await apolloClient.mutate({
      mutation,
      variables,
    });
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('GraphQL Mutation Error:', error);
    throw error;
  }
}

