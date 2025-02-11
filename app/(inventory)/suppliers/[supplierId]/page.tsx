import React from 'react';
import SupplierForm from '../../components/forms/supplier-form';

const page = ({ params }: { params: { supplierId: string } }) => {
    return (
        <div>
            <SupplierForm supplierId={params.supplierId} />
        </div>
    );
};

export default page;