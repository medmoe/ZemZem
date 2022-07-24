import React from "react";
import {Link} from 'react-router-dom';
import logo from './../../assets/ZemZem.png';
import styles from './NavigationBar.module.css';
import notifications from './../../assets/notify.svg'
import {Order} from "./HomePage";

type IProps = {
    username: string,
    isAuthenticated: boolean,
    orders: Order[],
}

export function NavigationBar({username, isAuthenticated, orders}: IProps) {
    if (!isAuthenticated) {
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
    } else {
        console.log(orders);
        return (
            <div className={styles.navbar}>
                <img className={styles.logo} src={logo} alt="logo"/>
                <nav>
                    <ul className={styles.navbar_links}>
                        <li><Link to="/" onClick={() => window.location.reload()}>Home</Link></li>
                        <li>Welcome, {username} !</li>
                        <li id="logout"><Link to="/logout">Logout</Link></li>
                        <li>
                            <div id={styles['orders']}>
                                <p>Orders</p>
                                <img src={notifications} alt="notifications" id={styles["notifications"]}/>
                                <div id={styles["orders_list"]}
                                     style={orders.length <= 0 ? {visibility: "hidden"} : {visibility: "visible"}}>
                                    <p>{orders ? orders.length : ""}</p></div>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}