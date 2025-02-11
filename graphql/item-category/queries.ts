import { gql } from "@apollo/client";

export const ITEM_CATEGORES_QUERY = gql`
query MyQuery($offset: Int , $first: Int, $search:String) {
  itemCategories(offset: $offset, first: $first, search:$search) {
    totalCount
    edges {
      node {
        createdAt
        description
        id
        image
        name
      }
    }
  }
}
`;

export const ITEM_CATEGORY_QUERY = gql`
query MyQuery($id: ID !) {
  itemCategory(id: $id) {
  		createdAt
        description
        id
        image
        name
  }
}
`;