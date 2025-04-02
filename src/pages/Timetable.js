import React, { useState } from "react";
import ICAL from "ical.js";
import {
  Box,
  Typography,
  Stack,
  Paper,
  styled,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Input,
  Menu,
  MenuItem,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link, useLocation } from "react-router-dom";

/**
 * Styled Components
 * These define reusable styled components with responsive design
 */
const TimetableContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(rgba(0, 0, 0, 0.7), url(/images/default.jpg))'
    : 'linear-gradient(rgba(255, 255, 255, 0.7), url(/images/default.jpg))',
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  boxSizing: "border-box",
  paddingBottom: "80px", // Extra padding for bottom navigation
}));

const TimetableCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.85)',
  backdropFilter: "blur(8px)",
  width: "100%",
  maxWidth: "95vw",
  margin: "auto",
  boxShadow: theme.shadows[2],
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 3,
    maxWidth: "900px",
  },
}));

const TimeSlot = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(0.5),
  margin: theme.spacing(0.25),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: color ? theme.palette[color].light : theme.palette.primary.light,
  color: theme.palette.getContrastText(color ? theme.palette[color].light : theme.palette.primary.light),
  fontSize: '0.65rem',
  textAlign: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  boxShadow: 'none',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1),
    fontSize: '0.75rem',
    margin: theme.spacing(0.5),
  },
}));

const DayHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  textAlign: 'center',
  padding: theme.spacing(0.5),
  fontSize: '0.75rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '0.9rem',
    padding: theme.spacing(1),
  },
}));

const TimeLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  textAlign: 'right',
  padding: theme.spacing(0.5),
  fontSize: '0.65rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '0.8rem',
    padding: theme.spacing(1),
  },
}));

const ImportButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontSize: '0.7rem',
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(1),
    fontSize: '0.875rem',
  },
}));

/**
 * Sample timetable data for demonstration
 */
const dummyEvents = [
  { day: "MON", startTime: "09:00", endTime: "10:00", module: "Mathematics", location: "Room 101", type: "Lecture" },
  { day: "MON", startTime: "11:00", endTime: "12:00", module: "Physics", location: "Lab 205", type: "Practical" },
  { day: "MON", startTime: "14:00", endTime: "16:00", module: "Computer Science", location: "Room 302", type: "Lecture" },
  { day: "TUE", startTime: "10:00", endTime: "12:00", module: "Chemistry", location: "Lab 105", type: "Practical" },
  { day: "TUE", startTime: "13:00", endTime: "14:00", module: "English", location: "Room 201", type: "Lecture" },
  { day: "WED", startTime: "09:00", endTime: "11:00", module: "Mathematics", location: "Room 101", type: "Tutorial" },
  { day: "WED", startTime: "14:00", endTime: "16:00", module: "History", location: "Room 203", type: "Lecture" },
  { day: "THU", startTime: "10:00", endTime: "12:00", module: "Biology", location: "Lab 305", type: "Practical" },
  { day: "FRI", startTime: "11:00", endTime: "13:00", module: "Art", location: "Studio 401", type: "Workshop" },
];

/**
 * Color mapping for different modules
 */
const eventColors = {
  "Mathematics": "primary",
  "Physics": "secondary",
  "Computer Science": "info",
  "Chemistry": "success",
  "English": "warning",
  "History": "error",
  "Biology": "primary",
  "Art": "secondary",
  "Default": "info"
};

/**
 * Main Timetable Component
 */
