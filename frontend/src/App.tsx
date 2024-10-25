import styled from "styled-components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Scanner from "./components/pages/Scanner";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";

function App() {
  return (
    <MainContainer>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scanner" element={<Scanner />} />
        </Routes>
      </BrowserRouter>
    </MainContainer>
  );
}

export default App;

const MainContainer = styled.div`
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #ffffff; /* Change this to your desired background color */
  padding: 0;
  margin: 0; /* Ensure no default margin */
`;
