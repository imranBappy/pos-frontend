import { gql } from "@apollo/client";

 



export const KITCHEN_QUERY = gql`
query KITCHEN_QUERY($name: String , $isActive: Boolean ,  $first: Int , $offset: Int, $orderBy: String ) {
  kitchens(
    name: $name
    isActive: $isActive
    first: $first
    offset: $offset
    orderBy: $orderBy
  ) {
    totalCount
    edges {
      node {
        id
        name
        photo
        description
        createdAt
        isActive
      }
    }
  }
}

`
