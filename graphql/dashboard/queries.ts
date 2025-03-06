import { gql } from "@apollo/client";



export const DASHBOARD_QUERIES = gql`
    query Dashboard {
        users(first: 10, orderBy: "-createdAt") {
            totalCount
            edges {
                node {
                    id
                    photo
                    phone
                    name
                    email
                    createdAt
                }
            }
        }
        orders(first: 10, orderBy: "-createdAt") {
            totalCount
            edges {
                node {
                    id
                    finalAmount
                    status
                    orderId
                    createdAt
                    type
                    user {
                        name
                        id
                    }
                    items {
                        totalCount
                    }
                }
            }
        }
        payments(first: 10, orderBy: "-createdAt") {
            totalCount
            edges {
                node {
                    trxId
                    status
                    paymentMethod
                    amount
                    createdAt
                    id
                }
            }
        }
        products(first: 10, orderBy: "-createdAt") {
            totalCount
            edges {
                node {
                    id
                    price
                    name
                    createdAt
                    images
                    ingredients {
                        totalCount
                    }
                    orders {
                        totalCount
                    }
                    category {
                        name
                        id
                    }
                }
            }
        }

        wastes {
            totalCount
        }
        outlets(first: 10, orderBy: "-createdAt") {
            totalCount
            edges {
                node {
                    email
                    phone
                    name
                    id
                }
            }
        }
        items(first: 10, orderBy: "stock_level") {
            totalCount
            edges {
                node {
                    stock
                    stockLevel
                    name
                    image
                    id
                    currentStock
                    safetyStock
                    createdAt
                    category {
                        name
                        id
                    }
                }
            }
        }
        categories(first: 10, orderBy: "-createdAt") {
            totalCount
        }
        floorTables {
            totalCount
        }
        floors {
            totalCount
        }
    }
`;