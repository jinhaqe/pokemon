import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "../src/components/Login.jsx";
import Signup from "../src/components/Signup.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import { LanguageProvider } from "./Context/LanguageContext.jsx";
import AppProviders from "./components/AppProviders.jsx";

createRoot(document.getElementById("root")).render(
   <LanguageProvider>
      <ThemeProvider>
         <AppProviders>
            <BrowserRouter>
               <Routes>
                  <Route index element={<App />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
               </Routes>
            </BrowserRouter>
         </AppProviders>
      </ThemeProvider>
   </LanguageProvider>
);
