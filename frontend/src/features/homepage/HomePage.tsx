import React, {useEffect, useRef, useState} from 'react'
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
import {selectOrderId, selectOrders, selectShowOrderDetailsCard, updateOrders} from "./homeSlice";

// let socket: WebSocket;

interface Response {
    order: OrderType,
}

export function HomePage() {
    const socket = useRef<WebSocket | null>(null);
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const username = useAppSelector(selectUsername);
    const isCustomer = useAppSelector(selectIsCustomer);
    const showOrderDetailsCard = useAppSelector(selectShowOrderDetailsCard);
    const orders = useAppSelector(selectOrders);
    const orderId = useAppSelector(selectOrderId);
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
    }, []);
    useEffect(() => {
        if (isAuthenticated && !isCustomer) {
            const getOrders = async () => {
                await axios.get('http://localhost:8000/order/', {withCredentials: true})
                    .then((res) => {
                        console.log(res.data)
                        dispatch(updateOrders([...orders, ...res.data]))
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
            getOrders();
        }
    }, [isAuthenticated])
    useEffect(() => {
        if (isAuthenticated && !isCustomer) {
            socket.current = new WebSocket("ws://localhost:8000/ws/notify-providers/");
            socket.current?.addEventListener('message', (event) => {
                const response: Response = JSON.parse(event.data);
                dispatch(updateOrders([...orders, {...response.order, showOrder: true}]));
            })
            const wsCurrent = socket.current;
            return () => {
                wsCurrent?.close();
            }
        }

    }, [orders, isAuthenticated])
    return (
        <div>
            <div>
                <NavigationBar username={username} isAuthenticated={isAuthenticated} orders={orders}/>
            </div>
            {isAuthenticated && isCustomer && <OrderForm/>}

            {!isCustomer && showOrderDetailsCard && (orderId === 0 || orderId) &&
                <OrderDetailCard phoneNumber={orders[orderId].phoneNumber}
                                 quantity={orders[orderId].quantity}
                                 isPotable={orders[orderId].isPotable}
                                 location={orders[orderId].location}
                                 hasLocation={orders[orderId].hasLocation}
                                 specialInstructions={orders[orderId].specialInstructions}
                                 customer={orders[orderId].customer}/>}


        </div>

    )
}
