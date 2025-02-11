import { gql } from "@apollo/client";


export const UNIT_MUTATION = gql`
    mutation MyMutation($name: String!, $id: String, $description: String) {
    unitCud(input: {name: $name, id: $id, description: $description}) {
        message
        success
        unit {
        id
        description
        name
        }
    }
}
`


export const DELETE_UNIT_MUTATION = gql`
  mutation DeleteUnitMutation($id: ID!) {
    deleteUnit(id: $id) {
      success
    }
  }
`;