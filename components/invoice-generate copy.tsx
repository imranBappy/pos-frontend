'use client';

import { Button } from "@/components/ui/button";
import { USER_TYPE } from "@/graphql/accounts";
import { OUTLET_TYPE } from "@/graphql/outlet/types";
import { ORDER_ITEM_TYPE } from "@/graphql/product";
import { useRef } from "react";
import autoTable from 'jspdf-autotable'; // For table rendering in PDFs
import jsPDF from 'jspdf';

type ORDER_ITEM_NOTE_TYPE = {
    node: ORDER_ITEM_TYPE
}


interface PROPS_TYPE {
    order: {
        id: string;
        user?: USER_TYPE;
        paymentMethod: string;
        finalAmount: number;
        status: string;
        createdAt: string;
        orderItems: ORDER_ITEM_TYPE[];
        type: string;
        orderId: string
        outlet: OUTLET_TYPE
        items: {
            edges: ORDER_ITEM_NOTE_TYPE[]
        }
    }
}

export type ORDER = {
    id: string;
    user?: USER_TYPE;
    paymentMethod: string;
    finalAmount: number;
    status: string;
    createdAt: string;
    orderItems: ORDER_ITEM_TYPE[];
    type: string;
    orderId: string
    outlet: OUTLET_TYPE
    items: {
        edges: ORDER_ITEM_NOTE_TYPE[]
    }
}
// sub total, vat, discount, total, payment method, status, created at, order items, type, order id, outlet
export const handleGenerateInvoice = (order: ORDER) => {
    if (!order) {
        return;
    }
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Invoice', 14, 20);

    // Add order details
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.orderId}`, 14, 30);
    doc.text(`Customer: ${order.user?.name || 'Walk-in Customer'}`, 14, 36);
    doc.text(`Email: ${order.user?.email || 'No email'}`, 14, 42);

    // Add table with items
    const tableData = order.items?.edges.map(({ node }: { node: ORDER_ITEM_TYPE }) => [
        node.product?.name || '',
        node.quantity || 0,
        node.price || 0,
    ]);

    autoTable(doc, {
        head: [['Product', 'Quantity', 'Price']],
        body: tableData,
        startY: 50,
    });

    // Add total price
    const totalPrice = order.finalAmount
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || 50;
    doc.text(`Total: $${totalPrice}`, 14, finalY + 10);

    // Save the PDF
    doc.save(`Invoice_${order.orderId}.pdf`);
};

export const InvoiceGenerate = ({ order }: PROPS_TYPE) => {

    console.log({ order });

    const printRef = useRef<HTMLDivElement>(null);


    const handlePrintInvoice = () => {
        if (printRef.current) {
            const printContent = printRef.current.innerHTML;
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.open();
                printWindow.document.write(`
                    <html>
                    <head>
                        <title>Invoice</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                padding: 20px;
                                margin: 0;
                            }
                            h1, h2, h3 {
                                margin: 0;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                            }
                            table, th, td {
                                border: 1px solid #000;
                            }
                            th, td {
                                padding: 8px;
                                text-align: left;
                            }
                        </style>
                    </head>
                    <body>${printContent}</body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
                printWindow.close();
            }
        }
    };



    return (
        <>
            <div className="flex justify-end  space-x-2 ">
                <Button variant={'outline'} onClick={() => handleGenerateInvoice(order)}>Download </Button>
                <Button variant={'secondary'} onClick={handlePrintInvoice}>Print </Button>

            </div>
            <div ref={printRef} className="hidden">
                <h1>Invoice</h1>
                <p>Order ID: {order.orderId}</p>
                <p>Customer: {order.user?.name || 'Walk-in Customer'}</p>
                <p>Email: {order.user?.email || 'No email address'}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order?.items?.edges.map(({ node }, index: number) => (
                            <tr key={index}>
                                <td>{node?.product?.name}</td>
                                <td>{node.quantity}</td>
                                <td>${node.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p>Total: ${order.finalAmount}</p>
            </div>
        </>

    );
}

export default InvoiceGenerate;
