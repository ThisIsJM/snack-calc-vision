import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import { grey } from "@mui/material/colors";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const pages = [
  {
    name: "Home",
    route: "/",
  },
  {
    name: "Scanner",
    route: "/scanner",
  },
];

function Navbar() {
  const navigate = useNavigate();

  const handleCloseNavMenu = (route: string) => {
    navigate(route);
  };

  return (
    <AppBar position="static">
      <NavContainer maxWidth="xl">
        <Toolbar variant="dense">
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              padding: "0px",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleCloseNavMenu(page.route)}
                sx={{ color: `${grey["600"]}`, display: "block" }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </NavContainer>
    </AppBar>
  );
}

const NavContainer = styled(Container)`
  padding: 0px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
`;

export default Navbar;
