import React, { useState } from "react";
import SnackWebcam from "../SnackWebcam";
import AddTransactionModal from "../AddTransactionModal";
import Transaction from "../../models/transaction";
import { calculateAPI } from "../../api";

export interface ShowResponse {
  show: boolean;
  transaction: Transaction | undefined;
}

function Scanner() {
  const [showResponse, setShowResponse] = useState<ShowResponse>({
    show: false,
    transaction: undefined,
  });

  async function calculatePrice(file: File | undefined) {
    try {
      if (!file) throw new Error();

      const transaction = await calculateAPI(file);
      setShowResponse({ show: true, transaction });
    } catch (error) {
      console.log(error);
    }
  }

  function closeHandler() {
    setShowResponse({
      show: false,
      transaction: undefined,
    });
  }

  function submitHandler() {}

  return (
    <>
      <SnackWebcam onImageCapture={calculatePrice} />
      <AddTransactionModal
        closeHandler={closeHandler}
        submitHandler={submitHandler}
        {...showResponse}
      />
    </>
  );
}

export default Scanner;
