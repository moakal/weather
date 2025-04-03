import { Box, styled } from "@mui/material";

const Container = styled(Box)(({ background }) => ({
    minHeight: "100vh",
    background,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "background 0.5s ease",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    paddingBottom: "80px",
  }));

export default Container