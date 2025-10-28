import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./_settings_";
import { setLanguage } from "@/features/settings/settings-slice";
import { useToast } from "../ui/use-toast";

export const PreferenceSettings = () => {
    const dispatch = useAppDispatch();
    const language = useAppSelector((state) => state.settings?.language);
    const { toast } = useToast();
    const handleLanguageChange = (value: string) => {
        dispatch(setLanguage(value));
        toast({
            title: "Success",
            description: language === "english" ? `Language set to ${value}` : language === "bisaya" ? `${value} ang naset nga lenggwahe` : `Itinakda sa ${value} ang wika`,
            className: "bg-green-500 text-white",
            duration: 3000,
        });
    };
    return (
        <motion.div
            key="preferences"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
        >
            <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="language" className="text-lg font-semibold">{language === "english" ? "Language" : language === "bisaya" ? "Lenggwahe" : "Wika"}</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language" className="w-full bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="bisaya">Bisaya</SelectItem>
                        <SelectItem value="tagalog">Tagalog</SelectItem>
                    </SelectContent>
                </Select>
            </motion.div>
            {/* <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label htmlFor="theme-mode" className="text-lg font-semibold">Dark Mode</Label>
                    <p className="text-sm text-gray-400">
                        {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                    </p>
                </div>
                <Switch
                    id="theme-mode"
                    checked={isDarkMode}
                    onCheckedChange={handleThemeToggle}
                />
            </motion.div> */}
        </motion.div>
    );
};