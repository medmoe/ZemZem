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
import {OrderForm} from "../order/OrderForm";
import axios from "axios";
import {OrderType} from "../utils/types";
import {OrderDetailCard} from "../order/OrderDetailCard";
import {selectShowOrderDetailsCard} from "./homeSlice";

let socket: WebSocket;

interface Response {
    order: OrderType,
}
export function HomePage() {

    const [orders, setOrders] = useState<OrderType[]>([])
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const username = useAppSelector(selectUsername);
    const isCustomer = useAppSelector(selectIsCustomer);
    const showOrderDetailsCard = useAppSelector(selectShowOrderDetailsCard);
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
    },[orders])
    useEffect(() => {
        if (isAuthenticated && !isCustomer){
            socket = new WebSocket("ws://localhost:8000/ws/notify-providers/")
            socket.addEventListener('message', (event) => {
                const response: Response = JSON.parse(event.data);
                setOrders([...orders,{
                    ...response.order,
                    showOrder: true,
                }])
            })
            const receivedOrders = async () => {
                await axios.get('http://localhost:8000/order/', {withCredentials: true})
                    .then((res) => {
                        setOrders([...orders, ...res.data])
                    })
                    .catch((err) => {
                        console.log(err);
                    })

            }
            receivedOrders();
        }
    }, [isAuthenticated])
    return (
        <div>
            <div>
                <NavigationBar username={username} isAuthenticated={isAuthenticated} orders={orders}/>
            </div>
            {isAuthenticated && isCustomer && <OrderForm/>}
            {!isCustomer && showOrderDetailsCard && <OrderDetailCard />}


        </div>

    )
}
