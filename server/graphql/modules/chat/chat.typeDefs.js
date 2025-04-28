export default `#graphql
    type Chat {
        id: ID!
        participants: [ChatParticipant!]!
        messages: [Message!]!
    }

    type Query {
        chats: [Chat!]!
    }

    type Mutation {
        createChat(userId: String!): Chat!
    }
`;