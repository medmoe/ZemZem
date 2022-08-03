import React from 'react';
import detailCardStyles from "./OrderDetailCard.module.css";
import {updateShowOrderInfo} from "../user/userSlice";
import {OrderType} from "../utils/types";
import {useAppDispatch} from "../../app/hooks";

export function CustomerOrderDetailsCard({provider, quantity, isPotable, phoneNumber, specialInstructions}: OrderType) {
    const dispatch = useAppDispatch();
    return (
        <div className={detailCardStyles.container}>
            <div className={detailCardStyles.esc} onClick={() => {dispatch(updateShowOrderInfo(false))}}><h2>X</h2>
            </div>
            <h2>Provider:</h2>
            <p>First name: {provider ? provider.first_name : "N/A"}</p>
            <p>Last name: {provider ? provider.last_name : "N/A"}</p>
            <p>Phone number: {provider ? provider.phone_number : "N/A"}</p>
            <hr/>
            <h2>Order:</h2>
            <p>Quantity: {quantity}</p>
            <p>Potable: {isPotable ? "YES" : "NO"}</p>
            <p>Phone number: {phoneNumber}</p>
            <p>Special instructions: {specialInstructions}</p>
        </div>
    );
}