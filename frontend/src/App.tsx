import React from 'react';
import {CustomerRegistration} from "./features/customer/CustomerRegistration";
import './App.css';
import {CustomerLogin} from "./features/customer/CustomerLogin";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {NavigationBar} from "./features/homepage/NavigationBar";
import {HomePage} from "./features/homepage/HomePage";

function App() {
    return (
        <BrowserRouter>
            <header>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/signup" element={<CustomerRegistration/>}/>
                        <Route path="/login" element={<CustomerLogin/>}/>
                    </Routes>
                </div>
            </header>
        </BrowserRouter>
    );
}

export default App;
