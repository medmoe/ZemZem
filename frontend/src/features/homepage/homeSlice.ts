import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store"
import {OrderType, SatisfactionFormDataType} from "../utils/types";
import {action} from "@storybook/addon-actions";

export interface HomeState {
    hasLocation: boolean,
    latitude?: number,
    longitude?: number,
    showOrderDetailsCard: boolean,
    orders: OrderType[],
    orderId?: number,
    acceptedOrders?: OrderType[],
    showSatisfactionForm: boolean,
    satisfactionFormData: SatisfactionFormDataType,
}

const initialState: HomeState = {
    hasLocation: false,
    showOrderDetailsCard: false,
    orders:[],
    showSatisfactionForm: false,
    satisfactionFormData: {
        stars: 0,
        isDelivered: false,
        comment: "",
    }
}

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        updateLatitude: (state, action: PayloadAction<number>) => {
            state.latitude = action.payload;
        },
        updateLongitude: (state, action: PayloadAction<number>) => {
            state.longitude = action.payload;
        },
        updateHasLocation: (state, action: PayloadAction<boolean>) => {
            state.hasLocation = action.payload;
        },
        updateShowOrderDetailsCard: (state, action: PayloadAction<boolean>) => {
            state.showOrderDetailsCard = action.payload;
        },
        updateOrders: (state, action: PayloadAction<OrderType[]>) => {
            state.orders = action.payload;
        },
        updateOrderId: (state, action: PayloadAction<number>) => {
            state.orderId = action.payload;
        },
        updateAcceptedOrders: (state, action: PayloadAction<OrderType[]>) => {
            state.acceptedOrders = action.payload;
        },
        updateShowSatisfactionForm: (state, action: PayloadAction<boolean>) => {
            state.showSatisfactionForm = action.payload;
        },
        updateSatisfactionFormData: (state, action:PayloadAction<SatisfactionFormDataType>) => {
            state.satisfactionFormData = action.payload;
        },
    }
})

export const selectLatitude = (state: RootState) => state.home.latitude;
export const selectLongitude = (state: RootState) => state.home.longitude;
export const selectHasLocation = (state: RootState) => state.home.hasLocation;
export const selectShowOrderDetailsCard = (state: RootState) => state.home.showOrderDetailsCard;
export const selectOrders = (state: RootState) => state.home.orders;
export const selectOrderId = (state: RootState) => state.home.orderId;
export const selectAcceptedOrders = (state: RootState) => state.home.acceptedOrders;
export const selectShowSatisfactionForm = (state: RootState) => state.home.showSatisfactionForm;
export const selectSatisfactionFormData = (state: RootState) => state.home.satisfactionFormData;
export const {
    updateLatitude,
    updateLongitude,
    updateHasLocation,
    updateShowOrderDetailsCard,
    updateOrders,
    updateOrderId,
    updateAcceptedOrders,
    updateShowSatisfactionForm,
    updateSatisfactionFormData,
} = homeSlice.actions;

export default homeSlice.reducer;