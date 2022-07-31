import React from 'react';
import {UserRegistration} from "./features/user/UserRegistration";
import './App.css';
import {UserLogin} from "./features/user/UserLogin";
import {Route, Routes, Navigate} from "react-router-dom";
import {HomePage} from "./features/homepage/HomePage";
import { useAppSelector} from "./app/hooks";
import { selectIsAuthenticated } from "./features/user/userSlice";
import {UserLogout} from "./features/user/UserLogout";

function App() {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    return (
            <header>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/signup" element={isAuthenticated?<Navigate to="/" />: <UserRegistration />}/>
                        <Route path="/login" element= {isAuthenticated?<Navigate to="/" />:<UserLogin />} />
                        <Route path="/logout" element={<UserLogout />} />
                    </Routes>
                </div>
            </header>
    );
}

export default App;
