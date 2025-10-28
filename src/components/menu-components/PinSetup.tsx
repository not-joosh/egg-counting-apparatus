import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setPinCode } from "@/features/egg-counting-apparatus/egg-counting-apparatus-slice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { openKeyboard, updateValue, updateValue2, resetInputs, closeKeyboard, focusValue, focusValue2, setInputLimit } from "@/features/keyboard/keyboard-slice";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";


const PinSetup = ({ onConfirm }: { onConfirm: () => void }) => {
  const dispatch = useAppDispatch();
  const pin = useAppSelector((state) => state.keyboard?.value) ?? "";
  const confirmPin = useAppSelector((state) => state.keyboard?.value2) ?? "";
  const language = useAppSelector((state) => state.settings?.language);
  const { toast } = useToast();
  const { register, handleSubmit, setValue, formState: { errors }, trigger } = useForm({
    defaultValues: {
      pin: "",
      confirmPin: "",
    },
  });

  const validatePin = () => {
    if (pin.length < 4 || pin.length > 6) {
      toast({
        title: "Error",
        description: language === "english" ? "PIN must be between 4 and 6 digits." : "Kailangan naa sa 4 ug 6 digits ang PIN.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    if (pin !== confirmPin) {
      toast({
        title: "Error",
        description: language === "english" ? "PINs do not match." : "Dili pareho ang PIN",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    return true;
  };

  const onSubmit = (data: any) => {
    console.log(data);
    console.log(pin);
    if (!validatePin()) {
      return;
    }

    dispatch(setPinCode(pin));
    dispatch(closeKeyboard());
    onConfirm();
  };

  const handleFocusPin = () => {
    dispatch(focusValue());
    dispatch(setInputLimit(6));
    dispatch(openKeyboard());
  };

  const handleFocusConfirm = () => {
    dispatch(focusValue2());
    dispatch(setInputLimit(6));
    dispatch(openKeyboard());
  };

  const handleChangePin = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateValue(e.target.value));
    setValue("pin", pin);
  };

  const handleChangeConfirmPin = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateValue2(e.target.value));
    setValue("confirmPin", confirmPin);
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
        <h2 className="text-3xl font-bold mb-4 text-white">{language === "english" ? "Create Your PIN" : language === "bisaya" ? "Pag-himo sa imong PIN" : "Gawin ang iyong PIN"}</h2>
        <p className="text-sm text-gray-300">
          {language === "english" ? "This PIN will be used to secure your account" : language === "bisaya" ? "Gamiton ang PIN para masecure imong account" : "Gagamitin ang PIN na ito para i-secure ang iyong account"}
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="pin" className="text-white">{language === "english" ? "Enter 4-6 digit PIN" : language === "bisaya" ? "Ibutang ang 4-6 digit nga PIN" : "Ilagay ang 4-6 na digit na PIN"}</Label>
          <Input
            id="pin"
            type="password"
            placeholder={language === "english" ? "Enter PIN" : language === "bisaya" ? "Ibutang ang PIN" : "Ilagay ang PIN"}
            maxLength={6}
            value={pin}
            {...register("pin")}
            onChange={handleChangePin}
            onFocus={handleFocusPin}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="confirmPin" className="text-white">{language === "english" ? "Confirm PIN" : language === "bisaya" ? "Kumpirma ang PIN" : "Kumpirmahin ang PIN"}</Label>
          <Input
            id="confirmPin"
            type="password"
            placeholder={language === "english" ? "Confirm PIN" : language === "bisaya" ? "Kumpirma ang PIN" : "Kumpirmahin ang PIN"}
            maxLength={6}
            value={confirmPin}
            {...register("confirmPin")}
            onChange={handleChangeConfirmPin}
            onFocus={handleFocusConfirm}
            className="mt-2"
          />
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            {language === "english" ? "Confirm PIN" : language === "bisaya" ? "Kumpirma ang PIN" : "Kumpirmahin ang PIN"}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default PinSetup;
