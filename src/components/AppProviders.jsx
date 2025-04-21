import { LanguageProvider } from "../Context/LanguageContext";
import { ThemeProvider } from "../Context/ThemeContext";
import { ModalProvider } from "../Context/ModalContext";
import { TypeMapProvider } from "../Context/TypeColorContext";
import { PokemonProvider } from "../Context/PokemonContext";

export default function AppProviders({ children }) {
   return (
      <LanguageProvider>
         <ThemeProvider>
            <ModalProvider>
               <TypeMapProvider>
                  <PokemonProvider>{children}</PokemonProvider>
               </TypeMapProvider>
            </ModalProvider>
         </ThemeProvider>
      </LanguageProvider>
   );
}
