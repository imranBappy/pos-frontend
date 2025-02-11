import { gql } from "@apollo/client";


export const ITEM_CATEGORY_MUTATION = gql`
mutation MyMutation($description: String, $id: String , $image: String , $name: String !) {
  itemCategoryCud(
    input: {name: $name, description: $description, id: $id, image: $image}
  ) {
    success
    message
  }
}
`