import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FarmLabel  {
    labelID: string;
    organizationID: string;
    displayName: string;
    labelName: string;
};  

export interface EggtrayFirebase { // Eggtray content we send to firebase
    bestByDate: string;
    date: string;
    eggCount: number;
    eggSize: string;
    egg_tray_id: string;
    firebaseUrl: string;
    label: FarmLabel;
    timeStamp: string;
    eggMatrix?: string[][];
    displayName: string;
    isForSale: boolean;
    isDeleted: boolean;
    apparatusID: string;
    apparatusName: string;
    deleteDate: string;
    soldDate: string;
};

export interface EggCountingApparatusState {
    eggCountingApparatusID: string;
    Eggtrays: EggtrayFirebase[];
    map_of_counts: {
        [key: string]: number;
    },
    pinCode: string;
    ownerID: string;
    orgID: string;
    secretKey: string;
    cacheList: EggtrayFirebase[];
    cacheCount: number;
    newPinUpdate: boolean;
    timeStampOfLogin: string;
    isPrintFail: boolean;
    printErrorMessage: string;
    labels: FarmLabel[];
    forceUpdate: boolean;
    displayName: string;
};

const initialState: EggCountingApparatusState = {
    eggCountingApparatusID: "undefined",
    //Update: removed initial state so it doesnt display on scan history
    Eggtrays: [],
    map_of_counts: {
        "S": 0,
        "M": 0,
        "L": 0,
        "XL": 0,
        "J": 0,
        "CR": 0
    },
    pinCode: "1234",
    ownerID: "undefined",
    orgID: "undefined",
    secretKey: "undefined",
    cacheList: [],
    cacheCount: 0,
    newPinUpdate: true,
    timeStampOfLogin: "",
    isPrintFail: false,
    printErrorMessage: "",
    labels: [],
    forceUpdate: false,
    displayName: "undefined",
};

export const eggCountingApparatusSlice = createSlice({
    name: "eggCountingApparatus",
    initialState,
    reducers: {
        setEggCountingApparatusID: (state, action: PayloadAction<string>) => {
            state.eggCountingApparatusID = action.payload;
        },
        addEggtray: (state, action: PayloadAction<EggtrayFirebase>) => {
            state.Eggtrays.push(action.payload);
            state.map_of_counts[action.payload.eggSize] += 1;
        },
        clearEggtray: (state) => {
            state.Eggtrays = [];
            state.map_of_counts = {
                "S": 0,
                "M": 0,
                "L": 0,
                "XL": 0,
                "J": 0,
                "CR": 0
            };
        },
        setPinCode: (state, action: PayloadAction<string>) => {
            state.pinCode = action.payload;
        },
        setOwnerID: (state, action: PayloadAction<string>) => {
            state.ownerID = action.payload;
        }, 
        setSecretKey: (state, action: PayloadAction<string>) => {
            state.secretKey = action.payload;
        },
        cacheEggTray: (state, action: PayloadAction<EggtrayFirebase>) => {
            try {
                if (!Array.isArray(state.cacheList)) {
                    state.cacheList = []; // Ensure it’s an array if something went wrong
                    console.log("CACHElIST BUG");
                }
                state.cacheList.push(action.payload);
                state.cacheCount += 1;
            } catch (error: unknown) {
                console.error("Error caching egg tray:", error);
            }
        },
        shiftCache: (state) => {
            state.cacheList.shift();
            state.cacheCount -= 1; 
        },
        resetCache: (state) => {
            state.cacheCount = 0;
            state.cacheList = [];
        },
        cachePinChange: (state, action: PayloadAction<boolean>) => {
            state.newPinUpdate = action.payload;
        },
        setTimeOfLogin: (state, action: PayloadAction<string>) => {
            state.timeStampOfLogin = action.payload;
        },
        setIsPrintFail: (state, action: PayloadAction<boolean>) => {
            state.isPrintFail = action.payload;
        },
        setPrintErrorMessage: (state, action: PayloadAction<string>) => {
            state.printErrorMessage = action.payload;
        },
        setLabels: (state, action: PayloadAction<FarmLabel[]>) => {
            state.labels = action.payload;
        },
        clearLabels: (state) => {
            state.labels = [];
        },
        setOrgID: (state, action: PayloadAction<string>) => {
            state.orgID = action.payload;
        },
        setForceUpdate: (state, action: PayloadAction<boolean>) => {    
            state.forceUpdate = action.payload;
        },
        setDisplayName: (state, action: PayloadAction<string>) => {
            state.displayName = action.payload;
        },
        resetEggCountingApparatus: (state) => {
            state.Eggtrays = [];
            state.cacheList = [];
            state.isPrintFail = false;
            state.ownerID = "undefined";
            state.orgID = "undefined";
            state.secretKey = "undefined";
            state.map_of_counts = {
                "S": 0,
                "M": 0,
                "L": 0,
                "XL": 0,
                "J": 0,
                "CR": 0
            };
            state.forceUpdate = false;
            state.pinCode = "1234";
            state.timeStampOfLogin = "";
        },
    },
});

// Export the actions generated from the slice
export const { 
    setEggCountingApparatusID, addEggtray, clearEggtray, cachePinChange,
    setPinCode, setOwnerID, setSecretKey, cacheEggTray, shiftCache, resetCache,
    setTimeOfLogin, setIsPrintFail, setPrintErrorMessage, setLabels, clearLabels, setOrgID, setForceUpdate,
    setDisplayName, resetEggCountingApparatus

} = eggCountingApparatusSlice.actions;
export default eggCountingApparatusSlice.reducer;
