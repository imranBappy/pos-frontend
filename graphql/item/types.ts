import { ITEM_CATEGORY_TYPE } from "../item-category/types";
import { UNIT_TYPE } from "../unit/types";

export interface ITEM_TYPE {
    id: string;
    name: string;
    image: string;
    category?: ITEM_CATEGORY_TYPE;
    unit: UNIT_TYPE;
    safetyStock: number;
    stockLevel: number;

    sku: string;
    vat: number;
    itemId?: string;

    stock: number;
    createdAt: string;
    updatedAt: string;
    currentStock: number;
}
