import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { setEggCountingApparatusID, setDisplayName } from '@/features/egg-counting-apparatus/egg-counting-apparatus-slice'
import { setIsSetup } from '@/features/routing-controller/routing-slice'
import { Loader2, Cpu } from 'lucide-react'
import { useApparatus } from '@/hooks/useApparatus'
import WaveBackground from './menu-components/WaveBackground'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useToast } from './ui/use-toast'
import { focusValue, setInputLimit, openKeyboard, updateValue, resetInputs, closeKeyboard } from '@/features/keyboard/keyboard-slice'

export const Setup = () => {
    const dispatch = useAppDispatch()
    const networkStatus = useAppSelector((state) => state.network?.networkStatus)
    const apparatusName = useAppSelector((state) => state.keyboard?.value) ?? ''
    const { toast } = useToast();
    const { createApparatus } = useApparatus()
    const [isVisible, setIsVisible] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [apparatusID, setApparatusID] = useState('')
    const [generationStage, setGenerationStage] = useState(0)

    const handleFocus = () => {
        dispatch(focusValue());
        dispatch(setInputLimit(60));
        dispatch(openKeyboard());
      };


    const stages = [
        "Initializing quantum core...",
        "Calibrating egg detection algorithms...",
        "Synchronizing with temporal flux...",
        "Generating unique identifier...",
        "Finalizing apparatus setup..."
    ];

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setGenerationStage(prev => (prev + 1) % stages.length)
            }, 1500)
            return () => clearInterval(interval)
        }
    }, [isLoading])

    useEffect(() => {
        if (apparatusID && apparatusName) {
            const timer = setTimeout(() => {
                handleTransition()
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [apparatusID])

    const generateApparatusID = async () => {
        if(!apparatusName) throw new Error('Apparatus name is required!')
        if (!networkStatus) {
            setIsLoading(false)
            throw new Error('No internet connection detected!')
        };
        if (apparatusID) throw new Error('Apparatus ID already generated!')
        setIsLoading(true)
        setGenerationStage(0);
        try {
            // const res = await createApparatus(apparatusName)
            // if (!res.success) throw new Error(res.message)
            // const generatedID = res.message
            const generatedID = "thisisatestid.hi"
            setApparatusID(generatedID)
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: `${error}`,
                variant: 'destructive',
                duration: 5000
            });
        } finally {
            setIsLoading(false)
        }
    }

    const handleTransition = () => {
        setIsVisible(false)
        setTimeout(() => {
            dispatch(setEggCountingApparatusID(apparatusID))
            dispatch(setDisplayName(apparatusName));
            dispatch(closeKeyboard());
            dispatch(resetInputs());
            dispatch(setInputLimit(60));
            dispatch(setIsSetup(true));
        }, 500);
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 relative overflow-hidden">
                <WaveBackground />
                <AnimatePresence>
                {isVisible && (
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md z-10"
                    >
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold mb-8 text-purple-400 text-center"
                    >
                        Egg Counting Apparatus Initialization
                    </motion.h1>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-800 p-6 rounded-lg border border-purple-500 shadow-lg relative overflow-hidden"
                    >
                        <Input
                            type="text"
                            onFocus={() => handleFocus()}
                            placeholder="Enter Apparatus Name"
                            value={apparatusName}
                            onChange={(e) => dispatch(updateValue(e.target.value))}
                            className="mb-4 bg-gray-700 text-purple-300 border-purple-500 focus:border-purple-400"
                            disabled={isLoading || !!apparatusID}
                        />
                        {apparatusID ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <p className="text-xl font-mono text-purple-400 break-all text-center mb-2">
                                    {apparatusID}
                                </p>
                                <p className="text-sm text-purple-300 text-center">
                                    Apparatus ID generated successfully!
                                </p>
                            </motion.div>
                        ) : (
                            <div className="h-20 flex items-center justify-center">
                                {isLoading ? (
                                    <p className="text-purple-300 text-center">{stages[generationStage]}</p>
                                ) : (
                                    <p className="text-purple-300 text-center">Apparatus ID will appear here</p>
                                )}
                            </div>
                        )}
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: apparatusID ? 1 : 0 }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                        />
                    </motion.div>
                    
                    <div className="flex justify-center mt-6">
                        <Button
                            onClick={generateApparatusID}
                            disabled={isLoading || !!apparatusID || !apparatusName.trim()}
                            className={`w-64 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full transition duration-300 ease-in-out flex items-center justify-center ${(apparatusID || !apparatusName.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Cpu className="mr-2 h-5 w-5" />
                            )}
                            {isLoading ? 'Initializing...' : apparatusID ? 'Initialized' : 'Initialize Apparatus'}
                        </Button>
                    </div>
                    
                    <motion.div
                        className="mt-8 text-center text-sm text-purple-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        {apparatusID ? 'Transitioning to operational mode...' : 'Enter your Egg Counting Apparatus name and initialize to begin the setup process.'}
                    </motion.div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </>
    )
}