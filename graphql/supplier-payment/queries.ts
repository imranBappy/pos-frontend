import { gql } from "@apollo/client";



export const SUPPLIER_PAYMENTS_QUERY = gql`
query MyQuery($search: String, $status: InventorySupplierPaymentStatusChoices, $paymentMethod: InventorySupplierPaymentPaymentMethodChoices) {
  supplierPayments(
    search: $search
    status: $status
    paymentMethod: $paymentMethod
  ) {
    totalCount
    edges {
      node {
        amountPaid
        createdAt
        id
        paymentMethod
        referenceNumber
        status
        trxId
        updatedAt
        invoice {
          id
          invoiceNumber
          supplier {
            id
            name
          }
        }
      }
    }
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