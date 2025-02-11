import { gql } from "@apollo/client";


export const UNITS_QUERY = gql`
    query MyQuery($offset: Int , $first: Int ) {
    units(offset: $offset, first: $first) {
        totalCount
        edges {
        node {
                description
                name
                id
            }
        }
    }
}
`

export const UNIT_QUERY = gql`
query MyQuery($id: ID!) {
  unit(id: $id) {
    description
    id
    name
  }
}
`
