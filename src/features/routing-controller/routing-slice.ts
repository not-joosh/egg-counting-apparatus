import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RoutingState {
    isSetup: boolean
    isFirstTimeVisit: boolean;
    authStep: number;
    isRedirect: boolean;
    otp: string;
    isIdle: boolean;
    isAuthenticated: boolean,
};

const initialState: RoutingState = {
    isSetup: false,
    isFirstTimeVisit: true,
    authStep: 1,
    isRedirect: false,
    otp: "undefined",
    isIdle: false,
    isAuthenticated: false,
};

export const routingSlice = createSlice({
    name: "routing",
    initialState,
    reducers: {
        setIsSetup: (state, action: PayloadAction<boolean>) => {
            state.isSetup = action.payload;
        },
        setIsFirstTimeVisit: (state, action: PayloadAction<boolean>) => {
            state.isFirstTimeVisit = action.payload;
        },
        setAuthStep: (state, action: PayloadAction<number>) => {
            state.authStep = action.payload;
        },
        setIsRedirect: (state, action: PayloadAction<boolean>) => {
            state.isRedirect = action.payload;
        },
        setOtp: (state, action: PayloadAction<string>) => {
            state.otp = action.payload
        },
        setIsIdle: (state, action: PayloadAction<boolean>) => {
            state.isIdle = action.payload
        },
        setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload
        },
        resetRoutingSlice: (state) => {
            // we will reset everything besides isSetup
            state.isFirstTimeVisit = true;
            state.authStep = 1;
            state.isRedirect = false;
            state.otp = "undefined";
            state.isIdle = false;
            state.isAuthenticated = false;
        },
    },
});

// Export the actions generated from the slice
export const { 
    setOtp, setIsSetup, setIsFirstTimeVisit, 
    setAuthStep, setIsRedirect, setIsIdle, setIsAuthenticated,
    resetRoutingSlice
 } = routingSlice.actions;
export default routingSlice.reducer;
