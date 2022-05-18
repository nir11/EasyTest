import './App.css';
import { Routes, Route, Link } from "react-router-dom";

//pages
import Home from './Pages/Home/Home';
import Location from './Pages/Location/Location';

import Nav from './components/Nav/Nav'
import Summary from './components/Summary/Summary';
function App() {
  return (
    <div className='rootBackround'>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location" element={<Location />} />
        <Route path="/appointment-saved" element={<Summary />} />
      </Routes>
    </div >
  );
}

export default App;
