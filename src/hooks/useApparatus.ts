import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { flask_app } from "@/lib/config";
import { cachePinChange, setEggCountingApparatusID, setPinCode } from "@/features/egg-counting-apparatus/egg-counting-apparatus-slice";
import { generateUniqueID } from "@/utils/hash";

export const useApparatus = () => {

    const language = useAppSelector((state) => state.settings?.language);
    const dispatch = useAppDispatch();
    const apparatusID = useAppSelector((state) => state.eggCountingApparatus?.eggCountingApparatusID);
    const networkStatus = useAppSelector((state) => state.network?.networkStatus);

    const updateApparatusPIN = async (pinCode: string) => {
        try {
            // making an api call
            dispatch(setPinCode(pinCode));
            return {message: "Pin updated successfully", success: true};
        } catch(error: unknown) {
            // Cache it in redux
            dispatch(cachePinChange(true));
            dispatch(setPinCode(pinCode));
            return {message: "Cached Pin Change", success: true};  
        };
    };

    const createApparatus = async (apparatusName: string) => {
        try {            

            // passing apparatusName to backend
            // const response = await fetch(`${flask_app}/create-apparatus`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({apparatus_name: apparatusName})
            // }).then((res) => res.json());

            // if(response.status_code !== 200) {
            //     throw new Error(response.content.message);
            // } else {
            const tempID = generateUniqueID(`${apparatusName}`);
            dispatch(setEggCountingApparatusID(tempID));
            return {message: "Apparatus created successfully", success: true};
            // }
        } catch(error: unknown) {
            return {message: "Error creating apparatus", success: false};
        }
    };

    return { createApparatus, updateApparatusPIN };
};