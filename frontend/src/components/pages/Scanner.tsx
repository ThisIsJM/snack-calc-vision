import React, { useState } from "react";
import SnackWebcam from "../SnackWebcam";
import TransactionModal from "../TransactionModal";
import Transaction from "../../models/transaction";
import { calculateAPI } from "../../api";

interface ShowResponse {
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
      <TransactionModal
        closeHandler={closeHandler}
        submitHandler={submitHandler}
        {...showResponse}
      />
    </>
  );
}

export default Scanner;