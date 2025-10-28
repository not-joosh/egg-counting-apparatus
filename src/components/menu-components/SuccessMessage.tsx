import { motion } from 'framer-motion'
import { CheckIcon } from "lucide-react"
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HOME_ROUTE } from '@/lib/routes'
import { useDispatch } from 'react-redux'
import { setAuthStep, setIsAuthenticated, setIsFirstTimeVisit } from '@/features/routing-controller/routing-slice'
import { useAppSelector } from '@/app/hooks'
import { setForceUpdate, setTimeOfLogin } from '@/features/egg-counting-apparatus/egg-counting-apparatus-slice'
import { doc, updateDoc } from 'firebase/firestore';
import { eggCountingApparatusRef } from '@/store/firebase';

interface SuccessMessageProps {
    message: string
};

const SuccessMessage = ({message}: SuccessMessageProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const language = useAppSelector((state) => state.settings?.language);
    const apparatusID = useAppSelector((state) => state.eggCountingApparatus?.eggCountingApparatusID) ?? "";
    const networkStatus = useAppSelector((state) => state.network?.networkStatus);

    // const triggetMonitorFetch = async() => {
    //     try {
    //         // Getting the document that matches the apparatusID
    //         const docRef = doc(eggCountingApparatusRef, apparatusID);
    //         await updateDoc(docRef, { hasNewLabels: true, hasNewPin: true });
    //     } catch (error: unknown) {
    //         console.error("Error updating the hasNewPin field in the firebase document");
    //         console.error(error);
    //     };
    // }
    
    useEffect(() => {
        // 6 second timeout, then navigating to HOME_ROUTE
        // updating the firebasedoc using the eggCounting Apparatus ID
        // if(networkStatus) {
        //     triggetMonitorFetch();
        // }
        const timeout = setTimeout(() => {
            // We also save the date time stamp of this login 
            dispatch(setForceUpdate(true));
            dispatch(setIsAuthenticated(true));
            dispatch(setTimeOfLogin(new Date().toISOString()));
            // dispatch(setIsIdle(false));
            dispatch(setIsFirstTimeVisit(false));
            dispatch(setAuthStep(1));
            navigate(HOME_ROUTE);
        }, 3500);
        return () => clearTimeout(timeout);
    }, []);
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 text-center"
        >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}>
                <CheckIcon className="mx-auto h-20 w-20 text-green-500" />
                <h2 className="mt-4 text-3xl font-extrabold text-white">{message}</h2>
                <p className="text-xl text-gray-300">{language === "english" ? "Please wait as we redirect you..." : language === "bisaya" ? "Palihug ug tagad sa pag redirect..." : "Mangyaring maghintay habang nire-redirect ka namin..."}</p>
            </motion.div>
            <motion.div
                className="w-full bg-gray-700 h-2 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
            >
                <motion.div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full"
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 3, ease: 'easeInOut' }}
                />
            </motion.div>
        </motion.div>
    )
}

export default SuccessMessage