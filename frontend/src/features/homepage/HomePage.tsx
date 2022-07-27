import React, {useEffect, useState} from 'react'
import {NavigationBar} from "./NavigationBar";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    selectIsAuthenticated,
    selectUsername,
    updateIsAuthenticated,
    updateUsername,
    selectIsCustomer, selectShowOrderForm
} from "../customer/customerSlice";
import {OrderForm} from "./OrderForm";
import axios from "axios";

let socket: WebSocket;

export interface Order {
    phoneNumber: string,
    quantity: string,
    isPotable: boolean,
    latitude: number,
    longitude: number,
    hasLocation: boolean,
    specialInstruction: string,
    showOrder?: boolean,
}
interface Response {
    order: Order,
}
export function HomePage() {

    const [orders, setOrders] = useState<Order[]>([])
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const username = useAppSelector(selectUsername);
    const isCustomer = useAppSelector(selectIsCustomer);
    useEffect(() => {
        const authenticate = async () => {
            await axios.get('http://localhost:8000/home/', {withCredentials: true})
                .then((res) => {
                    dispatch(updateIsAuthenticated(true));
                    dispatch(updateUsername(res.data.username));
                })
                .catch((err) => {
                    console.log("Unauthorized");
                })
        }
        authenticate();
        if (!isCustomer) {
            socket = new WebSocket("ws://localhost:8000/ws/notify-providers/")
            socket.addEventListener('message', (event) => {
                const response: Response = JSON.parse(event.data);
                setOrders([...orders,{
                    ...response.order,
                    showOrder: true,
                }])
            })
        }
    },[orders])
    return (
        <div>
            <div>
                <NavigationBar username={username} isAuthenticated={isAuthenticated} orders={orders}/>
            </div>
            {isAuthenticated && isCustomer? <OrderForm/> : <h1>Welcome {username}</h1>}


        </div>

    )
}
