import Img from "../assets/logo.png";
import { useTheme } from "../Context/ThemeContext";
import { useLanguage } from "../Context/LanguageContext";

export default function Header() {
   const { isDark, toggleTheme } = useTheme();
   const { language, toggleLanguage } = useLanguage(); // 추가

   return (
      <header className="fixed top-0 left-0 w-full h-20 shadow-md z-10 bg-white dark:bg-gray-800">
         <div className="mx-auto h-full flex items-center justify-between px-10">
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
               <button
                  onClick={toggleLanguage}
                  className="px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-transform transform hover:-translate-y-0.5 dark:bg-blue-600 dark:hover:bg-blue-500"
               >
                  {language === "ko" ? "영어" : "한국어"}
               </button>
            </div>
         </div>
      </header>
   );
}
