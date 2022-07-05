import React, {FormEvent} from 'react'
import { NavigationBar } from "../homepage/NavigationBar";
import styles from "./Customer.module.css";

type LoginFormProps = {
    isCustomer: boolean;
    handleCustomerChange: (event: FormEvent) => void;
    handleProviderChange: (event: FormEvent) => void;
    handleSubmit: (event: FormEvent) => void;
    handleInputChange: (event: FormEvent) => void;
}

export function LoginForm({isCustomer, handleCustomerChange, handleProviderChange, handleSubmit, handleInputChange}: LoginFormProps) {
    return (
        <div>
            <NavigationBar username={""} isAuthenticated={false}/>
            <form onSubmit={handleSubmit} className={styles.customer_form}>
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" onChange={handleInputChange}/><br/>
                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name="password" onChange={handleInputChange}/><br/>
                <fieldset>
                    <label>
                        <input type="radio" id="provider" name="provider" value="provider" checked={!isCustomer} onChange={handleProviderChange}/>
                        <span>Provider</span>
                    </label>
                    <label >
                        <input type="radio" id="customer" name="customer" value="customer" checked={isCustomer} onChange={handleCustomerChange}/>
                        <span>Customer</span>
                    </label>
                </fieldset>
                <input type="submit" value="submit" id={styles['submit_btn']}/>

            </form>
        </div>
    );
}