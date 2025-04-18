import PokemonCard from "./PorkemonCard";
import { PokemonContext } from "../Context/PokemonContext";
import { useContext } from "react";
import Img from "../assets/에몽가.gif";
import Bg from "../assets/Bg.jpg";

export default function Main() {
   const { pokemonList, loading } = useContext(PokemonContext);

   return (
      <main className="pt-20  mx-auto w-full">
         <div
            className="mb-8 flex justify-center w-full py-40 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${Bg})` }}
         >
            <input
               type="text"
               placeholder="포켓몬 이름 또는 번호를 입력하세요"
               className="w-full max-w-lg px-5 py-3 mt-10 rounded-lg border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
         </div>
         <div className="flex flex-wrap justify-center gap-5 px-50 py-5">
            {loading ? (
               <div className="w-full flex flex-col justify-center items-center py-10 space-y-4">
                  <img src={Img} className="animate-spin-slow" />
                  <p className="text-xl font-bold text-gray-600 animate-pulse ">
                     포켓몬 불러오는 중...
                  </p>
               </div>
            ) : (
               pokemonList.map((pokemon) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} />
               ))
            )}
         </div>
      </main>
   );
}
