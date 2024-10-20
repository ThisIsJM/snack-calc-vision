import Detection from "./models/detection";

export function drawBoundingBoxes(
  canvas: HTMLCanvasElement,
  detections: Detection[]
) {
  const context = canvas?.getContext("2d");

  if (!canvas || !context) return;

  // Clear the canvas before drawing
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Get the scaling factors
  const scaleX = canvas.width / 256;
  const scaleY = canvas.height / 256;

  // Since the webcam is mirrored, adjust the x-coordinates
  const mirroredWidth = canvas.width;

  detections.forEach((detection) => {
    // Scale the bounding box coordinates and mirror the x-coordinates
    const [x1, y1, x2, y2] = detection.bbox.map((coord, index) => {
      if (index % 2 === 0) {
        // For x-coordinates, mirror them
        return mirroredWidth - coord * scaleX;
      }
      // For y-coordinates, just scale
      return coord * scaleY;
    });
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

export async function imageSourceToFile(imageSource: string) {
  const response = await fetch(imageSource);
  const blob = await response.blob();
  const file = new File([blob], "captured-image.png", {
    type: "image/png",
  });

  return file;
}
