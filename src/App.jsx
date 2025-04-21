import Header from "./components/Header";
import Main from "./components/Main";
import { PokemonProvider } from "./Context/PokemonContext";
import { TypeMapProvider } from "./Context/TypeColorContext";
import lastBg2 from "../src/assets/lastBg2.png";
import lastB from "../src/assets/lastB.png";
import { ThemeProvider } from "./Context/ThemeContext";
import { useTheme } from "./Context/ThemeContext";
import Modal from "./components/Modal";
import { ModalProvider } from "./Context/ModalContext";

function AppContent() {
   const { isDark } = useTheme();

   return (
      <div
         className="w-full h-[100%] flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white bg-center"
         style={{ backgroundImage: `url(${isDark ? lastBg2 : lastB})` }}
      >
         <ModalProvider>
            <TypeMapProvider>
               <PokemonProvider>
                  <Header />
                  <Main />
                  <Modal />
               </PokemonProvider>
            </TypeMapProvider>
         </ModalProvider>
      </div>
   );
}

export default function App() {
   return (
      <ThemeProvider>
         <AppContent />
      </ThemeProvider>
   );
}
