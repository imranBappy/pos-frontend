import { gql } from "@apollo/client";


export const OUTLETS_QUERY = gql`
query MyQuery($phone: String, $orderBy: String, $offset: Int, $name: String, $first: Int, $email: String, $isActive: Boolean) {
  outlets(
    phone: $phone
    orderBy: $orderBy
    offset: $offset
    name: $name
    first: $first
    email: $email
    isActive: $isActive
  ) {
    totalCount
    edges {
      node {
        phone
        name
        id
        isActive
        email
        createdAt
        address
        users {
          totalCount
        }
        orders {
          totalCount
        }
      }
    }
  }
}
`

export const OUTLET_QUERY = gql`
  query MyQuery($id:ID!) {
    outlet(
      id:$id
    ) {
          phone
          name
          id
          isActive
          email
          createdAt
          address
    }
  }
`