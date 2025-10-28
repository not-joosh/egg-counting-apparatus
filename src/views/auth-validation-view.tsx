import { useEffect, useState } from "react";
import { auth } from "@/store/firebase";
import WaveBackground from "@/components/menu-components/WaveBackground";
import { LoadingIcon } from "@/components/ui/motion/LoadingIcon";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { MENU_ROUTE } from "@/lib/routes";
import { useDispatch } from "react-redux";
import { setAuthStep, setIsRedirect } from "@/features/routing-controller/routing-slice";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth"; // Import getRedirectResult
import { sendEmailVerification } from "firebase/auth";
export const AuthValidationView = () => {
    const [count, setCount] = useState(0);
    const [email, setEmail] = useState("joshratificar@gmail.com");
    const navigate = useNavigate();
    const isRedirect = useAppSelector((state) => state.routingController?.isRedirect);
    const { toast } = useToast();
    const dispatch = useDispatch();
    // const { loginWithGoogle } = useAuth();

    const handleAuth = async () => {
        try {
            // dispatch(setIsRedirect(false));
            // await loginWithGoogle();
        } catch (error) {
            console.error("Error authenticating user", error);
        }
    };

    // useEffect(() => {
    //     // handleAuth();
    //     const auth = getAuth();
    //     getRedirectResult(auth)
    //       .then((result) => {
    //         // This gives you a Google Access Token. You can use it to access Google APIs.
    //         const credential = GoogleAuthProvider.credentialFromResult(result);
    //         const token = credential.accessToken;
        
    //         // The signed-in user info.
    //         const user = result.user;
    //         // IdP data available using getAdditionalUserInfo(result)
    //         // ...
    //       }).catch((error) => {
    //         // Handle Errors here.
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         // The email of the user's account used.
    //         // const email = error.customData.email;
    //         console.log(error);
    //         // The AuthCredential type that was used.
    //         const credential = GoogleAuthProvider.credentialFromError(error);
    //         // ...
    //       });
    // }, [count]);

    return (
        <>
            <WaveBackground />
            {/* <LoadingIcon opacityPercentage={0.30} /> */}
            Auth Revalidation
            <button className = "absolute p-4 bg-white text-black"onClick = {() => setCount(count + 1)}>
                {count}
            </button>

        </>
    );
};
