import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";

export interface CustomerState {
    username: string;
    isAuthenticated: boolean;
    isCustomer: boolean;
}
const initialState: CustomerState = {
    username: "",
    isAuthenticated: false,
    isCustomer: false,
}

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        updateUsername: (state, action:PayloadAction<string>) => {
            state.username = action.payload;
        },
        updateIsAuthenticated: (state, action:PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        updateIsCustomer: (state, action:PayloadAction<boolean>) => {
            state.isCustomer = action.payload;
        },
    }
})

export const selectUsername = (state: RootState) => state.customer.username;
export const selectIsAuthenticated = (state: RootState) => state.customer.isAuthenticated;
export const selectIsCustomer = (state: RootState) => state.customer.isCustomer;

export const { updateUsername, updateIsAuthenticated, updateIsCustomer } = customerSlice.actions;
export default customerSlice.reducer;