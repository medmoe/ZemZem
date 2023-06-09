import React, {useEffect, useRef} from 'react'
import './../../App.css'
import styles from './OrderDetailCard.module.css'
import profileImage from '../../assets/profile_img.svg'
import {OrderType, UserType} from "../utils/types";
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
import axios from "axios";

export function ProviderOrderDetailsCard({
                                             phoneNumber,
                                             quantity,
                                             isPotable,
                                             specialInstructions,
                                             location,
                                             hasLocation,
                                             customer,
                                             id
                                         }: OrderType) {
    const socket = useRef<WebSocket | null>(null);
    const latitude = useAppSelector(selectLatitude);
    const longitude = useAppSelector(selectLongitude);
    const [lat, long] = location.split(",");
    const acceptedOrders = useAppSelector(selectAcceptedOrders);
    const provider = useAppSelector(selectUserInfo);
    const dispatch = useAppDispatch();
    const current_customer = customer as UserType;
    const [stars, voters] = current_customer.rank.split(":");
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
            customer: customer,
            hasLocation: hasLocation,
            provider: provider,
            id: id,
        }
        dispatch(updateAcceptedOrders(acceptedOrders ? [...acceptedOrders, order] : [order]));
        dispatch(updateShowOrderDetailsCard(false));
        socket.current?.send(JSON.stringify(order));
    }
    return (
        <div className={styles.container}>
            <h1>Details</h1>
            <h2>Customer information</h2>
            <div id={styles['profile_img']}>
                <img src={profileImage} alt="profile-picture"/>
            </div>
            <p><span>First name:</span> {customer?.first_name}</p>
            <p><span>Last name:</span> {customer?.last_name}</p>
            <p><span>Phone number:</span>{phoneNumber}</p>
            <p>Rating: {parseInt(stars)/parseInt(voters)}★</p>
            <hr/>
            <h2>Order information</h2>
            <p><span>Quantity:</span>{quantity}</p>
            <p><span>Distance:</span>{getDistance(latitude, parseFloat(lat), longitude, parseFloat(long)).toFixed(2)} Km
            </p>
            <p><span>Special instructions:</span>{specialInstructions}</p>
            <p><span>Potable:</span>{isPotable ? "Yes" : "No"}</p>
            <button onClick={acceptOrder}>Accept</button>
        </div>
    )
}