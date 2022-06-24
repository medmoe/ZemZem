import React from "react";
import {Link} from 'react-router-dom';
import logo from './../../assets/ZemZem.png';
import {useAppSelector} from "../../app/hooks";
import { selectToken, selectUsername } from "../customer/customerSlice";
import styles from './NavigationBar.module.css';
export function NavigationBar () {
    const token = useAppSelector(selectToken);
    const username = useAppSelector(selectUsername);
    if(!token) {
        return (
            <div className={styles.navbar}>
                <img className={styles.logo} src={logo} alt="logo"/>
                <nav>
                    <ul className={styles.navbar_links}>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/signup">signup</Link>
                        </li>
                        <li>
                            <Link to="/login">login</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }else{
        return (
            <div className={styles.navbar}>
                <img className={styles.logo} src={logo} alt="logo"/>
                <nav>
                    <ul className={styles.navbar_links}>
                        <li><Link to="/">Home</Link></li>
                        <li>Welcome, {username} !</li>
                        <li>Logout</li>
                    </ul>
                </nav>
            </div>
        );
    }
}