import { ITEM_CATEGORY_TYPE } from "../item-category/types";
import { UNIT_TYPE } from "../unit/types";

export interface ITEM_TYPE {
    id: string;
    name: string;
    category?: ITEM_CATEGORY_TYPE;
    unit: UNIT_TYPE;
    alertStock: string;
    sku: string;
    price: number;
    stock: number;
    createdAt: string;
    updatedAt: string;
}
