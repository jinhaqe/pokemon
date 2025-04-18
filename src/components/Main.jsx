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
               className="w-full mr-3 max-w-lg px-5 py-3 mb-10 rounded-4xl border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <button className="h-13 p-3 rounded-4xl border bg-white border-gray-300 text-sm hover:bg-black hover:text-white transition-transform transform hover:-translate-y-0.5 dark:bg-gray-700 dark:text-white">
               검색
            </button>
         </div>
         <div className="w-[75%] mx-auto flex flex-wrap justify-center gap-5 py-5">
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
