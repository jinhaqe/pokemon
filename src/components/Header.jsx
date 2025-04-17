import { useState, useEffect } from "react";
import Img from "../assets/logo.png";

export default function Header() {
   const [isDark, setIsDark] = useState(false);

   const toggleTheme = () => setIsDark(!isDark);

   useEffect(() => {
      document.documentElement.classList.toggle("dark", isDark);
   }, [isDark]);

   return (
      <header className="fixed top-0 left-0 w-full h-20 shadow-md z-10 bg-white dark:bg-gray-800">
         <div className="max-w-[calc(100%-600px)] mx-auto h-full flex items-center justify-between px-10">
            <img
               src={Img}
               alt="포켓몬 도감 로고"
               className="w-[150px] h-auto"
            />
            <div className="flex gap-3">
               <button
                  className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-transform transform hover:-translate-y-0.5 dark:bg-gray-600 dark:hover:bg-gray-500"
                  onClick={toggleTheme}
               >
                  {isDark ? "Light" : "Dark"}
               </button>
               <button className="px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-transform transform hover:-translate-y-0.5 dark:bg-blue-600 dark:hover:bg-blue-500">
                  언어
               </button>
            </div>
         </div>
      </header>
   );
}
