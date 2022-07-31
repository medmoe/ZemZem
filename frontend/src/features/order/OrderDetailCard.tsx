import React, {useEffect, useRef} from 'react'
import './../../App.css'
import styles from './OrderDetailCard.module.css'
import {OrderType} from "../utils/types";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    selectAcceptedOrders,
    selectLatitude,
    selectLongitude, selectOrders,
    updateAcceptedOrders,
    updateShowOrderDetailsCard,
    updateOrders
} from "../homepage/homeSlice";
import {getDistance} from "../homepage/NavigationBar";
import {selectUserInfo} from "../user/userSlice";

export function OrderDetailCard ({phoneNumber, quantity, isPotable, specialInstructions, location, hasLocation, user}:OrderType) {
    const socket = useRef<WebSocket | null>(null);
    const latitude = useAppSelector(selectLatitude);
    const longitude = useAppSelector(selectLongitude);
    const [lat, long] = location.split(",");
    const acceptedOrders = useAppSelector(selectAcceptedOrders);
    const provider = useAppSelector(selectUserInfo);
    const dispatch = useAppDispatch();
    useEffect(() => {
        socket.current = new WebSocket("ws://localhost:8000/ws/notify-customers/");
        const wsCurrent = socket.current;
        return () => {
            wsCurrent?.close()
        }
    })
    const acceptOrder = () => {
        const order: OrderType = {
            phoneNumber: phoneNumber,
            quantity: quantity,
            isPotable: isPotable,
            specialInstructions: specialInstructions,
            location: location,
            user: user,
            hasLocation: hasLocation,
        }
        dispatch(updateAcceptedOrders(acceptedOrders?[...acceptedOrders, order]: [order]));
        dispatch(updateShowOrderDetailsCard(false));
        socket.current?.send(JSON.stringify({
            'customer': user,
            'provider': provider,
        }));
    }
    return (
        <div className={styles.container}>
            <h1>Details</h1>
            <h2>Customer information</h2>
            <p><span>First name:</span> {user?.first_name}</p>
            <p><span>Last name:</span> {user?.last_name}</p>
            <p><span>Phone number:</span>{phoneNumber}</p>
            <hr/>
            <h2>Order information</h2>
            <p><span>Quantity:</span>{quantity}</p>
            <p><span>Distance:</span>{getDistance(latitude, parseFloat(lat), longitude, parseFloat(long)).toFixed(2)} Km</p>
            <p><span>Special instructions:</span>{specialInstructions}</p>
            <p><span>Potable:</span>{isPotable?"Yes": "No"}</p>
            <button onClick={acceptOrder}>Accept</button>
        </div>
    )
}

/*
The provider accepts the order X
notify the owner of the order:
added the order to the queue of the provider X
update the order status in the database
remove the order from the list of orders
added the order to the queue of the user

* */