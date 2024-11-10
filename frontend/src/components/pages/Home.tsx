import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import styled from "styled-components";
import TransactionTable from "../TransactionTable";
import SnackWebcam from "../SnackWebcam";
import ImageUploader from "../ImageUploader";
import { useTransactionStore } from "../../store";
import { useEffect, useState } from "react";
import AddTransactionModal from "../AddTransactionModal";
import { ShowResponse } from "./Scanner";
import { addTransactionAPI, calculateAPI } from "../../api";

function Home() {
  const { transactions, updateTransactions } = useTransactionStore(
    (state) => state
  );

  const [image, setImage] = useState<File | null>(null);
  const [showResponse, setShowResponse] = useState<ShowResponse>({
    show: false,
    transaction: undefined,
  });

  useEffect(() => {
    updateTransactions();
  }, []);

  async function closeHandler() {
    setShowResponse({ show: false, transaction: undefined });
  }

  async function calculatePriceHandler(file: File) {
    const transaction = await calculateAPI(file);

    setImage(file);
    setShowResponse({ show: true, transaction });
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
    <Container>
      <Typography variant="h6">Dashboard</Typography>
      <BodyContainer>
        <BodyContents>
          <ImageUploader onImageUpload={calculatePriceHandler} />
          <SnackWebcam onImageCapture={calculatePriceHandler} />
        </BodyContents>
        <BodyContents>
          <TransactionTable transactions={transactions} />
        </BodyContents>
      </BodyContainer>

      <AddTransactionModal
        {...showResponse}
        image={image}
        submitHandler={submitHandler}
        closeHandler={closeHandler}
      />
    </Container>
  );
}

export default Home;

const BodyContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  height: 100%;
  width: 100%;
  gap: 10px;
`;

const BodyContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 10px;
  width: 100%;
  height: 100%;
  padding: 15px;

  border: 1px solid gray; /* Change the color as needed */
  border-radius: 15px; /* Adjust the radius for more or less rounding */
  padding: 20px; /* Add padding inside the container */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional shadow for depth */
  box-sizing: border-box;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  color: ${grey[600]};
  height: 100%;
  box-sizing: border-box;
`;
