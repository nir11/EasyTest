import './App.css';
import { Routes, Route, Link } from "react-router-dom";

//pages
import Home from './Pages/Home/Home';
import Location from './Pages/Location/Location';

import Nav from './components/Nav/Nav'
function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location" element={<Location />} />
      </Routes>
    </div >
  );
}

export default App;
