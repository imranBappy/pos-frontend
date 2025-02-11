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
  mutation MyMutation($id: String,$alertStock: Int!, $category: ID, $name: String!, $price: Decimal!, $sku: String!, $stock: Int!, $unit: ID!) {
  itemCud(
    input: {id: $id, alertStock: $alertStock, stock: $stock, category: $category, name: $name, price: $price, sku: $sku, unit: $unit}
  ) {
    message
    success
  }
}
`