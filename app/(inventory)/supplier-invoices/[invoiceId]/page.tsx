import React from 'react';
import InvoiceDetails from '../../components/invoice-details';

const page = ({ params }: { params: { invoiceId: string } }) => {
    return (
        <div>
            <InvoiceDetails invoiceId={params.invoiceId} />
        </div>
    );
};

export default page;