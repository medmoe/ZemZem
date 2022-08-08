import React from 'react'
import {cleanup, render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import {store} from '../../app/store';
import {UserRegistration} from "./UserRegistration";
import userEvent from "@testing-library/user-event";
import * as router from 'react-router';
import {options} from "../utils/tests";
import {server} from "../../mocks/server";

describe("Customer registration", () => {
    const navigate = jest.fn();
    const user = userEvent.setup();
    let button: any = null;
    let first_name: any = null;
    let last_name: any = null;
    let email: any = null;
    let username: any = null;
    let pass1: any = null;
    let pass2: any = null;
    beforeAll(() => server.listen());
    beforeEach(() => {
        cleanup();
        server.resetHandlers();
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
        const { container }  = render(<Provider store={store}><UserRegistration /></Provider> , options)
        button = screen.getByRole('button', {name:/submit/i})
        first_name = container.querySelector("#first_name");
        last_name = container.querySelector("#last_name");
        email = container.querySelector("#email");
        username = container.querySelector("#username");
        pass1 = container.querySelector("#pass1");
        pass2 = container.querySelector("#pass2");
    })
    afterAll(() => server.close());
    it("should show error message when one of the fields is empty", async () => {
        await user.click(button);
        expect(screen.getByRole('heading', {name:/Please fill all the fields/i})).toBeInTheDocument();
    });
    it("should show error message when passwords don't match", async () => {
        await user.type(first_name, 'first_name');
        await user.type(last_name, 'last_name');
        await user.type(email, 'email@test.test');
        await user.type(username, 'username');
        await user.type(pass1, 'password');
        await user.type(pass2, 'passwor');
        await user.click(button);
        expect(screen.getByRole('heading', {name:/passwords didn't match/i})).toBeInTheDocument();
    })
    it("should show error message when given username or email already exists", async () => {
        await user.type(first_name, 'first_name');
        await user.type(last_name, 'last_name');
        await user.type(email, 'email@test.test');
        await user.type(username, 'username');
        await user.type(pass1, 'password');
        await user.type(pass2, 'password');
        await user.click(button);
        expect( await screen.findByRole('heading', {name: /user with the same data already exist!/i})).toBeInTheDocument();
    })
    it("should register the user", async () => {
        await user.type(first_name, 'first_name');
        await user.type(last_name, 'last_name');
        await user.type(email, 'email12@test.test');
        await user.type(username, 'username12');
        await user.type(pass1, 'password');
        await user.type(pass2, 'password');
        await user.click(button);
        expect(await screen.findByRole('heading', {name: /Please check your mailbox to activate your account!/i})).toBeInTheDocument()
    })
})