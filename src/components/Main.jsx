import { useEffect, useRef, useContext, useState } from "react";
import PokemonCard from "./PorkemonCard";
import Bg from "../assets/Bg.jpg";
import Bg2 from "../assets/Bg2.jpg";
import { useTheme } from "../Context/ThemeContext";
import { useModal } from "../Context/ModalContext";
import { useLanguage } from "../Context/LanguageContext";
import { PokemonContext } from "../Context/PokemonContext";
import noResult from "../assets/로딩.gif";

export default function Main() {
   const { pokemonList, searchLoading, fetchMorePokemon, more } =
      useContext(PokemonContext);
   const { searchPokemon, searchQuery } = useContext(PokemonContext);
   const { language } = useLanguage();
   const { openModal } = useModal();
   const { isDark } = useTheme();

   const [query, setQuery] = useState(searchQuery);

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

   const handleSearch = () => {
      searchPokemon(query);
   };

   const handleKeyPress = (e) => {
      if (e.key === "Enter") {
         handleSearch();
      }
   };

   return (
      <main className="pt-20 mx-auto w-full">
         <div
            className="mb-8 flex justify-center w-full py-40 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${isDark ? Bg2 : Bg})` }}
         >
            <input
               type="text"
               value={query}
               onChange={(e) => setQuery(e.target.value)} // 입력값이 변경되면 로컬 상태에 저장
               onKeyPress={handleKeyPress} // 엔터 키를 눌렀을 때 검색 실행
               placeholder={
                  language === "ko"
                     ? "포켓몬 이름 또는 번호 검색..."
                     : "Search by name or number..."
               }
               className="w-full mr-3 max-w-lg px-5 py-3 mb-10 rounded-4xl border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-400"
            />
            <button
               onClick={handleSearch} // 버튼 클릭 시 검색
               className="h-13 p-3 cursor-pointer rounded-4xl border bg-white border-gray-300 text-sm hover:bg-black hover:text-white transition-transform transform hover:-translate-y-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
               ꔫ
            </button>
         </div>

         {/* 포켓몬 카드 리스트 */}
         <div className="w-[75%] mx-auto flex flex-wrap justify-center gap-5 py-5">
            {pokemonList.length === 0 && !searchLoading ? ( // searchLoading이 false일 때만 결과 없음 표시
               <div className="flex-col">
                  <p className="text-xl text-center mb-4 text-gray-500">
                     {language === "ko"
                        ? "결과가 없습니다"
                        : "No results found"}
                  </p>
                  <img src={noResult} />
               </div>
            ) : (
               pokemonList.map((pokemon) => (
                  <PokemonCard
                     key={pokemon.id}
                     pokemon={pokemon}
                     onClick={() => openModal(pokemon)}
                  />
               ))
            )}
         </div>

         <div className="w-full flex justify-center">
            <div ref={observerRef} className="h-10 w-full"></div>
         </div>
      </main>
   );
}
