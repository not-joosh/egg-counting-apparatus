import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { useToast } from "@/components/ui/use-toast";
// import { useCache } from "./useCache";
// import { useApparatus } from "./useApparatus";
import { resetRoutingSlice, setIsAuthenticated } from "@/features/routing-controller/routing-slice";
import { cachePinChange, clearEggtray, resetEggCountingApparatus, setForceUpdate, setTimeOfLogin } from "@/features/egg-counting-apparatus/egg-counting-apparatus-slice";
// import { arrayRemove, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
// import { eggCountingApparatusRef } from "@/store/firebase";
// import { labelRef } from "@/store/firebase";
import { resetKeyboardSlice } from "@/features/keyboard/keyboard-slice";
import { resetCameraSlice } from "@/features/camera/camera-slice";
import { resetSettingsSlice } from "@/features/settings/settings-slice";
// import { organizationsRef } from "@/store/firebase";

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
    // const { processCache } = useCache();
    // const { updateApparatusPIN } = useApparatus();

    const unloadCache = async () => {
        try {
            console.log("uploadCache has gotten triggered (DEMO MODE - No Firebase)");
            // DEMO: Simulated cache processing
            const res = { success: true, message: "Cache processed successfully (demo)" };
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
            if (pin == null) throw new Error("Pin is null");
            // DEMO: Simulated PIN update
            const res = { success: true, message: "PIN updated successfully (demo)" };
            if (!res.success) throw new Error(`${res.message}`);
            dispatch(cachePinChange(false));
            toast({
                title: "Success",
                description: language === "english" ? "PIN updated successfully (demo mode)" : "Successful ang pag update sa PIN (demo mode)",
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
            if(!lastLogin) throw new Error(language === "english" ? "Last login date is not available" : "Dili available ang daan nga login date.");
            const currentDate = new Date();
            const lastLoginDate = new Date(lastLogin);
            const diff = currentDate.getTime() - lastLoginDate.getTime();
            if (diff > 43200000) { 
                // 43200000 milliseconds is 12 hours
                dispatch(setIsAuthenticated(false));
                dispatch(cachePinChange(false));
                dispatch(setTimeOfLogin(""));
                dispatch(clearEggtray());
                toast({
                    title: "Success",
                    description: language === "english" ? "Cache and egg tray history cleared successfully (demo mode)" : "Successful ang pag clear sa cache ug egg tray history (demo mode)",
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
                description: language === "english" ? "Apparatus has been reset (demo mode)" : "Nareset ang apparatus (demo mode)",
                duration: 3000,
                className: "bg-green-400 text-white",
            });
    
            // DEMO: Simulated Firebase operations
            console.log("DEMO MODE: Would remove apparatus from organization:", { orgID, apparatusID });
            console.log("DEMO MODE: Would delete apparatus document");
            
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

        // @ts-ignore
        if (lastLogin && cacheCount != null && cacheCount <= 0 && pinChanged === false && networkStatus) {
            console.log("Calling handleCleanup with valid states (DEMO MODE)");
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

        // DEMO: Firebase snapshot listener disabled
        console.log("DEMO MODE: Firebase snapshot listener would be active for apparatus:", copyOfApparatusID);
        
        // Simulated cleanup function
        return () => {
            console.log("DEMO MODE: Unsubscribed from Firebase listener");
        };

        /* ORIGINAL FIREBASE CODE - COMMENTED OUT FOR DEMO
        const unsubscribe = onSnapshot(
            query(eggCountingApparatusRef, where("__name__", "==", copyOfApparatusID)),
            (snapshot) => {
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    
                    if (data.hasNewLabels) {
                        console.log("Document needs update:", data);
                        fetchAndCacheLabels(copyOfOrgID);
                    } 
                    if (data.hasNewPin) {
                        console.log("Pin has been updated:", data);
                        dispatch(setPinCode(data.pin));
                        updateDocumentPinStatus(copyOfApparatusID);
                        dispatch(setIsAuthenticated(false));
                    }
                    if(data.hasLinkUpdate) {
                        handleReset();
                        console.log("Link has been updated:", data);
                    } 
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
        */
    }, [apparatusID, isForceUpdate]);

    /* FIREBASE HELPER FUNCTIONS - COMMENTED OUT FOR DEMO
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
    */
};