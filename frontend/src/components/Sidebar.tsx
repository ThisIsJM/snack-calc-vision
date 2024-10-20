import { Box } from "@mui/material";
import styled from "styled-components";

function Sidebar() {
  return (
    <StyledBox>
      <StyledTitle>Transaction History</StyledTitle>
    </StyledBox>
  );
}

const StyledBox = styled(Box)`
  padding: 10px;
  padding-top: 0;
  min-width: 250px;
`;

const StyledTitle = styled.h3`
  white-space: nowrap;
  font-weight: 500;
`;

export default Sidebar;
