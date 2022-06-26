import React, {useEffect} from 'react'
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../app/hooks";
import {updateIsAuthenticated} from "./customerSlice";

export function CustomerLogout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    useEffect(() => {
        const call = async () => {
            await axios.get('http://localhost:8000/logout/', {withCredentials: true})
                .then((res) => {
                    dispatch(updateIsAuthenticated(false));
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