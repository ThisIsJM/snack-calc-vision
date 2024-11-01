import { Button } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import React, { useState } from "react";
import { calculateAPI } from "../api";
import { ShowResponse } from "./pages/Scanner";
import TransactionModal from "./TransactionModal";

function ImageUploader() {
  const [showResponse, setShowResponse] = useState<ShowResponse>({
    show: false,
    transaction: undefined,
  });

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const transaction = await calculateAPI(file);
      setShowResponse({ show: true, transaction });
    }
  };

  const handleButtonClick = () => {
    document.getElementById("image-upload")?.click(); // Trigger file input click
  };

  async function closeHandler() {
    setShowResponse({ show: false, transaction: undefined });
  }

  async function submitHandler() {}

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
        endIcon={<FileUploadIcon />}
      >
        Upload Image
      </Button>
      <TransactionModal
        {...showResponse}
        submitHandler={submitHandler}
        closeHandler={closeHandler}
      />
    </div>
  );
}

export default ImageUploader;
