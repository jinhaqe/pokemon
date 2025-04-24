import { useNavigate } from "react-router";
import { useTheme } from "../Context/ThemeContext";
import { useLanguage } from "../Context/LanguageContext";

export default function FormHeader() {
   const navigate = useNavigate();
   const { isDark, toggleTheme } = useTheme();
   const { language, toggleLanguage } = useLanguage();

   const texts = {
      goBack: language === "ko" ? "뒤로가기" : "Go Back",
      themeToggle: isDark ? "Light" : "Dark",
      langToggle: language === "ko" ? "영어" : "Korean",
   };

   return (
      <div className="flex justify-between items-center mb-6">
         <button
            onClick={() => navigate(-1)}
            className="text-sm font-medium text-sky-500 hover:text-sky-600"
         >
            {texts.goBack}
         </button>
         <div className="flex gap-2">
            <button
               onClick={toggleTheme}
               className="text-sm font-medium text-sky-500 hover:text-sky-600"
            >
               {texts.themeToggle}
            </button>
            <button
               onClick={toggleLanguage}
               className="text-sm font-medium text-sky-500 hover:text-sky-600"
            >
               {texts.langToggle}
            </button>
         </div>
      </div>
   );
}
