import React, {FormEvent, useEffect, useState} from 'react'
import axios from "axios";
import '../../App.css'
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectCustomerId, selectShowOrderForm, updateShowOrderForm} from "../customer/customerSlice";
import {useNavigate} from "react-router-dom";
import styles from './OrderForm.module.css';
import {selectLatitude, selectLongitude} from "./homeSlice";

interface OrderForm {
    phoneNumber: string,
    quantity: number,
    isPotable: boolean,
    specialInstructions?: string,
    latitude?: number,
    longitude?: number,
}

interface Order {
    customer: number | undefined;
    phoneNumber: string,
    quantity: string,
    isPotable: boolean,
    specialInstructions?: string,
    location: string,
    status: string,

}

const initialState = {
    phoneNumber: "",
    quantity: 0,
    isPotable: true,
}

let socket: WebSocket;
let orderToSend: Order;

export function OrderForm() {
    const id = useAppSelector(selectCustomerId);
    const [orderFormData, setOrderFormData] = useState<OrderForm>(initialState)
    const navigate = useNavigate();
    const latitude = useAppSelector(selectLatitude);
    const longitude = useAppSelector(selectLongitude);
    const showOrderForm = useAppSelector(selectShowOrderForm);
    const dispatch = useAppDispatch();
    useEffect(() => {
        socket = new WebSocket("ws://localhost:8000/ws/notify-providers/")
    }, [])

    const submitOrderForm = async (event: FormEvent) => {
        event.preventDefault();
        socket.send(JSON.stringify({...orderFormData, latitude: latitude, longitude: longitude}));
        const options = {
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true,
        }
        let location: string = latitude && longitude ? `${latitude.toString()},${longitude.toString()}` : "N/A";
        orderToSend = {
            customer: id,
            phoneNumber: orderFormData.phoneNumber,
            quantity: orderFormData.quantity.toString(),
            isPotable: orderFormData.isPotable,
            specialInstructions: orderFormData.specialInstructions,
            location: location,
            status: 'READY',
        }
        await axios.post("http://localhost:8000/order/", JSON.stringify(orderToSend), options)
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
                    <input type="number" id="quantity" name="quantity" onChange={handleFieldChange}/>
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