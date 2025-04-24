import AppProviders from "./components/AppProviders";
import Header from "./components/Header";
import Main from "./components/Main";
import Modal from "./components/Modal";
import { useTheme } from "./Context/ThemeContext";
import lastBg2 from "./assets/lastBg2.png";
import lastB from "./assets/lastB.png";
import { LanguageProvider } from "./Context/LanguageContext";
import { ThemeProvider } from "./Context/ThemeContext"; // 테마 관리

function AppContent() {
   const { isDark } = useTheme(); // 테마 상태 가져오기

   return (
      <div
         className="w-full min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white bg-center bg-no-repeat"
         style={{
            backgroundImage: `url(${isDark ? lastBg2 : lastB})`,
            backgroundColor: isDark ? "#1a202c" : "#f7fafc",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
         }}
      >
         <Header />
         <Main />
         <Modal />
      </div>
   );
}

export default function App() {
   return (
      <LanguageProvider>
         <ThemeProvider>
            <AppProviders>
               <AppContent />
            </AppProviders>
         </ThemeProvider>
      </LanguageProvider>
   );
}
