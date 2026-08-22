import { useEffect, useRef } from "react";

function Camera({ onReady }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        const video = videoRef.current;

        video.srcObject = stream;

        video.onloadeddata = () => {
          onReady(video);
        };
      } catch (error) {
        console.error("Camera error:", error);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [onReady]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}

export default Camera;