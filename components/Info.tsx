import React from 'react';
import { Info as InfoIcon } from 'lucide-react';

const Info = ({message=''}) => {
    return (
        <div className=' w-fit flex gap-2   rounded text-yellow-600  bg-yellow-500/10 items-center px-4 py-2 text-sm'>
            <InfoIcon size={18} /> <p >{message}</p>
        </div>
    );
};

export default Info;