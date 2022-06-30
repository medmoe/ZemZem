import React from 'react';
import {render, waitFor, screen, fireEvent, cleanup} from '@testing-library/react';
import {Provider} from "react-redux";
import {store} from '../../app/store'
import {CustomerLogin} from "./CustomerLogin";
import {server} from '../../mocks/server';
import {options} from '../utils/tests'
import userEvent from '@testing-library/user-event'
import * as router from "react-router";

describe("Customer login", () => {
    beforeAll(() => {
        server.listen();
    });
    let button = null;
    let username = null;
    let password = null;
    beforeEach(() => {
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
        const {container}  = render(<Provider store={store}><CustomerLogin /></Provider> , options)
        button = screen.getByRole('button', {name:/submit/i})
        username = screen.getByRole('textbox');
        password = container.querySelector("#password");

    })
    afterEach(() => {
        server.resetHandlers();
        cleanup();
    });
    afterAll(() => server.close());
    const user = userEvent.setup();
    const navigate = jest.fn();
    // jest.mock('react-router-dom', () => ({
    //     ...jest.requireActual('react-router-dom') as any,
    //         useNavigate: () => mockUseNavigate,
    // }));
    it("should log the user in", async () => {
        await user.type(username, 'username');
        await user.type(password, 'password');
        expect(username).toHaveValue('username');
        expect(password).toHaveValue('password');
        await user.click(button as any);
        expect(navigate).toHaveBeenCalledWith("/");
        expect(navigate).toHaveBeenCalledTimes(2);

        // const header =  await screen.findByRole('heading', {name:/[a-z]*/i})
    })
    it ("should display an error message when authentication fails", async () => {
        await user.type(username, 'wrong-username');
        await user.type(password, 'wrong-password');
        await user.click(button);
        await expect(screen.findByRole('heading', {name:/some error message/i }))

    })
})