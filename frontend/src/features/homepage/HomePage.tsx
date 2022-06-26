import React, {useEffect} from 'react'
import {NavigationBar} from "./NavigationBar";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectIsAuthenticated, selectUsername, updateIsAuthenticated, updateUsername} from "../customer/customerSlice";
import axios from "axios";

export function HomePage() {

    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const username = useAppSelector(selectUsername);
    useEffect(() => {
        const authenticate = async () => {
            await axios.get('http://localhost:8000/home/', {withCredentials: true})
                .then((res) => {
                    dispatch(updateIsAuthenticated(true));
                    dispatch(updateUsername(res.data.username));
                })
                .catch((err) => {
                    console.log(err.response.data.Message);
                })
        }
        authenticate();
    })
    return (
        <>
            <div>
                <NavigationBar username={username} isAuthenticated={isAuthenticated}/>
            </div>
        </>

    )
}
