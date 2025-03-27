/*
Enter the postcodes of the start and end locations, and it will list
the various routes from the start to the end, as well as instructions
on taking these routes.

This is not what the final component will look like. Just testing
things and trying to make things work, and from here we can
build upwards to what we designed.
*/

import { Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";

const Travel = () => {
  const [startPostcode, setStartPostcode] = useState("");
  const [destPostcode, setDestPostcode] = useState("");
  const [journeyData, setJourneyData] = useState({});

  const fetchData = async () => {
    try {
      // First fetch the journey data
      const res = await axios.get(
        `https://api.tfl.gov.uk/Journey/JourneyResults/${"IG2 6SY"}/to/${"E1 4NS"}`
        // `https://api.tfl.gov.uk/Journey/JourneyResults/${"940GZZLULYS"}/to/${"E1 4NS"}`
      );
      setJourneyData(res.data);
      console.log(res.data);
      const lines = res.data.lines.map((line) => line.id);
      console.log("LINES");
      console.log(lines);
      const resLines = await axios.get(
        `https://api.tfl.gov.uk/Line/${lines.join()}/Disruption`
      );
      console.log(resLines);
    } catch (error) {
      console.log(error);
    }
    // try {
    //   // First fetch the journey data
    //   const res = await axios.get(
    //     `https://api.tfl.gov.uk/Journey/JourneyResults/${"940GZZLULYS"}/to/${"E1 4NS"}`
    //   );
    //   setJourneyData(res.data);
    //   console.log(res.data);
    //   const lines = res.data.lines.map((line) => line.id)
    //   console.log("LINES")
    //   console.log(lines)
    //   // If successful, fetch the statuses for the relevant lines
    //   const resLines = await axios.get(`https://api.tfl.gov.uk/Line/${}/Disruption`)
    // } catch (error) {
    //   console.error("An error occurred");
    // }
  };

  return (
    <>
      <Stack>
        <Typography>Current location: Leytonstone</Typography>
        <Typography>Destination: Queen Mary University of London</Typography>
        <Typography>Estimated Travel Time: </Typography>
      </Stack>

      {/* <label htmlFor="start-postcode">Start postcode:</label>
      <input
        type="text"
        name="start-postcode"
        id="start-postcode"
        value={startPostcode}
        onChange={(e) => setStartPostcode(e.target.value)}
      />
      <label htmlFor="dest-postcode">Destination postcode:</label>
      <input
        type="text"
        name="dest-postcode"
        id="dest-postcode"
        value={destPostcode}
        onChange={(e) => setDestPostcode(e.target.value)}
      />
      <br /> */}
      <button onClick={fetchData}>Go</button>
      {/* {Object.keys(data).length !== 0 && (
        <>
          <p>Lines taken:</p>
          {data.journeys.map((journey) => (
            <>
              {journey.legs.map((leg) => (
                <p>{leg.instruction.summary}</p>
              ))}
              <button>Select this route</button>
              <p>---</p>
            </>
          ))}
        </>
      )} */}
    </>
  );
};

export default Travel;
