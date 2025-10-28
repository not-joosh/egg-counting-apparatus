import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
    language: string;
    showAccountSettings: boolean;
};

// Define the initial state
const initialState: SettingsState = {
    language: "english", // Cebuano or English
    showAccountSettings: false,
};


// Create the slice 
export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
        setShowAccountSettings: (state, action: PayloadAction<boolean>) => {
            state.showAccountSettings = action.payload;
        },
        resetSettingsSlice: (state) => {
            state.language = "english";
            state.showAccountSettings = false;
        },
    },
});

// Export the actions generated from the slice
export const { setLanguage, setShowAccountSettings, resetSettingsSlice } = settingsSlice.actions;
export default settingsSlice.reducer;