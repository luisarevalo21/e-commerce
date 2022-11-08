import Login from "./components/Registration/Login/Login";
import Register from "./components/Registration/Register/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import Header from "./components/Header/Header";
import "./App.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
