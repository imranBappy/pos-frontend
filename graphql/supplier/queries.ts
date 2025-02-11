import { gql } from "@apollo/client";

// Query to fetch a list of suppliers with pagination
export const SUPPLIERS_QUERY = gql`
query SuppliersQuery($offset: Int, $first: Int, $search: String ) {
  suppliers(offset: $offset, first: $first, search: $search) {
    totalCount
    edges {
      node {
        id
        name
        phoneNumber
        whatsappNumber
        emailAddress
        address
      }
    }
  }
}
`;

// Query to fetch a single supplier by ID
export const SUPPLIER_QUERY = gql`
  query SupplierQuery($id: ID!) {
    supplier(id: $id) {
      id
          name
          phoneNumber
          whatsappNumber
          emailAddress
          address
    }
  }
`;