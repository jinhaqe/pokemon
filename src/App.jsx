import Header from "./components/Header";
import Main from "./components/Main";
import { PokemonProvider } from "./Context/PokemonContext";
import { TypeColorContext, TypeMapProvider } from "./Context/TypeColorContext";
import lastBg from "../src/assets/lastB.png";
import Bg2 from "../src/assets/Bg2.jpg";
function App() {
   return (
      <div
         className="w-full min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white bg-center"
         style={{ backgroundImage: `url(${lastBg})` }}
      >
         <TypeMapProvider>
            <PokemonProvider>
               <Header />
               <Main />
            </PokemonProvider>
         </TypeMapProvider>
      </div>
   );
}

export default App;
