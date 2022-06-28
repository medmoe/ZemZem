import React from 'react';
import {Queries, render, RenderOptions} from '@testing-library/react';
import {HomePage} from "./HomePage";
import {Provider} from "react-redux";
import {store} from '../../app/store';
import {MemoryRouter} from "react-router-dom";

test("render navigation bar when not authenticated", () => {
    const options = {
        wrapper: MemoryRouter
    } as RenderOptions<Queries, HTMLElement, HTMLElement>
    const {getByText} = render(
        <Provider store={store}>
            <HomePage/>
        </Provider>, options
    );
    expect(getByText(/login/)).toBeInTheDocument();
    expect(getByText(/signup/)).toBeInTheDocument();
    expect(getByText(/Home/)).toBeInTheDocument();

})