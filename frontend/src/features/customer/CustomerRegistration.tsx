import React, {FormEvent, useEffect, useState} from 'react';
import axios from "axios";
import styles from './Customer.module.css';
import {Banner} from "./Banner";
import {RegistrationForm} from "./RegistrationForm";
import {updateIsAuthenticated, updateUsername} from "./customerSlice";
import {useAppDispatch} from "../../app/hooks";
import {useNavigate} from "react-router-dom";

interface CustomerData {
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    password: string,
    pass2?: string,
}

export function CustomerRegistration() {
    let initialState: CustomerData = {
        "first_name": "",
        "last_name": "",
        "email": "",
        "username": "",
        "password": "",
        "pass2": "",
    }
    const [customerData, setCustomerData] = useState(initialState);
    const [customerCreated, setCustomerCreated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        const call = async () => {
            await axios.get('http://localhost:8000/home/', {withCredentials: true})
                .then((res) => {
                    dispatch(updateIsAuthenticated(true));
                    dispatch(updateUsername(res.data.username));
                    navigate('/');
                })
                .catch((err) => {
                    console.log(err.response.data.Message);
                })
        }
        call();
    })
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!customerData.first_name || !customerData.last_name || !customerData.email || !customerData.username || !customerData.password) {
            setErrorMessage("Please fill all the fields!");
            return;
        }
        if (customerData.password !== customerData.pass2) {
            setErrorMessage("password didn't match");
            return;
        }
        let options = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        delete customerData.pass2;
        await axios.post("http://localhost:8000/signup/", JSON.stringify(customerData), options).then((res) => {
            setCustomerCreated(true);
        }).catch((err) => {
            if (err.response.status === 409) {
                setErrorMessage(err.response.data.Message)
            }
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
    if (!customerCreated) {
        if (!errorMessage) {
            return (
                <RegistrationForm handleSubmit={handleSubmit} handleChange={handleChange}/>
            );
        } else {
            return (
                <>
                    <RegistrationForm handleSubmit={handleSubmit} handleChange={handleChange}/>
                    <h1 className={styles.error_message}>{errorMessage}</h1>
                </>
            )
        }
    } else {
        return <Banner message="Please check your mailbox to activate your account!"/>;
    }
}