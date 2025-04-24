import { ModalProvider } from "../Context/ModalContext";
import { TypeMapProvider } from "../Context/TypeColorContext";
import { PokemonProvider } from "../Context/PokemonContext";

export default function AppProviders({ children }) {
   return (
      <ModalProvider>
         <TypeMapProvider>
            <PokemonProvider>{children}</PokemonProvider>
         </TypeMapProvider>
      </ModalProvider>
   );
}
