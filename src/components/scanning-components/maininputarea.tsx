import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Settings } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { useCamera } from '@/hooks/useCamera';
import { useToast } from '../ui/use-toast';
import { flask_app } from '@/lib/config';
import { useTimer } from '@/hooks/useTimer';
import { useEggTray } from '@/hooks/useEggTray';
import { addEggtray, FarmLabel, setIsPrintFail, setPrintErrorMessage } from '@/features/egg-counting-apparatus/egg-counting-apparatus-slice';
import { useQRCode } from '@/hooks/useQRCode';
import { PrintRetryModal } from './reprint-modal';
import { random, set } from 'lodash';

interface MainInputAreaProps {
    isCameraOn: boolean;
}

const MotionButton = motion(Button);

export const MainInputArea = ({ isCameraOn }: MainInputAreaProps) => {
    //dispatches
    const dispatch = useAppDispatch();
    const labels = useAppSelector((state) => state.eggCountingApparatus?.labels);
    const eggtraylist = useAppSelector((state) => state.eggCountingApparatus?.Eggtrays);
    const language = useAppSelector((state) => state.settings?.language);
    //states
    const [labelCopy, setLabelCopy] = useState<FarmLabel[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<FarmLabel | null>(labels?.[0] || null);
    const [isProcessing, setIsProcessing] = useState(false);
    // @ts-ignore
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    //hooks
    const { toast } = useToast();
    const { captureImage, blobifyImage } = useCamera();
    const { startTimer, endTimer, formatDuration } = useTimer();
    const { prepareForFirebase, uploadTrayToFirebase, uploadCRUDDoc } = useEggTray();
    const { sendQRtoPrinter } = useQRCode();    
    const isFlashOn = useAppSelector((state) => state.led?.isOn)
    const handleDismiss = async () => {
        dispatch(setIsPrintFail(false));
    }
    const handleRetryPrint = async () => {
        try {
            // dispatch(setIsPrintFail(false));
            // return;
            // Ensure we have the egg tray list to process
            
            if (!eggtraylist || eggtraylist.length === 0) {
                throw new Error(language === "english" ? "No egg tray available to retry print." : language === "bisaya" ? "Wala'y egg tray nga available para sa pag retry print." : "Wala pong egg tray na available para sa retry print.");
            }

            // // Get the last item in the egg tray list
            const eggtray = eggtraylist[eggtraylist.length - 1]; // last element
    

            // Settings timeout for 2 seconds
            // const printResult = await sendQRtoPrinter(eggtray.firebaseUrl, eggtray.eggSize);
            const printResult = {
                success: true,
                message: "Print Successful"
            };
            if (printResult.success) {
                // Successfully printed, break out of the loop
                dispatch(setIsPrintFail(false));
                toast({
                    title: "Success",
                    description: language === "english" ? "QR code printed successfully!" : language === "bisaya" ? "Successful ra ang pag print sa QR Code!" : "Matagumpay na na-print ang QR code!",
                    className: "bg-green-500 text-white",
                });
            } else {
                throw new Error(language === "english" ? "Failed to retry print." : language === "bisaya" ? "Wala na retry ug print." : "Nabigo sa pag retry print.");
            }
        } catch (error) {
            // Handle errors and show the toast notification
            if (error instanceof Error) {
                console.log(error.message);
                toast({
                    title: "Error",
                    description: error.message,
                    className: "bg-red-500 text-white",
                });
            } else {
                toast({
                    title: "Error",
                    description: language === "english" ? "Failed to retry print." : language === "bisaya" ? "Wala na retry ug print." : "Nabigo sa pag retry print.",
                    className: "bg-red-500 text-white",
                });
            }
            // Dispatch print failure state if not successful
            dispatch(setIsPrintFail(true));
        }
    };

    const handleConfirm = async () => {
        
         
            const size = document.getElementById("size") as HTMLSelectElement;
            // Starting timer to measure the entire process
            if(selectedLabel == null) throw new Error(language === "english"? "Failed to select a label." : language === "bisaya" ? "Wala'y napili nga label." : "Walang napiling label.");
            // const start_processTimer = startTimer();
            setIsProcessing(true);
            
            // // Step 1: Take the image
            // captureImage();
            const picture = await captureImage();
            if(!picture) throw new Error(language === "english" ? "Failed to capture image." : language === "bisaya" ? "Wala na kuha ang image." : "Hindi na-capture ang imahe.");      
            const blob = blobifyImage(picture);

            //Step 3: Send blob as formdata to backend
            const formData = new FormData();
            formData.append('image', blob, 'egg_image.jpg');
            formData.append('size', size.value);  // Append the size to the form data
            formData.append('language', language === "tagalog" || language === "bisaya" || language === "english" ? language : "english");
          

            // console.log(classificationData.egg_matrix);
            // eggMatrix: string[][]
            const eggMatrix = [[], [], [], [], []];
            const eggTray = prepareForFirebase(selectedLabel, size.value, random(1, 30), eggMatrix);
            
            // const start_uploadTimer = startTimer(); // Start the timer for uploading the egg tray to firebase
            const uploadRes = await uploadTrayToFirebase(eggTray);
            dispatch(addEggtray(uploadRes.eggtray));
            // Timer for uploading the egg tray to firebase ends here
            // Step 6: Check if the upload was successful
            // console.log("before print result:", uploadRes.eggtray)

            
            // const printResult = await sendQRtoPrinter(uploadRes.eggtray.firebaseUrl, size.value);
            const printResult = {
                success: true,
                message: "Print Successful"
            };
            if(!printResult.success) {
                 dispatch(setIsPrintFail(true));
                 dispatch(setPrintErrorMessage(printResult.message as string));
                 throw new Error("Failed to print the QR code.");
            }

       
            toast({
                title: "Success",
                className: "bg-green-500 text-white",
                description: language === "english" ? "Eggs counted successfully!" : language === "bisaya" ? "Successful ra ang pag count sa eggs!" : "Matagumpay na na-count ang mga itlog!",
                duration: 4000
            });

            setIsProcessing(false);
    };
    
    useEffect(() => {
        setLabelCopy(labels || []);     
        setSelectedLabel(labels?.[0] || null);
    }, [labels]);

    // useEffect(() => {
    //     setTempPicture(picture || null);
    // }, [picture])

    return (
        <>
            <AnimatePresence initial={false}>
                <motion.div
                    key="content"
                    initial={{ x: isSettingsOpen ? "100%" : 0 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`flex flex-col md:flex-row w-full md:h-full h-1/5  bg-black/10`}
                    style={{ position: isSettingsOpen ? "absolute" : "relative", right: 0 }}
                >
                    {/* Left view (form) */}
                    <div className="ml-4 flex-1 flex flex-col p-8 backdrop-blur-sm ">
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold">{language === "english" ? "Insert Egg Tray" : language === "bisaya" ? "Ibutang ang Egg Tray" : "Ipasok ang Egg Tray"}</h1>
                        </div>
                        <div className="space-y-8 w-72">
                            <div>
                            <Label htmlFor="layerHouse" className="text-xl">Layer House</Label>
                                <select
                                    id="layerHouse"
                                    className="text-black mt-1 block w-full pl-4 pr-12 py-3 text-lg border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-lg rounded-md"
                                    onChange={(e) => {
                                        const selected = labelCopy.find(label => label.labelName === e.target.value);
                                        setSelectedLabel(selected || null);
                                    }}
                                    defaultValue={labelCopy[0]?.labelName || "null"}
                                >
                                    {labelCopy.map((label) => (
                                        <option key={label.labelID} value={label.labelName}>
                                            {label.displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="size" className="text-xl">Size</Label>
                                <select
                                    id="size"
                                    className="text-black mt-1 block w-full pl-4 pr-12 py-3 text-lg border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-lg rounded-md"
                                    defaultValue="S"
                                >
                                    <option value="S">Small</option>
                                    <option value="M">Medium</option>
                                    <option value="L">Large</option>
                                    <option value="XL">Extra Large</option>
                                    <option value="J">Jumbo</option>
                                    <option value="CR">Cracked</option>

                                </select>
                            </div>

                            <MotionButton
                                whileTap={{ scale: 0.95, filter: "0 0 0 2rem rgba(200, 24, 0, 0.4)", boxShadow: "0 0 2rem rgba(6, 69, 255, 0.4)" }}
                                whileHover={{ scale: 1.02 }}
                                className="select-none w-full rounded-xl px-4 py-2 bg-white text-gray-800 hover:!bg-white hover:!text-gray-800 font-bold"  
                                onClick={handleConfirm}
                                disabled={!isCameraOn || isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-8 w-8 animate-spin" /> {/* Increased icon size */}
                                        {language === "english" ? "Processing..." : language === "bisaya" ? "Gina-proseso..." : "Ini-process..."}
                                    </>
                                ) : (
                                    language === "english" ? "Scan Tray" : language === "bisaya" ? "Kuha og Litrato" : "Kumuha ng Larawan"
                                )}
                            </MotionButton>
                        </div>
                    </div>
                </motion.div>
                {isSettingsOpen && (
                    <motion.div
                        key="settings"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute inset-0 bg-background z-40"
                    >
                        <Settings />
                    </motion.div>
                )}
            </AnimatePresence>
            <PrintRetryModal onRetry={handleRetryPrint} onClose={handleDismiss} />
        </>
    );
};

