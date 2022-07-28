import React, {FormEvent, useEffect, useState} from 'react'
import axios from "axios";
import '../../App.css'
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectCustomerInfo, selectShowOrderForm, updateShowOrderForm} from "../customer/customerSlice";
import styles from './OrderForm.module.css';
import {selectLatitude, selectLongitude} from "../homepage/homeSlice";

import {OrderType, CustomerType} from "../utils/types";

let socket: WebSocket;

export function OrderForm() {
    const customerInfo = useAppSelector(selectCustomerInfo);
    const [orderFormData, setOrderFormData] = useState<OrderType>({
        phoneNumber: "N/A",
        quantity: 100,
        isPotable: true,
        location: "N/A",
        hasLocation: false,
        specialInstructions: "N/A",
        customer: customerInfo,
    })
    const latitude = useAppSelector(selectLatitude);
    const longitude = useAppSelector(selectLongitude);
    const showOrderForm = useAppSelector(selectShowOrderForm);
    const dispatch = useAppDispatch();
    useEffect(() => {
        socket = new WebSocket("ws://localhost:8000/ws/notify-providers/")
    }, [])

    const submitOrderForm = async (event: FormEvent) => {
        event.preventDefault();
        let location: string = latitude && longitude ? `${latitude.toString()},${longitude.toString()}` : "N/A";

        // Broadcast the order
        socket.send(JSON.stringify({...orderFormData, location:location}));
        const options = {
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true,
        }

        // set the order in the database
        await axios.post("http://localhost:8000/order/", JSON.stringify({...orderFormData, location:location, status: "READY"}), options)
            .then((res) => {
                dispatch(updateShowOrderForm(false));
            })
            .catch((err) => {
                console.log("failed");
            })
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

    return (
        <div>
            {showOrderForm ?
                <form className="zem-forms">
                    <label htmlFor="phoneNumber">Phone number:</label>
                    <input type="text" id="phoneNumber" name="phoneNumber" onChange={handleFieldChange}/>
                    <label htmlFor="quantity">Quantity (L):</label>
                    <input type="number" id="quantity" name="quantity" value={orderFormData.quantity} onChange={handleFieldChange}/>
                    <fieldset>
                        <label><input type="radio" onChange={changePotable}
                                      checked={orderFormData.isPotable} name="isPotable"/><span>Potable</span></label>
                        <label><input type="radio" onChange={changeNonPotable}
                                      checked={!orderFormData.isPotable}
                                      name="isPotable"/><span>Non-Potable</span></label>
                    </fieldset>
                    <label htmlFor="specialInstruction">Special instructions:</label>
                    <textarea id="specialInstruction" name="specialInstructions" rows={10}
                              onChange={handleFieldChange}/>
                    <input type="submit" value="submit" id="submit_btn" onClick={submitOrderForm}/>
                </form>
                :
                <div className={styles.loader_container}>
                    <div className={styles.loader}></div>
                    <p>Connecting you to a provider!!!</p>
                </div>

            }
        </div>
    )
}