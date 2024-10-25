import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import styled from "styled-components";

function Home() {
  return (
    <Container>
      <Typography variant="h6">Transaction History</Typography>
    </Container>
  );
}

export default Home;

const Container = styled.div`
  padding: 10px;
  color: ${grey[600]};
`;
