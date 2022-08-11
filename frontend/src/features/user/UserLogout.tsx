import React, {useEffect} from 'react'
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {updateIsAuthenticated, selectIsCustomer, selectUsername, updateShowLoader} from "./userSlice";
import {updateOrders, updateShowOrderDetailsCard} from "../homepage/homeSlice";

export function UserLogout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const options = {
        headers: {
            'content-type': 'application/json'
        },
        withCredentials: true,
    }
    const data = {
        'username': useAppSelector(selectUsername),
        'isCustomer': useAppSelector(selectIsCustomer),
    }
    useEffect(() => {
        const call = async () => {
            await axios.post('http://localhost:8000/logout/', JSON.stringify(data), options)
                .then((res) => {
                    dispatch(updateIsAuthenticated(false));
                    dispatch(updateOrders([]));
                    dispatch(updateShowLoader(false));
                    dispatch(updateShowOrderDetailsCard(false));

                    navigate('/');
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        call();
    })
    return (
        <>
        </>
    )
}