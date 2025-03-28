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
import { useCallback, useEffect, useState } from "react";

const Travel = () => {
  const [startPostcode, setStartPostcode] = useState("");
  const [destPostcode, setDestPostcode] = useState("");
  const [journeyData, setJourneyData] = useState({});
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      // First fetch the journey data
      const res = await axios.get(
        `https://api.tfl.gov.uk/Journey/JourneyResults/${"IG2 6SY"}/to/${"EC4V 6BJ"}?journeyPreference=leastinterchange&routeBetweenEntrances=true`
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

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <p>From: Gants Hill</p>
      <p>To: Queen Mary University of London</p>
      <p>Estimated Travel Time: {journeyData.journeys[0].duration} minutes</p>
    </div>
  );
};

export default Travel;
