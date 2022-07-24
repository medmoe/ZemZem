import React from 'react'
import {cleanup, render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import {store} from '../../app/store'
import {server} from "../../mocks/server";
import {options} from '../utils/tests'
import {NavigationBar} from "../homepage/NavigationBar";
import userEvent from '@testing-library/user-event'
import * as router from 'react-router'

describe("Customer logout", () => {
    const user = userEvent.setup();
    const navigate = jest.fn();
    beforeAll(() => server.listen())
    beforeEach(() => {
        cleanup();
        server.resetHandlers();
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
    })
    afterAll(() => server.close());

    it("should log the customer out", async () => {
        render(
            <Provider store={store}>
                <NavigationBar username={"username"} isAuthenticated={true} orders={[]}/>
            </Provider> , options
        )
        const logout = screen.getByText("Logout");
        expect(logout).toBeInTheDocument();
        await user.click(logout);
        expect(navigate).toHaveBeenCalledTimes(1);
    })
})