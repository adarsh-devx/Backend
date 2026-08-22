import { useCallback, useState, useEffect, useRef } from "react";

import Camera from "../components/Camera";
import FaceDetector from "../components/FaceDetector";
import ExpressionDisplay from "../components/ExpressionDisplay";
import DetectExpressionBtn from "../components/DetectExpressionBtn";
import Player from "../../home/components/Player";
import { useSong } from "../../home/hooks/useSong";

import { detectExpression } from "../utils/expression";

const mapExpressionToMood = (name) => {
  if (!name) return "happy";
  const lowerName = name.toLowerCase();
  if (lowerName === "happy" || lowerName === "neutral" || lowerName === "kiss") {
    return "happy";
  }
  if (lowerName === "sad" || lowerName === "angry" || lowerName === "disgust" || lowerName === "fear") {
    return "sad";
  }
  if (lowerName === "surprised") {
    return "surprised";
  }
  return "happy";
};

function ExpressionPage() {
  const [video, setVideo] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [expression, setExpression] = useState({
    name: "Ready",
    emoji: "🙂",
  });

  const { handleGetSong } = useSong();
  const prevIsDetectingRef = useRef(false);

  useEffect(() => {
    // When scanning ends, fetch the song matching the last detected expression
    if (prevIsDetectingRef.current === true && isDetecting === false) {
      if (expression.name && !["Scanning...", "Ready", "No Face"].includes(expression.name)) {
        const mood = mapExpressionToMood(expression.name);
        handleGetSong({ mood });
      }
    }
    prevIsDetectingRef.current = isDetecting;
  }, [isDetecting, expression.name, handleGetSong]);

  const handleCameraReady = useCallback((videoElement) => {
    console.log("Camera ready:", videoElement);
    setVideo(videoElement);
  }, []);

  const handleFaceResult = useCallback((result) => {
    const detectedExpression = detectExpression(result);
    setExpression(detectedExpression);
  }, []);

  const startScanning = () => {
    if (isDetecting || !isModelLoaded) return;
    
    setIsDetecting(true);
    setExpression({
      name: "Scanning...",
      emoji: "🔍",
    });

    // Run active detection for 1.3 seconds, then turn off the detector loop
    setTimeout(() => {
      setIsDetecting(false);
    }, 1300);
  };

  let buttonLabel = "Detect Expression";
  if (video && !isModelLoaded) {
    buttonLabel = "Loading AI Model (please wait)...";
  } else if (isDetecting) {
    buttonLabel = "Scanning...";
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      padding: "1rem 1.5rem 100px 1.5rem",
      maxWidth: "900px",
      margin: "0 auto",
      height: "100vh",
      maxHeight: "100vh",
      overflow: "hidden",
      boxSizing: "border-box"
    }}>
      <h1 style={{
        fontSize: "1.75rem",
        fontWeight: "800",
        background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textAlign: "center",
        margin: "0 0 0.25rem 0"
      }}>
        Face Expression Music Player
      </h1>

      {/* Face Detector Block */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        background: "rgba(255, 255, 255, 0.02)",
        borderRadius: "1.25rem",
        padding: "1.25rem 1.5rem",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
        width: "100%",
        maxWidth: "720px",
        boxSizing: "border-box"
      }}>
        <h2 style={{ fontSize: "1.1rem", color: "#a5b4fc", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
          Expression Detection
        </h2>

        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: "600px", // Increased from 480px
          aspectRatio: "16/9", // Wider aspect ratio to save vertical space
          borderRadius: "0.75rem",
          overflow: "hidden",
          border: "2px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          background: "#000"
        }}>
          <Camera onReady={handleCameraReady} />
          
          {video && (
            <FaceDetector
              video={video}
              onResult={handleFaceResult}
              shouldCapture={isDetecting}
              onModelLoaded={() => setIsModelLoaded(true)}
            />
          )}
        </div>

        <DetectExpressionBtn
          isDetecting={isDetecting}
          onClick={startScanning}
          disabled={!isModelLoaded || isDetecting || !video}
          label={buttonLabel}
        />

        <ExpressionDisplay
          expression={expression}
        />
      </div>

      {/* Fixed bottom player bar */}
      <Player />
    </div>
  );
}

export default ExpressionPage;

