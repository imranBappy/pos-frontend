import React from 'react';

export type ITEM_STOCK_STATUS = 'WARNING'|'DENGER'|'GOOD'

const ItemStockStatus = ({status}:{status:ITEM_STOCK_STATUS}) => {
    if (status === 'GOOD') 
        return <span className="w-[10px] h-[10px]  rounded-full bg-green-700"/>
    
    if (status === 'WARNING') 
        return <span className="w-[10px] h-[10px]  rounded-full bg-yellow-700"/>

    if (status === 'DENGER') 
        return <span className="w-[10px] h-[10px]  rounded-full bg-red-700"/>
};

export default ItemStockStatus;