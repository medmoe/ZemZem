import React, {FormEvent} from 'react'
import {NavigationBar} from "../homepage/NavigationBar";
import styles from "./Customer.module.css";

type IProps = {
    handleSubmit: (event: FormEvent) => void;
    handleInputChange: (event: FormEvent) => void;
}

export function LoginForm(props:IProps) {
    return (
        <div>
            <NavigationBar />
            <form onSubmit={props.handleSubmit} className={styles.customer_form}>
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" onChange={props.handleInputChange}/><br/>
                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name="password" onChange={props.handleInputChange}/><br />
                <input type="submit" value="submit" id={styles['submit_btn']}/>
            </form>
        </div>
    )
}