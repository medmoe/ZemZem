import React from 'react';
import {render} from '@testing-library/react';
import {HomePage} from "./HomePage";
import {Provider} from "react-redux";
import {store} from '../../app/store';
import { MemoryRouter } from "react-router-dom";

test("render navigation bar when not authenticated", () => {
    const {getByText} =render(<Provider store={store}><HomePage /></Provider>, {wrapper: MemoryRouter});
    expect(getByText(/login/)).toBeInTheDocument();
    expect(getByText(/signup/)).toBeInTheDocument();
    expect(getByText(/Home/)).toBeInTheDocument();

})