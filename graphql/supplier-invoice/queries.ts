import { gql } from "@apollo/client";



// supplier-invoice/queries.ts
export const SUPPLIER_INVOICE_QUERY = gql`
    query SupplierInvoiceQuery($id: ID!) {
        supplierInvoice(id: $id) {
            id
            due
            duePaymentDate
            invoiceNumber
            invoiceImage
            amount
            status
            paidAmount
            finalAmount
            poNumber
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
 query SupplierInvoicesQuery($offset: Int, $first: Int, $search: String) {
  supplierInvoices(offset: $offset, first: $first, search: $search) {
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
        paidAmount
      }
    }
    
    totalCount
  }
}
`;
export const SUPPLIER_INVOICE_ITEMS_QUERY = gql`
query MyQuery($supplierInvoice: String) {
  parchageInvoiceItems(supplierInvoice: $supplierInvoice) {
    totalCount
    edges {
      node {
        createdAt
        id
        price
        quantity
        updatedAt
        item {
          id
          name
          stock
        }
        supplierInvoice {
          id
          amount
        }
      }
    }
   
  }
}
`

export const SUPPLIER_INVOICE_ITEM_QUERY = gql`
query MyQuery($id: ID!) {
  parchageInvoiceItem(id: $id) {
    createdAt
    id
    price
    quantity
    updatedAt
    item {
          id
          name
          stock
    }
    supplierInvoice {
          id
          amount
    }
  }
}
`