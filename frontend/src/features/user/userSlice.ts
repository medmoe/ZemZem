import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {OrderType, UserType} from "../utils/types";
import {action} from "@storybook/addon-actions";

export interface CustomerState {
    username?: string;
    isAuthenticated: boolean;
    isCustomer?: boolean;
    userInfo?: UserType;
    showOrderForm: boolean;
    showLoader: boolean;
    showOrderInfo: boolean;
    orders: OrderType[];
}

const initialState: CustomerState = {
    isAuthenticated: false,
    showOrderForm: false,
    showLoader: false,
    showOrderInfo: false,
    orders: [],
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
        updateShowOrderInfo: (state, action: PayloadAction<boolean>) => {
            state.showOrderInfo = action.payload;
        },
        updateOrders: (state, action: PayloadAction<OrderType[]>) => {
            state.orders = action.payload;
        }
    }
})

export const selectUsername = (state: RootState) => state.user.username;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectIsCustomer = (state: RootState) => state.user.isCustomer;
export const selectUserInfo = (state: RootState) => state.user.userInfo;
export const selectShowOrderForm = (state: RootState) => state.user.showOrderForm;
export const selectShowLoader = (state: RootState) => state.user.showLoader;
export const selectShowOrderInfo = (state: RootState) => state.user.showOrderInfo;
export const selectOrders = (state: RootState) => state.user.orders;

export const {
    updateUsername,
    updateIsAuthenticated,
    updateIsCustomer,
    updateUserInfo,
    updateShowOrderForm,
    updateShowLoader,
    updateShowOrderInfo,
    updateOrders,
} = userSlice.actions;
export default userSlice.reducer;