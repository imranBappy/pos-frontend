"use client"

import OrderDetails from '../components/order-details';
const page = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            <OrderDetails orderId={params.id} />
        </div>
    );
};

export default page;