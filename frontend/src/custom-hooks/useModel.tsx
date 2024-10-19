import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";

const modelPath = "../../model-asset/best_web_model/model.json";
//const classLabels = ["Hello Snack Bar", "Monde Special Mammon", "Rebisco"];

export default function useModel() {
  const [model, setModel] = useState<tf.GraphModel<string | tf.io.IOHandler>>();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await tf.loadGraphModel(modelPath);
        setModel(model);
      } catch (error) {
        console.error("Error loading model:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
    return () => {
      if (model) {
        model.dispose(); // Dispose of the model if it's not needed anymore
      }
    };
  }, []);

  useEffect(() => {
    console.log("Model was Loaded recently");
  }, [model]);

  async function runInference(image: HTMLVideoElement | null) {
    if (!model || isLoading || !image) return;

    const resizedImage = resizeImage(image);

    //Convert content image to tensor and add batch dimensions
    let tfTensor = tf.browser.fromPixels(resizedImage);
    tfTensor = tfTensor.div(255.0);
    tfTensor = tfTensor.expandDims(0);
    tfTensor = tfTensor.cast("float32");

    // Run image through model
    const prediction = model.predict(tfTensor) as tf.Tensor;
    const data = await prediction.data();
    console.log("data: ", data);
    console.log(data.length);

    const maxIndex = data.indexOf(Math.max(...data));
    console.log("Predicted class index: ", maxIndex);

    // Dispose tensors to free memory
    tfTensor.dispose();
    prediction.dispose();
  }

  function resizeImage(image: CanvasImageSource) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas; // or use other methods to get the resized image
  }

  return { runInference, model, isLoading };
}
