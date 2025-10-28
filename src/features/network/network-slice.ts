import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NetworkState {
    networkStatus: boolean;
}

// Define the initial state
const initialState: NetworkState = {
    networkStatus: navigator.onLine
};

// Create the slice
export const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        setNetworkStatus: (state, action: PayloadAction<boolean>) => {
            state.networkStatus = action.payload;
        },
    }
});

// Export the actions generated from the slice
export const { setNetworkStatus } = networkSlice.actions;
export default networkSlice.reducer;