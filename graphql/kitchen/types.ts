
interface RELATED_TYPE {
    id: string;
    name: string;
}
export interface PRODUCT_TYPE {
    id?: string;
    name: string;
    description: string;
    price: number;
    photo: string;
    sku: string;
    cookingTime: number;
    tag: string;
    isActive?: boolean;
    createdAt?: string;
    vat: number;
    kitchen: RELATED_TYPE | string;
    category: RELATED_TYPE | string;
    subcategory: RELATED_TYPE | string;
}






export interface GetProductsData {
    products: PRODUCT_TYPE[];
}

export interface GetProductByIdData {
    product: PRODUCT_TYPE;
}

export interface CreateProductData {
    createProduct: PRODUCT_TYPE;
}

export interface CreateProductVariables {
    name: string;
    description?: string;
    price: number;
}
