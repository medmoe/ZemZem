import React from 'react'
import {render, screen} from '@testing-library/react'
import {Provider} from "react-redux";
import {store} from '../../app/store';
import {options} from '../utils/tests';
import {RegistrationForm} from "./RegistrationForm";

describe("Registration form", () => {
    const handleSubmit = jest.fn();
    const handleChange = jest.fn();
    it('should show all the fields of the form', function () {
        const { container } = render(
            <Provider store={store}>
                <RegistrationForm handleSubmit={handleSubmit} handleChange={handleChange} />
            </Provider> , options
        )
        expect(screen.getByText(/first name:/i)).toBeInTheDocument();
        expect(screen.getByText(/last name:/i)).toBeInTheDocument();
        expect(screen.getByText(/email:/i)).toBeInTheDocument();
        expect(screen.getByText(/username:/i)).toBeInTheDocument();
        expect(screen.getByText(/password:/i)).toBeInTheDocument();
        expect(screen.getByText(/renter password/i)).toBeInTheDocument();
        expect(container.querySelector("#first_name")).toBeInTheDocument();
        expect(container.querySelector("#last_name")).toBeInTheDocument();
        expect(container.querySelector("#email")).toBeInTheDocument();
        expect(container.querySelector("#username")).toBeInTheDocument();
        expect(container.querySelector("#pass1")).toBeInTheDocument();
        expect(container.querySelector("#pass2")).toBeInTheDocument();

    });
})