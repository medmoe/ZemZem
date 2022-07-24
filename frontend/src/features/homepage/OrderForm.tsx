import React, {FormEvent, useEffect, useState} from 'react'
import axios from "axios";
import '../../App.css'

interface OrderForm {
    phoneNumber: string,
    quantity: number,
    isPotable: boolean,
    specialInstruction?: string,
    latitude?: number,
    longitude?: number,
    hasLocation?: boolean,
}

const initialState = {
    phoneNumber: "",
    quantity: 0,
    isPotable: true,
}

let socket:WebSocket;

export function OrderForm() {
    const [orderFormData, setOrderFormData] = useState<OrderForm>(initialState)
    useEffect(() => {
        socket = new WebSocket("ws://localhost:8000/ws/notify-providers/")
    },[])
    if (!navigator.geolocation) {
        setOrderFormData({
            ...orderFormData,
            hasLocation: false,
        })
    } else {
        navigator.geolocation.getCurrentPosition((position) => {
            setOrderFormData({
                ...orderFormData,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                hasLocation: true,
            })
        }, () => {
            setOrderFormData({
                ...orderFormData,
                hasLocation: false,
            })
        });
    }
    const submitOrderForm = async (event: FormEvent) => {
        event.preventDefault();
        socket.send(JSON.stringify(orderFormData));
        const options = {
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true,
        }
        await axios.post("http://localhost:8000/order/", JSON.stringify(orderFormData), options)
            .then((res) => {
                console.log("success");
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
            <form className="zem-forms">
                <label htmlFor="phoneNumber">Phone number:</label>
                <input type="text" id="phoneNumber" name="phoneNumber" onChange={handleFieldChange}/>
                <label htmlFor="quantity">Quantity (L):</label>
                <input type="number" id="quantity" name="quantity" onChange={handleFieldChange}/>
                <fieldset>
                    <label><input type="radio" onChange={changePotable}
                                  checked={orderFormData.isPotable} name="isPotable"/><span>Potable</span></label>
                    <label><input type="radio" onChange={changeNonPotable}
                                  checked={!orderFormData.isPotable} name="isPotable"/><span>Non-Potable</span></label>
                </fieldset>
                <label htmlFor="specialInstruction">Special instructions:</label>
                <textarea id="specialInstruction" name="specialInstruction" rows={10}
                          onChange={handleFieldChange}/>
                <input type="submit" value="submit" id="submit_btn" onClick={submitOrderForm}/>
            </form>
        </div>
    )
}