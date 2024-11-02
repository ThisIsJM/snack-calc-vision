import { Button, CircularProgress } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import React, { useState } from "react";
import { addTransactionAPI, calculateAPI } from "../api";
import { ShowResponse } from "./pages/Scanner";
import AddTransactionModal from "./AddTransactionModal";
import { useTransactionStore } from "../store";

function ImageUploader() {
  const updateTransactions = useTransactionStore(
    (state) => state.updateTransactions
  );

  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showResponse, setShowResponse] = useState<ShowResponse>({
    show: false,
    transaction: undefined,
  });

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setIsLoading(true);
    const file = event.target.files?.[0];

    if (file) {
      const transaction = await calculateAPI(file);
      setImage(file);
      setShowResponse({ show: true, transaction });
    }

    setIsLoading(false);
  }

  const handleButtonClick = () => {
    document.getElementById("image-upload")?.click(); // Trigger file input click
  };

  async function closeHandler() {
    setShowResponse({ show: false, transaction: undefined });
  }

  async function submitHandler() {
    const { transaction } = showResponse;

    if (transaction) {
      const response = await addTransactionAPI(transaction);
      if (response.success) await updateTransactions();

      return response.success;
    }

    return false;
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }} // Hide the default input
        id="image-upload"
      />
      <Button
        variant="contained"
        onClick={handleButtonClick}
        endIcon={
          isLoading ? (
            <CircularProgress size={"14px"} color={"inherit"} />
          ) : (
            <FileUploadIcon />
          )
        }
      >
        Upload Image
      </Button>
      <AddTransactionModal
        {...showResponse}
        image={image}
        submitHandler={submitHandler}
        closeHandler={closeHandler}
      />
    </div>
  );
}

export default ImageUploader;
