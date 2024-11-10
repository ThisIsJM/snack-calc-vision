import { Button, CircularProgress } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import React, { useState } from "react";

interface Props {
  onImageUpload: (file: File) => Promise<void>;
}

function ImageUploader({ onImageUpload }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setIsLoading(true);
    const file = event.target.files?.[0];

    if (file) await onImageUpload?.(file);
    setIsLoading(false);
  }

  const handleButtonClick = () => {
    document.getElementById("image-upload")?.click(); // Trigger file input click
  };

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
    </div>
  );
}

export default ImageUploader;
