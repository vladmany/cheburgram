import {makeMutation} from "src/apollo/requestHandler.js";
import gql from "graphql-tag";

export async function createMessage(chatId, text) {
  return await makeMutation(gql`
    mutation {
      createMessage(chatId: ${chatId}, text: "${text}") {
        id
        text
        chat_id
        participant_id
        sent_at
      }
    }
  `)
}

export async function markAsRead(messageId) {
  return await makeMutation(gql`
    mutation {
      markAsRead(messageId: ${messageId})
    }
  `)
}
