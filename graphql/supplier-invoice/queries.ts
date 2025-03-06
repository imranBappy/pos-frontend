import { gql } from "@apollo/client";



// supplier-invoice/queries.ts
export const SUPPLIER_INVOICE_QUERY = gql`
    query MyQuery($id: ID!, $first: Int) {
        supplierInvoice(id: $id) {
            amount
            createdAt
            due
            duePaymentDate
            finalAmount
            id
            invoiceImage
            invoiceNumber
            paidAmount
            purchaseItems(first: $first) {
                totalCount
                edges {
                    node {
                        createdAt
                        id
                        price
                        quantity
                        totalQuantity
                        item {
                            id
                            image
                            vat
                            stock
                            sku
                            name
                        }
                    }
                }
            }
            poNumber
            status
            supplier {
                address
                branch
                contactPerson
                createdAt
                emailAddress
                id
                name
                phoneNumber
                whatsappNumber
            }
            payments {
                totalCount
                edges {
                    node {
                        amount
                        id
                        createdAt
                        paymentMethod
                        status
                        trxId
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
        $minStock: Decimal
        $itemId: Decimal
    ) {
        supplierInvoices(
            offset: $offset
            first: $first
            search: $search
            minStock: $minStock
            itemId: $itemId
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
                    paidAmount
                }
            }

            totalCount
        }
    }
`;
export const SUPPLIER_INVOICE_ITEMS_QUERY = gql`
query MyQuery($supplierInvoice: String) {
  purchaseInvoiceItems(supplierInvoice: $supplierInvoice) {
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
  purchaseInvoiceItem(id: $id) {
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