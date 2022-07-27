import React, {CSSProperties, useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import logo from './../../assets/ZemZem.png';
import styles from './NavigationBar.module.css';
import notifications from './../../assets/notify.svg'
import orders_ico from './../../assets/orders.svg';
import {Order} from "./HomePage";
import {useAppSelector} from "../../app/hooks";
import {selectIsCustomer} from "../customer/customerSlice";
import {selectLatitude, selectLongitude} from "./homeSlice";
import {OrderComponent} from "./OrderComponent";

type IProps = {
    username: string,
    isAuthenticated: boolean,
    orders: Order[],
}

function getDistance(lat1:number | undefined, lat2:number | undefined, lon1:number | undefined, lon2:number | undefined) {
    if (!lat1 || !lat2 || !lon1 || !lon2){
        return 0;
    }
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;

    // Haversine formula
    let dlon: number = lon2 - lon1;
    let dlat: number = lat2 - lat1;
    let a: number = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    let c: number = 2 * Math.asin(Math.sqrt(a));
    const rad = 6371; // radius of earth
    return c * rad;
}

export function NavigationBar({username, isAuthenticated, orders}: IProps) {
    const isCustomer = useAppSelector(selectIsCustomer);
    const latitude = useAppSelector(selectLatitude);
    const longitude = useAppSelector(selectLongitude);
    const [visibility, setVisibility] = useState<CSSProperties>({visibility: 'hidden'})
    const updateVisibility = () => {
        setVisibility(visibility.visibility === "hidden"? {visibility: "visible"} : {visibility: "hidden"});
    }
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
        return (
            <div className={styles.navbar}>
                <img className={styles.logo} src={logo} alt="logo"/>
                <nav>
                    <ul className={styles.navbar_links}>
                        <li><Link to="/" onClick={() => window.location.reload()}>Home</Link></li>
                        <li>Welcome, {username} !</li>
                        <li id="logout"><Link to="/logout">Logout</Link></li>
                        {!isCustomer ?
                            <li onClick={updateVisibility}>
                                <div id={styles['orders']}>
                                    <p>Orders</p>
                                    <img src={notifications} alt="notifications" id={styles["notifications"]}/>
                                    <div id={styles["orders_list"]}
                                         style={orders.length <= 0 ? {visibility: "hidden"} : {visibility: "visible"}}>
                                        <p>{orders ? orders.length : ""}</p></div>
                                </div>
                                <div className={styles.dropDownContainer} style={visibility}>
                                    {orders.map((order, id) => {
                                        return <OrderComponent key={id} distance={getDistance(latitude, order.latitude, longitude, order.longitude).toFixed(2)} />
                                    })}
                                </div>
                            </li>
                            :
                            <li>
                                <div id={styles['orders']}>
                                    <p>Orders</p>
                                    <img src={orders_ico} alt="orders" id={styles["notifications"]}/>
                                </div>
                            </li>
                        }
                    </ul>
                </nav>
            </div>
        );
    }
}