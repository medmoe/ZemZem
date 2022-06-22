import React from 'react';
import {CustomerRegistration} from "./features/customerRegistration/CustomerRegistration";
import './App.css';
import {NavigationBar} from "./features/homepage/NavigationBar";
import {CustomerLogin} from "./features/customerLogin/CustomerLogin";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<NavigationBar/>} />
                    <Route path="/signup" element={<CustomerRegistration />} />
                    <Route path="/login" element={<CustomerLogin/>} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
