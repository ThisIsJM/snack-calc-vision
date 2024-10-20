import { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import { predictAPI } from "../api";
import Item from "../models/item";

interface Props {
  captureInterval?: number;
}

function SnackWebcam({ captureInterval = 1500 }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(onVideoRecord, captureInterval);

    return () => clearInterval(interval);
  }, [captureInterval]);

  async function onVideoRecord() {
    const imageSource = webcamRef?.current?.getScreenshot();
    if (!imageSource) return;

    try {
      const file = await imageSourceToFile(imageSource);

      const predictions = await predictAPI(file);
      drawBoundingBoxes(predictions);
      console.log(predictions);
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  }

  async function imageSourceToFile(imageSource: string) {
    const response = await fetch(imageSource);
    const blob = await response.blob();
    const file = new File([blob], "captured-image.png", {
      type: "image/png",
    });

    return file;
  }

  function drawBoundingBoxes(detections: Item[]) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    // Clear the canvas before drawing
    context.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach((detection) => {
      const [x1, y1, x2, y2] = detection.bbox;

      context.beginPath();
      context.rect(x1, y1, x2 - x1, y2 - y1);
      context.lineWidth = 2;
      context.strokeStyle = "red";
      context.fillStyle = "rgba(255, 0, 0, 0.3)";
      context.fill();
      context.stroke();

      // Draw the class label and confidence
      context.font = "16px Arial";
      context.fillStyle = "white";
      context.fillText(
        `${detection.class} (${(detection.confidence * 100).toFixed(1)}%)`,
        x1,
        y1 > 20 ? y1 - 5 : y1 + 20
      );
    });
  }

  return (
    <Container>
      <StyledWebcam ref={webcamRef} muted={true} />
      <StyledCanvas ref={canvasRef} />
    </Container>
  );
}

const Container = styled.div`
  position: relative; // Set the container to relative positioning
  width: 100%; // Set a fixed width or use 100% for responsive design
  height: 100%; // Set a fixed height or use 100% for responsive design
`;

const StyledWebcam = styled(Webcam)`
  width: 100%; // Set the width to 100% of the container
  height: 100%; // Set the height to 100% of the container
  object-fit: cover; // Ensure the video covers the container without stretching
`;

const StyledCanvas = styled.canvas`
  position: absolute; // Position the canvas absolutely within the container
  top: 0; // Align the top of the canvas with the container
  left: 0; // Align the left of the canvas with the container
  width: 100%; // Set the width to 100% of the container
  height: 100%; // Set the height to 100% of the container
  pointer-events: none; // Disable pointer events on the canvas if it should not capture mouse pointer-events
`;
export default SnackWebcam;
