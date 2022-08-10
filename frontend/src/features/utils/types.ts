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
    customer?: UserType,
    deliveredAt?: string,
    id?: number,
    provider?: UserType,
    status?: string,
}

export interface SatisfactionFormDataType {
    stars: number,
    isDelivered: boolean,
    comment: string,
    order_id?: number,
}

