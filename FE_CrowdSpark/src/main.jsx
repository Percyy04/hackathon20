import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import { AppRouter } from "./routes/index.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppRouter />
    <Toaster />
  </BrowserRouter>
);
