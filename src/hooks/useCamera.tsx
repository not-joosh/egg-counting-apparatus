import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useWebcamContext } from "@/lib/webcam-provider";
import {  useAppSelector } from "@/app/hooks";

export const useCamera = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const { toast } = useToast();
  const { canvasRef, webcamRef } = useWebcamContext() || {};
  const language = useAppSelector((state) => state.settings?.language);

  const handleCameraPermission = () => {
      if (isCameraOn) {
        setIsCameraOn(false)
      } else {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(() => setIsCameraOn(true))
          .catch(() => {
            toast({
              title: "Camera Error",
              description: language === "english" ? "Please allow camera permissions to continue." : "Palihug ug enable sa camera permissions para makapadayon",
              variant: "destructive",
            })
          });
      };
  };

  const captureImage = (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      try {
        const screenshot = webcamRef?.current?.getScreenshot({
          width: 1024,
          height: 600
        });
        if (screenshot) {
          const image = new Image();
          image.src = screenshot;
          image.onload = () => {
            const canvas = canvasRef?.current;
            if (canvas) {
              const context = canvas.getContext("2d");
              if (context) {
                console.log("image width: ", image.width);
                console.log("image height: ", image.height);
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0);
                canvas.toBlob(
                  (blob: Blob) => {
                    if (blob) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64data = reader.result as string;
                        resolve(base64data); // Resolve with Base64 image
                      };
                      reader.readAsDataURL(blob); // Convert blob to Base64
                    } else {
                      reject(new Error("Failed to convert canvas to Blob"));
                    }
                  },
                  "image/jpeg",
                  0.95 // Quality option for JPEG
                );
              }
            }
          };
        } else {
          resolve(null); // No screenshot available
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error("An unknown error occurred during capture"));
        }
      }
    });
  };
  const blobifyImage = (image: string) => {
    const byteString = atob(image.split(',')[1]);
    const mimeString = image.split(',')[0].split(':')[1].split(';')
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    const imageBlob = new Blob([arrayBuffer], { type: mimeString[0] });
    return imageBlob;
  }

  useEffect(() => {
      const interval = setInterval(() => {
          navigator.mediaDevices.getUserMedia({ video: true })
              .then(() => {
                  setIsCameraOn(true);
              })
              .catch(() => {
                  setIsCameraOn(false);
              });
      }, 1000);
      return () => clearInterval(interval);
  }, []);

  return {
      isCameraOn, setIsCameraOn,
      handleCameraPermission, captureImage, blobifyImage,
  };
};  
