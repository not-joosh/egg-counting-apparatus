import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { focusValue, openKeyboard, setInputLimit, updateValue } from '@/features/keyboard/keyboard-slice';
import { useEffect } from 'react';

type PinEntryProps = {
  onSubmit: (pin: string) => void;
};

const PinEntry = ({ onSubmit }: PinEntryProps) => {
  const dispatch = useAppDispatch();
  const pin = useAppSelector((state) => state.keyboard?.value);
  const language = useAppSelector((state) => state.settings?.language);

  const handleFocus = () => {
    dispatch(openKeyboard());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateValue(e.target.value));
  };
  
  useEffect(() => {
    dispatch(focusValue());
    dispatch(setInputLimit(6));
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">{language === "english" ? "Enter PIN" : language === "bisaya" ? "Ibutang ang PIN" : "Ilagay ang PIN"}</h2>
        <p className="text-sm text-gray-300">{language === "english" ? "Please enter your PIN" : language === "bisaya" ? "Palihug ug butang sa imong PIN" : "Pakilagay ang iyong PIN"}</p>
      </motion.div>
      <div>
        <Label htmlFor="pin" className="text-white">Enter PIN</Label>
        <Input
          id="pin"
          type="password"
          placeholder={language === "english" ? "Enter PIN" : language === "bisaya" ? "Ibutang ang PIN" : "Ilagay ang PIN"}
          maxLength={6}
          value={pin}
          onChange={handleChange}
          onFocus={handleFocus}
          className="mt-2"
        />
      </div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button onClick={() => onSubmit(pin?? '')} className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out">
          Submit
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PinEntry;