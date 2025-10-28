import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setLanguage } from '@/features/settings/settings-slice';

const LanguageSelector = ({ onNext }: { onNext: () => void }) => {
    const dispatch = useAppDispatch();
    const [language, setLanguageState] = useState('english'); // Default language state
    const languageSelected = useAppSelector((state) => state.settings?.language)
    const handleNext = () => {
        dispatch(setLanguage(language)); // Dispatch the selected language to Redux
        onNext();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="text-center"
            >
                <h2 className="text-3xl font-bold mb-4 text-white">{languageSelected === "english" ? "Select Language" : languageSelected === "bisaya" ? "Pili ug Lenggwahe" : "Piliin ang Wika"}</h2>
                <p className="text-sm text-gray-300">{languageSelected === "english" ? "Choose your preferred language" : languageSelected === "bisaya" ? "Pili sa imong gusto nga lenggwahe" : "Piliin ang iyong gustong wika"}</p>
            </motion.div>

            <div>
                <Label htmlFor="language" className="text-white">{languageSelected === "english" ? "Language" : languageSelected === "bisaya" ? "Lenggwahe" : "Wika"}</Label>
                <select
                id="language"
                value={language} // Controlled by local state
                onChange={(e) => setLanguageState(e.target.value)} // Update local state
                className="w-full mt-2 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="english">English</option>
                    <option value="bisaya">Bisaya</option>
                    <option value="tagalog">Tagalog</option>
                </select>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    onClick={handleNext}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                    Next
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default LanguageSelector;
