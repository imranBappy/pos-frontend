import { ADDRESS_TYPE, USER_TYPE } from "../accounts/types";
import { ITEM_TYPE } from "../item/types";
import { OUTLET_TYPE } from "../outlet/types";

interface RELATED_TYPE {
    id: string;
    name: string;
}


export interface PRODUCT_TYPE {
    id: string;
    name: string;
    description?: string;
    price: number;
    sku?: string;
    cookingTime?: number;
    tag?: string;
    isActive?: boolean;
    createdAt?: string;
    vat: number;
    kitchen?: RELATED_TYPE | string;
    category?: RELATED_TYPE | string;
    subcategory?: RELATED_TYPE | string;
    images?: string | Promise<string>;
    ingredients?: {
        totalCount: number;
    };
    orders?: {
        totalCount: number;
    };
}
export interface CATEGORY_TYPE {
    id: string;
    name: string;
    description: string;
    photo: string;
    isActive: boolean;
    products?: PRODUCT_TYPE[];
    subcategories?: CATEGORY_TYPE[];
}

export interface SUBCATEGORY_TYPE {
    id: string;
    name: string;
    description: string;
    photo: string;
    isActive: boolean;
}

export interface ORDER_ITEM_TYPE {
    id: string;
    product?: PRODUCT_TYPE;
    quantity: number;
    price: number;
    discount?: number
    vat: number
}



export interface ORDER_TYPE {
    id: string;
    user: USER_TYPE;
    paymentMethod: string;
    finalAmount: number;
    due?: number;
    amount: number;
    status: string;
    createdAt: string;
    kitchen: RELATED_TYPE | string;
    category: RELATED_TYPE | string;
    subcategory: RELATED_TYPE | string;
    orderItems: ORDER_ITEM_TYPE[];
    address: ADDRESS_TYPE;
    type: string;
    orderId: string
    outlet: OUTLET_TYPE
    items?: {
        edges: { node: ORDER_ITEM_TYPE }[]
    }
    payments?: {
        totalCount: number;
        edges: { node: PAYMENT_TYPE }[]
    }
}
export interface FLOOR_TABLES_TYPE {
    name: string;
    id: string;
    createdAt: string;
    isActive: boolean;
    isBooked: boolean;
    floor?: FLOOR_TYPE;
    floorTable?: FLOOR_TYPE;
}
export interface FLOOR_TYPE {
    name: string;
    id: string;
    createdAt: string,
    isActive: boolean,
    isBooked: boolean,
    floorTables?: FLOOR_TABLES_TYPE

}



export interface PAYMENT_TYPE {
    id: string;
    user: USER_TYPE;
    paymentMethod: string;
    amount: number;
    status: string;
    createdAt: string;
    remarks: string;
    trxId: string;
    order: ORDER_TYPE[];
}

export interface INGREDIENT_QUERY {
    id?: string
    quantity: number
    item: ITEM_TYPE
    product: PRODUCT_TYPE
}