import { gql } from "@apollo/client";

export const WASTES_QUERY = gql`
    query MyQuery(
        $totalLossAmount: Decimal
        $search: String
        $orderBy: String
        $offset: Int
        $first: Int
        $createdAtStart: Date
        $createdAtEnd: Date
    ) {
        wastes(
            totalLossAmount: $totalLossAmount
            search: $search
            orderBy: $orderBy
            offset: $offset
            first: $first
            createdAtStart: $createdAtStart
            createdAtEnd: $createdAtEnd
        ) {
            totalCount
            edges {
                node {
                    createdAt
                    date
                    id
                    notes
                    estimatedCost
                    responsible {
                        id
                        name
                    }
                    wasteIngredient {
                        totalCount
                    }
                }
            }
        }
    }
`;
export const WASTE_QUERY = gql`
    query MyQuery($id: ID!) {
        waste(id: $id) {
            category {
                id
                name
            }
            createdAt
            date
            estimatedCost
            id
            notes
            responsible {
                role {
                    name
                    id
                }
                photo
                phone
                name
                isActive
                isVerified
                gender
                id
                email
            }
            invoice {
                finalAmount
                duePaymentDate
                due
                createdAt
                amount
                poNumber
                status
                paidAmount
                invoiceNumber
                invoiceImage
                id
                supplier {
                    name
                    id
                    phoneNumber
                    contactPerson
                    emailAddress
                    branch
                    address
                }
            }
            wasteIngredient {
                totalCount
                edges {
                    node {
                        createdAt
                        id
                        lossAmount
                        quantity
                        updatedAt
                        ingredient {
                            id
                            image
                            name
                        }
                    }
                }
            }
        }
    }
`;

export const WASTE_CATEGORIES_QUERY = gql`
    query MyQuery($offset: Int, $first: Int) {
        wasteCategories(offset: $offset, first: $first) {
            totalCount
            edges {
                node {
                    description
                    id
                    name
                }
            }
        }
    }
`;

export const WASTE_CATEGORY_QUERY = gql`
    query MyQuery($id: ID!) {
        wasteCategory(id: $id) {
            description
            id
            name
        }
    }
`;