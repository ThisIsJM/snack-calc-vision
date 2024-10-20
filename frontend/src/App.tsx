import styled from "styled-components";
import SnackWebcam from "./components/SnackWebcam";
import Sidebar from "./components/Sidebar";

function App() {
  async function calculatePrice(file: File | undefined) {
    if (!file) return;
  }

  return (
    <MainContainer>
      <SnackWebcam onImageCapture={calculatePrice} />
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
