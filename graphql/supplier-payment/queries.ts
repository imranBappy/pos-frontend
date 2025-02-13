import { gql } from "@apollo/client";


export const SUPPLIER_PAYMENT_QUERY = gql`
query MyQuery($id: ID!) {
  supplierPayment(id: $id) {
    amount
    createdAt
    id
    invoice {
      id
      due
      amount
      invoiceNumber
      status
    }
    paymentMethod
    status
    trxId
  }
}
`;

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
        createdAt
        id
        paymentMethod
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
          amount
          due
          paidAmount
          status
          duePaymentDate
        }
        amount
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