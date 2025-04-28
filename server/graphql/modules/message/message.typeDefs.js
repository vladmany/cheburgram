export default `#graphql
    type Message {
        id: ID!
        text: String!
        chat_id: ID!
        participant_id: ID!
        sent_at: String
        read_at: String
    }

    type Query {
        messages: [Message!]!
    }

    type Mutation {
        createMessage(chatId: ID!, text: String): Message!
        markAsRead(messageId: ID!): Boolean
    }
`;