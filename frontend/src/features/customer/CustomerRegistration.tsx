import React, {FormEvent, useState} from 'react';
import axios from "axios";
import {NavigationBar} from "../homepage/NavigationBar";
import styles from './Customer.module.css';

interface CustomerData {
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    password: string,
    pass2?: string,
}
export function CustomerRegistration () {
    let initialState: CustomerData = {
        "first_name": "",
        "last_name": "",
        "email": "",
        "username": "",
        "password": "",
        "pass2": "",
    }
    const [customerData, setCustomerData] = useState(initialState);
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!customerData.first_name || !customerData.last_name || !customerData.email || !customerData.username || !customerData.password) {
            console.log("Please fill all the fields");
            return;
        }
        if (customerData.password !== customerData.pass2) {
            console.log("Password did not match");
            return;
        }
        let options = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        delete customerData.pass2;
        await axios.post("http://localhost:8000/signup/", JSON.stringify(customerData), options).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }
    const handleChange = (event: FormEvent) => {
        const target = event.target as HTMLInputElement;
        setCustomerData({
            ...customerData,
            [target.name]: target.value,
        })
        event.preventDefault();
    }
    return (
        <div>
            <NavigationBar />
            <form onSubmit={handleSubmit} className={styles.customer_form}>
                <label htmlFor="first_name">First name: </label>
                <input type="text" id="first_name" name="first_name" onChange={handleChange}/>
                <label htmlFor="last_name">Last name: </label>
                <input type="text" id="last_name" name="last_name" onChange={handleChange}/>
                <label htmlFor="email">Email: </label>
                <input type="email" id="email" name="email" onChange={handleChange}/>
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" onChange={handleChange}/>
                <label htmlFor="pass1">Password:</label>
                <input type="password" id="pass1" name="password" onChange={handleChange}/>
                <label htmlFor="pass2">Renter password</label>
                <input type="password" id="pass2" name="pass2" onChange={handleChange}/>
                <input type="submit" value="submit" id={styles['submit_btn']}/>
            </form>
        </div>
    );
}