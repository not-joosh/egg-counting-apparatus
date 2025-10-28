import QRCode from "qrcode"; 
import { flask_app } from '@/lib/config';
import { useAppSelector } from "@/app/hooks";

export const useQRCode = () => {
    const language = useAppSelector((state)=> state.settings?.language);
    
    const generateQRCodeAsPNG = async (text: string) => {
        try {
            const qrCodePng = await QRCode.toDataURL(text, { 
                errorCorrectionLevel: 'H', 
                type: 'image/png' 
            });
            return qrCodePng; 
        } catch (error) {
            console.error("Error generating QR code:", error);
            return null;
        }
    };

    const generateQRCodeAsSVG = async (text: string) => {
        try {
            let qrCodeSVG = await QRCode.toString(text, { 
                errorCorrectionLevel: 'L', 
                type: 'svg' 
            });
            // Modify the SVG string to set the desired width and height
            qrCodeSVG = qrCodeSVG.replace('<svg ', `<svg width="195" height="195" `);
            return qrCodeSVG; 
        } catch (error) {
            console.error("Error generating QR code:", error);
            return null;
        }
    }

    const sendQRtoPrinter = async (text: string, eggsize: string) => {
        try {
            //const qrCodePng = await generateQRCodeAsPNG(text); // Generate the QR code as PNG
            //lets try svg file type
            const qrCodeSvg = await generateQRCodeAsSVG(text); // Generate the QR code as SVG
            if(qrCodeSvg) {
                const base64Svg = btoa(qrCodeSvg);
                const data = {image: `data:image/svg+xml;base64,${base64Svg}`, eggsize: eggsize, language: language};
                const response = await fetch(`${flask_app}/print-qr`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }).then((res) => res.json());
                
                console.log("response QR: ", response);
                console.log("Printing out content:", response?.status);
                if (response.status === 200) {
                    return {
                        "message": language === "english" ? "QR code sent to printer" : "Na send sa printer ang QR code",
                        "success": true
                    }
                } else {
                    throw new Error(response.content.message);                    
                }
            } else {
                throw new Error(language === "english" ? "Error generating QR code as PNG" : "Naay error sa pag generate ug QR code as PNG");
            }
        } catch (error) {
            if(error instanceof Error) {
                console.error("Error sending QR code to printer:", error.message);
                return {
                    "message": error.message,
                    "success": false
                }
            } else {
                return {
                    "message": error,
                    "success": false
                }
            }
        }
    };
    
    return { generateQRCodeAsPNG, generateQRCodeAsSVG, sendQRtoPrinter };
};