const Timetable = () => {
  const theme = useTheme();
  const location = useLocation();
  
  // State management
  const [navValue, setNavValue] = useState(() => {
    // Set initial navigation value based on current route
    switch(location.pathname) {
      case '/': return 0;
      case '/timetable': return 1;
      case '/travel': return 2;
      case '/weather': return 3;
      default: return 0;
    }
  });
  const [events, setEvents] = useState(dummyEvents);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Timetable configuration
  const times = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
  ];

  const days = ["MON", "TUE", "WED", "THU", "FRI"];

  /**
   * Handles file upload and parsing of ICS files
   */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jcalData = ICAL.parse(e.target.result);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents("vevent");

        // Parse each event from the ICS file
        const parsedEvents = vevents.map((vevent) => {
          const event = new ICAL.Event(vevent);
          const startDate = event.startDate.toJSDate();
          const hours = startDate.getHours();
          const formattedHour = hours < 10 ? `0${hours}` : `${hours}`;

          const endDate = event.endDate.toJSDate();
          const endHours = endDate.getHours();
          const formattedEndHour = endHours < 10 ? `0${endHours}` : `${endHours}`;

          return {
            day: startDate
              .toLocaleDateString("en-US", { weekday: "short" })
              .slice(0, 3)
              .toUpperCase(),
            startTime: `${formattedHour}:00`,
            endTime: `${formattedEndHour}:00`,
            module: event.summary || "Class",
            location: event.location || "TBA",
            type: event.description || "Event",
          };
        });

        setEvents(parsedEvents);
      } catch (error) {
        console.error("Error parsing ICS file:", error);
        alert("Error parsing ICS file. Please make sure it's a valid ICS file.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  // Helper functions
  const clearTimetable = () => {
    setEvents([]);
    handleClose();
  };

  const loadDummyTimetable = () => {
    setEvents(dummyEvents);
    handleClose();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Finds an event for a specific time slot
   */
  const getEventForTimeSlot = (day, time) => {
    const [startHour] = time.split(" - ");
    return events.find(
      (event) => event.day === day && event.startTime === startHour
    );
  };

  /**
   * Gets the color for a module based on its name
   */
  const getEventColor = (module) => {
    if (!module) return "Default";
    const moduleKey = Object.keys(eventColors).find(key => 
      module.toLowerCase().includes(key.toLowerCase())
    );
    return moduleKey || "Default";
  };

  return (
    <>
      <TimetableContainer>
        <TimetableCard>
          <Stack spacing={2} alignItems="center">
            {/* Header section with title and menu */}
            <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
              <Stack spacing={0.5}>
                <Typography variant="h5" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  Weekly Schedule
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {events.length > 0 ? "Your current timetable" : "No timetable loaded"}
                </Typography>
              </Stack>
              
              {/* Options menu button */}
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
                size="small"
              >
                <MoreVertIcon fontSize="inherit" />
              </IconButton>
              
              {/* Options menu */}
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: 48 * 4.5,
                    width: '20ch',
                  },
                }}
              >
                <MenuItem onClick={loadDummyTimetable} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Load Sample Timetable
                </MenuItem>
                <MenuItem onClick={clearTimetable} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Clear Timetable
                </MenuItem>
              </Menu>
            </Box>

            {/* Import controls */}
            <Stack direction="row" spacing={1} width="100%" justifyContent="center">
              <Input
                type="file"
                accept=".ics"
                onChange={handleFileUpload}
                id="ics-upload"
                sx={{ display: 'none' }}
              />
              <label htmlFor="ics-upload">
                <ImportButton
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon fontSize="small" />}
                  disabled={loading}
                  fullWidth
                  sx={{ minWidth: '120px' }}
                >
                  {loading ? <CircularProgress size={20} /> : "Import ICS"}
                </ImportButton>
              </label>
            </Stack>

            {/* Timetable display */}
            {events.length > 0 ? (
              <>
                <Box sx={{ width: '100%', overflowX: 'auto', '-webkit-overflow-scrolling': 'touch' }}>
                  <Table sx={{ minWidth: 300 }} aria-label="timetable">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '15%', p: { xs: 0.5, sm: 1 } }}></TableCell>
                        {days.map((day) => (
                          <TableCell key={day} align="center" sx={{ width: '17%', p: { xs: 0.5, sm: 1 } }}>
                            <DayHeader variant="subtitle1">{day}</DayHeader>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {times.map((timeSlot) => (
                        <TableRow key={timeSlot}>
                          <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
                            <TimeLabel variant="body2">{timeSlot}</TimeLabel>
                          </TableCell>
                          {days.map((day) => {
                            const event = getEventForTimeSlot(day, timeSlot);
                            const color = event ? getEventColor(event.module) : null;
                            return (
                              <TableCell key={`${day}-${timeSlot}`} align="center" sx={{ p: { xs: 0.5, sm: 1 } }}>
                                {event && (
                                  <TimeSlot color={eventColors[color]}>
                                    <div>{event.module}</div>
                                    <div style={{ fontSize: '0.55rem' }}>{event.location}</div>
                                  </TimeSlot>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>

                {/* Color legend */}
                <Box sx={{ width: '100%', textAlign: 'center', mt: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" mb={1} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Module Colors
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
                    {Object.entries(eventColors).map(([module, color]) => (
                      <Paper
                        key={module}
                        sx={{
                          p: 0.5,
                          backgroundColor: theme.palette[color].light,
                          color: theme.palette.getContrastText(theme.palette[color].light),
                          borderRadius: 1,
                          fontSize: '0.6rem',
                          whiteSpace: 'nowrap',
                          [theme.breakpoints.up('sm')]: {
                            p: 1,
                            fontSize: '0.75rem',
                          },
                        }}
                      >
                        {module}
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </>
            ) : (
              // Empty state when no timetable is loaded
              <Box sx={{ 
                width: '100%', 
                height: { xs: '200px', sm: '300px' }, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center',
                gap: 2
              }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  No timetable loaded
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={loadDummyTimetable}
                  startIcon={<EventIcon fontSize="small" />}
                  size="small"
                >
                  Load Sample Timetable
                </Button>
              </Box>
            )}
          </Stack>
        </TimetableCard>
      </TimetableContainer>

      {/* Bottom navigation bar */}
      <BottomNavigation
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.palette.mode === 'dark' ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.9)",
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
          icon={<HomeIcon fontSize="small" />}
          sx={{
            '& .MuiBottomNavigationAction-label': {
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }
          }}
        />
        <BottomNavigationAction 
          component={Link}
          to="/timetable"
          label="Timetable" 
          icon={<EventIcon fontSize="small" />}
          sx={{
            '& .MuiBottomNavigationAction-label': {
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }
          }}
        />
        <BottomNavigationAction 
          component={Link}
          to="/travel"
          label="Travel" 
          icon={<DirectionsCarIcon fontSize="small" />}
          sx={{
            '& .MuiBottomNavigationAction-label': {
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }
          }}
        />
        <BottomNavigationAction 
          component={Link}
          to="/weather"
          label="Weather" 
          icon={<WbSunnyIcon fontSize="small" />}
          sx={{
            '& .MuiBottomNavigationAction-label': {
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }
          }}
        />
      </BottomNavigation>
    </>
  );
};

export default Timetable;