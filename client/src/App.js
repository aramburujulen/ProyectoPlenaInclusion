import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
            {/* <Navbar/>
            <Dashboard/>
          </Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;