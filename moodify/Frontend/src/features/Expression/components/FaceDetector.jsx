import { useEffect, useRef } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

function FaceDetector({ video, onResult, shouldCapture, onModelLoaded }) {
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const shouldCaptureRef = useRef(shouldCapture);
  const onResultRef = useRef(onResult);
  const onModelLoadedRef = useRef(onModelLoaded);

  // Keep refs up-to-date to avoid re-triggering the main setup useEffect
  useEffect(() => {
    shouldCaptureRef.current = shouldCapture;
  }, [shouldCapture]);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    onModelLoadedRef.current = onModelLoaded;
  }, [onModelLoaded]);

  useEffect(() => {
    if (!video) return;

    let active = true;
    let lastDetectionTime = 0;

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
        
        // Notify parent that model is fully loaded and ready
        if (onModelLoadedRef.current) {
          onModelLoadedRef.current();
        }

        detect();
      } catch (error) {
        console.error("MediaPipe initialization error:", error);
      }
    }

    function detect() {
      if (!active || !landmarkerRef.current) {
        return;
      }

      const now = performance.now();

      // Only perform heavy vision tasks if a capture is requested and throttle to once every 150ms
      if (shouldCaptureRef.current && now - lastDetectionTime > 150) {
        // Prevent MediaPipe WASM crash if video frames are not ready yet
        if (
          !video ||
          video.readyState < 2 ||
          video.videoWidth === 0 ||
          video.videoHeight === 0
        ) {
          animationRef.current = requestAnimationFrame(detect);
          return;
        }

        try {
          const result = landmarkerRef.current.detectForVideo(
            video,
            now
          );
          onResultRef.current(result);
          lastDetectionTime = now;
        } catch (e) {
          console.error("Detection error:", e);
        }
      }

      animationRef.current = requestAnimationFrame(detect);
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
  }, [video]); // Only recreate if video element changes

  return null;
}

export default FaceDetector;
