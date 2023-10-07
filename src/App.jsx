import "./App.css";
import { Route, Routes, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import Loginpage from "./Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Loginpage />} />
      </Routes>
      <Dashboard />
    </>
  );
}

export default App;
