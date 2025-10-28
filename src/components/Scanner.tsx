import { useRef, useEffect, useCallback } from 'react';
import QrScanner from 'qr-scanner';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Action } from '@/views/testing-component';

interface ScannerProps{
    selectedAction: Action;
    setScannerState: (state: 'initial' | 'scanning' | 'result') => void;
    setScannedResult: (result: string) => void;
}

export const Scanner = ({ selectedAction, setScannerState, setScannedResult }: ScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  const startScanner = useCallback(() => {
    if (videoRef.current) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          setScannedResult(result.data);
          setScannerState('result');
          qrScannerRef.current?.stop();
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      qrScannerRef.current.start();
    }
  }, [setScannedResult, setScannerState]);

  useEffect(() => {
    console.log(selectedAction);
    startScanner();
    return () => {
      qrScannerRef.current?.destroy();
    };
  }, [startScanner]);

  const stopScanning = () => {
    qrScannerRef.current?.stop();
    setScannerState('initial');
  };

  return (
    <div className="relative w-full max-w-sm">
      <video ref={videoRef} className="w-full h-[70vh] object-cover rounded-lg shadow-md" />
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center">
          {selectedAction.icon}
          <span className="ml-2 text-lg font-semibold">
            {selectedAction.label}
          </span>
        </div>
        <span className="text-sm bg-black text-primary-foreground px-2 py-1 rounded-full">
          Scanning...
        </span>
      </div>
      <Button
        onClick={stopScanning}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        variant="destructive"
      >
        <X className="w-4 h-4 mr-2" />
        Stop Scanning
      </Button>
    </div>
  );
};

