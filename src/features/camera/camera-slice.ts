
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CameraState {
    picture: string;
};

const initialState: CameraState = {
    picture: ""
};

export const cameraSlice = createSlice({
    name: 'camera',
    initialState,
    reducers: {
        setPicture: (state, action: PayloadAction<string>) => {
            state.picture = action.payload;
        },
        resetCameraSlice: (state) => {
            state.picture = "";
        },
    }
});

export const { setPicture, resetCameraSlice } = cameraSlice.actions;
export default cameraSlice.reducer;
