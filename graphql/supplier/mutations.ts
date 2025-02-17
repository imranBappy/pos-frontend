import { gql } from "@apollo/client";


export const SUPPLIER_MUTATION = gql`
mutation MyMutation($emailAddress: String!, $id: String, $name: String!, $phoneNumber: String!, $whatsappNumber: String, $address: String, $contactPerson: String!, $branch: String) {
  supplierCud(
    input: {name: $name, phoneNumber: $phoneNumber, whatsappNumber: $whatsappNumber, emailAddress: $emailAddress, address: $address, id: $id, contactPerson: $contactPerson, branch: $branch}
  ) {
    success
    message
  }
}
`
export const DELETE_SUPPLIER_MUTATION = gql`
  mutation DeleteSupplierMutation($id: ID!) {
    deleteSupplier(id: $id) {
      success
    }
  }
`;
