import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {CustomerType} from "../utils/types";

export interface CustomerState {
    username?: string;
    isAuthenticated: boolean;
    isCustomer?: boolean;
    customerInfo?: CustomerType;
    showOrderForm: boolean;
}

const initialState: CustomerState = {
    isAuthenticated: false,
    showOrderForm: true,
}

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        updateUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        updateIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        updateIsCustomer: (state, action: PayloadAction<boolean>) => {
            state.isCustomer = action.payload;
        },
        updateCustomerInfo: (state, action: PayloadAction<CustomerType>) => {
            state.customerInfo = action.payload;
        },
        updateShowOrderForm: (state, action: PayloadAction<boolean>) => {
            state.showOrderForm = action.payload;
        }
    }
})

export const selectUsername = (state: RootState) => state.customer.username;
export const selectIsAuthenticated = (state: RootState) => state.customer.isAuthenticated;
export const selectIsCustomer = (state: RootState) => state.customer.isCustomer;
export const selectCustomerInfo = (state: RootState) => state.customer.customerInfo;
export const selectShowOrderForm = (state: RootState) => state.customer.showOrderForm;

export const {
    updateUsername,
    updateIsAuthenticated,
    updateIsCustomer,
    updateCustomerInfo,
    updateShowOrderForm,
} = customerSlice.actions;
export default customerSlice.reducer;