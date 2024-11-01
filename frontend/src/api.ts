import axios from "axios";
import { SERVER_URL } from "../constants/server-address";
import Transaction from "./models/transaction";
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

    return response.data as Transaction;
  } catch (error) {
    console.log(error);
  }
};

export const addTransactionAPI = async (transaction: Transaction) => {
  try {
    const response = await axios({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${SERVER_URL}/add-transaction`,
      data: transaction,
    });

    console.log(response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(error);
    return { success: false, data: null };
  }
};

export const getTransactionsAPI = async () => {
  try {
    const response = await axios({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${SERVER_URL}/get-transactions`,
    });

    return response.data as Transaction[];
  } catch (error) {
    console.log(error);
    return [];
  }
};
