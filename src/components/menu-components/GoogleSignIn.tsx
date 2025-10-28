import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { setIsRedirect } from '@/features/routing-controller/routing-slice';
import { REDIRECT_ROUTE } from '@/lib/routes';
import { GoogleIcon } from '../icons/icon';


const GoogleSignIn = ({ onNext }: { onNext: any }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const handleStep = () => {
        dispatch(setIsRedirect(true));
        navigate(REDIRECT_ROUTE);
        // @ts-ignore
        if(3 === 4) { // This is just a placeholder for the actual condition
            onNext();
        }
    };
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="text-center">
                <h2 className="text-3xl font-bold mb-4 text-white">Connect Your Account</h2>
                <p className="text-sm text-gray-300">Link your Google account for seamless access</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => handleStep()} className="w-full flex items-center justify-center py-3 px-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out">
                    <GoogleIcon />
                    <span>Sign in with Google</span>
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default GoogleSignIn