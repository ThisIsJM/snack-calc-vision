import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import styled from "styled-components";
import Transaction from "../../models/transaction";
import { useEffect, useState } from "react";
import { getTransactionsAPI } from "../../api";
import TransactionTable from "../TransactionTable";
import SnackWebcam from "../SnackWebcam";
import ImageUploader from "../ImageUploader";

/**
 * TODO
 * INSTALL DATE-FNS
 */
function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const getTransactionHistory = async () => {
      const transactions = await getTransactionsAPI();
      setTransactions(transactions);
    };

    getTransactionHistory();
  }, []);

  return (
    <Container>
      <Typography variant="h6">Dashboard</Typography>
      <BodyContainer>
        <BodyContents>
          <ImageUploader />
          <SnackWebcam />
        </BodyContents>
        <BodyContents>
          <TransactionTable transactions={transactions} />
        </BodyContents>
      </BodyContainer>
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
