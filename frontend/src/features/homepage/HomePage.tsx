import React, {useEffect} from 'react'
import {NavigationBar} from "./NavigationBar";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {updateUsername, selectUsername} from "../customer/customerSlice";
import axios from "axios";

export function HomePage() {
    const dispatch = useAppDispatch();
    const username = useAppSelector(selectUsername);
    useEffect(()=>{
        const call = async () => {
            await axios.get('http://localhost:8000/home/', {withCredentials: true})
                .then((res) => {
                    dispatch(updateUsername(res.data.username));
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        call();
    },[])
    return(
        <div>
            <NavigationBar username={username} />
        </div>
)
}
