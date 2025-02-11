import { gql } from "@apollo/client";

export const SUPPLIER_INVOICE_MUTATION = gql`
  mutation SupplierInvoiceMutation(
    $id: ID
    $due: Float # Use Float for DecimalField
    $duePaymentDate: Date
    $invoiceNumber: String!
    $amount: Float!
    $status: String!
    $supplier: ID! # Send Supplier ID
  ) {
    supplierInvoiceMutation( # Your mutation name
      id: $id
      due: $due
      duePaymentDate: $duePaymentDate
      invoiceNumber: $invoiceNumber
      amount: $amount
      status: $status
      supplier: $supplier
    ) {
      supplierInvoice { # The SupplierInvoice object returned by the mutation
        id
        due
        duePaymentDate
        invoiceNumber
        amount
        status
        supplier {
          id
          name # or other supplier fields
        }
        createdAt
        updatedAt
      }
      success
      message
    }
  }
`;

// supplier-invoice/queries.ts
export const SUPPLIER_INVOICE_QUERY = gql`
  query SupplierInvoiceQuery($id: ID!) {
    supplierInvoice(id: $id) {
      id
      due
      duePaymentDate
      invoiceNumber
      amount
      status
      supplier {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const SUPPLIER_INVOICES_QUERY = gql`
  query SupplierInvoicesQuery(
    $offset: Int
    $first: Int
    $search: String
    # Add other filter variables as needed
  ) {
    supplierInvoices(
      offset: $offset
      first: $first
      search: $search
      # ... other filter arguments
    ) {
      edges {
        node {
          id
          due
          duePaymentDate
          invoiceNumber
          amount
          status
          supplier {
            id
            name
          }
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;