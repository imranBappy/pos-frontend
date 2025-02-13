import React from 'react';
import SupplierInvoiceForm from '../../components/forms/supplier-invoice-form';

const page = ({ params }: { params: { invoiceId: string } }) => {
    return (
        <div>
            <SupplierInvoiceForm invoiceId={params.invoiceId} />
        </div>
    );
};

export default page;