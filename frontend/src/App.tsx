import styled from "styled-components";
import SnackWebcam from "./components/SnackWebcam";
import Sidebar from "./components/Sidebar";
import { calculateAPI } from "./api";
import { useState } from "react";
import TransactionModal from "./components/TransactionModal";
import Transaction from "./models/transaction";

interface ShowResponse {
  show: boolean;
  transaction: Transaction | undefined;
}

function App() {
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
    <MainContainer>
      <SnackWebcam onImageCapture={calculatePrice} />
      <TransactionModal
        closeHandler={closeHandler}
        submitHandler={submitHandler}
        {...showResponse}
      />
      <Sidebar />
    </MainContainer>
  );
}

export default App;

const MainContainer = styled.div`
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  background-color: #ffffff; /* Change this to your desired background color */
  padding: 0;
  margin: 0; /* Ensure no default margin */
`;
