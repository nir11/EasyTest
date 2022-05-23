import './App.css';
import { Routes, Route, HashRouter } from "react-router-dom";

//pages
import Home from './Pages/Home/Home';
import Location from './Pages/Location/Location';
import Summary from './Pages/Summary/Summary';

//components
import Nav from './components/Nav/Nav'

function App() {
  return (
    <div className='rootBackround'>
      <Nav />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/location/" element={<Location />} />
        <Route path="/appointment-saved/" element={<Summary />} />
        <Route path='*' element={<Home />} />
      </Routes>


    </div >
  );
}

export default App;
