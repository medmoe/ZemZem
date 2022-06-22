import React from "react";
import {Link} from 'react-router-dom'
export function NavigationBar () {
    return (
        <div>
            <nav>
                <ul>
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