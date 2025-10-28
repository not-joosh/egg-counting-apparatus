// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface LedState {
//     isOn: boolean;
// }

// const initialState: LedState = {
//     isOn: false,
// };

// export const ledSlice = createSlice({
//     name: 'led',
//     initialState,
//     reducers: {
//         setLedState: (state, action: PayloadAction<boolean>) => {
//             state.isOn = action.payload;
//         },
//         toggleLedState: (state) => {
//             state.isOn = !state.isOn;
//         },
//     },
// });

// // Export the actions generated from the slice
// export const { setLedState, toggleLedState } = ledSlice.actions;
// export default ledSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LedState {
    isOn: boolean;
}

// Initialize state from sessionStorage
const initialState: LedState = {
    isOn: sessionStorage.getItem('ledState') === 'false',
};

export const ledSlice = createSlice({
    name: 'led',
    initialState,
    reducers: {
        setLedState: (state, action: PayloadAction<boolean>) => {
            state.isOn = action.payload;
            sessionStorage.setItem('ledState', String(action.payload));
        },
        toggleLedState: (state) => {
            state.isOn = !state.isOn;
            sessionStorage.setItem('ledState', String(state.isOn));
        },
    },
});

// Export the actions generated from the slice
export const { setLedState, toggleLedState } = ledSlice.actions;
export default ledSlice.reducer;