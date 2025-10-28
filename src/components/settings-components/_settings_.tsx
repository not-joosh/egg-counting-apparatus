import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { X, LockIcon, GlobeIcon, ChevronLeftIcon, AlertCircleIcon } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { PreferenceSettings } from './preference-settings'
import { AccountSettings } from './account-settings'
import { setShowAccountSettings } from '@/features/settings/settings-slice'
import { Alert, AlertDescription } from '../ui/alert'
import { useToast } from '../ui/use-toast'

interface SettingsPageProps {
    isOpen: boolean
    onClose: () => void
};

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

const MotionButton = motion(Button);

export const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
        opacity: 1, 
        scale: 1,
        transition: { 
            type: "spring",
            stiffness: 300,
            damping: 30,
            staggerChildren: 0.07
        }
    },
    exit: { 
        opacity: 0, 
        scale: 0.95,
        transition: { 
            type: "spring",
            stiffness: 300,
            damping: 30,
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
};

export default function SettingsPage({ isOpen, onClose }: SettingsPageProps) {
    const language = useAppSelector(state => state.settings?.language);
    const pinCode = useAppSelector(state => state.eggCountingApparatus?.pinCode);
    const showAccountSettings = useAppSelector(state => state.settings?.showAccountSettings);
    const { toast } = useToast();
    const [activeSection, setActiveSection] = useState('main');
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isOpen) {
            setActiveSection('main')
        }
    }, [isOpen])

    const renderSection = () => {
        switch (activeSection) {
            case 'preferences': return <PreferenceSettings />
            case 'account': return <AccountSettings />
            default: return (
                <motion.div
                    key="main"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                >
                    <motion.button
                        variants={itemVariants}
                        onClick={() => setActiveSection('preferences')}
                        className="w-full p-4 bg-gray-800 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors"
                    >
                        <div className="flex items-center">
                            <GlobeIcon className="w-6 h-6 mr-3 text-purple-500" />
                            <span className="text-lg font-semibold">Preferences</span>
                        </div>
                        <ChevronLeftIcon className="w-5 h-5 transform rotate-180" />
                    </motion.button>
                    <motion.button
                        variants={itemVariants}
                        onClick={() => setActiveSection('account')}
                        className="w-full p-4 bg-gray-800 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors"
                    >
                        <div className="flex items-center">
                            <LockIcon className="w-6 h-6 mr-3 text-purple-500" />
                            <span className="text-lg font-semibold">Account Settings</span>
                        </div>
                        <ChevronLeftIcon className="w-5 h-5 transform rotate-180" />
                    </motion.button>
                </motion.div>
            );
        };
    };

    return (
        <>
            <motion.div
                className="fixed left-0 top-0 bottom-0 w-full bg-gray-800 shadow-lg"
                initial={{ x: '-100%' }}
                animate={{ x: isOpen ? '0%' : '-100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full"
                        >
                            <motion.div
                                className="bg-gray-900 h-full rounded-lg shadow-lg w-full  overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h1 className="text-2xl font-bold text-white">
                                            {activeSection === 'main' ? 'Settings' :
                                                activeSection === 'preferences' ? 'Preferences' : 'Account'}
                                        </h1>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={onClose}
                                            className="text-gray-400 hover:text-white hover:!bg-gray-800"
                                        >
                                            <X className="w-6 h-6" />
                                        </Button>
                                    </div>
                                    {activeSection !== 'main' && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => setActiveSection('main')}
                                            className="mb-4 text-gray-400 hover:text-white hover:!bg-gray-800"
                                        >
                                            <ChevronLeftIcon className="w-5 h-5 mr-2" />
                                            Back
                                        </Button>
                                    )}
                                    {showAccountSettings && (
                                        <>
                                            <motion.div variants={itemVariants} className="space-y-4 mb-4">
                                                <Alert className="bg-yellow-500/20 border-yellow-500 text-yellow-200">
                                                    <AlertCircleIcon className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {language === "english" ? "Your account settings are currently unlocked. Please remember to lock them when you're done." : language === "bisaya" ? "Naka unlock imong account settings. Palihug ayaw kalimot ug lock paghuman." : "Kasalukuyang naka-unlock ang mga setting ng iyong account. Mangyaring tandaan na i-lock ang mga ito kapag tapos ka na."}
                                                        <span>
                                                            {` `}{language === "english" ? "Click Here to " : language === "bisaya" ? "Tuploik diri para ma " : "Mag-click dito para "}{` `} 
                                                            <MotionButton 
                                                                whileTap={{ scale: 0.98 }}
                                                                variant="ghost" 
                                                                className = "p-2 translate-y-1 h-fit w-fit text-white hover:text-black hover:!bg-white" 
                                                                size="icon" 
                                                                onClick={() => dispatch(setShowAccountSettings(false))}>
                                                                <LockIcon className="w-4 h-4" /> 
                                                                {` `} Lock
                                                            </MotionButton>
                                                        </span>
                                                    </AlertDescription>
                                                </Alert>
                                            </motion.div>
                                        </>
                                    )}
                                    <AnimatePresence mode="wait">
                                        {renderSection()}
                                    </AnimatePresence>

                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
};