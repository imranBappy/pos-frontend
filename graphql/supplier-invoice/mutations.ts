import { gql } from "@apollo/client";

export const q = gql`mutation MyMutation($amount: Decimal = "", $due: Decimal = "", $duePaymentDate: Date = "", $id: String = "", $invoiceImage: String = "", $invoiceNumber: String = "", $status: String = "", $supplier: ID = "") {
  supplierInvoiceCud(
    input: {invoiceNumber: $invoiceNumber, amount: $amount, status: $status, due: $due, duePaymentDate: $duePaymentDate, id: $id, invoiceImage: $invoiceImage, supplier: $supplier}
  ) {
    success
    message
  }
}`
