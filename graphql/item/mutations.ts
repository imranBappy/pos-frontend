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
export const ITEM_MUTATION = gql`
  mutation MyMutation($id: String, $safetyStock: Int!, $category: ID, $name: String!,  $sku: String!, $unit: ID!) {
  itemCud(
    input: {id: $id, safetyStock: $safetyStock, category: $category, name: $name, sku: $sku, unit: $unit}
  ) {
    message
    success
  }
}
`