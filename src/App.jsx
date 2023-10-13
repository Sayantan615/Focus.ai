import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Loginpage from "./Login";

function App() {
  return (
    <>
      <Dashboard />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Loginpage />} />
      </Routes>
    </>
  );
}

export default App;
