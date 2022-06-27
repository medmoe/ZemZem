import React from 'react';
import {CustomerRegistration} from "./features/customer/CustomerRegistration";
import './App.css';
import {CustomerLogin} from "./features/customer/CustomerLogin";
import {Route, Routes, Navigate} from "react-router-dom";
import {HomePage} from "./features/homepage/HomePage";
import { useAppSelector} from "./app/hooks";
import { selectIsAuthenticated } from "./features/customer/customerSlice";
import {CustomerLogout} from "./features/customer/CustomerLogout";

function App() {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    return (
            <header>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/signup" element={isAuthenticated?<Navigate to="/" />: <CustomerRegistration />}/>
                        <Route path="/login" element= {isAuthenticated?<Navigate to="/" />:<CustomerLogin />} />
                        <Route path="/logout" element={<CustomerLogout />} />
                    </Routes>
                </div>
            </header>
    );
}

export default App;
