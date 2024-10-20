import axios from "axios";
import { SERVER_URL } from "../constants/server-address";
import Detection from "./models/detection";

export const checkAPI = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: `${SERVER_URL}/`,
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const predictAPI = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios({
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: `${SERVER_URL}/predict`,
      data: formData,
    });

    return response.data as Detection[];
  } catch (error) {
    console.log(error);
  }
};

export const calculateAPI = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios({
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: `${SERVER_URL}/calculate-price`,
      data: formData,
    });

    return response.data as Detection[];
  } catch (error) {
    console.log(error);
  }
};
