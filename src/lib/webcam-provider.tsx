import React, { createContext, useContext, useRef } from "react";

interface WebcamContextValue {
    webcamRef: React.MutableRefObject<any>;
    canvasRef: React.MutableRefObject<any>;
}

const WebcamContext = createContext<WebcamContextValue | null>(null);

export const useWebcamContext = () => useContext(WebcamContext);

export const WebcamProvider = ({ children }: { children: React.ReactNode }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    return (
        <WebcamContext.Provider value={{ webcamRef, canvasRef }}>
            {children}
        </WebcamContext.Provider>
    );
};