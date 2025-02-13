import { ITEM_TYPE } from "../item/types";
import { SUPPLIER_TYPE } from "../supplier/types";


export interface SUPPLIER_INVOICE_TYPE {
    id: string;
    due: number; // DecimalField becomes number
    duePaymentDate: string | null; // DateField becomes string (ISO 8601) or null
    invoiceNumber: string;
    amount: number;
    status: string;
    supplier?: SUPPLIER_TYPE; // ForeignKey becomes SupplierType object
    createdAt: string; // DateTimeField becomes string (ISO 8601)
    updatedAt: string;
    paidAmount:number
}
export interface SUPPLIER_INVOICE_ITEM_TYPE {
    id: string;
    due: number; // DecimalField becomes number
    duePaymentDate: string | null; // DateField becomes string (ISO 8601) or null
    invoiceNumber: string;
    amount: number;
    status: string;
    supplier?: SUPPLIER_TYPE; // ForeignKey becomes SupplierType object
    createdAt: Date; // DateTimeField becomes string (ISO 8601)
    updatedAt: Date;
    price: number
    quantity: number
    item: ITEM_TYPE
    supplierInvoice: SUPPLIER_INVOICE_TYPE
}
