import React from 'react';
import {Queries, render, RenderOptions} from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import {NavigationBar} from "./NavigationBar";
import {MemoryRouter} from "react-router-dom";
import {Container} from "react-dom";

describe("navigation bar", () => {
    const options = {
            wrapper: MemoryRouter
        } as RenderOptions<Queries, HTMLElement, HTMLElement>
    it("should show login and sign up when not authenticated", () => {

        const {getByText} = render(
            <Provider store={store}>
                <NavigationBar username={""} isAuthenticated={false} orders={[]}/>
            </Provider>, options
        )
        expect(getByText(/login/)).toBeInTheDocument();
        expect(getByText(/signup/ )).toBeInTheDocument();
    })
    it("should show username and logout if authenticated" , () => {
        const { getByText } = render(
            <Provider store={store}>
                <NavigationBar username={"username"} isAuthenticated={true} orders={[]}/>
            </Provider>, options
        )
        expect(getByText(/Welcome, username !/)).toBeInTheDocument();
        expect(getByText(/Logout/)).toBeInTheDocument();
    })
    describe("logo", () =>{
        it("should be displayed", () => {
            const { getByRole } = render(
                <Provider store={store}>
                    <NavigationBar username={"username"} isAuthenticated={true} orders={[]}/>
                </Provider> , options
            )
            const logo = getByRole('img');
            expect(logo).toHaveAttribute('src', 'ZemZem.png');
            expect(logo).toHaveAttribute('alt', 'logo');
        })
    })
})