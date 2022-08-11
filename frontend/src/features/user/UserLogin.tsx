import React, {FormEvent, useEffect, useState} from 'react';
import axios from "axios";
import {LoginForm} from "./LoginForm";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../app/hooks";
import {updateIsAuthenticated, updateUsername, updateIsCustomer, updateUserInfo} from "./userSlice";
import styles from "./User.module.css";
import {updateHasLocation, updateLatitude, updateLongitude} from "../homepage/homeSlice";

interface CustomerLoginData {
    username: string;
    password: string;
    isCustomer: boolean;
}

let location: [boolean, number, number] = [false, 0, 0];

export function getLocation(arr: [boolean, number, number]) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            arr[0] = true;
            arr[1] = position.coords.latitude;
            arr[2] = position.coords.longitude;
        }, () => {
            console.log("cannot get geolocation!");
        });
    } else {
        console.log("browser does not support geolocation!");
    }
}

export function UserLogin() {
    const [customerLoginData, setCustomerLoginData] = useState<CustomerLoginData>({
        password: "",
        username: "",
        isCustomer: true
    })
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    useEffect(() => {
        const call = async () => {
            await axios.get('http://localhost:8000/home/', {withCredentials: true})
                .then((res) => {
                    dispatch(updateIsAuthenticated(true));
                    dispatch(updateIsCustomer(customerLoginData.isCustomer))
                    dispatch(updateUsername(res.data.username));
                    dispatch(updateUserInfo({
                        id: res.data.id,
                        first_name: res.data.first_name,
                        last_name: res.data.last_name,
                        phone_number: res.data.phone_number,
                        rank: res.data.rank,
                    }))
                    navigate('/');
                })
                .catch((err) => {
                    const {username, password, message} = err.response.data;
                    !username && !password ? console.log("Do Nothing!") : setErrorMessage(message);
                })
        }
        call();
        getLocation(location);
        dispatch(updateHasLocation(location[0]))
        dispatch(updateLongitude(location[1]))
        dispatch(updateLatitude(location[2]))
    }, [errorMessage])
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const options = {
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true,
        }
        await axios.post("http://localhost:8000/login/", JSON.stringify(customerLoginData), options)
            .then((res) => {
                dispatch(updateUsername(res.data.username));
                dispatch(updateIsCustomer(res.data.isCustomer));
                dispatch(updateIsAuthenticated(true));
                dispatch(updateUserInfo({
                    id: res.data.id,
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                    phone_number: res.data.phone_number,
                    rank: res.data.rank,
                }))
                getLocation(location);
                dispatch(updateHasLocation(location[0]))
                dispatch(updateLongitude(location[1]))
                dispatch(updateLatitude(location[2]))
                navigate('/');
            })
            .catch((err) => {
                setErrorMessage(err.response.data.Message);
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
    const handleProviderChange = (event: FormEvent) => {
        setCustomerLoginData({
            ...customerLoginData, isCustomer: false
        })
    }
    const handleCustomerChange = (event: FormEvent) => {
        setCustomerLoginData({
            ...customerLoginData, isCustomer: true
        })
    }
    if (!errorMessage) {
        return (
            <LoginForm
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
                isCustomer={customerLoginData.isCustomer}
                handleCustomerChange={handleCustomerChange}
                handleProviderChange={handleProviderChange}
            />
        );
    } else {
        return (
            <>
                <LoginForm
                    handleSubmit={handleSubmit}
                    handleInputChange={handleInputChange}
                    isCustomer={customerLoginData.isCustomer}
                    handleCustomerChange={handleCustomerChange}
                    handleProviderChange={handleProviderChange}
                />
                <h1 className={styles.error_message} id="error-message">{errorMessage}</h1>
            </>
        )
    }
}