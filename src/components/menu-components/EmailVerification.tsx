import { useState, useRef, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from '../ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/app/hooks';
import { closeKeyboard, focusValue, openKeyboard, resetInputs, setInputLimit, updateValue } from '@/features/keyboard/keyboard-slice';

interface EmailVerificationProps {
    onNext: () => void;
}

interface EmailForm {
    email: string;
}

interface OtpForm {
    otp: string;
}

const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
};

const EmailVerification = ({ onNext }: EmailVerificationProps) => {
    const expiration_value = 140;
    const resend_value = 30;
    const fixedValue = useAppSelector((state) => state.routingController?.otp);
    const emailInput = useAppSelector((state) => state.keyboard?.value) ?? '';
    const otp = useAppSelector((state) => state.keyboard?.value) ?? '';
    const language = useAppSelector((state) => state.settings?.language);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [isLabels, setIsLabels] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [otpExpiryTimer, setOtpExpiryTimer] = useState(expiration_value);
    const [isOverrideMode, setIsOverrideMode] = useState(false);
    const { toast } = useToast();
    // const { sendOtpToEmail, verifyOtp } = useAuth();
    const dispatch = useDispatch();
    

    const {
        register: emailRegister,
        handleSubmit: handleEmailSubmit,
        formState: { errors: emailErrors },
        setValue: setEmailValue,
        setError: setEmailError,
        clearErrors: clearEmailErrors,
    } = useForm<EmailForm>();

    const {
        control,
        handleSubmit: handleOtpSubmit,
        formState: { errors: otpErrors },
        setValue,
        reset: resetOtpForm,
        setError: setOtpError,
        clearErrors: clearOtpErrors,
    } = useForm<OtpForm>();

    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('email', { type: 'required', message: language === "english" ? 'Email is required' : language === "bisaya" ? 'Required ang email' : 'Kinakailangan ang email' });
            return false;
        }
        if (!emailRegex.test(email)) {
            setEmailError('email', { type: 'pattern', message: language === "english" ? 'Invalid email format' : language === "bisaya" ? 'Dili sakto ang email nga format' : 'Hindi tamang format ng email' });
            return false;
        }
        clearEmailErrors('email');
        return true;
    };

    const validateOtp = (otp: string) => {
        if (!otp) {
            setOtpError('otp', { type: 'required', message: language === "english" ? 'OTP is required' : language === "bisaya" ? 'Kailangan ang OTP' : 'Kinakailangan ang OTP' });
            return false;
        }
        if (otp.length !== 6) {
            setOtpError('otp', { type: 'length', message: language === "english" ? 'OTP must be 6 digits' : language === "bisaya" ? 'Kailangan nga 6 digits ang OTP' : 'Kinakailangan 6 digits ang OTP' });
            return false;
        }
        clearOtpErrors('otp');
        return true;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        dispatch(updateValue(newEmail));
        setEmailValue("email", newEmail, { shouldValidate: true });
        validateEmail(newEmail);
    };

    const handleFocusEmail = () => {
        dispatch(focusValue());
        dispatch(setInputLimit(60));
        dispatch(openKeyboard());
    };

    const onEmailSubmit = async (data: EmailForm) => {
        if (!validateEmail(data.email)) return;
        setIsLoading(true);
        try {

            // const res = await sendOtpToEmail(data.email, isOverrideMode);
            // if(!res.success) throw new Error(res.message);
            // if(isOverrideMode) {
            //     toast({
            //         title: "Overridee Mode", 
            //         description: `The OTP IS ${fixedValue}, please use this to login.`,
            //         className: "bg-yellow-500 text-black",
            //         duration: 100000
            //     })
            // }
            setIsLabels(true);
            setEmail(data.email);
            setOtpSent(true);
            setStep(2);
            dispatch(resetInputs());
            dispatch(closeKeyboard());
            dispatch(setInputLimit(6));
            setResendTimer(resend_value);
            setOtpExpiryTimer(expiration_value);
        } catch (error) {
            console.error("Error sending OTP", error);
            let errorMessage = "Error occurred."
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === "string") {
                errorMessage = error;
            }
            toast({
                title: "Error",
                description: `${errorMessage}`,
                className: "bg-red-500 text-white",
                duration: 5000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onOtpSubmit = async (data: OtpForm) => {
        console.log(data.otp);
        console.log(otp);
        if (!validateOtp(data.otp)) return;

        if (otpExpiryTimer === 0) {
            toast({
                title: "OTP Expired",
                description: language === "english" ? "The OTP has expired. Please request a new one." : language === "bisaya" ? "Expired ang OTP. Palihug pangayo ug bago" : "Nag-expire na ang OTP. Mangyaring humiling ng bago.",
                className: "bg-yellow-500 text-white",
                duration: 5000
            });
            return;
        }

        setIsLoading(true);
        try {
            // const success = await verifyOtp(email, data.otp);
            const success = true;
            if(!success) throw new Error("Invalid OTP");
            dispatch(resetInputs());
            dispatch(setInputLimit(60));
            dispatch(closeKeyboard());
            onNext();
        } catch (error) {
            console.error("Error verifying OTP", error);
            toast({
                title: "Error",
                description: language === "english" ? "Invalid OTP. Please try again." : language === "bisaya" ? "Dili mao ang OTP. Palihug ug usab." : "Hindi tama ang OTP. Subukan muli.",
                className: "bg-red-500 text-white",
                duration: 5000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        setIsLoading(true);
        try {
            // const success = await sendOtpToEmail(email, isOverrideMode);
            const success = true;
            if(!success) throw new Error(language === "english" ? "Failed to resend OTP" : language === "bisaya" ? "Wala na send ug balk ang OTP" : "Hindi naipadala ang OTP");
            setOtpSent(true);
            setResendTimer(resend_value);
            setOtpExpiryTimer(expiration_value);
            resetOtpForm();
            // if(isOverrideMode) {
// console.log("overrided");
            // } else {
                toast({
                    title: "OTP Resent",
                    description: language === "english" ? "A new OTP has been sent to your email." : language === "bisaya" ? "Naay bago nga OTP nga na send sa imong email." : "May bagong OTP na naipadala sa iyong email.",
                    className: "bg-green-500 text-white",
                    duration: 5000
                });             
            // }
        } catch (error) {
            console.error("Error resending OTP", error);
            toast({
                title: "Error",
                description: language === "english" ? "Failed to resend OTP. Please try again." : language === "bisaya" ? "Wala na resend ang OTP. Palihug ug usab." : "Hindi naipadala ang OTP. Subukan muli.",
                className: "bg-red-500 text-white",
                duration: 5000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if(otpInputRefs.current.length >= 5 || otpInputRefs.current.length == 0 ) {  return }
        else {
            if (value.length <= 1) {
                const newOtp = otpInputRefs.current.map((input, i) => 
                    i === index ? value : input?.value || ''
                ).join('');
                dispatch(updateValue(value));
                setValue('otp', newOtp);
                validateOtp(newOtp);
        
                if (value.length === 1 && index < 5) {
                    otpInputRefs.current[index + 1]?.focus();
                }
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && index > 0 && !otpInputRefs.current[index]?.value) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleFocus = () => {
        dispatch(focusValue()); 
        dispatch(openKeyboard());
    };


    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (otpExpiryTimer > 0 && otpSent) {
            interval = setInterval(() => {
                setOtpExpiryTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (otpExpiryTimer === 0 && otpSent) {
            toast({
                title: "OTP Expired",
                description: language === "english" ? "The OTP has expired. Please request a new one." : language === "bisaya" ? "Expired na ang OTP. Palihug request ug bago." : "Nag-expire na ang OTP. Mangyaring humiling ng bago.",
                className: "bg-yellow-500 text-white",
                duration: 5000
            });
        }
        return () => clearInterval(interval);
    }, [otpExpiryTimer, otpSent, toast, language]);

    useEffect(() => {
        if (step === 2) {
            otpInputRefs.current[0]?.focus();
        }
    }, [step]);

    useEffect(() => {
        setValue("otp", otp)
        validateOtp(otp);
    }, [otp, setValue])

    useEffect(() => {
        setEmailValue("email", emailInput, { shouldValidate: true });
    }, [emailInput, setEmailValue]);


    return (
        <div className="space-y-6 relative">
            {/* <Button
                type="button"
                onClick={() => {
                    setIsOverrideMode((prev) => !prev);
                }}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white"
            >
                {isOverrideMode ? "Overide: Enabled" : "Overide: Disabled"}
            </Button> */}
            <div className="flex justify-center mb-6">
                <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
                    <div className="w-16 h-1 bg-gray-300 mx-2"></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
                </div>
            </div>
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.form
                        key="email-form"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        onSubmit={handleEmailSubmit(onEmailSubmit)}
                        className="space-y-6"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-white">{language === "english" ? "Enter Your Email" : language === "bisaya" ? "Ibutang Imong Email" : "Ilagay ang Iyong Email"}</h2>
                            <p className="text-sm text-gray-300">{language === "english" ? "We will send an OTP to your email for verification" : language === "bisaya" ? "Mag send mi ug OTP sa imong email para verification." : "Magpapadala kami ng OTP sa iyong email para sa pagpapatunay"}</p>
                        </motion.div>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={emailInput}
                            className="w-full"
                            {...emailRegister("email")}
                            onFocus={handleFocusEmail}
                            onChange={handleEmailChange}
                        />
                        {emailErrors.email && <p className="text-red-500">{emailErrors.email.message}</p>}
                        <Button
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Send OTP
                        </Button>
                    </motion.form>
                )}

                {step === 2 && otpSent && (
                    <>
                        <motion.form
                            key="otp-form"
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            onSubmit={handleOtpSubmit(onOtpSubmit)}
                            className="space-y-6"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                                className="text-center"
                            >
                                <h2 className="text-3xl font-bold mb-4 text-white">{language === "english" ? "Enter OTP" : language === "bisaya" ? "Ibutang ang OTP" : "Ilagay ang OTP"}</h2>
                                <p className="text-sm text-gray-300">{language === "english" ? "We have sent an OTP to your account. Please enter it below." : language === "bisaya" ? "Nag send mi ug OTP sa imong account. Palihug ug butang sa ubos." : "Nagpadala kami ng OTP sa iyong account. Mangyaring ilagay ito sa ibaba."}</p>
                                <p className="text-lg text-red-300 mt-2">{language === "english" ? "OTP expires in: " : language === "bisaya" ? "Mu-expire ang OTP pagka: " : "Mag-e-expire ang OTP sa:"}{formatTime(otpExpiryTimer)}</p>
                            </motion.div>
                            <div className="flex justify-center space-x-2">
                                <Controller
                                    name="otp"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <>
                                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    maxLength={1}
                                                    value={otp[index] || ''}
                                                    className="text-stone-200 w-12 h-12 text-center text-2xl font-bold bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                                                    ref={(el) => (otpInputRefs.current[index] = el)}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                    onFocus={handleFocus}
                                                />
                                            ))}
                                        </>
                                    )}
                                />
                            </div>
                            {otpErrors.otp && <p className="text-red-500 text-center">{otpErrors.otp.message}</p>}
                            <Button
                                type="submit"
                                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                                disabled={isLoading || (otpExpiryTimer === 0 && !isOverrideMode)}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                Verify OTP
                            </Button>
                            <div className="text-center">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleResendOtp}
                                    disabled={resendTimer > 0 || isLoading}
                                    className="bg-black w-full text-blue-400 hover:text-blue-500"
                                >
                                    {resendTimer > 0 ? `Resend OTP in ${formatTime(resendTimer)}` : 'Resend OTP'}
                                </Button>
                            </div>
                        </motion.form>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmailVerification;

// import { useState, useRef, useEffect } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from "@/components/ui/button";
// import { Input } from '../ui/input';
// import { useToast } from '@/components/ui/use-toast';
// import { useAuth } from '@/hooks/useAuth';
// import { Loader2 } from 'lucide-react';
// import { useDispatch } from 'react-redux';
// import { useAppSelector } from '@/app/hooks';
// import { closeKeyboard, focusValue, openKeyboard, resetInputs, setInputLimit, updateValue } from '@/features/keyboard/keyboard-slice';

// interface EmailVerificationProps {
//     onNext: () => void;
// }

// interface EmailForm {
//     email: string;
// }

// interface OtpForm {
//     otp: string;
// }

// const formVariants = {
//     hidden: { opacity: 0, x: -50 },
//     visible: { opacity: 1, x: 0 },
//     exit: { opacity: 0, x: 50 }
// };

// const EmailVerification = ({ onNext }: EmailVerificationProps) => {
//     const expiration_value = 140;
//     // const expiration_value = 670000;
//     const resend_value = 30;
//     const emailInput = useAppSelector((state) => state.keyboard?.value) ?? '';
//     const otp = useAppSelector((state) => state.keyboard?.value) ?? '';
//     const language = useAppSelector((state) => state.settings?.language);
//     const [step, setStep] = useState(1);
//     const [email, setEmail] = useState("");
//     const [isLabels, setIsLabels] = useState(false);
//     const [otpSent, setOtpSent] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [resendTimer, setResendTimer] = useState(0);
//     const [otpExpiryTimer, setOtpExpiryTimer] = useState(expiration_value);
//     const { toast } = useToast();
//     const { sendOtpToEmail, verifyOtp } = useAuth();
//     const dispatch = useDispatch();

//     const {
//         register: emailRegister,
//         handleSubmit: handleEmailSubmit,
//         formState: { errors: emailErrors },
//         setValue: setEmailValue,
//         setError: setEmailError,
//         clearErrors: clearEmailErrors,
//     } = useForm<EmailForm>();

//     const {
//         control,
//         handleSubmit: handleOtpSubmit,
//         formState: { errors: otpErrors },
//         setValue,
//         reset: resetOtpForm,
//         setError: setOtpError,
//         clearErrors: clearOtpErrors,
//     } = useForm<OtpForm>();

//     const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

//     const validateEmail = (email: string) => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!email) {
//             setEmailError('email', { type: 'required', message: language === "english" ? 'Email is required' : language === "bisaya" ? 'Required ang email' : 'Kinakailangan ang email' });
//             return false;
//         }
//         if (!emailRegex.test(email)) {
//             setEmailError('email', { type: 'pattern', message: language === "english" ? 'Invalid email format' : language === "bisaya" ? 'Dili sakto ang email nga format' : 'Hindi tamang format ng email' });
//             return false;
//         }
//         clearEmailErrors('email');
//         return true;
//     };

//     const validateOtp = (otp: string) => {
//         if (!otp) {
//             setOtpError('otp', { type: 'required', message: language === "english" ? 'OTP is required' : language === "bisaya" ? 'Kailangan ang OTP' : 'Kinakailangan ang OTP' });
//             return false;
//         }
//         if (otp.length !== 6) {
//             setOtpError('otp', { type: 'length', message: language === "english" ? 'OTP must be 6 digits' : language === "bisaya" ? 'Kailangan nga 6 digits ang OTP' : 'Kinakailangan 6 digits ang OTP' });
//             return false;
//         }
//         clearOtpErrors('otp');
//         return true;
//     };
//     const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newEmail = e.target.value;
//         dispatch(updateValue(newEmail));
//         setEmailValue("email", newEmail, { shouldValidate: true }); // Add shouldValidate: true
//         validateEmail(newEmail);
//     };

//     const handleFocusEmail = () => {
//         dispatch(focusValue());
//         dispatch(setInputLimit(60));
//         dispatch(openKeyboard());
//     };


//     const onEmailSubmit = async (data: EmailForm) => {
//         if (!validateEmail(data.email)) return;
//         setIsLoading(true);
//         try {
//             const res = await sendOtpToEmail(data.email);
//             //if organization exists then continue to next step
//             console.log("response:", res);
//             if(!res.success) throw new Error(res.message);
//             setIsLabels(true);
//             setEmail(data.email);
//             setOtpSent(true);
//             setStep(2);
//             dispatch(resetInputs());
//             dispatch(closeKeyboard());
//             dispatch(setInputLimit(6));
//             setResendTimer(resend_value);
//             setOtpExpiryTimer(expiration_value);
//         } catch (error) {
//             console.error("Error sending OTP", error);
//             let errorMessage = "Error occurred."
//             if (error instanceof Error) {
//                 errorMessage = error.message;
//             } else if (typeof error === "string") {
//                 errorMessage = error;
//             }
//             toast({
//                 title: "Error",
//                 description: `${errorMessage}`,
//                 className: "bg-red-500 text-white",
//                 duration: 5000
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const onOtpSubmit = async (data: OtpForm) => {
//         console.log(data.otp);
//         console.log(otp);
//         if (!validateOtp(data.otp)) return;

//         if (otpExpiryTimer === 0) {
//             toast({
//                 title: "OTP Expired",
//                 description: language === "english" ? "The OTP has expired. Please request a new one." : language === "bisaya" ? "Expired ang OTP. Palihug pangayo ug bago" : "Nag-expire na ang OTP. Mangyaring humiling ng bago.",
//                 className: "bg-yellow-500 text-white",
//                 duration: 5000
//             });
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const success = await verifyOtp(email, data.otp);
//             if(!success) throw new Error("Invalid OTP");
//             dispatch(resetInputs());
//             dispatch(setInputLimit(60));
//             dispatch(closeKeyboard());
//             onNext();
//         } catch (error) {
//             console.error("Error verifying OTP", error);
//             toast({
//                 title: "Error",
//                 description: language === "english" ? "Invalid OTP. Please try again." : language === "bisaya" ? "Dili mao ang OTP. Palihug ug usab. : "Hindi tama ang OTP. Subukan muli.",
//                 className: "bg-red-500 text-white",
//                 duration: 5000
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleResendOtp = async () => {
//         if (resendTimer > 0) return;
//         setIsLoading(true);
//         try {
//             const success = await sendOtpToEmail(email);
//             if(!success) throw new Error(language === "english" ? "Failed to resend OTP" : language === "bisaya" ? "Wala na send ug balik ang OTP" : "Hindi naipadala ang OTP");
//             setOtpSent(true);
//             setResendTimer(resend_value);
//             setOtpExpiryTimer(expiration_value);
//             resetOtpForm();
//             toast({
//                 title: "OTP Resent",
//                 description: language === "english" ? "A new OTP has been sent to your email." : language === "bisaya" ? "Naay bago nga OTP nga na send sa imong email." : "May bagong OTP na naipadala sa iyong email.",
//                 className: "bg-green-500 text-white",
//                 duration: 5000
//             });
//         } catch (error) {
//             console.error("Error resending OTP", error);
//             toast({
//                 title: "Error",
//                 description: language === "english" ? "Failed to resend OTP. Please try again." : language === "bisaya" ? "Wala na resend ang OTP. Palihug ug usab." : "Hindi naipadala ang OTP. Subukan muli.",
//                 className: "bg-red-500 text-white",
//                 duration: 5000
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleOtpChange = (index: number, value: string) => {
//         if(otpInputRefs.current.length >= 5 || otpInputRefs.current.length == 0 ) {  return }
//         else {
//             if (value.length <= 1) {
//                 const newOtp = otpInputRefs.current.map((input, i) => 
//                     i === index ? value : input?.value || ''
//                 ).join('');
//                 dispatch(updateValue(value));
//                 setValue('otp', newOtp);
//                 validateOtp(newOtp);
        
//                 if (value.length === 1 && index < 5) {
//                     otpInputRefs.current[index + 1]?.focus();
//                 }
//             }
//         }
//     };

//     const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Backspace' && index > 0 && !otpInputRefs.current[index]?.value) {
//             otpInputRefs.current[index - 1]?.focus();
//         }
//     };

//     const formatTime = (seconds: number) => {
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = seconds % 60;
//         return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//     };

//     const handleFocus = () => {
//         dispatch(focusValue()); 
//         dispatch(openKeyboard());
//     };

//     useEffect(() => {
//         let interval: NodeJS.Timeout;
//         if (resendTimer > 0) {
//             interval = setInterval(() => {
//                 setResendTimer((prevTimer) => prevTimer - 1);
//             }, 1000);
//         }
//         return () => clearInterval(interval);
//     }, [resendTimer]);

//     useEffect(() => {
//         let interval: NodeJS.Timeout;
//         if (otpExpiryTimer > 0 && otpSent) {
//             interval = setInterval(() => {
//                 setOtpExpiryTimer((prevTimer) => prevTimer - 1);
//             }, 1000);
//         } else if (otpExpiryTimer === 0 && otpSent) {
//             toast({
//                 title: "OTP Expired",
//                 description: language === "english" ? "The OTP has expired. Please request a new one." : language === "bisaya" ? "Expired na ang OTP. Palihug request ug bago." : "Nag-expire na ang OTP. Mangyaring humiling ng bago.",
//                 className: "bg-yellow-500 text-white",
//                 duration: 5000
//             });
//         }
//         return () => clearInterval(interval);
//     }, [otpExpiryTimer, otpSent, toast]);

//     useEffect(() => {
//         if (step === 2) {
//             otpInputRefs.current[0]?.focus();
//         }
//     }, [step]);

//     useEffect(() => {
//         setValue("otp", otp)
//         validateOtp(otp);
//     }, [otp, setValue])

//     useEffect(() => {
//         setEmailValue("email", emailInput, { shouldValidate: true }); // Add shouldValidate: true
//     }, [emailInput, setEmailValue]);

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-center mb-6">
//                 <div className="flex items-center">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
//                     <div className="w-16 h-1 bg-gray-300 mx-2"></div>
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
//                 </div>
//             </div>
//             <AnimatePresence mode="wait">
//                 {step === 1 && (
//                     <motion.form
//                         key="email-form"
//                         variants={formVariants}
//                         initial="hidden"
//                         animate="visible"
//                         exit="exit"
//                         transition={{ duration: 0.3 }}
//                         onSubmit={handleEmailSubmit(onEmailSubmit)}
//                         className="space-y-6"
//                     >
//                         <motion.div
//                             animate={{ y: [0, -10, 0] }}
//                             transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
//                             className="text-center"
//                         >
//                             <h2 className="text-3xl font-bold mb-4 text-white">{language === "english" ? "Enter Your Email" : language === "bisaya" ? "Ibutang Imong Email" : "Ilagay ang Iyong Email"}</h2>
//                             <p className="text-sm text-gray-300">{language === "english" ? "We will send an OTP to your email for verification" : language === "bisaya" ? "Mag send mi ug OTP sa imong email para verification." : "Magpapadala kami ng OTP sa iyong email para sa pagpapatunay"}</p>
//                         </motion.div>
//                         <Input
//                             type="email"
//                             placeholder="Enter your email"
//                             value={emailInput}
//                             className="w-full"
//                             {...emailRegister("email")}
//                             onFocus={handleFocusEmail}
//                             onChange={handleEmailChange}
//                         />
//                         {emailErrors.email && <p className="text-red-500">{emailErrors.email.message}</p>}
//                         <Button
//                             type="submit"
//                             className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
//                             disabled={isLoading}
//                         >
//                             {isLoading ? (
//                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             ) : null}
//                             Send OTP
//                         </Button>
//                     </motion.form>
//                 )}

//                 {step === 2 && otpSent && (
//                     <>
//                         <motion.form
//                             key="otp-form"
//                             variants={formVariants}
//                             initial="hidden"
//                             animate="visible"
//                             exit="exit"
//                             transition={{ duration: 0.3 }}
//                             onSubmit={handleOtpSubmit(onOtpSubmit)}
//                             className="space-y-6"
//                         >
//                             <motion.div
//                                 animate={{ y: [0, -10, 0] }}
//                                 transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
//                                 className="text-center"
//                             >
//                                 <h2 className="text-3xl font-bold mb-4 text-white">{language === "english" ? "Enter OTP" : language === "bisaya" ? "Ibutang ang OTP" : "Ilagay ang OTP"}</h2>
//                                 <p className="text-sm text-gray-300">{language === "english" ? "We have sent an OTP to your account. Please enter it below." : language === "bisaya" ? "Nag send mi ug OTP sa imong account. Palihug ug butang sa ubos." : "Nagpadala kami ng OTP sa iyong account. Mangyaring ilagay ito sa ibaba."}</p>
//                                 <p className="text-lg text-red-300 mt-2">{language === "english" ? "OTP expires in: " : "Mu-expire ang OTP pagka: "}{formatTime(otpExpiryTimer)}</p>
//                             </motion.div>
//                             <div className="flex justify-center space-x-2">
//                                 <Controller
//                                     name="otp"
//                                     control={control}
//                                     defaultValue=""
//                                     // @ts-ignore
//                                     render={({ field }) => (
//                                         <>
//                                             {[0, 1, 2, 3, 4, 5].map((index) => (
//                                                 <input
//                                                     key={index}
//                                                     type="text"
//                                                     maxLength={1}
//                                                     // @ts-ignore
//                                                     value={otp[index] || ''}
//                                                     className="text-stone-200 w-12 h-12 text-center text-2xl font-bold bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
//                                                     ref={(el) => (otpInputRefs.current[index] = el)}
//                                                     onChange={(e) => handleOtpChange(index, e.target.value)}
//                                                     onKeyDown={(e) => handleKeyDown(index, e)}
//                                                     onFocus={handleFocus}
//                                                 />
//                                             ))}
//                                         </>
//                                     )}
//                                 />
//                             </div>
//                             {otpErrors.otp && <p className="text-red-500 text-center">{otpErrors.otp.message}</p>}
//                             <Button
//                                 type="submit"
//                                 className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
//                                 disabled={isLoading || otpExpiryTimer === 0}
//                             >
//                                 {isLoading ? (
//                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                 ) : null}
//                                 Verify OTP
//                             </Button>
//                             <div className="text-center">
//                                 <Button
//                                     type="button"
//                                     variant="ghost"
//                                     onClick={handleResendOtp}
//                                     disabled={resendTimer > 0 || isLoading}
//                                     className="bg-black w-full text-blue-400 hover:text-blue-500"
//                                 >
//                                     {resendTimer > 0 ? `Resend OTP in ${formatTime(resendTimer)}` : 'Resend OTP'}
//                                 </Button>
//                             </div>
//                         </motion.form>
//                     </>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// export default EmailVerification;