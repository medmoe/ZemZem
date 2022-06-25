import React from "react";
import {Link} from 'react-router-dom';
import logo from './../../assets/ZemZem.png';
import styles from './NavigationBar.module.css';

type IProps = {
    username: string
}

export function NavigationBar (props:IProps) {
    if(!props.username) {
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
                        <li>Welcome, {props.username} !</li>
                        <li>Logout</li>
                    </ul>
                </nav>
            </div>
        );
    }
}