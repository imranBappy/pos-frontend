import { gql } from "@apollo/client";

export const PRODUCTS_QUERY = gql`
query PRODUCTS_QUERY($offset: Int, $search: String, $after: String, $before: String, $first: Int, $category: Decimal, $subcategory: Decimal, $price: Decimal, $orderBy: String, $isActive: Boolean, $name: String, $kitchen: Decimal, $priceLte: Decimal, $sku: String , $tag: String , $createdAtEnd: Date , $createdAtStart: Date ) {
  products(
    offset: $offset
    after: $after
    before: $before
    first: $first
    category: $category
    subcategory: $subcategory
    price: $price
    orderBy: $orderBy
    isActive: $isActive
    name: $name
    kitchen: $kitchen
    priceLte: $priceLte
    search: $search
    sku: $sku
    tag: $tag
    createdAtEnd: $createdAtEnd
    createdAtStart: $createdAtStart
  ) {
    totalCount
    edges {
      node {
        id
        name
        price
        description
        vat
        images
        sku
        cookingTime
        tag
        isActive
        createdAt
        kitchen {
          id
          name
        }
        category {
          id
          name
        }
        subcategory {
          id
          name
        }
        ingredients{
          totalCount
        }
      }
    }
  }
}
`;
export const PRODUCT_QUERY = gql`
query Product($id: ID!) {
  product(id: $id) {
    id
    name
    vat
    tag
    sku
    price
    isActive
    images
    cookingTime
    createdAt
    description
    video
    category {
      description
      id
      image
      isActive
      name
    }
    subcategory {
      name
      image
      id
      description
    }
    kitchen {
      id
      name
    }
    orders(first: 60) {
      totalCount
      edges {
        node {
          order {
            id
            orderId
            status
          }
          price
          vat
          quantity
          id
          discount
          createdAt
        }
      }
    }
    
  }
}
`;
export const PRODUCT_DETAILS_QUERY = gql`
    query Product($id: ID!) {
        product(id: $id) {
            id
            name
            vat
            tag
            sku
            price
            isActive
            images
            cookingTime
            createdAt
            description
            video
            ingredients {
                totalCount
                edges {
                    node {
                        id
                        price
                        quantity
                        item {
                            id
                            image
                            name
                        }
                    }
                }
            }
            category {
                description
                id
                image
                isActive
                name
            }
            subcategory {
                name
                image
                id
                description
            }
            kitchen {
                id
                name
            }
            orders(first: 60) {
                totalCount
                edges {
                    node {
                        order {
                            id
                            orderId
                            status
                        }
                        price
                        vat
                        quantity
                        id
                        discount
                        createdAt
                    }
                }
            }
        }
    }
`;

export const CATEGORIES_QUERY = gql`
query CATEGORIES_QUERY($search: String, $orderBy: String, $first: Int $isActive: Boolean, $isCategory: Boolean, $offset: Int, $parent: Decimal ) {
  categories(
    search: $search
    orderBy: $orderBy
    first: $first
    isActive: $isActive
    isCategory: $isCategory
    offset: $offset
    parent: $parent
  ) {
    totalCount
    edges {
      node {
        id
        name
        isActive
        products {
          totalCount
        }
        subcategories {
          totalCount
        }
      }
    }
  }
}
`

export const CATEGORY_QUERY = gql`
query MyQuery($id: ID!) {
  category(id: $id) {
    id
    description
    image
    isActive
    name
    parent {
      id
      name
    }
  }
}
`

export const SUBCATEGORIES_QUERY = gql`
 query SUBCATEGORIES_QUERY($offset: Int , $first: Int, $search: String, $parentId:ID!) {
    subcategories(offset: $offset, first: $first, search: $search, parentId:$parentId) {
      totalCount
      edges {
        node {
          id
          name
          image
          description
          isActive
        }
      }
    }
  }
`

export const ORDERS_QUERY = gql`
    query MyQuery(
        $first: Int
        $orderBy: String
        $offset: Int
        $search: String
        $type: ProductOrderTypeChoices
        $status: ProductOrderStatusChoices
        $outlet: ID
    ) {
        orders(
            first: $first
            orderBy: $orderBy
            offset: $offset
            search: $search
            type: $type
            status: $status
            outlet: $outlet
        ) {
            totalCount
            edges {
                node {
                    id
                    createdAt
                    status
                    finalAmount
                    type
                    orderId
                    due
                    amount
                    user {
                        id
                        name
                        email
                    }
                    outlet {
                        email
                        id
                        address
                        name
                        phone
                    }
                    payments {
                        totalCount
                        edges {
                            node {
                                amount
                                createdAt
                                id
                                paymentMethod
                                remarks
                                status
                                trxId
                            }
                        }
                    }
                    items {
                        totalCount
                        edges {
                            node {
                                price
                                quantity
                                id
                                discount
                                vat
                                
                                product {
                                    id
                                    images
                                    price
                                    name
                                    vat
                                    sku
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
export const ORDER_QUERY = gql`
    query MyQuery($id: ID!) {
        order(id: $id) {
            status
            finalAmount
            due
            amount
            type
            id
            orderId

            tableBookings {
                totalCount
                edges {
                    node {
                        id
                        floorTable {
                            id
                            name
                            createdAt
                            isActive
                            isBooked
                        }
                    }
                }
            }

            createdAt
            user {
                id
                name
                email

                address {
                    edges {
                        node {
                            id
                            address
                            default
                            addressType
                            city
                            area
                            street
                            house
                            street
                        }
                    }
                }
            }

            payments {
                totalCount
                edges {
                    node {
                        amount
                        createdAt
                        id
                        paymentMethod
                        remarks
                        status
                        trxId
                    }
                }
            }
            outlet {
                email
                id
                address
                name
                phone
            }
            items {
                totalCount
                edges {
                    node {
                        price
                        quantity
                        id
                        discount
                        vat
                        orderIngredients {
                            totalCount
                            edges {
                                node {
                                    quantity
                                    id
                                    item {
                                        id
                                        name
                                        unit {
                                            id
                                            name
                                        }
                                    }
                                }
                            }
                        }
                        product {
                            id
                            images
                            name
                            vat
                        }
                    }
                }
            }
        }
    }
