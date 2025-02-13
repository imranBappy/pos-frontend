import { SUPPLIER_INVOICE_TYPE } from "../supplier-invoice/types";
import { SUPPLIER_TYPE } from "../supplier/types";


export interface SUPPLIER_PAYMENT_TYPE {
    id: string;
    supplier: SUPPLIER_TYPE;
    invoice: SUPPLIER_INVOICE_TYPE | null;
    paidAmount?: number; // DecimalField becomes number
    paymentMethod: string;
    referenceNumber: string | null;
    trxId: string | null;
    status: string;
    createdAt: string; // DateTimeField becomes string (ISO 8601)
    updatedAt: string;
    amount: number
}