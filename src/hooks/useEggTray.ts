import { addEggtray, cacheEggTray, FarmLabel } from "@/features/egg-counting-apparatus/egg-counting-apparatus-slice";
// import {  eggTrayRef, dataCollectionRef } from "@/store/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { software_defined_web_url } from "@/lib/config";
import { generateUniqueID } from "@/utils/hash";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { EggtrayFirebase } from "@/features/egg-counting-apparatus/egg-counting-apparatus-slice";
import { serialize } from "@/lib/serialize";

export const useEggTray = () => {
    const dispatch = useAppDispatch();
    const map_of_counts = useAppSelector((state) => state.eggCountingApparatus?.map_of_counts);
    const networkStatus = useAppSelector((state) => state.network?.networkStatus);
    const apparatusName = useAppSelector((state) => state.eggCountingApparatus?.displayName) ?? 'Undefined';
    const apparatusID = useAppSelector((state) => state.eggCountingApparatus?.eggCountingApparatusID) ?? 'Undefined';
    // CRUD OPERATION FOR EGG TRAY TIMING (DATA COLLECTION)
    // STEPS OF HOW THE EGG TRAY ACTUALLY GOES
    
    const prepareForFirebase = (
        label: FarmLabel, eggSizeIn: string, eggCountIn: number, eggMatrix: string[][]
      ) => {
        console.log("unflattened egg matrix:", eggMatrix);
        
        const date = new Date();
        const dateString = date.toLocaleDateString('en-CA'); // 'en-CA' format results in 'YYYY-MM-DD'
        const timeStamp = date.toLocaleTimeString('it-IT');  // 'it-IT' results in 'HH:MM:SS'
      
        //Get best by date
        const bestByDate = new Date(date);
        bestByDate.setDate(bestByDate.getDate() + 14);
      
        // const flattenedMatrix = serialize(eggMatrix);
        
        // Get the data from the user
        const eggtray: EggtrayFirebase = {
          label: label,
          eggSize: eggSizeIn,
          eggCount: eggCountIn,
          date: dateString,  // Use the localized date string here
          bestByDate: bestByDate.toISOString(),
          timeStamp: timeStamp,  // Use localized time
          firebaseUrl: "",
          egg_tray_id: "",
          displayName: apparatusName,
          isDeleted: false,
          isForSale: false,
          apparatusID: apparatusID,
          apparatusName: apparatusName,
          soldDate: "",
          deleteDate: ""
        };
      
        return eggtray;
    };
    
    const uploadTrayToFirebase = async (eggtray: EggtrayFirebase) => {
        let tempID = "tempID";
        //trying hash for id generation
        try {
            // console.log(eggtray);
            if(!networkStatus) throw new Error("No Internet");
            // Step 3: Format the data:
            //      layhouse, eggSize, eggCount,
            //      date, bestByDate, timeStamp,
            //      firebaseUrl ""
            
            // First we will calcualte the bestByDate, which is usually 2 
            // weeks from the date of scanning.
            
            // getting ref collection
            // Next we will create the eggtray object.
            
            // using eggTrayRef <-- pointing to the eggTray collection
            // and using the add() method to create a new document.
            // This will return a promise, which we can await.
            // We will then use the document ID to set the egg_tray_id and also
            //const newDocRef = doc(eggTrayRef);
            // testing
            //throw new Error("No Wifi");
            
            const trayCopy = eggtray; // we want to copy the object so we don't 
            // console.log(eggtray);
            // trayCopy.egg_tray_id = eggtray.egg_tray_id
            // console.log(trayCopy.eggMatrix)
            // console.log(trayCopy)

            tempID = generateUniqueID(`${eggtray.bestByDate}${eggtray.eggCount}`); // bestbyDate ensures no overlaps

            const eggTray = {
                ...trayCopy,
                bestByDate: trayCopy.bestByDate.split('T')[0],
                date: trayCopy.date,
                eggCount: trayCopy.eggCount,
                eggSize: trayCopy.eggSize,
                egg_tray_id: tempID,
                firebaseUrl: "oogabooga!this is a DEMO url",
                label: trayCopy.label,
                timeStamp: trayCopy.timeStamp,
                eggMatrix: trayCopy.eggMatrix
            };
            return {
                "eggtray": eggTray,
                "success": true
            } // Will return true if nothing went wrong
        } catch(error: unknown) {
            // At this point we know the error is because of network issues
            // So we can implement caching here
            // The information we need to cache:
            // timeStamp, bestByDate, The information in general actually needs to be saved without the
            // document id, so we'll move the obj outside of the scope of the try catch
            // @ts-ignore
            console.log("SCOPE: ", error.message)
            // @ts-ignore
            const specificCount = map_of_counts[eggtray.eggSize];
            eggtray.egg_tray_id = generateUniqueID(`${eggtray.bestByDate}${specificCount}`); // bestbyDate ensures no overlaps
            // setting the eggtray's url to the software defined web url
            // if the eggtray doesn't have a firebase url, then we'll set it
            if(!eggtray.firebaseUrl)
                eggtray.firebaseUrl = `${software_defined_web_url}/eggTray=${eggtray.egg_tray_id}`;
            dispatch(cacheEggTray(eggtray)); 
            dispatch(addEggtray(eggtray));
            return {
                "eggtray": eggtray,
                "success": false
            };
        };
    };

    // data collection hook
    const uploadCRUDDoc = async (timeIn: string, trayRefID: string) => {
        try {
            if(!networkStatus) throw new Error("No wifi")
            // const docRef = doc(dataCollectionRef);
            // await setDoc(docRef, {
            //     TCRUD: timeIn,
            //     trayRefID: trayRefID,
            // });
            return {
                "message": "uploaded reference and timestamp",
                "success": true
            }
    } catch(error: unknown) {
            if(error instanceof Error) {
                return {
                    "message": error.message,
                    "success": false
                }
            } else {
                return {
                    "message": error,
                    "success": false
                }
            }
        }
    }

    return { 
        prepareForFirebase, uploadTrayToFirebase, uploadCRUDDoc
    };
};
