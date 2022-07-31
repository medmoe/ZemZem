export interface UserType {
    first_name: string,
    last_name: string,
    phone_number?: string,
    id: number,
}

export interface OrderType {
    phoneNumber: string,
    quantity: number,
    isPotable: boolean,
    location: string,
    hasLocation: boolean,
    specialInstructions: string,
    showOrder?: boolean,
    created?: string,
    user?: UserType,
    deliveredAt?: string,
    id?: number,
    provider?: number,
    status?: string,
}

