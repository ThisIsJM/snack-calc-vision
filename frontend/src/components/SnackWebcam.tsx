import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import { predictAPI } from "../api";
import { drawBoundingBoxes, imageSourceToFile } from "../utlities";
import { Button } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

interface Props {
  captureInterval?: number;
  onImageCapture?: (file: File | undefined) => void;
}

export interface SnackWebcamHandle {
  startStreaming: () => void;
  stopStreaming: () => void;
}

const SnackWebcam = forwardRef<SnackWebcamHandle, Props>(
  ({ captureInterval = 1500, onImageCapture }, ref) => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useImperativeHandle(ref, () => ({
      startStreaming,
      stopStreaming,
    }));

    useEffect(() => {
      // startStreaming();
      return () => stopStreaming();
    }, [webcamRef]);

    function startStreaming() {
      if (!intervalRef.current)
        intervalRef.current = setInterval(onVideoRecord, captureInterval);
    }

    function stopStreaming() {
      if (!intervalRef.current) return;

      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    async function captureImage() {
      const imageSource = webcamRef.current?.getScreenshot();
      if (!imageSource) return;

      return await imageSourceToFile(imageSource);
    }

    async function onVideoRecord() {
      try {
        const file = await captureImage();
        if (!canvasRef.current || !file) return;

        const detections = (await predictAPI(file)) || [];

        drawBoundingBoxes(canvasRef.current, detections);
      } catch (error) {
        console.error("Error capturing image:", error);
      }
    }

    async function onCaptureButtonPressed() {
      const file = await captureImage();
      onImageCapture?.(file);
    }

    return (
      <Container>
        <StyledWebcam ref={webcamRef} muted={true} />
        <CaptureButton
          onClick={onCaptureButtonPressed}
          variant="contained"
          color="error"
          size="small"
        >
          <CameraAltIcon fontSize="large" />
        </CaptureButton>
        <StyledCanvas ref={canvasRef} />
      </Container>
    );
  }
);

const Container = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
`;

const CaptureButton = styled(Button)`
  aspect-ratio: 1;
  border-radius: 50%;
  margin: auto;
  margin-right: 30px;
`;

const StyledWebcam = styled(Webcam)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
`;

const StyledCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;
export default SnackWebcam;
