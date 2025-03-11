import { gql } from "@apollo/client";

export const ITEM_CATEGORES_QUERY = gql`
query MyQuery($offset: Int , $first: Int) {
  itemCategories(offset: $offset, first: $first) {
    totalCount
    edges {
      node {
        createdAt
        description
        id
        image
        name
      }
    }
  }
}
`;

export const ITEM_CATEGORY_QUERY = gql`
query MyQuery($id: ID !) {
  itemCategory(id: $id) {
  		createdAt
        description
        id
        image
        name
  }
}
`;

export const ITEMS_QUERY = gql`
    query MyQuery(
        $safetyStock: Decimal
        $category: Decimal
        $first: Int
        $offset: Int
        $price: Decimal
        $stock: Decimal
        $search: String
        $orderBy: String
    ) {
        items(
            safetyStock: $safetyStock
            category: $category
            first: $first
            offset: $offset
            price: $price
            search: $search
            stock: $stock
            orderBy: $orderBy
        ) {
            edges {
                node {
                    id
                    safetyStock
                    createdAt
                    stock
                    name
                    image
                    vat
                    sku
                    currentStock
                    stockLevel
                    purchaseItems {
                        totalCount
                    }
                    unit {
                        name
                        id
                    }
                    category {
                        id
                        name
                    }
                }
            }
        }
    }
`;
export const ITEM_QUERY = gql`
    query MyQuery($id: ID!) {
        item(id: $id) {
            safetyStock
            category {
                id
                name
            }
            createdAt
            id
            name
            sku
            stock
            image
            currentStock
            unit {
                name
                id
            }
        }
    }
`;
export const ITEM_DETAILS_QUERY = gql`
    query MyQuery($id: ID!) {
        item(id: $id) {
            category {
                description
                id
                image
                name
            }
            createdAt
            currentStock
            id
            image
            name
            safetyStock
            sku
            stock
            stockLevel
            vat
            unit {
                description
                id
                name
                createdAt
            }
            wasteIngredient {
                totalCount
                edges {
                    node {
                        quantity
                        lossAmount
                        id
                        createdAt
                    }
                }
            }
            purchaseItems {
                totalCount
                edges {
                    node {
                        vat
                        totalQuantity
                        quantity
                        price
                        id
                        supplierInvoice {
                            invoiceNumber
                            supplier {
                                name
                                id
                                emailAddress
                            }
                        }
                    }
                }
            }
            ingredients {
                totalCount
            }
        }
    }
`;