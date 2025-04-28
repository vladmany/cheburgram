import {makeMutation} from "src/apollo/requestHandler.js";
import gql from "graphql-tag";

export async function createChat(userId) {
  return await makeMutation(gql`
    mutation {
      createChat(userId: "${userId}") {
        id
        messages {
          id
          text
        }
        participants {
          id
          user_id
        }
      }
    }
  `)
}
