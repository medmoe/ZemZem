import React, {useEffect, useRef, useState} from 'react'
import {NavigationBar} from "./NavigationBar";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    selectIsAuthenticated,
    selectUsername,
    updateIsAuthenticated,
    updateUsername,
    selectIsCustomer, selectShowOrderForm
} from "../user/userSlice";
import {OrderForm} from "../order/OrderForm";
import axios from "axios";
import {OrderType} from "../utils/types";
import {OrderDetailCard} from "../order/OrderDetailCard";
import {
    selectAcceptedOrders,
    selectOrderId,
    selectOrders,
    selectShowOrderDetailsCard,
    updateAcceptedOrders,
    updateOrders
} from "./homeSlice";
import styles from './HomePage.module.css';
import del from './../../assets/delete.png'

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
    const acceptedOrders = useAppSelector(selectAcceptedOrders);
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

    const removeAcceptedOrder = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLElement
        dispatch(updateAcceptedOrders(acceptedOrders ? acceptedOrders.filter((acceptedOrder, id) => {
            return id !== +target.id;
        }) : []))
    }
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
                                 user={orders[orderId].user}/>}

            {isAuthenticated && !isCustomer && <div className={styles.acceptedOrders_container}>
                <table>
                    <thead>
                    <tr>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Phone Number</th>
                        <th>Quantity</th>
                        <th>Potable</th>
                        <th>Location</th>
                        <th>Special Instructions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {acceptedOrders?.map((acceptedOrder, id) => {
                        return <tr key={id}>
                            <td>{acceptedOrder.user?.first_name}</td>
                            <td>{acceptedOrder.user?.last_name}</td>
                            <td>{acceptedOrder.phoneNumber}</td>
                            <td>{acceptedOrder.quantity}</td>
                            <td>{acceptedOrder.isPotable ? "YES" : "NO"}</td>
                            <td>"N/A"</td>
                            <td>{acceptedOrder.specialInstructions}</td>
                            <td id={styles['icon']}><img src={del} alt="delete" id={id + ""}
                                                         onClick={removeAcceptedOrder}/></td>

                        </tr>
                    })}
                    </tbody>

                </table>
            </div>}
        </div>

    );
}
