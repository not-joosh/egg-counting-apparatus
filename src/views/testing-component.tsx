import { useState } from "react";
import { useQRCode } from "@/hooks/useQRCode";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { setNetworkStatus } from "@/features/network/network-slice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { clearLabels, EggtrayFirebase, resetCache } from "@/features/egg-counting-apparatus/egg-counting-apparatus-slice";
import { useCache } from "@/hooks/useCache";
import { flask_app } from '@/lib/config'

export const TestingComponent = () => {
    const { generateQRCodeAsPNG, sendQRtoPrinter } = useQRCode();
    const [url] = useState("https://www.pornhub.com");
    const [qrCodePng, setQRCodePng] = useState<string | null>(null);
    const networkStatus = useAppSelector((state) => state.network?.networkStatus);
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const cacheList = useAppSelector((state) => state.eggCountingApparatus?.cacheList);
    const cacheCount = useAppSelector((state) => state.eggCountingApparatus?.cacheCount);
    const { processCache } = useCache();
    const latestLogin = useAppSelector((state) => state.eggCountingApparatus?.timeStampOfLogin);
    const [onLights, setOnLights] = useState(false);

    const handleGenerateQR = async () => {
        try {
            const qrCodePng = await generateQRCodeAsPNG(url); // Generate the QR code
            setQRCodePng(qrCodePng); // Save the generated QR code
            sendQRtoPrinter(url, "L"); //sending Large egg size for testing
        } catch (error: unknown) {
            console.error(error);
        }
    };

    const handleToggleLights = async () => {
        try {
            if(onLights === false){
                const res = await fetch(`${flask_app}toggle-led-on`, {
                    method: 'POST',
                })
                const results = await res.json();
                console.log(results);
                console.log("Turning on lights");
                if (results.status_code == 200) setOnLights(true);
                else{
                    toast({
                        title: `ERROR!`,
                        description: `Failed to turn on lights`,
                        duration: 3000,
                        className: "bg-red-300 text-white",
                    })
                }
            } else {
                const res = await fetch(`${flask_app}toggle-led-off`, {
                    method: 'POST',
                })
                const results = await res.json();
                console.log(results);
                console.log("Turning off lights");
                if (results) setOnLights(false);
                else{
                    toast({
                        title: `ERROR!`,
                        description: `Failed to turn off lights`,
                        duration: 3000,
                        className: "bg-red-300 text-white",
                    })
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {/* <button className = "rounded bg-black text-white px-4 py-2"onClick={handleGenerateQR}>Generate QR</button> */}
            {/* {qrCodePng && <img src={qrCodePng} alt="QR Code" />} */}
            {/* Making a button that will dispatch and toggle between states of the network */}
            {/* This button will be at the very bottom left, and there will also be a toast */}
            <section className = "fixed bottom-0 left-0">
            {/*Button to clear labels */}
            <Button 
                type="button"
                variant="outline"
                onClick = {handleToggleLights}
                >
                    {onLights? "Turn Off" : "Turn On"}
            </Button>
            <Button 
                type="button"
                variant="outline"
                onClick = {() => {
                    dispatch(clearLabels());
                    toast({
                        title: `SUCCESS!`,
                        description: `cleared label cache`,
                        duration: 3000,
                        className: "bg-green-300 text-white",
                    })
                }}
                >
                    Clear Labels
                </Button>
            <Button
                    type="button"
                    variant="outline"
                    onClick = {() => {
                        dispatch(setNetworkStatus(!networkStatus));
                        toast({
                            title: `SUCCESS!`,
                            description: `NOW NETWORK STATUS IS ${networkStatus}`,
                            duration: 3000,
                            className: "bg-green-300 text-white",
                        })
                    }}
                >
                    {networkStatus === true ? "Go Offline" : "Go Online"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick = {() => {
                        toast({
                            description: `Checking Cache`,
                            duration: 3000,
                            className: "bg-green-300 text-white",
                        })
                        console.log(cacheCount);
                        console.log(`
                            Cache Count: ${cacheCount},
                        `);
                        console.log(cacheList)
                        cacheList?.map((eggtray: EggtrayFirebase) => {
                            console.log("eggtray: ", eggtray.bestByDate)
                        })
                    }}
                >
                    View Cache
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick = {() => {
                        toast({
                            description: `Resetting Cache`,
                            duration: 3000,
                            className: "bg-green-300 text-white",
                        })
                        dispatch(resetCache());
                    }}
                >
                    Reset Cache
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick = {processCache}
                >
                    Process Cache Once
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick = {() => {
                        console.log(latestLogin);
                        
                    }}
                >
                    View Date Content
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick = {() => {
                        handleGenerateQR();
                        
                    }}
                >
                    Print QR
                </Button>
            </section>

        </>
    );
};

// import { useAppSelector } from "@/app/hooks";
// import { useToast } from "@/components/ui/use-toast";
// import { MENU_ROUTE, REDIRECT_ROUTE } from "@/lib/routes";
// import { auth } from "@/store/firebase";
// import { useNavigate } from "react-router-dom";


// export const TestingComponent = () => {
//     const { toast } = useToast();
//     const navigate = useNavigate();
//     const ownerID = useAppSelector((state) => state.eggCountingApparatus?.ownerID);
//     const secretKey = useAppSelector((state) => state.eggCountingApparatus?.secretKey);

//     const handleSignOut = async () => {
//         try {
//             await auth.signOut();
//             toast({
//                 title: "Sign Out",
//                 description: "You have successfully signed out",
//                 className: "bg-green-500 text-white",
//                 duration: 5000,
//             });
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 console.log("Error: ", error.message);
//             } else {
//                 console.log("Internal server error");
//             };
//         };
//     };

//     return (
//         <div style={{ position: "fixed", bottom: 0, left: 0, zIndex: 9999 }}>
//             <button onClick = {handleSignOut}className="text-white bg-black p-10">
//                 Sign Out
//             </button>
//             {/* The next button will be navigate to Menu Route */}
//             <button
//                 onClick={() => {
//                     navigate(MENU_ROUTE);
//                 }}
//                 className="text-black bg-white p-10"
//             >
//                 To Menu
//             </button>
//             <button
//                 onClick={() => {
//                     navigate(REDIRECT_ROUTE);
//                 }}
//                 className="text-white bg-black p-10"
//             >
//                 Redirect
//             </button>
//             {/* Button to toast the user credentials */}
//             <button
//                 onClick={() => {
    
//                     toast({
//                         title: "User Credentials",
//                         description: `${auth.currentUser?.uid}`,
//                         className: "bg-green-500 text-white top-0 right-0",
//                         duration: 5000,
//                     });
//                 }
//                 }
//                 className="text-white bg-black p-10"
//             >
//                 Toast
//             </button>
//             <button
//                 onClick={() => {
    
//                     toast({
//                         title: "Secret Key:",
//                         description: `${secretKey}`,
//                         className: "bg-green-500 text-white top-0 right-0",
//                         duration: 5000,
//                     });
//                 }
//                 }
//                 className="text-white bg-black p-10"
//             >
//                 Secret Key
//             </button>

//         </div>
//     );
// };
