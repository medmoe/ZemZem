import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";

export interface CustomerState {
    token: string | null;
    username: string;
}
const initialState: CustomerState = {
    token: "",
    username: "",
}

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        updateToken: (state) => {
            state.token = localStorage.getItem('token');
        },
        updateUsername: (state, action:PayloadAction<string>) => {
            state.username = action.payload;
        }
    }
})

export const selectToken = (state: RootState) => state.customer.token;
export const selectUsername = (state: RootState) => state.customer.username;

export const { updateToken, updateUsername } = customerSlice.actions;
export default customerSlice.reducer;