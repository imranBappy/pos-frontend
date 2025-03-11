

import { gql } from "@apollo/client";

export const ME_QUERY = gql`
    query{
        me{
            email
            name
            role {
              id
              name
            }
            photo
        }
    }
`;

export const USERS_QUERY = gql`
    query MyQuery(
        $role: Decimal
        $search: String
        $offset: Int
        $gender: String
        $createdAt: DateTime
        $createdAtStart: Date
        $createdAtEnd: Date
        $isActive: Boolean = true
        $orderBy: String
        $first: Int
        $isStaff: Boolean
    ) {
        users(
            role: $role
            search: $search
            offset: $offset
            gender: $gender
            createdAt: $createdAt
            createdAtStart: $createdAtStart
            createdAtEnd: $createdAtEnd
            isActive: $isActive
            orderBy: $orderBy
            first: $first
            isStaff: $isStaff
        ) {
            totalCount
            edges {
                node {
                    id
                    email
                    createdAt
                    gender
                    isActive
                    isVerified
                    name
                    photo
                    privacyPolicyAccepted
                    role {
                        id
                        name
                    }
                    termAndConditionAccepted
                    phone
                }
            }
        }
    }
`;

export const USER_QUERY = gql`
query MyQuery($email: String, $id: ID , $phone: String ) {
  user(email: $email, id: $id, phone: $phone) {
    createdAt
    email
    gender
    id
    isActive
    isVerified
    name
    phone
    photo
    dateOfBirth
    role{
       id
      name
    }
    address {
      totalCount
      edges {
        cursor
        node {
          address
          area
          city
          country
          addressType
          default
          street
          state
          id
          house
          createdAt
        }
      }
    }
  }
}
`



export const ROLES_QUERY = gql`
  query MyQuery {
    roles {
      id
      name
    }
  }
`

export const ADDRESS_QUERY = gql`
query MyQuery($id: ID, $user: ID) {
  address(id: $id, user: $user) {
    area
    city
    country
    house
    id
    state
    street
    addressType
      default
    address
    updatedAt
    createdAt

  }
}
`

export const CUSTOMER_SEARCH_QUERY = gql`
    query MyQuery($search: String, $first: Int) {
        users(search: $search, first: $first) {
            totalCount
            edges {
                node {
                    id
                    email
                    name
                }
            }
        }
    }
`;

export const EMPLOYEE_SEARCH_QUERY = gql`
    query MyQuery($search: String, $first: Int) {
        users(search: $search, first: $first, isEmployee: true) {
            totalCount
            edges {
                node {
                    id
                    email
                    name
                }
            }
        }
    }
`;

 