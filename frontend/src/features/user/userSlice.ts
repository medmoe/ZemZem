import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {UserType} from "../utils/types";
import {action} from "@storybook/addon-actions";

export interface CustomerState {
    username?: string;
    isAuthenticated: boolean;
    isCustomer?: boolean;
    userInfo?: UserType;
    showOrderForm: boolean;
    showLoader: boolean;
    showProviderInfo: boolean;
}

const initialState: CustomerState = {
    isAuthenticated: false,
    showOrderForm: false,
    showLoader: false,
    showProviderInfo: false,
}

export const userSlice = createSlice({
    name: 'user',
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
        updateUserInfo: (state, action: PayloadAction<UserType>) => {
            state.userInfo = action.payload;
        },
        updateShowOrderForm: (state, action: PayloadAction<boolean>) => {
            state.showOrderForm = action.payload;
        },
        updateShowLoader: (state, action: PayloadAction<boolean>) => {
            state.showLoader = action.payload;
        },
        updateShowProviderInfo: (state, action: PayloadAction<boolean>) => {
            state.showProviderInfo = action.payload;
        }
    }
})

export const selectUsername = (state: RootState) => state.user.username;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectIsCustomer = (state: RootState) => state.user.isCustomer;
export const selectUserInfo = (state: RootState) => state.user.userInfo;
export const selectShowOrderForm = (state: RootState) => state.user.showOrderForm;
export const selectShowLoader = (state: RootState) => state.user.showLoader;
export const selectShowProviderInfo = (state: RootState) => state.user.showProviderInfo;

export const {
    updateUsername,
    updateIsAuthenticated,
    updateIsCustomer,
    updateUserInfo,
    updateShowOrderForm,
    updateShowLoader,
    updateShowProviderInfo,
} = userSlice.actions;
export default userSlice.reducer;