import AppProviders from "./components/AppProviders";
import Header from "./components/Header";
import Main from "./components/Main";
import Modal from "./components/Modal";
import { useTheme } from "./Context/ThemeContext";
import lastBg2 from "./assets/lastBg2.png";
import lastB from "./assets/lastB.png";

function AppContent() {
   const { isDark } = useTheme();

   return (
      <div
         className="w-full min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white bg-center bg-no-repeat"
         style={{
            backgroundImage: `url(${isDark ? lastBg2 : lastB})`,
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
      <AppProviders>
         <AppContent />
      </AppProviders>
   );
}
