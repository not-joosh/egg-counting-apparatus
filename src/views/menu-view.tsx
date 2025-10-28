import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { setAuthStep } from "@/features/routing-controller/routing-slice"
import LanguageSelector from '@/components/menu-components/LanguageSelector'
import PinEntry from '@/components/menu-components/PinEntry'
import PinSetup from '@/components/menu-components/PinSetup'
import SuccessMessage from '@/components/menu-components/SuccessMessage'
import WaveBackground from '@/components/menu-components/WaveBackground'
import EmailVerification from '@/components/menu-components/EmailVerification'
import { useToast } from '@/components/ui/use-toast'
import { useApparatus } from '@/hooks/useApparatus'
import { MENU_ROUTE } from '@/lib/routes'
import { closeKeyboard, resetInputs, setInputLimit } from '@/features/keyboard/keyboard-slice'

export const MenuView = () => {
    const dispatch = useAppDispatch();
    const routeController = useAppSelector((state) => state.routingController)
    const pinCode = useAppSelector((state) => state.eggCountingApparatus?.pinCode) ?? "";
    const authStep = useAppSelector((state) => state.routingController?.authStep)
    const isIdle = useAppSelector((state) => state.routingController?.isIdle);
    const isAuthenticated = useAppSelector((state) => state.routingController?.isAuthenticated);
    const language = useAppSelector((state) => state.settings?.language);
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showAlert, setShowAlert] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleNextStep = () => {
        // handling step based on what step we are on
        dispatch(setAuthStep((authStep || 0) + 1));
    };

    const handlePinSubmit = (pinAttempt: string) => {
        try {
            setIsLoading(true)
            if(pinAttempt !== pinCode) throw new Error("Invalid PIN");
            toast({
                title: "Success",
                description: language === "english" ? "PIN Verified" : "Verified ang PIN",
                className: "bg-green-500 text-white",
            });
            dispatch(resetInputs());
            dispatch(setInputLimit(60));
            dispatch(closeKeyboard());  
            dispatch(setAuthStep(2));
        } catch(error: unknown) {
            if(error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive"
                });
            } else {
                toast({
                    title: "Error",
                    description: language === "english" ? "Error verifying PIN" : "Naay error sa pag verify ug PIN",
                    variant: "destructive"
                });
            }
        };
    };

    const handleConfirm = async () => {
        try {
            // const res = await updateApparatusPIN(pinCode ?? "1234");
            // if(!res.success) throw new Error(res.message);
            toast({
                title: "Success",
                description: "Pin Created!",
                className: "bg-green-500 text-white",
            });
            dispatch(resetInputs());
            dispatch(setInputLimit(60));
            setShowAlert(false);
            handleNextStep();
        } catch(error: unknown) {
            if(error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive"
                });
            } else {
                toast({
                    title: "Error",
                    description: language === "english" ? "Error setting PIN" : "Naay error sa pag set ug PIN",
                    variant: "destructive"
                });
            };
        };
    };

    const renderFirstTimeVisit = () => (
        <AnimatePresence mode="wait">
            {authStep === 1 && <LanguageSelector onNext={handleNextStep} />}
            {authStep === 2 && <PinSetup onConfirm={() => setShowAlert(true)} />}
            {/* {authStep === 3 && <GoogleSignIn onNext={handleNextStep} />} */}
            {authStep === 3 && <EmailVerification onNext={handleNextStep} />}
            {authStep === 4 && <SuccessMessage message={"Successfully Linked!"}/>}
        </AnimatePresence>
    );

    const renderReturningUser = () => (
        <AnimatePresence mode="wait">
            {authStep === 1 && <PinEntry onSubmit={handlePinSubmit} />}
            {authStep === 2 && <SuccessMessage message={"Successfully Verified!"}/>}
        </AnimatePresence>
    );

    useEffect(() => {
        if (isIdle) 
            navigate(MENU_ROUTE);
        if(!isAuthenticated)
            navigate(MENU_ROUTE);
    }, [isIdle, isAuthenticated, navigate]);


    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden inset-0">
            <WaveBackground />
            {/* Rendering the main content */}
            <div className="relative w-full max-w-md z-10">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-2xl backdrop-blur-sm"
                    animate={{
                        scale: [1, 1.02, 1],
                        rotate: [0, 1, 0],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
                <motion.div
                    className="relative bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {routeController?.isFirstTimeVisit ? renderFirstTimeVisit() : renderReturningUser()}
                </motion.div>
            </div>
            <AnimatePresence>
                {showAlert && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-gray-800 p-6 rounded-lg border border-purple-500 shadow-lg"
                        >
                            <h3 className="text-2xl font-bold mb-4 text-white">Confirm PIN</h3>
                            <p className="text-gray-300 mb-6">Are you sure you want to set this PIN?</p>
                            <div className="flex justify-end space-x-4">
                                <motion.button 
                                    onClick={() => setShowAlert(false)} 
                                    className="px-4 py-2 bg-gray-600 text-white rounded"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button 
                                    onClick={handleConfirm} 
                                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded"
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(167, 139, 250, 0.5)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Confirm
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MenuView