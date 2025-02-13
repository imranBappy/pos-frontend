import { gql } from "@apollo/client";

export const SUPPLIER_INVOICE_MUTATION = gql`mutation MyMutation($amount: Decimal!, $due: Decimal, $duePaymentDate: Date, $id: String, $invoiceImage: String, $invoiceNumber: String!, $status: String!, $supplier: ID, $paidAmount: Decimal!) {
  supplierInvoiceCud(
    input: {invoiceNumber: $invoiceNumber, amount: $amount, status: $status, due: $due, duePaymentDate: $duePaymentDate, id: $id, invoiceImage: $invoiceImage, supplier: $supplier, paidAmount: $paidAmount}
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
}`

export const SUPPLIER_INVOICE_ITEM_MUTATION = gql`mutation MyMutation($id: String, $item: ID!, $price: Decimal!, $quantity: Int!  $supplierInvoice: ID!) {
  parchageInvoiceItemCud(
    input: {item: $item, quantity: $quantity, price: $price, id: $id, supplierInvoice: $supplierInvoice}
  ) {
    message
    success
  }
}`

export const SUPPLIER_INVOICE_ITEM_DELETE_MUTATION = gql`mutation MyMutation($id: ID!) {
  deleteParchageInvoiceItem(id: $id) {
    success
  }
}`
