import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store"

export interface HomeState {
    hasLocation: boolean,
    latitude?: number,
    longitude?: number,
}

const initialState: HomeState = {hasLocation: false}

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
        }
    }
})

export const selectLatitude = (state: RootState) => state.home.latitude;
export const selectLongitude = (state: RootState) => state.home.longitude;
export const selectHasLocation = (state: RootState) => state.home.hasLocation;

export const {updateLatitude, updateLongitude, updateHasLocation} = homeSlice.actions;

export default homeSlice.reducer;