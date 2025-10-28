import { useToast } from "@/components/ui/use-toast";
import { flask_app } from "@/lib/config";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { setOtp } from "@/features/routing-controller/routing-slice";
import { auth } from "@/store/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { setOrgID, setOwnerID, setSecretKey } from "@/features/egg-counting-apparatus/egg-counting-apparatus-slice";

export const useAuth = () => {
    const { toast } = useToast();
    const language = useAppSelector((state) => state.settings?.language);
    const validOTP = useAppSelector((state) => state.routingController?.otp);
    const apparatusID = useAppSelector((state) => state.eggCountingApparatus?.eggCountingApparatusID);
    const dispatch = useAppDispatch();

    const sendOtpToEmail = async (email: string, isOverride: boolean) => {
        try {
            // Checking if email exists in firebase authentication
            // we dont have api, so we will use firebase resources
            // Step 1: Generate a random 6 digit OTP

            const otp = generateOTP();
            if(isOverride) {
                dispatch(setOtp(otp));
                toast({
                    title: "Override Mode", 
                    description: `The OTP IS ${otp}, please use this to login.`,
                    className: "bg-yellow-500 text-black",
                    duration: 100000
                })
                return {
                    success: true,
                    message: "OTP sent",
                };
            } else {
                // const otp = generateOTP();
    
                const body = {
                    otp: otp,
                    email: email,
                    language: language
                }
                
                const response = await fetch(`${flask_app}/send-otp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }).then((res) => res.json());
               // console.log("Response: ", response);
                if (response.status_code === 200 && response.isOrganization) {
                    dispatch(setOtp(otp));
                    return {
                        success: true,
                        message: response.content.message,
                    };
                } else {
                    throw new Error(response.content.message);
                }
            }
        } catch (error: unknown) {
            let errorMessage = "An unexpected error occurred";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === "string") {
                errorMessage = error;
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
                duration: 5000,
            });

            return {
                success: false,
                message: errorMessage,
            };
        }
    };

    // const generateOTP = () => {
    //     // Generate a random 6 digit OTP
    //     const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //     let otp = "";
        
    //     for (let i = 0; i < 6; i++) {
    //         otp += characters.charAt(Math.floor(Math.random() * characters.length));
    //     };
    //     return otp;
    // };
    const generateOTP = () => {
        // Generate a random 6 digit OTP
        const characters = "0123456789";
        let otp = "";
        
        for (let i = 0; i < 6; i++) {
            otp += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return otp;
    };
    
    const verifyOtp = async (email: string, otp: string) => {
        try {
            // We will do some backend important stuff.
            if (!validOTP) throw new Error(language === "english" ? "No OTP found. Please request a new OTP." : "Wala nakita ang OTP. Palihug ug request ug bago nga OTP.");
            // alert(`${otp} AND ${validOTP}`);
            if (validOTP !== otp) throw new Error(language === "english" ? "Invalid OTP. Please try again." : "Dili sakto ang OTP. Palihug ug usab.");
            // printing real otp value


            // Fetch necessary data from your Flask backend
            const response = await fetch(`${flask_app}/link-apparatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, apparatus_id: apparatusID, language: language })
            }).then((res) => res.json());
    
            if (response.status_code !== 200) {
                throw new Error(response.content.message);
            } else {
                const { tks, tksecret, tktk_secret_secret } = response.content;
    
                console.log(response.content);

                try {
                    // Try signing in first
                    const userCredential = await signInWithEmailAndPassword(auth, `${apparatusID}@gmail.com`, tks);
                    const user = userCredential.user;
                    console.log('User signed in:', user);
                } catch (signInError) {
                    // If the user doesn't exist, create the account
                    console.log(signInError);
                    // console.log(signInError);
                    // console.log('Creating new user...');
                    // const userCredential = await createUserWithEmailAndPassword(auth, `${apparatusID}@gmail.com`, tks);
                    // const user = userCredential.user;
                    // console.log('New user created:', user);
                    // If there's a different error during sign-in, rethrow it
                }
    
                // Persist important keys in state
                dispatch(setSecretKey(tks));
                dispatch(setOwnerID(tksecret));
                dispatch(setOrgID(tktk_secret_secret));
    
                // Set the cookie and validate the user token
                const user = auth.currentUser;
                if (user) {
                    const idToken = await user.getIdToken();
                    document.cookie = `token=${idToken}; path=/; max-age=3600; secure; HttpOnly`;
                }
    
                // Reset the OTP
                dispatch(setOtp("undefined"));
                return true;
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                    duration: 5000,
                });
            } else {
                toast({
                    title: "Error",
                    description: `${error}`,
                    variant: "destructive",
                    duration: 5000,
                });
            }
            return false;
        }
    };
    
    const logout = async () => {
        try {
            await auth.signOut();
            document.cookie = `token=; path=/; max-age=0; secure; HttpOnly`;
            toast({
                title: "Success",
                description: "You have signed out successfully",
                className: "bg-green-500 text-white",
                duration: 3000,
            });
        } catch(error: unknown) {
            if(error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                    duration: 5000,
                });
            } else {
                toast({
                    title: "Error",
                    description: `${error}`,
                    variant: "destructive",
                    duration: 5000,
                });
            };
        }
    };

    return { sendOtpToEmail, verifyOtp, logout };
};
