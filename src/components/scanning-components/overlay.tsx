import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { Minimize2, Maximize2 } from "lucide-react";

export const Overlay = () => {
    const mapOfCounts = useAppSelector((state) => state.eggCountingApparatus?.map_of_counts);
    const language = useAppSelector((state) => state.settings?.language);
    const [isMinimized, setIsMinimized] = useState(false);
    const [midpoint, setMidpoint] = useState(0);
    const [leftColumn, setLeftColumn] = useState<[string, number][]>([]);
    const [rightColumn, setRightColumn] = useState<[string, number][]>([]);

    if (!mapOfCounts) return null;

    useEffect(() => {
        const copyOfMapOfCounts = { ...mapOfCounts };
        const entries = Object.entries(copyOfMapOfCounts);
        const midpoint = Math.ceil(entries.length / 2);
        setMidpoint(midpoint);
        // @ts-ignore
        setLeftColumn(entries.slice(0, midpoint));
        // @ts-ignore
        setRightColumn(entries.slice(midpoint));
    }, [mapOfCounts]);

    return (
        <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 right-1/3 transform translate-x-1/3 w-64 bg-gray-900 shadow-lg overflow-hidden rounded-b-xl"
        >
            <motion.div
                layout
                className="bg-gray-800 text-gray-100 p-2 flex justify-between items-center rounded-b-xl px-4"
            >
                <h2 className="text-sm font-semibold">{language === "english" ? "Egg Tray Counts" : language === "bisaya" ? "Na Ihap nga Egg Tray" : "Bilang ng Egg Tray"}</h2>
                <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-gray-700 rounded-full transition-colors duration-200"
                >
                    {isMinimized ? <Maximize2 className="ml-2 mr-2" size={18} /> : <Minimize2 className="ml-2 mr-2" size={18} />}
                </button>
            </motion.div>
            <AnimatePresence initial={false}>
                {!isMinimized && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden rounded-b-xl"
                    >
                        <div className="p-2 flex max-h-[calc(100vh-40px)] overflow-y-auto !rounded-b-xl">
                            <div className="w-1/2 pr-1 space-y-2">
                                {leftColumn.map(([size, count], index) => (
                                    <motion.div
                                        key={size}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        className="flex flex-row items-center bg-gradient-to-r from-gray-800 to-gray-700 rounded-md p-1 shadow-md"
                                    >
                                        <span className="text-s text-gray-300 font-medium">{size}</span>
                                        <span className="text-xs ml-2 font-bold text-gray-100 bg-gray-600 px-2 py-1 rounded-full mt-1">
                                            {count}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="w-1/2 pl-1 space-y-2">
                                {rightColumn.map(([size, count], index) => (
                                    <motion.div
                                        key={size}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2, delay: (index + midpoint) * 0.05 }}
                                        className="flex flex-row items-center bg-gradient-to-r from-gray-800 to-gray-700 rounded-md p-1 shadow-md"
                                    >
                                        <span className="text-s text-gray-300 font-medium">{size}</span>
                                        <span className="text-xs ml-2 font-bold text-gray-100 bg-gray-600 px-2 py-1 rounded-full mt-1">
                                            {count}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
};