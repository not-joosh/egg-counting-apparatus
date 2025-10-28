import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { useToast } from "@/components/ui/use-toast";
import { useCache } from "./useCache";
import { useApparatus } from "./useApparatus";
import { resetRoutingSlice, setIsAuthenticated } from "@/features/routing-controller/routing-slice";
import { cachePinChange, clearEggtray, FarmLabel, resetEggCountingApparatus, setForceUpdate, setLabels, setPinCode, setTimeOfLogin } from "@/features/egg-counting-apparatus/egg-counting-apparatus-slice";
import { arrayRemove, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { eggCountingApparatusRef } from "@/store/firebase";
import { labelRef } from "@/store/firebase";
import { resetKeyboardSlice } from "@/features/keyboard/keyboard-slice";
import { resetCameraSlice } from "@/features/camera/camera-slice";
import { resetSettingsSlice } from "@/features/settings/settings-slice";
import { organizationsRef } from "@/store/firebase";

export const useMonitor = () => {
    const dispatch = useAppDispatch();
    const isDeviceSetup = useAppSelector((state) => state.routingController?.isSetup);
    const networkStatus = useAppSelector((state) => state.network?.networkStatus);
    const cacheCount = useAppSelector((state) => state.eggCountingApparatus?.cacheCount);
    const pinChanged = useAppSelector((state) => state.eggCountingApparatus?.newPinUpdate);
    const pin = useAppSelector((state) => state.eggCountingApparatus?.pinCode);
    const lastLogin = useAppSelector((state) => state.eggCountingApparatus?.timeStampOfLogin);
    const apparatusID = useAppSelector((state) => state.eggCountingApparatus?.eggCountingApparatusID);
    const orgID = useAppSelector((state) => state.eggCountingApparatus?.orgID);
    const language = useAppSelector((state) => state.settings?.language);
    const isForceUpdate = useAppSelector((state) => state.eggCountingApparatus?.forceUpdate);
    const { toast } = useToast();
    const { processCache } = useCache();
    const { updateApparatusPIN } = useApparatus();

    const unloadCache = async () => {
        try {
            console.log("uploadCache has gotten triggered");
            const res = await processCache();
            if (!res.success) throw new Error(`${res.message}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                    duration: 3000,
                    className: "bg-red-400 text-white",
                });
            } else {
                toast({
                    title: "Error",
                    description: `${error}`,
                    duration: 3000,
                    className: "bg-red-400 text-white",
                });
            }
        }
    };

    const handlePinUpdate = async () => {
        try {
            // console.log("uploadCache has gotten triggered");
            if (pin == null) throw new Error("Pin is null");
            const res = await updateApparatusPIN(pin);
            if (!res.success) throw new Error(`${res.message}`);
            dispatch(cachePinChange(false));
            toast({
                title: "Success",
                description: language === "english" ? "PIN updated successfully" : "Successful ang pag update sa PIN",
                duration: 3000,
                className: "bg-green-400 text-white",
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                    duration: 3000,
                    className: "bg-red-400 text-white",
                });
            } else {
                toast({
                    title: "Error",
                    description: `${error}`,
                    duration: 3000,
                    className: "bg-red-400 text-white",
                });
            }
        }
    };

    const handleCleanup = () => {
        try {
            // We know that the string of the last login is not empty, and its formatted like this:
            // "2022-02-22T22:22:22.222Z"
            // So we can check if today's date is at least 12 hours from the last login
            if(!lastLogin) throw new Error(language === "english" ? "Last login date is not available" : "Dili available ang daan nga login date.");
            const currentDate = new Date();
            const lastLoginDate = new Date(lastLogin);
            const diff = currentDate.getTime() - lastLoginDate.getTime();
            if (diff > 43200000) { 
            // if (diff > 30000) { 
                // 43200000 milliseconds is 12 hours
                // for 30 seconds, use 30000
                // We can clear the egg tray history
                dispatch(setIsAuthenticated(false));
                dispatch(cachePinChange(false));
                // dispatch(setIsIdle(true));
                dispatch(setTimeOfLogin(""));
                dispatch(clearEggtray());
                toast({
                    title: "Success",
                    description: language === "english" ? "Cache and egg tray history cleared successfully" : "Successful ang pag clear sa cache ug egg tray history",
                    duration: 3000,
                    className: "bg-green-400 text-white",
                });
            };
        } catch(error: unknown) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                    duration: 3000,
                    className: "bg-red-400 text-white",
                });
            } else {
                toast({
                    title: "Error",
                    description: `${error}`,
                    duration: 3000,
                    className: "bg-red-400 text-white",
                });
            }
        }
    };

    // const handleReset = async () => {
    //     try {
    //         // This function will reset all states to their initial values

    //         // Sync apparatus
    //         dispatch(resetCameraSlice());
    //         dispatch(resetEggCountingApparatus());
    //         dispatch(resetKeyboardSlice());
    //         dispatch(resetSettingsSlice());
    //         dispatch(resetRoutingSlice());

    //         toast({
    //             title: "Success",
    //             description: language === "english" ? "Apparatus has been reset" : "Nareset ang apparatus",
    //             duration: 3000,
    //             className: "bg-green-400 text-white",
    //         });

    //         // before we delete the apparatus document from the apparatus collection, we first
    //         // need to delete the "id" by searching through the org collection where the orgID matches the org id here.
    //         // after identifying the document sharing the same orgID, we will have to look at the attribute: "eggCounterApparatusId" and find the eggCOunting APparatus's id
    //         // and delete it from the array.
    //         // organizationsRef <=== imported as the collection of organizations from firebase

    //         // now we can delete the document frmo the apparatus ref
    //         const docRef = doc(eggCountingApparatusRef, apparatusID);
    //         await deleteDoc(docRef); // Delete the document instead of updating it
            
            
    //         localStorage.clear(); // resetting local storage. 
    //     } catch (error: unknown) {
    //         if (error instanceof Error) {
    //             toast({
    //                 title: "Error",
    //                 description: error.message,
    //                 duration: 3000,
    //                 className: "bg-red-400 text-white",
    //             });
    //         } else {
    //             toast({
    //                 title: "Error",
    //                 description: `${error}`,
    //                 duration: 3000,
    //                 className: "bg-red-400 text-white",
    //             });
    //         }
    //     }
    // };
    const handleReset = async () => {
        try {
            // Reset application states
            dispatch(resetCameraSlice());
            dispatch(resetEggCountingApparatus());
            dispatch(resetKeyboardSlice());
            dispatch(resetSettingsSlice());
            dispatch(resetRoutingSlice());
    
            toast({
                title: "Success",
                description: language === "english" ? "Apparatus has been reset" : "Nareset ang apparatus",
                duration: 3000,
                className: "bg-green-400 text-white",
            });
    
            // Search for the organization document matching the orgID
            const orgQuery = query(organizationsRef, where("organizationID", "==", orgID));
            const orgSnapshot = await getDocs(orgQuery);
    
            if (!orgSnapshot.empty) {
                orgSnapshot.forEach(async (orgDoc) => {
                    const orgData = orgDoc.data();
    
                    // Check if "eggCounterApparatusId" array contains the apparatusID
                    if (orgData.eggCounterApparatusId?.includes(apparatusID)) {
                        const orgDocRef = doc(organizationsRef, orgDoc.id);
    
                        // Remove the apparatusID from the array
                        await updateDoc(orgDocRef, {
                            eggCounterApparatusId: arrayRemove(apparatusID),
                        });
    
                        console.log(`Removed apparatusID from organization: ${orgDoc.id}`);
                    }
                });
            } else {
                console.warn("No matching organization found.");
            }
    
            // Delete the document from apparatus collection
            const docRef = doc(eggCountingApparatusRef, apparatusID);
            await deleteDoc(docRef);
    
            // Clear local storage
            localStorage.clear();
    
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                    duration: 3000,
                    className: "bg-red-400 text-white",
                });
            } else {
                toast({
                    title: "Error",
                    description: `${error}`,
                    duration: 3000,
                    className: "bg-red-400 text-white",
                });
            }
        }
    };
    
    // Effect to monitor network status and pin changes independently
    useEffect(() => {
        if(!isDeviceSetup) return;
        if (networkStatus && cacheCount != null && cacheCount > 0) {
            unloadCache();
        };

        if (pinChanged && pinChanged === true && networkStatus) {
            handlePinUpdate();
        };
        // If the cache is empty and the pin has not changed, then we can 
        // attempt to dump the cache and also egg tray history to clean the redux state.
        // This is necessary to prevent memory leaks. we'll make a check to see if the timestamp
        // console.log("pinChanged: ", pinChanged);
        // console.log("cacheCount: ", cacheCount);
        // console.log("lastLogin: ", lastLogin);
        // console.log("networkStatus: ", networkStatus);
        // @ts-ignore
        if (lastLogin && cacheCount != null && cacheCount <= 0 && pinChanged === false && networkStatus) {
            console.log("Calling handleCleanup with valid states");
            handleCleanup();
        } else {
            console.log("Conditions not met for handleCleanup:", {
                lastLogin,
                cacheCount,
                pinChanged,
                networkStatus
            });
        }
    }, [networkStatus, pinChanged, lastLogin]);

    useEffect(() => {
        if(!isDeviceSetup) return;
        if (!networkStatus) return;
        const copyOfOrgID = orgID;
        if(!copyOfOrgID) return;
        const copyOfApparatusID = apparatusID;
        if (!copyOfApparatusID) return;

        const unsubscribe = onSnapshot(
            query(eggCountingApparatusRef, where("__name__", "==", copyOfApparatusID)),
            (snapshot) => {
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    
                    if (data.hasNewLabels) {
                        // Fetch labels from the labelRef collection where organizationID matches copyOfOrgID
                        // Cache the labels in redux
                        // Set hasNewLabels to false in the document
                        console.log("Document needs update:", data);
                        // Assuming you have a function to fetch labels and update the document
                        fetchAndCacheLabels(copyOfOrgID);
                    } 
                    if (data.hasNewPin) {
                        // Update the pin in redux and force relogin
                        // Set hasNewPin to false in the document
                        console.log("Pin has been updated:", data);
                        dispatch(setPinCode(data.pin));
                        updateDocumentPinStatus(copyOfApparatusID);
                        // forcing them to reauthenticate
                        dispatch(setIsAuthenticated(false));
                    }
                    // Resettting the apparatus since the linking is updated
                    if(data.hasLinkUpdate) {
                        handleReset();
                        console.log("Link has been updated:", data);
                    } 
                    // if there is a force update, then we can update the pin and labels
                    if(isForceUpdate) {
                        fetchAndCacheLabels(copyOfOrgID);
                        console.log("Pin has been updated:", data);
                        dispatch(setPinCode(data.pin));
                        updateDocumentPinStatus(copyOfApparatusID);
                        dispatch(setForceUpdate(false));
                    }
                });
            },
            (error) => {
                console.error("Error fetching document:", error);
            }
        );

        return () => unsubscribe();
    }, [apparatusID, isForceUpdate]);

    const fetchAndCacheLabels = async (orgID: string) => {
        try {
            const labelsSnapshot = await getDocs(query(labelRef, where("organizationID", "==", orgID)));
            const labelArray = labelsSnapshot.docs.map(doc => doc.data());
            console.log(labelArray)
            const farmLabels: FarmLabel[] = labelsSnapshot.docs.map(doc => ({
                labelID: doc.id,
                organizationID: doc.data().organizationID,
                displayName: doc.data().displayName,
                labelName: doc.data().labelName
            }));
            dispatch(setLabels(farmLabels));
            const docRef = doc(eggCountingApparatusRef, apparatusID);
            await updateDoc(docRef, { hasNewLabels: false });
        } catch (error) {
            console.error("Error fetching labels:", error);
        }
    };

    const updateDocumentPinStatus = async (apparatusID: string) => {
        try {
            const docRef = doc(eggCountingApparatusRef, apparatusID);
            await updateDoc(docRef, { hasNewPin: false });
        } catch (error) {
            console.error("Error updating document pin status:", error);
        };
    };

};