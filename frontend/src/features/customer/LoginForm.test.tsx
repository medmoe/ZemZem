import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {options} from '../utils/tests'
import {LoginForm} from "./LoginForm";
import {Provider} from 'react-redux'
import {store} from '../../app/store'

describe("Login form tests", () => {
    test("form renders successfully", () => {
        const handleSubmit = jest.fn();
        const handleInputChange = jest.fn()
        const { container } = render(<Provider store={store}>
            <LoginForm handleSubmit={handleSubmit} handleInputChange={handleInputChange} />
        </Provider> , options)
        expect(screen.getByRole('button', {name:/submit/i})).toBeInTheDocument();
        expect(screen.getByText(/username:/i)).toBeInTheDocument();
        expect(screen.getByText(/password:/i)).toBeInTheDocument();
        expect(container.querySelector('#password')).toBeInTheDocument();


    })
})