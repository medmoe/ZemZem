import React, {CSSProperties, useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import logo from './../../assets/ZemZem.png';
import styles from './NavigationBar.module.css';
import notifications from './../../assets/notify.svg'
import orders_ico from './../../assets/orders.svg';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectIsCustomer, selectShowOrderForm} from "../user/userSlice";
import {
    selectLatitude,
    selectLongitude,
    selectShowOrderDetailsCard,
    updateOrderId,
    updateShowOrderDetailsCard,
} from "./homeSlice";
import { updateShowOrderForm} from "../user/userSlice";
import {OrderComponent} from "../order/OrderComponent";
import {OrderType} from "../utils/types";

type IProps = {
    username?: string,
    isAuthenticated: boolean,
    orders: OrderType[],
}

export function getDistance(lat1: number | undefined, lat2: number | undefined, lon1: number | undefined, lon2: number | undefined) {
    if (!lat1 || !lat2 || !lon1 || !lon2) {
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
    const showOrderDetailsCard = useAppSelector(selectShowOrderDetailsCard);
    const showOrderForm = useAppSelector(selectShowOrderForm);
    const [visibility, setVisibility] = useState<CSSProperties>({visibility: 'hidden'})
    const dispatch = useAppDispatch();
    const updateVisibility = () => {
        setVisibility(visibility.visibility === "hidden" ? {visibility: "visible"} : {visibility: "hidden"});
        if (showOrderDetailsCard) {
            dispatch(updateShowOrderDetailsCard(false))
        }
    }
    const showOrderDetails = (event: React.MouseEvent<HTMLElement>) => {
        dispatch(updateShowOrderDetailsCard(true));
        const target = event.target as HTMLParagraphElement
        dispatch(updateOrderId(+target.id))
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
                                        const [lat, long] = order.location.split(',');
                                        return <OrderComponent key={id}
                                                               distance={getDistance(latitude, parseFloat(lat), longitude, parseFloat(long)).toFixed(2)}
                                                               showOrderDetails={showOrderDetails}
                                                               id={id}/>
                                    })}
                                </div>
                            </li>
                            :
                            <li>
                                <div id={styles['orders']} onClick={ () => dispatch(updateShowOrderForm(!showOrderForm))}>
                                    <p>Order Now!</p>
                                    <img src={orders_ico} alt="orders" id={styles["notifications-truck"]}/>
                                </div>
                            </li>
                        }
                    </ul>
                </nav>
            </div>
        );
    }
}