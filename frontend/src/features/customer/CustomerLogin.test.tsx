import React from 'react';
import {render, waitFor, screen, fireEvent, RenderOptions, Queries} from '@testing-library/react';
import { Provider } from "react-redux";
import { store } from '../../app/store'
import {CustomerLogin} from "./CustomerLogin";
import {MemoryRouter} from "react-router-dom";


describe("Customer login", () => {
    const options = {
        wrapper: MemoryRouter
    } as RenderOptions<Queries, HTMLElement, HTMLElement>
    const onSubmit = jest.fn();
    it("should render", () => {
        const { getByText } = render(
            <Provider store={store}>
                <CustomerLogin />
            </Provider> , options
        )
        expect(getByText(/Username/)).toBeInTheDocument();
        expect(getByText(/Password/)).toBeInTheDocument();
    })
})