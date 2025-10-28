import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { motion } from 'framer-motion';
import { AlertTriangle, Smartphone, Globe, MousePointer } from 'lucide-react';
import { Button } from '../ui/button';
import { setLabels } from '@/features/egg-counting-apparatus/egg-counting-apparatus-slice';

export const NoLabelsModal = () => {
    const labels = useAppSelector((state) => state.eggCountingApparatus?.labels) ?? [];
    const language = useAppSelector((state) => state.settings?.language);
    const isAuthenticated = useAppSelector((state) => state.routingController?.isAuthenticated);
    const dispatch = useAppDispatch();
    if (labels.length === 0 && isAuthenticated) {
        return (
            <div className="select-none fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl"
                >
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            className="relative mb-6"
                        >
                            <AlertTriangle className="text-yellow-500 w-20 h-20" />
                            <motion.div
                                className="absolute inset-0 border-4 border-yellow-500 rounded-full"
                                initial={{ scale: 0.5, opacity: 0.5 }}
                                animate={{ scale: 1.2, opacity: 0 }}
                                transition={{ duration: 5, repeat: Infinity }}
                            />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-6">
                            {language === "english"? "Label Required" : "Kinahanglan ang Label"}
                        </h2>
                        <p className="text-gray-300 mb-6 text-lg">
                            {language === "english"
                                ? "To use this app, you need to create at least one label on our website." 
                                : "Aron magamit kini nga app, kinahanglan ka mohimo ug bisan usa ka label sa among website."}
                        </p>
                        <div className="flex justify-center items-center space-x-8 mb-6">
                            {/* <motion.div
                                className="flex flex-col items-center"
                                whileHover={{ scale: 1.1 }}
                            >
                                <Smartphone className="text-blue-400 w-12 h-12 mb-2" />
                                <span className="text-gray-300 text-sm">
                                    {language === "english"? "Use Phone" : "Gamita ang Telepono"}
                                </span>
                            </motion.div> */}
                            
                            <motion.div
                                className="flex flex-col items-center"
                                whileHover={{ scale: 1.1 }}
                            >
                                <Globe className="text-purple-400 w-12 h-12 mb-2" />
                                <span className="text-gray-300 text-sm">
                                    {language === "english"? "Visit the Website" : "Bisitaha ang Website"}
                                </span>
                            </motion.div>
                            <motion.div
                            className="relative mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="bg-purple-500 text-white py-2 px-4 rounded-md font-semibold">
                                {language === "english"? "Add Label" : "Idugang ang Label"}
                            </div>
                            <motion.div
                                className="absolute -right-5 top-1"
                                animate={{ 
                                    x: [0, 20, 0],
                                    y: [0, 10, 0],
                                }}
                                transition={{ 
                                    repeat: Infinity, 
                                    duration: 5.5,
                                    ease: "easeInOut",
                                }}
                            >
                                <MousePointer className="text-white w-6 h-6" />
                            </motion.div>
                        </motion.div>
                        </div>
                        <p className="text-gray-400 text-sm italic">
                            {language === "english"
                                ? "This message will close once a label is created."
                                : "Human sa paghimo ug label, balik sa kini nga screen ug i-refresh ang page."}
                        </p>
                        <Button onClick={() => {
                     

                            const labels = [
                                {
                                    labelID: "0",
                                    organizationID: "1",
                                    displayName: "Chicken House 1",
                                    labelName: "Chicken House 1",
                                },
                                {
                                    labelID: "1",
                                    organizationID: "1",
                                    displayName: "Chicken House 2",
                                    labelName: "Chicken House 2",
                                },
                                {
                                    labelID: "2",
                                    organizationID: "1",
                                    displayName: "Chicken House 3",
                                    labelName: "Chicken House 3",
                                },
                                {
                                    labelID: "3",
                                    organizationID: "1",
                                    displayName: "Chicken House 4",
                                    labelName: "Chicken House 4",
                                },
                            ]
                            dispatch(setLabels(labels));
                        }}> Click here to generate Label. (Demo Purposes)</Button>
                    </div>
                </motion.div>
            </div>
        );
    }
    else return null;
};