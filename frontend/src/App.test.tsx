import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { BrowserRouter} from "react-router-dom";

describe("App", ()=>{
    it("should render", () => {
        const { getByText } = render(
            <Provider store={store}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Provider>
        )


        expect(getByText(/Home/ )).toBeInTheDocument();
        expect(getByText(/signup/ )).toBeInTheDocument();
        expect(getByText(/login/ )).toBeInTheDocument();
    })
})