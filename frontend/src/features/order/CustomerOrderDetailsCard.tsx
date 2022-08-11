import React from 'react';
import detailCardStyles from "./OrderDetailCard.module.css";
import {updateShowOrderInfo} from "../user/userSlice";
import {OrderType, UserType} from "../utils/types";
import {useAppDispatch} from "../../app/hooks";
import styles from "./OrderDetailCard.module.css";
import profileImage from "../../assets/profile_img.svg";

interface Proptypes {
    sendFeedback: (event: React.MouseEvent) => void;
    order: OrderType;
}

export function CustomerOrderDetailsCard({sendFeedback, order}: Proptypes) {
    const dispatch = useAppDispatch();
    const rank = order.provider?.rank as string
    const [stars, voters] = rank.split(":")
    const provider = order.provider as UserType

    return (
        <div className={detailCardStyles.container}>
            <div className={detailCardStyles.esc} onClick={() => {dispatch(updateShowOrderInfo(false))}}><h2>X</h2>
            </div>
            <h2>Provider:</h2>
            <div id={styles['profile_img']}>
                <img src={profileImage} alt="profile-picture"/>
            </div>
            <p>First name: {provider.first_name}</p>
            <p>Last name: {provider.last_name}</p>
            <p>Phone number: {provider.phone_number}</p>
            <p>Rating: {parseInt(stars)/parseInt(voters)}★</p>
            <hr/>
            <h2>Order:</h2>
            <p>Quantity: {order.quantity}</p>
            <p>Potable: {order.isPotable ? "YES" : "NO"}</p>
            <p>Phone number: {order.phoneNumber}</p>
            <p>Special instructions: {order.specialInstructions}</p>
            <button onClick={sendFeedback}>Send feedback</button>
        </div>
    );
}