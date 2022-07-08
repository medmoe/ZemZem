import React, {useEffect} from 'react'
import {NavigationBar} from "./NavigationBar";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    selectIsAuthenticated,
    selectUsername,
    updateIsAuthenticated,
    updateUsername,
    selectIsCustomer
} from "../customer/customerSlice";
import {OrderForm} from "./OrderForm";
import axios from "axios";

export function HomePage() {

    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const username = useAppSelector(selectUsername);
    const isCustomer = useAppSelector(selectIsCustomer);
    useEffect(() => {
        const authenticate = async () => {
            await axios.get('http://localhost:8000/home/', {withCredentials: true})
                .then((res) => {
                    dispatch(updateIsAuthenticated(true));
                    dispatch(updateUsername(res.data.username));
                })
                .catch((err) => {
                    console.log("Unauthorized");
                })
        }
        authenticate();
    })
    return (
        <div>
            <div>
                <NavigationBar username={username} isAuthenticated={isAuthenticated}/>
            </div>
            {isAuthenticated && isCustomer? <OrderForm/> : <h1>Welcome {username}</h1>}
        </div>

    )
}
