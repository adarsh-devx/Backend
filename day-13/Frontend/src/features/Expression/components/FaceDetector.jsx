import { useEffect, useRef } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

function FaceDetector({ video, onResult }) {
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!video) return;

    let active = true;

    async function setup() {
      try {
        // Load MediaPipe WASM
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        );

        // Create Face Landmarker
        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },

          runningMode: "VIDEO",

          numFaces: 1,

          outputFaceBlendshapes: true,
        });

        if (!active) {
          landmarker.close();
          return;
        }

        landmarkerRef.current = landmarker;

        detect();
      } catch (error) {
        console.error("MediaPipe initialization error:", error);
      }
    }

    function detect() {
  if (!active || !landmarkerRef.current) {
    return;
  }

  const result =
    landmarkerRef.current.detectForVideo(
      video,
      performance.now()
    );

  console.log("MediaPipe result:", result);
  

  onResult(result);

  animationRef.current =
    requestAnimationFrame(detect);
}
    setup();

    return () => {
      active = false;

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [video, onResult]);

  return null;
}

export default FaceDetector;
