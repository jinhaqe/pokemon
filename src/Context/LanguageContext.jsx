import { createContext, useContext, useState } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
   const [language, setLanguage] = useState("ko"); // 기본값: 한국어

   const toggleLanguage = () => {
      setLanguage((prev) => (prev === "ko" ? "en" : "ko"));
   };

   return (
      <LanguageContext.Provider value={{ language, toggleLanguage }}>
         {children}
      </LanguageContext.Provider>
   );
};

export const useLanguage = () => useContext(LanguageContext);
