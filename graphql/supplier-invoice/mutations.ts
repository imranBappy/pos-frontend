import { gql } from "@apollo/client";

export const SUPPLIER_INVOICE_MUTATION = gql`
    mutation MyMutation(
        $amount: Decimal!
        $due: Decimal
        $duePaymentDate: Date
        $id: String
        $invoiceImage: String
        $invoiceNumber: String!
        $status: String!
        $supplier: ID
        $paidAmount: Decimal!
        $finalAmount: Decimal!
        $poNumber: String
    ) {
        supplierInvoiceCud(
            input: {
                invoiceNumber: $invoiceNumber
                amount: $amount
                status: $status
                due: $due
                duePaymentDate: $duePaymentDate
                id: $id
                invoiceImage: $invoiceImage
                supplier: $supplier
                paidAmount: $paidAmount
                finalAmount: $finalAmount
                poNumber: $poNumber
            }
        ) {
            success
            message
            supplierInvoice {
                id
                status
                amount
                invoiceNumber
                invoiceImage
                paidAmount
                due
                duePaymentDate
            }
        }
    }
`;

export const SUPPLIER_INVOICE_ITEM_MUTATION = gql`
  mutation MyMutation(
    $id: String
    $item: ID!
    $price: Decimal!
    $quantity: Int!
    $supplierInvoice: ID!
    $vat: Decimal!
  ) {
    parchageInvoiceItemCud(
      input: {
        item: $item
        quantity: $quantity
        price: $price
        id: $id
        supplierInvoice: $supplierInvoice
        vat: $vat
      }
    ) {
      message
      success
    }
  }
`;

export const SUPPLIER_INVOICE_ITEM_DELETE_MUTATION = gql`mutation MyMutation($id: ID!) {
  deleteParchageInvoiceItem(id: $id) {
    success
  }
}`
