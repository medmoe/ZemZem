import React from 'react'
import {OrderType} from "../utils/types";
import styles from './OrderDetailCard.module.css'
export function OrderDetailCard () {
    return (
        <div className={styles.container}>
            <h1>Details</h1>
            <h2>Customer information</h2>
            <p><span>First name:</span> first.</p>
            <p><span>Last name:</span> last.</p>
            <p><span>Phone number:</span> 555-555-5555.</p>
            <hr/>
            <h2>Order information</h2>
            <p><span>Quantity:</span> 100.</p>
            <p><span>Distance:</span> 2Km.</p>
            <p><span>Special instructions:</span> Please meet me next to the hospital at downtown.</p>
            <p><span>Potable:</span> Yes.</p>

        </div>
    )
}