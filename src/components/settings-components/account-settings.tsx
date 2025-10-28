import { AnimatePresence, motion } from "framer-motion";
import { UnlockIcon, KeyIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { containerVariants, itemVariants } from "./_settings_";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { useState } from "react";
import { setShowAccountSettings } from "@/features/settings/settings-slice";
import { useToast } from "../ui/use-toast";
import { useForm, Controller } from "react-hook-form";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useApparatus } from "@/hooks/useApparatus";
import { closeKeyboard, focusValue, focusValue2, openKeyboard, resetInputs, setInputLimit, updateValue, updateValue2 } from "@/features/keyboard/keyboard-slice";
import { setPinCode } from "@/features/egg-counting-apparatus/egg-counting-apparatus-slice";

type ChangePinFormData = {
  newPin: string;
  confirmNewPin: string;
};

export const AccountSettings = () => {
    const dispatch = useAppDispatch();
    const pinCode = useAppSelector((state) => state.eggCountingApparatus?.pinCode);
    const showAccountSettings = useAppSelector((state) => state.settings?.showAccountSettings);
    const currentPin = useAppSelector((state) => state.keyboard?.value);
    const newPin = useAppSelector((state) => state.keyboard?.value);
    const confirmNewPin = useAppSelector((state) => state.keyboard?.value2);
    const apparatusID = useAppSelector((state) => state.eggCountingApparatus?.eggCountingApparatusID);
    const ownerID = useAppSelector((state) => state.eggCountingApparatus?.ownerID);
    const language = useAppSelector((state) => state.settings?.language);
    const apparatusName = useAppSelector((state) => state.eggCountingApparatus?.displayName);
    const { toast } = useToast();
    const [showCurrentPin, setShowCurrentPin] = useState(false);
    const [showNewPin, setShowNewPin] = useState(false);
    const [showConfirmPin, setShowConfirmPin] = useState(false);

    const { updateApparatusPIN } = useApparatus();

    const { control, handleSubmit, formState: { errors }, reset } = useForm<ChangePinFormData>({
        defaultValues: {
            newPin: '',
            confirmNewPin: '',
        },
    });
    
    const handleFocusPinAttempt = () => {
        dispatch(setInputLimit(6));
        dispatch(focusValue());
        dispatch(openKeyboard());
    };
    
    const handleChangePinAttempt = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateValue(e.target.value));
    };
    
    const handleFocusNewPin = () => {
        dispatch(setInputLimit(6));
        dispatch(focusValue());
        dispatch(openKeyboard());
    };
        
    const handleFocusConfirmPin = () => {
        dispatch(setInputLimit(6));
        dispatch(focusValue2());
        dispatch(openKeyboard());
    };

    const handleChangeNewPin = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateValue(e.target.value));

    };


    const handleChangeConfirmPin = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateValue2(e.target.value));
    };

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentPin === pinCode) {
            dispatch(setShowAccountSettings(true));
            dispatch(resetInputs());
            dispatch(closeKeyboard());
            dispatch(setInputLimit(60));
        } else {
            toast({
                title: "Error",
                description: "Incorrect PIN",
                variant: "destructive",
                duration: 5000,
            });
        }
    };

    const handleChangePin = async (data: ChangePinFormData) => { 
        console.log(data)
        if (newPin !== confirmNewPin) {
            // setError('confirmNewPin', { type: 'match', message: 'PINs must match' });
            toast({
                title: "Error",
                description: language === "english" ? "PINs must match" : language === "bisaya" ? "Kailangan pareho ang PIN" : "Kinakailangan pareho ang PIN",
                variant: "destructive",
                duration: 3000,
            })
            return;
        }
        else if (!newPin) {
            toast({
                title: "Error",
                description: language === "english" ? "New PIN is required" : language === "bisaya" ? "Kailangan bago ang PIN" : "Kinakailangan bago ang PIN",
                variant: "destructive",
                duration: 3000,
            })
            return;
        } else if (newPin.length < 4) {
            toast({
                title: "Error",
                description: language === "english" ? "PIN must be at least 4 digits" : language === "bisaya" ? "Kailangan 4 digits pataas ang PIN" : "Kinakailangan 4 digits pataas ang PIN",
                variant: "destructive",
                duration: 3000,
            })
            return;
        } 

        try {
            const response = await updateApparatusPIN(newPin);
            if (!response.success) {
                throw new Error(response.message);
            }
            toast({
                title: "Success",
                description: language === "english" ? "PIN changed successfully" : language === "bisaya" ? "Successful ang pag change sa PIN" : "Matagumpay na napalitan ang PIN",
                className: "bg-green-500 text-white",
                duration: 3000,
            });
            dispatch(resetInputs());
            dispatch(setInputLimit(60));
            dispatch(setPinCode(newPin));
            dispatch(closeKeyboard());
            reset();
        } catch (error: unknown) {
            toast({
                title: "Detected Missing Connection",
                description: error instanceof Error ? error.message : `${error}`,
                className: "bg-yellow-500 text-white",
                duration: 5000,
            });
        }
    };

    const renderPinInput = (name: "newPin" | "confirmNewPin", label: string, showState: boolean, setShowState: (state: boolean) => void) => (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">{label}</Label>
            <div className="relative">
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type={showState ? "text" : "password"}
                            className="bg-gray-800 border-gray-700 pr-10"
                            required
                            value={name === "newPin" ?  newPin : confirmNewPin }
                            onFocus={name === "newPin" ? handleFocusNewPin : handleFocusConfirmPin}
                            onChange={name === "newPin" ? handleChangeNewPin : handleChangeConfirmPin}
                            maxLength={6}
                            minLength={4}
                        />
                    )}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowState(!showState)}
                >
                    {showState ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
            </div>
            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
        </div>
    );

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={showAccountSettings ? "account-settings" : "pin-form"}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
            >
                <ScrollArea className="h-[400px] pr-4">
                    {!showAccountSettings ? (
                        <form onSubmit={handleUnlock} className="space-y-6">
                            <motion.div variants={itemVariants}>
                                <div className="space-y-2">
                                    <Label htmlFor="currentPin" className="text-sm font-medium">{language === "english" ? "Enter PIN" : language === "bisaya" ? "Ibutang ang PIN" : "Ilagay ang PIN"}</Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPin"
                                            type={showCurrentPin ? "text" : "password"}
                                            value={currentPin}
                                            onFocus={handleFocusPinAttempt}
                                            onChange={(e) => handleChangePinAttempt(e)}
                                            className="bg-gray-800 border-gray-700 pr-10"
                                            required
                                            maxLength={6}
                                            minLength={4}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                            onClick={() => setShowCurrentPin(!showCurrentPin)}
                                        >
                                            {showCurrentPin ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                                    <UnlockIcon className="w-4 h-4 mr-2" />
                                    {language === "english" ? "Unlock Account Settings" : language === "bisaya" ? "I-Unlock ang Account Settings" : "I-unlock ang Mga Setting ng Account"}
                                </Button>
                            </motion.div>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit(handleChangePin)} className="space-y-6">
                            <motion.div variants={itemVariants} className="space-y-4">
                                <h2 className="text-lg font-semibold">{language === "english" ? "General Information" : language === "bisaya" ? "General na Impormasyon" : "Pangkalahatang Impormasyon"}</h2>
                                <div className="space-y-2">
                                    <Label htmlFor="apparatusName" className="text-sm font-medium">Egg Counting Apparatus Name</Label>
                                    <Input
                                        id="apparatusId"
                                        type="text"
                                        className="bg-gray-800 border-gray-700"
                                        value={apparatusName}
                                        disabled
                                        maxLength={6}
                                        minLength={4}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="apparatusId" className="text-sm font-medium">Egg Counting Apparatus ID</Label>
                                    <Input
                                        id="apparatusId"
                                        type="text"
                                        className="bg-gray-800 border-gray-700"
                                        value={apparatusID}
                                        disabled
                                        maxLength={6}
                                        minLength={4}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ownerId" className="text-sm font-medium">{language === "english" ? "Linked to: Owner ID" : language === "bisaya" ? "Naka-link sa: Owner ID" : "Naka-link sa: Owner ID"}</Label>
                                    <Input
                                        id="ownerId"
                                        type="text"
                                        className="bg-gray-800 border-gray-700"
                                        value={ownerID} 
                                        disabled
                                        maxLength={6}
                                        minLength={4}
                                    />
                                </div>
                            </motion.div>
                            <Separator className="my-6" />
                            <motion.div variants={itemVariants} className="space-y-4">
                                <h2 className="text-lg font-semibold">{language === "english" ? "Change PIN" : language === "bisaya" ? "Pulihan ang PIN" : "Baguhin ang PIN"}</h2>
                                {renderPinInput("newPin", language === "english" ? "New PIN" : language === "bisaya" ? "Bago nga PIN" : "Bagong PIN", showNewPin, setShowNewPin)}
                                {renderPinInput("confirmNewPin", language === "english" ? "Confirm New PIN" : "Kumpirma ang PIN", showConfirmPin, setShowConfirmPin)}
                            </motion.div>
                            <Separator className="my-6" />
                            <motion.div variants={itemVariants}>
                                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                                    <KeyIcon className="w-4 h-4 mr-2" />
                                    {language === "english" ? "Change PIN" : language === "bisaya" ? "Pulihan ang PIN" : "Baguhin ang PIN"}
                                </Button>
                            </motion.div>
                        </form>
                    )}
                    {showAccountSettings && (
                        <motion.div variants={itemVariants} className="mt-4">
                            <Button onClick={() => dispatch(setShowAccountSettings(false))} variant="link" className="w-full justify-center text-sm text-gray-400 hover:text-white">
                                <LockIcon className="w-4 h-4 mr-2" />
                                {language === "english" ? "Lock Account Settings" : language === "bisaya" ? "I-Lock ang Account Settings" : "I-lock ang Mga Setting ng Account"}
                            </Button>
                        </motion.div>
                    )}
                </ScrollArea>
            </motion.div>
        </AnimatePresence>
    );
};