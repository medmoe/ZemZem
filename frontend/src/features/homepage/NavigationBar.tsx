import React from "react";
import {Link} from 'react-router-dom';
import logo from './../../assets/ZemZem.png';
import styles from './NavigationBar.module.css';
export function NavigationBar () {
    return (
        <div className={styles.navbar}>
            <img className={styles.logo} src={logo} alt="somename"/>
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
}