import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import RegisterAcc from "./Components/RegisterAcc";
import Dashboard from './Components/Dashboard';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar'
import ListOfActivities from './Components/ListOfActivities';

function App() {
  return (
    <div className="app">
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/registerAcc" element={<RegisterAcc/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/listOfActivities" element={<ListOfActivities/>}/>
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
    
  );
}

export default App;