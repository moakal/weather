import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  useTheme,
  Stack,
  Typography,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Paper,
  styled
} from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { Link, useLocation } from "react-router-dom";

const TravelContainer = styled(Box)(({ background }) => ({
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

const TravelCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 3,
  background:
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.75)"
      : "rgba(255, 255, 255, 0.35)",
  backdropFilter: "blur(2px)",
  margin: 0,
  boxShadow: theme.shadows[0],
}));

const lineColours = [
  {
    name: "bakerloo",
    colour: "#B36305",
  },
  {
    name: "central",
    colour: "#E32017",
  },
  {
    name: "circle",
    colour: "#FFD300",
  },
  {
    name: "district",
    colour: "#00782A",
  },
  {
    name: "elizabeth",
    colour: "#6950a1",
  },
  {
    name: "hammersmith-city",
    colour: "#F3A9BB",
  },
  {
    name: "jubilee",
    colour: "#A0A5A9",
  },
  {
    name: "metropolitan",
    colour: "#9B0056",
  },
  {
    name: "northern",
    colour: "#000000",
  },
  {
    name: "piccadilly",
    colour: "#003688",
  },
  {
    name: "victoria",
    colour: "#0098D4",
  },
  {
    name: "waterloo-city",
    colour: "#95CDBA",
  },
];

const Travel = () => {
  const [startPostcode, setStartPostcode] = useState("");
  const [destPostcode, setDestPostcode] = useState("");
  const [journeyData, setJourneyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disruptions, setDisruptions] = useState([]);
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const location = useLocation();
  const [navValue, setNavValue] = useState(() => {
    switch (location.pathname) {
      case "/":
        return 0;
      case "/timetable":
        return 1;
      case "/travel":
        return 2;
      case "/weather":
        return 3;
      default:
        return 0;
    }
  });

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      // First fetch the journey data
      const res = await axios.get(
        `https://api.tfl.gov.uk/Journey/JourneyResults/${startPostcode}/to/${destPostcode}?journeyPreference=leastinterchange&routeBetweenEntrances=true`
      );
      setJourneyData(res.data);
      const lines = res.data.lines.map((line) => line.id);
      const disruptions = await axios.get(
        `https://api.tfl.gov.uk/Line/Mode/tube/Status`
      );
      setDisruptions(disruptions.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getLineColour = (name) => {
    const colourObj = lineColours.find((obj) => obj.name === name);
    if (colourObj) {
      return colourObj.colour;
    }

    return "#ffffff";
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getStatusDesc = (dis) => {
    return dis.lineStatuses[0].statusSeverityDescription
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          Enter Postcodes
        </DialogTitle>
        <DialogContent>
          <Stack gap={2}>
            <Stack>
              <Typography>Start Postcode</Typography>
              <TextField
                variant="outlined"
                value={startPostcode}
                onChange={(e) => setStartPostcode(e.target.value)}
              />
            </Stack>
            <Stack>
              <Typography>Destination Postcode</Typography>
              <TextField
                variant="outlined"
                value={destPostcode}
                onChange={(e) => setDestPostcode(e.target.value)}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              fetchData();
            }}
          >
            Go
          </Button>
        </DialogActions>
      </Dialog>
      <TravelContainer background={"url('/images/tube_map4.png')"}>
        <Stack gap={2}>
          <Button
            onClick={handleClickOpen}
            sx={{ borderRadius: "10px", color: "white" }}
            variant="text"
          >
            Enter Start and Destination
          </Button>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            startPostcode === "" || destPostcode === "" ? (
              <Typography sx={{ color: "white" }} variant="h4" textAlign="center">
                Enter start and destination postcodes
              </Typography>
            ) : (
              <Typography color="error" variant="h4">
                Failed to fetch journey data
              </Typography>
            )
          ) : (
            <Stack gap={2} textAlign="center" alignItems="stretch">
              <TravelCard>
                <Typography variant="h4">
                  Current Location: <b>{startPostcode}</b>
                </Typography>
                <br />
                <Typography variant="h4">
                  Destination: <b>{destPostcode}</b>
                </Typography>
              </TravelCard>
              <TravelCard>
                <Typography mb={2} variant="h6" fontWeight="bold">
                  Estimated Travel Time
                </Typography>
                <Typography>
                  {journeyData.journeys[0].duration} minutes
                </Typography>
              </TravelCard>
              <TravelCard>
                <Typography fontWeight="bold" variant="h6" mb={2}>Transport Updates</Typography>
                <Stack gap={1}>
                  {disruptions.map((dis) => (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                      fontWeight="bold"
                        px={1}
                        sx={{ borderRadius: "8px" }}
                        bgcolor={() => getLineColour(dis.id)}
                        color={dis.id === "northern" ? "white" : "black"}
                      >{`${
                        dis.id.charAt(0).toUpperCase() + dis.id.slice(1)
                      }`}</Typography>
                      <Typography sx={{color: getStatusDesc(dis) === "Good Service" ? "#0b7000" : getStatusDesc(dis) === "Minor Delays" ? "#4a2a00" : "#700000"}}>{getStatusDesc(dis)}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </TravelCard>
            </Stack>
          )}
        </Stack>
      </TravelContainer>
      <BottomNavigation
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(0, 0, 0, 0.7)"
              : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: theme.shadows[3],
        }}
        value={navValue}
        onChange={(_, newValue) => setNavValue(newValue)}
        showLabels
      >
        <BottomNavigationAction
          component={Link}
          to="/"
          label="Home"
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to="/timetable"
          label="Timetable"
          icon={<EventIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to="/travel"
          label="Travel"
          icon={<DirectionsCarIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to="/weather"
          label="Weather"
          icon={<WbSunnyIcon />}
        />
      </BottomNavigation>
    </>
  );
};

export default Travel;