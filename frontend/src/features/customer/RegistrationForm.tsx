import React, {FormEvent} from 'react'
import styles from "./Customer.module.css";
import '../../App.css';
import {NavigationBar} from "../homepage/NavigationBar";

type IProps = {
    handleSubmit: (event: FormEvent) => void;
    handleChange: (event: FormEvent) => void;
}

export function RegistrationForm(props: IProps) {
    return (
        <div>
            <NavigationBar username={""} isAuthenticated={false}/>
            <form onSubmit={props.handleSubmit} className="zem-forms">
                <label htmlFor="first_name">First name: </label>
                <input type="text" id="first_name" name="first_name" onChange={props.handleChange}/>
                <label htmlFor="last_name">Last name: </label>
                <input type="text" id="last_name" name="last_name" onChange={props.handleChange}/>
                <label htmlFor="email">Email: </label>
                <input type="email" id="email" name="email" onChange={props.handleChange}/>
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" onChange={props.handleChange}/>
                <label htmlFor="pass1">Password:</label>
                <input type="password" id="pass1" name="password" onChange={props.handleChange}/>
                <label htmlFor="pass2">Renter password</label>
                <input type="password" id="pass2" name="pass2" onChange={props.handleChange}/>
                <input type="submit" value="submit" id="submit_btn"/>
            </form>
        </div>
    )
}