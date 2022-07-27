import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store"

export interface HomeState {
    hasLocation: boolean,
    latitude?: number,
    longitude?: number,
    showOrderDetailsCard: boolean,
}

const initialState: HomeState = {hasLocation: false, showOrderDetailsCard: false}

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        updateLatitude : (state, action: PayloadAction<number>) => {
            state.latitude = action.payload;
        },
        updateLongitude : (state, action: PayloadAction<number>) => {
            state.longitude = action.payload;
        },
        updateHasLocation: (state, action: PayloadAction<boolean>) => {
            state.hasLocation = action.payload;
        },
        updateShowOrderDetailsCard: (state, action: PayloadAction<boolean>) => {
            state.showOrderDetailsCard = action.payload;
        }
    }
})

export const selectLatitude = (state: RootState) => state.home.latitude;
export const selectLongitude = (state: RootState) => state.home.longitude;
export const selectHasLocation = (state: RootState) => state.home.hasLocation;
export const selectShowOrderDetailsCard = (state: RootState) => state.home.showOrderDetailsCard;

export const {updateLatitude, updateLongitude, updateHasLocation, updateShowOrderDetailsCard} = homeSlice.actions;

export default homeSlice.reducer;