import {Paper, styled} from "@mui/material";

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 3,
  background:
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.75)"
      : "rgba(255, 255, 255, 0.35)",
  backdropFilter: "blur(2px)",
  width: "100%",
  maxWidth: "450px",
  margin: 0,
  boxShadow: theme.shadows[0],
}));

export default Card