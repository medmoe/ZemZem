import React, {FormEvent, useEffect, useRef, useState} from 'react'
import '../../App.css'
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    selectUserInfo,
    selectShowOrderForm,
    updateShowOrderForm,
    selectShowLoader,
    selectShowOrderInfo,
    updateShowLoader,
    updateShowOrderInfo,
    updateOrders, selectOrders
} from "../user/userSlice";
import styles from './OrderForm.module.css';
import detailCardStyles from './OrderDetailCard.module.css'
import {
    selectLatitude,
    selectLongitude, selectSatisfactionFormData,
    selectShowSatisfactionForm, updateSatisfactionFormData,
    updateShowSatisfactionForm
} from "../homepage/homeSlice";
import {OrderType, UserType} from "../utils/types";
import {CustomerOrderDetailsCard} from "./CustomerOrderDetailsCard";
import {SatisfactionForm} from "../user/SatisfactionForm";
import axios from "axios";

export function OrderForm() {
    const [orderToShow, setOrderToShow] = useState<OrderType | null>(null);
    const userInfo = useAppSelector(selectUserInfo);
    const [orderFormData, setOrderFormData] = useState<OrderType>({
        phoneNumber: "N/A",
        quantity: 100,
        isPotable: true,
        location: "N/A",
        hasLocation: false,
        specialInstructions: "N/A",
        customer: userInfo,
    })
    const latitude = useAppSelector(selectLatitude);
    const longitude = useAppSelector(selectLongitude);
    const showOrderForm = useAppSelector(selectShowOrderForm);
    const showLoader = useAppSelector(selectShowLoader);
    const showProviderInfo = useAppSelector(selectShowOrderInfo);
    const orders = useAppSelector(selectOrders);
    const dispatch = useAppDispatch();
    const socketToProvider = useRef<WebSocket | null>(null)
    const socketFromProvider = useRef<WebSocket | null>(null)
    const user = useAppSelector(selectUserInfo);
    const showOrderInfo = useAppSelector(selectShowOrderInfo);
    const showSatisfactionForm = useAppSelector(selectShowSatisfactionForm);
    const satisfactionFormData = useAppSelector(selectSatisfactionFormData);

    useEffect(() => {
        socketToProvider.current = new WebSocket("ws://localhost:8000/ws/notify-providers/")
        socketFromProvider.current = new WebSocket("ws://localhost:8000/ws/notify-customers/")
        socketFromProvider.current?.addEventListener('message', (event) => {
            // remove the spinner if this is the right user
            const response = JSON.parse(event.data);
            if (user && response.data.customer.id === user.id) {
                dispatch(updateShowLoader(false));
                dispatch(updateOrders([...orders, response.data]))
            }
        })
        const currentSocketToProvider = socketToProvider.current;
        const currentSocketFromProvider = socketFromProvider.current;

        return () => {
            currentSocketFromProvider?.close();
            currentSocketToProvider?.close();
        }
    }, [orders])

    const submitOrderForm = async (event: FormEvent) => {
        event.preventDefault();
        let location: string = latitude && longitude ? `${latitude.toString()},${longitude.toString()}` : "N/A";
        dispatch(updateShowLoader(true));
        // Broadcast the order
        socketToProvider.current?.send(JSON.stringify({...orderFormData, location: location}));
        dispatch(updateShowOrderForm(false));
    }
    const handleFieldChange = (event: FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLInputElement
        setOrderFormData({
            ...orderFormData,
            [target.name]: target.value,
        })
    }
    const changePotable = (event: FormEvent) => {
        setOrderFormData({...orderFormData, isPotable: true,})
    }
    const changeNonPotable = (event: FormEvent) => {
        setOrderFormData({...orderFormData, isPotable: false,})
    }
    const showOrderDetails = (event: React.MouseEvent) => {
        const target = event.target as HTMLElement
        const index = target.getAttribute("data-key") as string
        setOrderToShow(orders[parseInt(index)])
        dispatch(updateShowOrderInfo(true))

    }
    const sendFeedback = (event: React.MouseEvent) => {
        dispatch(updateShowSatisfactionForm(true));
        dispatch(updateShowOrderInfo(false));
        dispatch(updateSatisfactionFormData({...satisfactionFormData, isCustomer: true}))
        console.log(orderToShow);
    }
    const submitFeedback = (event: FormEvent) => {
        const orderId = orderToShow?.id
        axios.put(`http://localhost:8000/order/${orderId}/`, satisfactionFormData, {withCredentials: true})
            .then((res) => {
                dispatch(updateShowSatisfactionForm(false))
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return (
        <div>
            <div className={styles.container}>
                {showOrderForm &&
                    <form className="zem-forms">
                        <label htmlFor="phoneNumber">Phone number:</label>
                        <input type="text" id="phoneNumber" name="phoneNumber" onChange={handleFieldChange}/>
                        <label htmlFor="quantity">Quantity (L):</label>
                        <input type="number" id="quantity" name="quantity" value={orderFormData.quantity}
                               onChange={handleFieldChange}/>
                        <fieldset>
                            <label><input type="radio" onChange={changePotable}
                                          checked={orderFormData.isPotable}
                                          name="isPotable"/><span>Potable</span></label>
                            <label><input type="radio" onChange={changeNonPotable}
                                          checked={!orderFormData.isPotable}
                                          name="isPotable"/><span>Non-Potable</span></label>
                        </fieldset>
                        <label htmlFor="specialInstruction">Special instructions:</label>
                        <textarea id="specialInstruction" name="specialInstructions" rows={10}
                                  onChange={handleFieldChange}/>
                        <input type="submit" value="submit" id="submit_btn" onClick={submitOrderForm}/>
                    </form>
                }
                {showLoader &&
                    <div className={styles.loader_container}>
                        <div className={styles.loader}></div>
                        <p>Connecting you to a provider!!!</p>
                    </div>
                }
                {showOrderInfo && orderToShow ?
                    <CustomerOrderDetailsCard
                        sendFeedback={sendFeedback}
                        order={orderToShow}
                    />
                    :
                    orders.map((order, id) => {
                        return <div key={id} className={styles.order} onClick={showOrderDetails}>
                            <p data-key={id}>Order {id + 1}</p>
                        </div>
                    })
                }
            </div>
            {showSatisfactionForm &&
                <SatisfactionForm
                    submitFeedback={submitFeedback}
                    statement={"I received the order successfully."}
                />
            }

        </div>
    )
}