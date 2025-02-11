
export interface ADDRESS_TYPE {
    id: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    street?: string;
    addressType?: "HOME" | "OFFICE"
    area?: string
    house?: string,
    default?: boolean
    user?:string
}
export interface USER_TYPE {
    id: string
    name: string
    email: string
    phone?: string
    role: {
        id: string
        name: string
    }
    gender: string
    isActive: boolean
    isVerified: boolean
    address: ADDRESS_TYPE
}

export interface USERS_TYPE {
    products: USER_TYPE[];
}

export interface ROLE_TYPE {
    id: string,
    name: string
}

export interface BUILDING_TYPE {

    floor?: string,
    id?: string,
    latitude?: string,
    longitude?: string,
    name: string,
    photo?: string,
}