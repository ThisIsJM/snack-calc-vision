import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import { predictAPI } from "../api";
import { drawBoundingBoxes, imageSourceToFile } from "../utlities";
import { Button } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  captureInterval?: number;
  onImageCapture?: (file: File) => Promise<void>;
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

    const [isStreaming, setIsStreaming] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      startStreaming,
      stopStreaming,
    }));

    function startStreaming() {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(onVideoRecord, captureInterval);
        setIsStreaming(true);
      }
    }

    function stopStreaming() {
      if (!intervalRef.current) return;

      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsStreaming(false);
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
      if (file) onImageCapture?.(file);
    }

    if (!isStreaming) {
      return (
        <BlackScreen>
          <Button
            variant="contained"
            color="primary"
            sx={{ padding: 1 }}
            endIcon={<CameraAltIcon fontSize="large" />}
            onClick={startStreaming}
          >
            Toggle Webcam
          </Button>
        </BlackScreen>
      );
    }

    return (
      <Container>
        <StyledWebcam
          ref={webcamRef}
          muted={true}
          videoConstraints={{
            facingMode: { exact: "environment" },
          }}
        />

        <ButtonContainer>
          <RoundedButton
            onClick={onCaptureButtonPressed}
            variant="contained"
            color="primary"
          >
            <CameraAltIcon fontSize="large" />
          </RoundedButton>
          <RoundedButton
            onClick={stopStreaming}
            variant="contained"
            color="error"
          >
            <CloseIcon fontSize="large" />
          </RoundedButton>
        </ButtonContainer>
        <StyledCanvas ref={canvasRef} />
      </Container>
    );
  }
);

const BlackScreen = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  align-items: center;
  justify-content: center;

  background: black;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: black;

  align-items: end;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: 30px;
  box-sizing: border-box;

  margin-right: 30px;
`;

const RoundedButton = styled(Button)`
  aspect-ratio: 1;
  border-radius: 50%;
`;

const StyledWebcam = styled(Webcam)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;

  /* transform: scaleX(-1); */
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
