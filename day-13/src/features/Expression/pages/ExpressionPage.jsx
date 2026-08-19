import { useCallback, useState } from "react";

import Camera from "../components/Camera";
import FaceDetector from "../components/FaceDetector";
import ExpressionDisplay from "../components/ExpressionDisplay";

import { detectExpression } from "../utils/expression";

function ExpressionPage() {
  const [video, setVideo] = useState(null);
  const [expression, setExpression] = useState({
  name: "Loading...",
  emoji: "🙂",
  confidence: 0,
});

  const handleCameraReady = useCallback((videoElement) => {
    console.log("Camera ready:", videoElement);

    setVideo(videoElement);
  }, []);

 const handleFaceResult = useCallback((result) => {
  const detectedExpression =
    detectExpression(result);

  setExpression(detectedExpression);
}, []);

  return (
    <div>
      <h1>Face Expression Detector</h1>

      <Camera onReady={handleCameraReady} />

      {video && (
        <FaceDetector
          video={video}
          onResult={handleFaceResult}
        />
      )}

      <ExpressionDisplay
        expression={expression}
      />
    </div>
  );
}

export default ExpressionPage;