import React, {useEffect, useRef, useState} from 'react'
import {NavigationBar} from "./NavigationBar";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    selectIsAuthenticated,
    selectUsername,
    updateIsAuthenticated,
    updateUsername,
    selectIsCustomer, updateIsCustomer, selectUserInfo,
} from "../user/userSlice";
import {OrderForm} from "../order/OrderForm";
import axios from "axios";
import {OrderType, SatisfactionFormDataType, UserType} from "../utils/types";
import {ProviderOrderDetailsCard} from "../order/ProviderOrderDetailsCard";
import {
    selectAcceptedOrders,
    selectOrderId,
    selectOrders,
    selectShowOrderDetailsCard,
    updateAcceptedOrders,
    updateOrders,
    updateShowSatisfactionForm,
    selectShowSatisfactionForm, selectSatisfactionFormData, updateSatisfactionFormData,
} from "./homeSlice";
import styles from './HomePage.module.css';
import del from './../../assets/delete.png';
import star from './../../assets/star.png';
import {SatisfactionForm} from "../user/SatisfactionForm";

interface Response {
    order: OrderType,
}

export function HomePage() {
    const toProvider = useRef<WebSocket | null>(null);
    const fromProvider = useRef<WebSocket | null>(null);
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const username = useAppSelector(selectUsername);
    const isCustomer = useAppSelector(selectIsCustomer);
    const showOrderDetailsCard = useAppSelector(selectShowOrderDetailsCard);
    const orders = useAppSelector(selectOrders);
    const orderId = useAppSelector(selectOrderId);
    const acceptedOrders = useAppSelector(selectAcceptedOrders);
    const showSatisfactionForm = useAppSelector(selectShowSatisfactionForm);
    const satisfactionFormData = useAppSelector(selectSatisfactionFormData);
    const userInfo = useAppSelector(selectUserInfo) as UserType;
    useEffect(() => {
        const authenticate = async () => {
            await axios.get('http://localhost:8000/home/', {withCredentials: true})
                .then((res) => {
                    dispatch(updateIsAuthenticated(true));
                    dispatch(updateUsername(res.data.username));
                    dispatch(updateIsCustomer(res.data.is_customer));
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
            fromProvider.current = new WebSocket("ws://localhost:8000/ws/notify-customers/");
            toProvider.current = new WebSocket("ws://localhost:8000/ws/notify-providers/");
            toProvider.current?.addEventListener('message', (event) => {
                const response: Response = JSON.parse(event.data);
                dispatch(updateOrders([...orders, {...response.order, showOrder: true}]));
            })
            fromProvider.current?.addEventListener('message', (event) => {
                const res = JSON.parse(event.data);
                dispatch(updateOrders(orders.filter((order) => {
                    return order.id !== res.data.id
                })))
            })
            const toProviderCurrent = toProvider.current;
            const fromProviderCurrent = fromProvider.current;
            return () => {
                toProviderCurrent?.close();
                fromProviderCurrent?.close();
            }
        }

    }, [orders, isAuthenticated])

    const removeAcceptedOrder = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLElement
        dispatch(updateAcceptedOrders(acceptedOrders ? acceptedOrders.filter((acceptedOrder, id) => {
            return id !== +target.id;
        }) : []))
        const value: string | null = target.getAttribute("data-key");
        dispatch(updateShowSatisfactionForm(true))
        dispatch(updateSatisfactionFormData({...satisfactionFormData, order_id: value?+value:-1}))
    }
    const submitFeedback = (event: React.FormEvent) => {
        dispatch(updateShowSatisfactionForm(false))
        axios.put(`http://localhost:8000/provider/${userInfo.id}/`, satisfactionFormData, {withCredentials: true})
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    return (
        <div>
            <div>
                <NavigationBar username={username} isAuthenticated={isAuthenticated} orders={orders}/>
            </div>
            {isAuthenticated && isCustomer && <OrderForm/>}

            {!isCustomer && showOrderDetailsCard && (orderId === 0 || orderId) &&
                <ProviderOrderDetailsCard phoneNumber={orders[orderId].phoneNumber}
                                          quantity={orders[orderId].quantity}
                                          isPotable={orders[orderId].isPotable}
                                          location={orders[orderId].location}
                                          hasLocation={orders[orderId].hasLocation}
                                          specialInstructions={orders[orderId].specialInstructions}
                                          customer={orders[orderId].customer}
                                          id={orders[orderId].id}/>}

            {isAuthenticated && !isCustomer && !showSatisfactionForm &&
                <div className={styles.acceptedOrders_container}>
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
                                <td>{acceptedOrder.customer?.first_name}</td>
                                <td>{acceptedOrder.customer?.last_name}</td>
                                <td>{acceptedOrder.phoneNumber}</td>
                                <td>{acceptedOrder.quantity}</td>
                                <td>{acceptedOrder.isPotable ? "YES" : "NO"}</td>
                                <td>"N/A"</td>
                                <td>{acceptedOrder.specialInstructions}</td>
                                <td id={styles['icon']}>
                                    <img src={del}
                                         alt="delete"
                                         id={id + ""}
                                         onClick={removeAcceptedOrder}
                                         data-key={acceptedOrder.id + ""}
                                    />
                                </td>

                            </tr>
                        })}
                        </tbody>

                    </table>
                </div>}
            {isAuthenticated && !isCustomer && showSatisfactionForm && <SatisfactionForm submitFeedback={submitFeedback}/>}
        </div>

    );
}