`;

export const FLOORS_QUERY = gql`
query MyQuery($after: String, $first: Int, $offset: Int, $name: String, $search: String, $isActive: Boolean, $orderBy: String ) {
  floors(
    after: $after
    first: $first
    offset: $offset
    name: $name
    search: $search
    isActive: $isActive
    orderBy: $orderBy
  ) {
    totalCount
    edges {
      node {
        name
        id
        createdAt
        floorTables {
          totalCount
        }
        isActive
      }
    }
  }
}
`
export const FLOOR_QUERY = gql`
query MyQuery($id: ID!) {
  floor(id: $id) {
    name
    isActive
    id
  }
}
`

export const FLOOR_TABLES_QUERY = gql`
query MyQuery($first: Int, $floor: Decimal, $name: String, $offset: Int, $orderBy: String, $search: String, $isActive: Boolean, $isBooked: Boolean ) {
  floorTables(
    first: $first
    floor: $floor
    name: $name
    offset: $offset
    orderBy: $orderBy
    search: $search
    isActive: $isActive
    isBooked: $isBooked
  ) {
    totalCount
    edges {
      node {
        createdAt
        id
        name
        isActive
        isBooked
        floor {
          id
          name
        }
      }
    }
  }
} 
`

export const FLOOR_TABLE_QUERY = gql`
query MyQuery($id: ID!) {
  floorTable(id: $id) {
    id
    isActive
    name
    floor {
      id
      name
    }
  }
}
`

export const ADDRESS_QUERY = gql`
query MyQuery($id: ID, $user: ID, $addressType: String) {
  address(id: $id, user: $user, addressType: $addressType) {
    id
    user {
      id
      name
      email
      phone
    }
    street
    state
    house
    createdAt
    country
    city
    area
    address
    addressType
    default
    buildins {
      edges {
        node {
          floor
          id
          latitude
          longitude
          name
          photo
        }
      }
    }
  }
}
`

export const PAYMENT_QUERY = gql`
query MyQuery($id: ID, $order: ID) {
  payment(id: $id, order: $order) {
    amount
    createdAt
    id
    paymentMethod
    order {
      amount
      type
      status
      id
      discountApplied
      createdAt
      finalAmount
      updatedAt
      orderId
    }
    remarks
    status
    trxId
  }
}
  
  `
export const PAYMENTS_QUERY = gql`
query MyQuery($order: ID, $amount: Decimal, $trxId: String, $first: Int, $createdAt: DateTime, $orderBy: String, $status: ProductPaymentStatusChoices, $paymentMethod: ProductPaymentPaymentMethodChoices, $offset: Int, $search: String = "") {
  payments(
    order: $order
    amount: $amount
    trxId: $trxId
    first: $first
    createdAt: $createdAt
    orderBy: $orderBy
    status: $status
    paymentMethod: $paymentMethod
    offset: $offset
    search: $search
  ) {
    totalCount
    edges {
      node {
        amount
        createdAt
        id
        paymentMethod
        remarks
        status
        trxId
        updatedAt
        order {
          id
          status
          user {
            id
            email
            name
            phone
          }
        }
      }
    }
  }
}
`
export const ADDRESS_PAYMENT_QUERY = gql`
query PAYMENT_QUERY($user:ID, $orderId:ID!){
   address( user: $user) {
    id
    user {
      id
      name
      email
    }
    street
    state
    house
    createdAt
    country
    city
    area
    address
  }
    order(id: $orderId) {
    user {
      id
      name
      email
    }
    address {
      city
      state
      street
      zipCode
      id
    }
    status
    finalAmount
    type
    id
    outlet {
      email
      id
      address
      name
      phone
      manager {
        email
        id
        name
      }
    }
    items {
      totalCount
      edges {
        node {
          price
          quantity
          id
          product {
            id
            images
            name
          }
        }
      }
    }
  }
}
`

export const BUILDING_QUERY = gql`
query MyQuery($id: ID , $address: ID) {
  building(id: $id, address: $address) {
    createdAt
    floor
    id
    latitude
    longitude
    name
    photo
    updatedAt
  }
}
`
export const INGREDIENTS_QUERY = gql`
    query MyQuery($product: String) {
        ingredients(product: $product) {
            totalCount
            edges {
                node {
                    id
                    price
                    quantity
                    product {
                        id
                        name
                    }
                    item {
                        id
                        name
                        safetyStock
                    }
                }
            }
        }
    }
`;