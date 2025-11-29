import { Route, Routes } from "react-router";
import Login from "../pages/authen/login/login";
import Signup from "../pages/authen/signup/signup";
import Home from "../pages/home/home";

export function AppRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}
