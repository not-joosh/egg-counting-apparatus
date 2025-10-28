import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { shiftCache } from "@/features/egg-counting-apparatus/egg-counting-apparatus-slice";
import { useTimer } from "./useTimer";
import { useEggTray } from "./useEggTray";
import { useToast } from "@/components/ui/use-toast";
import { resetCache } from "@/features/egg-counting-apparatus/egg-counting-apparatus-slice";
// import { types } from "@/lib/types" // fuck that we implement later..
export const useCache = () => {
    // This hook will process all the cached items...
    // also we will be using a function to generate 
    const dispatch = useAppDispatch();
    const eggTraysList = useAppSelector((state) => state.eggCountingApparatus?.cacheList);
    const count = useAppSelector((state) => state.eggCountingApparatus?.cacheCount);
    const language = useAppSelector((state) => state.settings?.language);
    const { uploadTrayToFirebase, uploadCRUDDoc} = useEggTray();
    const {startTimer,  endTimer, formatDuration} = useTimer();
    const { toast } = useToast();

    const processCache = async () => {
        try {
            if (!eggTraysList || eggTraysList.length === 0) {
                toast({
                    title: "Cache Empty!",
                    description: language === "english" ? "No trays available to process." : "Walay tray nga available i-proseso.",
                    duration: 3000,
                    className: "bg-green-400 text-white",
                });
                return { message: "No trays in cache.", success: true };
            }

            // Process all trays in parallel using Promise.all()
            await Promise.all(eggTraysList.map(async (eggtray) => {
                console.log("Processing tray: ", eggtray);
                
                const startClock = startTimer();
                const res = await uploadTrayToFirebase(eggtray);
                const duration = formatDuration(endTimer(startClock), "milliseconds");

                if (!res.success) {
                    throw new Error(language === "english" ? "Failed to upload tray. Lost connection." : "Wala na upload ang tray. Nawala ang connection.");
                }

                if (!duration) {
                    throw new Error(language === "english" ? "Failed to calculate duration." : "Wala na calculate ang duration.");
                }

                const dataRes = await uploadCRUDDoc(duration, res.eggtray.egg_tray_id);
                if (!dataRes.success) {
                    throw new Error(language === "english" ? "Data upload failed." : "Wala na upload ang data.");
                }

                // Dispatch shiftCache after successful upload
                dispatch(shiftCache());

                toast({
                    title: "Tray Uploaded!",
                    description: language === "english" ? "Successfully uploaded a tray." : "Successful ang pag upload sa tray.",
                    duration: 3000,
                    className: "bg-green-400 text-white",
                });
            }));

            // After all are processed
            toast({
                title: "All Trays Processed!",
                description: language === "english" ? "Successfully processed all trays." : "Successful ang pag process sa tanan na trays.",
                duration: 3000,
                className: "bg-green-400 text-white",
            });

            dispatch(resetCache()); // Reset the cache after processing all trays

            return { message: language === "english" ? "All trays processed successfully" : "Successful ang pag process sa tanan na trays", success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({
                title: "Error!",
                description: errorMessage,
                duration: 3000,
                variant: "destructive",
            });
            return { message: errorMessage, success: false };
        }
    };

    return { processCache }
};