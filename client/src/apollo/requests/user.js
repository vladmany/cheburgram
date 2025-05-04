import {makeQuery} from "src/apollo/requestHandler.js";
import gql from "graphql-tag";

export async function getAllUsers() {
  return await makeQuery(gql`
    query users {
      users {
        id
        first_name
        last_name
        image_url
        chat {
          id
          messages {
            id
            text
            participant_id
            sent_at
            read_at
          }
          participants {
            id
            user_id
          }
        }
      }
    }
  `)
}
