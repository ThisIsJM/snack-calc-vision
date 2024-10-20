import styled from "styled-components";
import SnackWebcam from "./components/SnackWebcam";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <MainContainer>
      <SnackWebcam />
      <Sidebar />
    </MainContainer>
  );
}

export default App;

const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  background-color: #f0f8ff; /* Change this to your desired background color */
  padding: 0;
  margin: 0; /* Ensure no default margin */
`;
