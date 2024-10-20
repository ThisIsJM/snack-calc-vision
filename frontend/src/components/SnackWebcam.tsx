import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import { predictAPI } from "../api";
import { drawBoundingBoxes, imageSourceToFile } from "../utlities";
import Item from "../models/item";

interface Props {
  captureInterval?: number;
}

export interface SnackWebcamHandle {
  startStreaming: () => void;
  stopStreaming: () => void;
  getItems: () => Promise<Item[]>;
}

const SnackWebcam = forwardRef<SnackWebcamHandle, Props>(
  ({ captureInterval = 1500 }, ref) => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useImperativeHandle(ref, () => ({
      startStreaming,
      stopStreaming,
      getItems: async () => await getItemsFromSnapshot(),
    }));

    useEffect(() => {
      startStreaming();
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

    async function getItemsFromSnapshot() {
      const imageSource = webcamRef.current?.getScreenshot();
      if (!imageSource) return [];

      const file = await imageSourceToFile(imageSource);
      return (await predictAPI(file)) || [];
    }

    async function onVideoRecord() {
      try {
        if (!canvasRef.current) return;

        const items = await getItemsFromSnapshot();
        drawBoundingBoxes(canvasRef.current, items);
      } catch (error) {
        console.error("Error capturing image:", error);
      }
    }

    return (
      <Container>
        <StyledWebcam ref={webcamRef} muted={true} />
        <StyledCanvas ref={canvasRef} />
      </Container>
    );
  }
);

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledWebcam = styled(Webcam)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
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
