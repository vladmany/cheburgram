export default `#graphql
    type User {
        id: ID!
        first_name: String
        last_name: String
        image_url: String
        chat: Chat
    }

    type Query {
        users: [User!]!
    }
`;