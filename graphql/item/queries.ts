import { gql } from "@apollo/client";

export const ITEM_CATEGORES_QUERY = gql`
query MyQuery($offset: Int , $first: Int) {
  itemCategories(offset: $offset, first: $first) {
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

export const ITEMS_QUERY = gql`
query MyQuery($alertStock: Decimal, $category: Decimal, $first: Int, $offset: Int, $price: Decimal,  $stock: Decimal , $search: String,  $orderBy: String ) {
  items(
    alertStock: $alertStock
    category: $category
    first: $first
    offset: $offset
    price: $price
    search: $search
    stock: $stock
    orderBy: $orderBy
  ) {
    edges {
      node {
        id
        alertStock
        createdAt
        stock
        parchageItems {
          totalCount
        }
        name
        unit {
          name
          id
        }
        category {
          id
          name
        }
        sku
        price
      }
    }
  }
}
`
export const ITEM_QUERY = gql`
query MyQuery($id: ID!) {
  item(id: $id) {
    alertStock
    category {
      id
      name
    }
    createdAt
    id
    name
    price
    sku
    stock
    unit {
      name
      id
    }
  }
}
`