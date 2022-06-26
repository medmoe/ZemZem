import React from "react";
import {Link} from 'react-router-dom';
import logo from './../../assets/ZemZem.png';
import styles from './NavigationBar.module.css';

type IProps = {
    username: string,
    isAuthenticated: boolean,
}

export function NavigationBar ({username, isAuthenticated}:IProps) {
    if(!isAuthenticated) {
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
                        <li><Link to="/" onClick={() => window.location.reload()}>Home</Link></li>
                        <li>Welcome, {username} !</li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </nav>
            </div>
        );
    }
}