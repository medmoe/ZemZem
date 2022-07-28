import React from 'react'
import './../../App.css'
import styles from './OrderDetailCard.module.css'
import {OrderType} from "../utils/types";
import {useAppSelector} from "../../app/hooks";
import {selectLatitude, selectLongitude} from "../homepage/homeSlice";
import {getDistance} from "../homepage/NavigationBar";

export function OrderDetailCard ({phoneNumber, quantity, isPotable, specialInstructions, location, hasLocation, customer}:OrderType) {
    const latitude = useAppSelector(selectLatitude);
    const longitude = useAppSelector(selectLongitude);
    const [lat, long] = location.split(",");

    return (
        <div className={styles.container}>
            <h1>Details</h1>
            <h2>Customer information</h2>
            <p><span>First name:</span> {customer?.first_name}</p>
            <p><span>Last name:</span> {customer?.last_name}</p>
            <p><span>Phone number:</span>{phoneNumber}</p>
            <hr/>
            <h2>Order information</h2>
            <p><span>Quantity:</span>{quantity}</p>
            <p><span>Distance:</span>{getDistance(latitude, parseFloat(lat), longitude, parseFloat(long)).toFixed(2)} Km</p>
            <p><span>Special instructions:</span>{specialInstructions}</p>
            <p><span>Potable:</span>{isPotable?"Yes": "No"}</p>
            <button>Accept</button>
        </div>
    )
}