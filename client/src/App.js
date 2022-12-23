import "./App.css";
import { Routes, Route, HashRouter } from "react-router-dom";

//pages
import Home from "./Pages/Home/Home";
import Summary from "./Pages/Summary/Summary";

//components
import Nav from "./components/Nav/Nav";
import Recommended from "./Pages/Recommended/Recommended";

function App() {
  return (
    <div className="rootBackround">
      <Nav />
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/:editAppointmentId" element={<Home />} />
        {/* <Route path="/recommended/" element={<Recommended />} /> */}
        <Route path="/appointment-saved/" element={<Summary />} />
      </Routes>
    </div>
  );
}

export default App;
