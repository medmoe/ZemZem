export interface CustomerType {
    first_name: string,
    last_name: string,
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
    customer?: CustomerType,
    deliveredAt?: string,
    id?: number,
    provider?: number,
    status?: string,
}

