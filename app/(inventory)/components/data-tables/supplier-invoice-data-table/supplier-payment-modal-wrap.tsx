"use client"
import React, { useState } from 'react';
import SupplierPaymentModal from '../../supplier-payment-modal';

const SupplierPaymentModalWrap = ({
    invoiceId,
    disabled = false,
}: {
    invoiceId: string;
    disabled:boolean
}) => {
    const [isModelOpen, setIsModalOpen] = useState(false);

    return (
        <SupplierPaymentModal
            disabled={disabled}
            orderId={invoiceId}
            variant="outline"
            openBtnName="Payment"
            openBtnClassName="w-36"
            modalState={[isModelOpen, setIsModalOpen]}
        />
    );
};

export default SupplierPaymentModalWrap;