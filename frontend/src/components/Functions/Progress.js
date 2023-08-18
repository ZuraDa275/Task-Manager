import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e76062",
    },
  },
});

function Progress() {
  return (
    <Box sx={{ width: "100%", position: "absolute" }}>
      <ThemeProvider theme={theme}>
        <LinearProgress
          sx={{ bgcolor: "transparent", height: 8 }}
          style={{ top: "0" }}
          color="primary"
        />
      </ThemeProvider>
    </Box>
  );
}
function CProgress() {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress style={{ color: "white" }} />
    </Box>
  );
}

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 2, mb: 1 }}>
        <ThemeProvider theme={theme}>
          <LinearProgress
            color="primary"
            variant="determinate"
            {...props}
            sx={{ borderRadius: 5, height: 6 }}
          />
        </ThemeProvider>
      </Box>
      <Box sx={{ minWidth: 35, mb: 1 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

function LinearWithValueLabel({ completePercentage }) {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel value={completePercentage} />
    </Box>
  );
}
export { Progress, CProgress, LinearWithValueLabel };
