/*
Enter the postcodes of the start and end locations, and it will

This is not what the final component will look like. Just testing
things and trying to make things work, and from here we can
build upwards to what we designed.
*/

import axios from "axios";
import { useEffect, useState } from "react";

const Travel = () => {
  // const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  // const [destination, setDestination] = useState({ latitude: 0, longitude: 0 });
  const [startPostcode, setStartPostcode] = useState("");
  const [destPostcode, setDestPostcode] = useState("");
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const data = await axios.get(
        `https://api.tfl.gov.uk/Journey/JourneyResults/${startPostcode}/to/${destPostcode}`
      );
      setData(data.data);
      console.log(data.data);
    } catch {
      console.error("An error occurred");
    }
  };

  return (
    <>
      <label htmlFor="start-postcode">Start postcode:</label>
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
      <br />
      <button onClick={fetchData}>Go</button>
      {Object.keys(data).length !== 0 && (
        <>
          <p>Lines taken:</p>
          {data.journeys.map((journey) => (
            <>
            {journey.legs.map((leg) => (
              <p>{leg.instruction.summary}</p>
            ))}
          <p>---</p>  
            </>
          
          ))}
        </>
      )}
    </>
  );
};

export default Travel;
