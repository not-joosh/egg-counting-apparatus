// Redux store setup imports
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { combineReducers } from "@reduxjs/toolkit";
import { encryptTransform } from "redux-persist-transform-encrypt";

// Feature Imports
import { eggCountingApparatusSlice } from "@/features/egg-counting-apparatus/egg-counting-apparatus-slice";
import { routingSlice } from "@/features/routing-controller/routing-slice";
import { settingsSlice } from "@/features/settings/settings-slice";
import { networkSlice } from "@/features/network/network-slice";
import { cameraSlice } from "@/features/camera/camera-slice";
import { keyboardSlice } from "@/features/keyboard/keyboard-slice";
import { ledSlice } from "@/features/led/led-slice";
const reducer = combineReducers({
    eggCountingApparatus: eggCountingApparatusSlice.reducer,
    routingController: routingSlice.reducer,
    settings: settingsSlice.reducer,
    network: networkSlice.reducer,
    camera: cameraSlice.reducer,
    keyboard: keyboardSlice.reducer,
    led: ledSlice.reducer,
    // user: userSlice.reducer,
    // authLocal: authSlice.reducer,
    // cacheStore: cacheSlice.reducer,
});

const persistedReducer = persistReducer(
    {
        transforms: [
            encryptTransform({
                secretKey: `${import.meta.env.SUPER_SECRET_KEY}`,
                onError: function (error) {
                    console.error('Error in encryptTransform', error);
                },
            }),
        ],
        storage,
        version: 1,
        key: "root"
    },
    // @ts-ignore
    reducer
);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;