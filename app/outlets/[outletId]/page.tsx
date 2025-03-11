"use client"
import OutletAddForm from '../components/forms/outlet-add-form';

const page = ({ params }: { params: { outletId: string } }) => {
    return (
        <>
            <OutletAddForm outletId={params.outletId} />
        </>
    );
};

export default page;