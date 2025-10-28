import CryptoJS from 'crypto-js';

const hashCache: {[key: string]: boolean} = {}

const ID_GENERATION_KEY = import.meta.env.VITE_ID_GENERATION_KEY

export const generateHash = (input: string): string => {
    try {
        const test = CryptoJS.HmacSHA256(input, ID_GENERATION_KEY).toString(CryptoJS.enc.Hex);
        return test;
    } catch(error) {
        console.log("generateHash: ", error);
        return "shit";
    }
};

export const generateUniqueID = (input: string): string => {
    try {
        console.log("Input in ENCRYPTION:", input)
        let hash = generateHash(input);
        let id = hash.substring(0, 19);
        let counter = 0;
        while(hashCache[id]) {
            id = hash.substring(0, 19) + counter;
            counter++;
        }
        hashCache[id] = true;
        // console.log("hashCache:", hash);
        // console.log(id)
        return id;
    } catch(error) {
        console.log("generateUniqueID: ", error)
        return "shit2"
    }
};


