import { useEffect, useRef, useContext } from "react";
import PokemonCard from "./PorkemonCard";
import { PokemonContext } from "../Context/PokemonContext";
import Img from "../assets/에몽가.gif";
import Bg from "../assets/Bg.jpg";
import Bg2 from "../assets/Bg2.jpg";
import { useTheme } from "../Context/ThemeContext";
import { useModal } from "../Context/ModalContext";

export default function Main() {
   const { pokemonList, loading, fetchMorePokemon, more } =
      useContext(PokemonContext);
   const { openModal } = useModal();
   const { isDark } = useTheme();

   const observerRef = useRef();

   useEffect(() => {
      const observer = new IntersectionObserver(
         (entries) => {
            if (entries[0].isIntersecting && more) {
               fetchMorePokemon(); // 다음 포켓몬 호출
            }
         },
         { threshold: 0.5 }
      );

      if (observerRef.current) observer.observe(observerRef.current);

      return () => {
         if (observerRef.current) observer.unobserve(observerRef.current);
      };
   }, [more, fetchMorePokemon]);

   return (
      <main className="pt-20 mx-auto w-full">
         <div
            className="mb-8 flex justify-center w-full py-40 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${isDark ? Bg2 : Bg})` }}
         >
            <input
               type="text"
               placeholder="포켓몬 이름 또는 번호를 입력하세요"
               className="w-full mr-3 max-w-lg px-5 py-3 mb-10 rounded-4xl border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-400"
            />
            <button className="h-13 p-3 rounded-4xl border bg-white border-gray-300 text-sm hover:bg-black hover:text-white transition-transform transform hover:-translate-y-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600">
               ꔫ
            </button>
         </div>

         {/* 포켓몬 카드 리스트 */}
         <div className="w-[75%] mx-auto flex flex-wrap justify-center gap-5 py-5">
            {pokemonList.map((pokemon) => (
               <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onClick={() => openModal(pokemon)}
               />
            ))}
         </div>

         {/* 로딩 인디케이터와 관찰자를 분리 */}
         {loading && (
            <div className="w-full flex justify-center pb-10">
               <div className="flex flex-col items-center space-y-4">
                  <img src={Img} className="animate-spin-slow" alt="로딩 중" />
                  <p className="text-xl font-bold text-gray-600 animate-pulse">
                     포켓몬 불러오는 중...
                  </p>
               </div>
            </div>
         )}

         {/* 관찰자 요소는 항상 존재하지만 보이지 않음 */}
         <div className="w-full flex justify-center">
            <div ref={observerRef} className="h-10 w-full"></div>
         </div>
      </main>
   );
}
