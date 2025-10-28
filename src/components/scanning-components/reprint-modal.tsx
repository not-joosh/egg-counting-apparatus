import { useAppSelector } from "@/app/hooks";
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PrintRetryModalProps {
    onRetry: () => void;
    onClose: () => void;
}

export const PrintRetryModal = ({ onRetry, onClose }: PrintRetryModalProps) => {
    const isPrintFailed = useAppSelector((state) => state.eggCountingApparatus?.isPrintFail);
    const printErrorMessage = useAppSelector((state) => state.eggCountingApparatus?.printErrorMessage);
    const language = useAppSelector((state) => state.settings?.language);
    var turnedOff: Boolean
    if (!isPrintFailed) return <></>;
    if (language === 'english') {
        turnedOff = printErrorMessage === "The printer is out of paper or the lid is not closed properly. Please resolve the issue. The print will be retried automatically.";
    } else if (language === 'bisaya') {
        turnedOff = printErrorMessage === "Ang printer wala na ug papel o ang takupan wala na isara. Ayaw pagdumot sa isyu. Ang print mao ang pag retry sa kaugalingon.";
    } else {
        turnedOff = printErrorMessage === "Ang printer ay wala sa papel o ang takip ay hindi nakasara nang maayos. Pakiresolba ang isyu. Ang pag-print ay awtomatikong muling susubukan.";
    }
    console.log(printErrorMessage)
    console.log("turned off? ", turnedOff)
    return (
        <div className="select-none fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
            >
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    >
                        <AlertTriangle className="text-yellow-500 w-16 h-16 mb-4" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-4">{language === "english" ? "QR Code Printing Failed" : language === "bisaya" ? "Wala na Print ang QR Code" : "Nabigo ang Pag-print ng QR Code"}</h2>
                    <p className="text-gray-300 mb-6">
                    {turnedOff
                            ? (language === "english"
                                ? "The printer is out of paper or the lid is not closed properly. Please resolve the issue. The print will be retried automatically."
                                : language === "bisaya" ? "Ang printer wala na ug papel o ang takupan wala na isara. Ayaw pagdumot sa isyu. Ang print mao ang pag retry sa kaugalingon."
                                : "Ang printer ay wala sa papel o ang takip ay hindi nakasara nang maayos. Pakiresolba ang isyu. Ang pag-print ay awtomatikong muling susubukan.")
                            : (language === "english"
                                ? "It looks like the printer is not turned on. Turn on printer then click on Retry to proceed with reprinting."
                                : language === "bisaya" ? "I-tuplok ang Retry para ma sugdan ang pag reprint."
                                : "I-turn on ang printer pagkatapos i-click ang Retry para magpatuloy sa pag-reprint.")
                    }
                                </p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {turnedOff
                        ?
                        <>
                        <Button
                        onClick={onClose}
                        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-full flex items-center"
                    >
                        Dismiss
                    </Button>
                    <Button
                    onClick={onRetry}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-full flex items-center"
                >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Retry
                </Button>
                </>
                    :
                    <Button
                            onClick={onRetry}
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-full flex items-center"
                        >
                            <RefreshCw className="mr-2 h-5 w-5" />
                            Retry
                        </Button>}
                        
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};
