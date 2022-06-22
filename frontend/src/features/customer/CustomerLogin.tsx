import React, {FormEvent, useState} from 'react';
import axios from "axios";
import {NavigationBar} from "../homepage/NavigationBar";
import styles from './Customer.module.css';

type CustomerLoginData = {
    username: string;
    password: string;
}
export function CustomerLogin() {
    const [customerLoginData, setCustomerLoginData] = useState<CustomerLoginData>({password: "", username: ""})
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const options = {
            headers: {
                'content-type' : 'application/json'
            }
        }
        await axios.post("http://localhost:8000/login/", JSON.stringify(customerLoginData), options)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const handleInputChange = (event: FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLInputElement
        setCustomerLoginData({
            ...customerLoginData,
            [target.name]: target.value,
        })
    }
    return (
        <div>
            <NavigationBar />
            <form onSubmit={handleSubmit} className={styles.customer_form}>
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" onChange={handleInputChange}/><br/>
                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name="password" onChange={handleInputChange}/><br />
                <input type="submit" value="submit" id={styles['submit_btn']}/>
            </form>
        </div>
    );
}