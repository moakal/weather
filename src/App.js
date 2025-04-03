import React from "react";
import Travel from "./pages/Travel";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/timetable" element={<Timetable />} /> */}
          <Route path="/travel" element={<Travel />} />
          {/* <Route path="/weather" element={<Weather />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
