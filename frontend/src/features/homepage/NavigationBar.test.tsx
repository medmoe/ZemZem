import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import {NavigationBar} from "./NavigationBar";
import {MemoryRouter} from "react-router-dom";

describe("navigation bar", () => {
    it("should show login and sign up when not authenticated", () => {
        const { getByText } = render(
            <Provider store={store}>
                <NavigationBar username={""} isAuthenticated={false} />
            </Provider> , {wrapper: MemoryRouter}
        )
        expect(getByText(/login/)).toBeInTheDocument();
        expect(getByText(/signup/)).toBeInTheDocument();
    })
    it("should show username and logout if authenticated" , () => {
        const { getByText } = render(
            <Provider store={store}>
                <NavigationBar username={"username"} isAuthenticated={true} />
            </Provider>, {wrapper: MemoryRouter}
        )
        expect(getByText(/Welcome, username !/)).toBeInTheDocument();
        expect(getByText(/Logout/)).toBeInTheDocument();
    })
    describe("logo", () =>{
        it("should be displayed", () => {
            const { getByRole } = render(
                <Provider store={store}>
                    <NavigationBar username={"username"} isAuthenticated={true} />
                </Provider> , {wrapper: MemoryRouter}
            )
            const logo = getByRole('img');
            expect(logo).toHaveAttribute('src', 'ZemZem.png');
            expect(logo).toHaveAttribute('alt', 'logo');
        })
    })
})