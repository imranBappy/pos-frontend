'use client';

import { Button } from "@/components/ui/button";

import { ORDER_ITEM_TYPE, ORDER_TYPE } from "@/graphql/product";
import autoTable from 'jspdf-autotable'; // For table rendering in PDFs
import jsPDF from 'jspdf';
import { toFixed, underscoreToSpace } from "@/lib/utils";



interface PROPS_TYPE {
    order: ORDER_TYPE
}


export const handleGenerateInvoice = (order: ORDER_TYPE, isPrint = false) => {
    if (!order) {
        return;
    }

    const doc = new jsPDF();

    doc.setFont("helvetica");

    // Invoice Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", 105, 20, { align: "center" });

    // Outlet Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Outlet: ${order.outlet.name}`, 10, 30);
    doc.text(`Address: ${order.outlet.address}`, 10, 36);

    // Add Order ID as a clickable link
    const orderDetailsUrl = `https://example.com/order/${order.orderId}`; // Replace with actual URL
    doc.textWithLink(`Order ID: ${order.orderId}`, 10, 46, {
        url: orderDetailsUrl,
    });
    doc.setTextColor(0, 0, 0); // Reset color

    // Find payment method

    const paymentsMethods = order.payments?.edges.map(({ node }) => node.paymentMethod) || [];

    // Other Order Details
    doc.text(`Type: ${underscoreToSpace(order.type)}`, 10, 52);
    doc.text(`Payment Method: ${paymentsMethods.join(", ")}`, 10, 58);
    doc.text(`Status: ${order.status}`, 10, 64);
    doc.text(`Created At: ${new Date(order.createdAt).toLocaleString()}`, 10, 70);

    let totalDiscountAmount = 0;

    // Order Items Table
    const tableData = order.items?.edges.map(({ node }: { node: ORDER_ITEM_TYPE }) => {
        totalDiscountAmount += parseFloat(`${node.discount}`) || 0;
        return [
            node.product?.name || '',
            node.quantity,
            `${toFixed(node.vat)}%`,
            toFixed(node.discount || 0),
            toFixed(node.price),
        ]
    });

    autoTable(doc, {
        startY: 80,
        head: [["Product", "Quantity", 'VAT', 'Discount', "Price"]],
        body: tableData,
        theme: "grid",
        styles: {
            fontSize: 10,
            halign: "center",
        },
        headStyles: {
            fillColor: [41, 128, 185], // Blue color for the header
            textColor: [255, 255, 255],
        },
    });
    // || 85
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 10, finalY + 10);

    doc.setFont("helvetica", "normal");
    doc.text(`Sub Total:`, 10, finalY + 20);
    doc.text(`$${toFixed(order.amount)}`, 190, finalY + 20, { align: "right" });

    doc.text(`VAT:`, 10, finalY + 26);
    doc.text(`$${toFixed(order.finalAmount - order.amount)}`, 190, finalY + 26, { align: "right" })

    doc.text(`Due:`, 10, finalY + 32);
    doc.text(`$${toFixed(order.due || 0)}`, 190, finalY + 32, { align: "right" });

    doc.text(`Discount:`, 10, finalY + 38);
    doc.text(`$${toFixed(totalDiscountAmount)}`, 190, finalY + 38, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.text(`Total:`, 10, finalY + 46);
    doc.text(`$${toFixed(order.finalAmount)}`, 190, finalY + 46, { align: "right" });

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your buy!", 105, finalY + 60, { align: "center" })

    if (isPrint) {
        const pdfBlob = doc.output("blob");
        const url = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(url, "_blank");
        if (printWindow) {
            printWindow.focus();
            printWindow.print();
        }
        return;
    }
    doc.save(`Invoice_${order.orderId}.pdf`);
};

export const InvoiceGenerate = ({ order }: PROPS_TYPE) => {
    return (
        <>
            <div className="flex justify-end  space-x-2 ">
                <Button variant={'outline'} onClick={() => handleGenerateInvoice(order)}>Download </Button>
                <Button variant={'secondary'} onClick={() => handleGenerateInvoice(order, true)}>Print </Button>
            </div>
        </>

    );
}

export default InvoiceGenerate;
