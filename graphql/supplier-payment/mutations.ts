
import { gql } from "@apollo/client";

export const SUPPLIER_PAYMENT_MUTATION = gql`mutation MyMutation($amount: Decimal!, $id: String, $paymentMethod: String!, $status: String!, $trxId: String!, $invoice: ID!, $duePaymentDate: Date) {
  supplierPaymentCud(
    input: {amount: $amount, paymentMethod: $paymentMethod, status: $status, id: $id, trxId: $trxId, invoice: $invoice, duePaymentDate: $duePaymentDate}
  ) {
    success
    supplierPayment {
      amount
      id
      status
      trxId
      paymentMethod
      invoice {
        id
        due
        amount
        status
        duePaymentDate
        paidAmount
      }
    }
  }
}`