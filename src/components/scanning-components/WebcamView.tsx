// import React from 'react'
// import Webcam from "react-webcam";
// import { useWebcamContext } from "@/lib/webcam-provider";
// import { useWindowSize } from '@/hooks/useWindowSize';
// import { useAppDispatch } from '@/app/hooks';

// export const WebCamView: React.FC = () => {
//   const { webcamRef, canvasRef } = useWebcamContext() || {};
//   const dispatch = useAppDispatch();
//   // const webcamRef = useRef<Webcam>(null);
//   // const canvasRef = useRef<HTMLCanvasElement>(null);
//   const windowSize = useWindowSize();

//   const videoConstraints = {
//       width: windowSize.width || 1280,
//       height: windowSize.height || 720,
//       facingMode: "user"
//   };


//   return (
//     <>
//       <Webcam
//           audio={false}
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           videoConstraints={videoConstraints}
//           className="w-full h-full object-cover"
//       />
//       <canvas ref={canvasRef} style={{ display: "none" }} />
//     </>
//   );
// };
import React from 'react'
import Webcam from "react-webcam";
import { useWebcamContext } from "@/lib/webcam-provider";
import { useWindowSize } from '@/hooks/useWindowSize';
import { useAppDispatch } from '@/app/hooks';

export const WebCamView: React.FC = () => {
  const { webcamRef, canvasRef } = useWebcamContext() || {};
  const dispatch = useAppDispatch();
  // const webcamRef = useRef<Webcam>(null);
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  const windowSize = useWindowSize();

  const videoConstraints = {
      width: 1024,
      height: 600,
      //Lets try fixing the width and height
      // width: 640,
      // height: 640,
      facingMode: "user"
  };


  return (
      <div className="webcam-container">
      <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="webcam"
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
  );
};