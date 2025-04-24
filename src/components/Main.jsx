import { useEffect, useRef, useContext, useState } from "react";
import PokemonCard from "./PorkemonCard";
import Bg from "../assets/bg.jpg";
import Bg2 from "../assets/Bg2.jpg";
import { useTheme } from "../Context/ThemeContext";
import { useModal } from "../Context/ModalContext";
import { useLanguage } from "../Context/LanguageContext";
import { PokemonContext } from "../Context/PokemonContext";
import noResult from "../assets/로딩.gif";
import loadingGif from "../assets/에몽가.gif";
import LanguageGif from "../assets/헤롱헤롱.gif";
import Top from "./Top";

export default function Main() {
   const {
      pokemonList,
      loading,
      searchLoading,
      fetchMorePokemon,
      more,
      originalList,
      dataFullyLoaded,
   } = useContext(PokemonContext);
   const { searchPokemon, searchQuery } = useContext(PokemonContext);
   const { language } = useLanguage();
   const { openModal } = useModal();
   const { isDark } = useTheme();

   const [query, setQuery] = useState(searchQuery);
   const [hasSearched, setHasSearched] = useState(false); // 검색이 실행되었는지 추적
   const [prevLanguage, setPrevLanguage] = useState(language); // 이전 언어 상태 저장
   const [isLanguageChanging, setIsLanguageChanging] = useState(false); // 언어 변경 중 상태

   const observerRef = useRef();

   // 언어 변경 감지
   useEffect(() => {
      if (prevLanguage !== language) {
         setIsLanguageChanging(true); // 언어 변경 중 상태 활성화
         setPrevLanguage(language);
      }
   }, [language]);

   // 데이터 로딩 상태 감지
   useEffect(() => {
      // 언어 변경 중이었고, 로딩이 완료되면 언어 변경 중 상태 해제
      if (isLanguageChanging && !loading && dataFullyLoaded) {
         setIsLanguageChanging(false);
      }
   }, [loading, isLanguageChanging, dataFullyLoaded]);

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
      setHasSearched(true); // 검색 실행 표시
   };

   const handleKeyPress = (e) => {
      if (e.key === "Enter") {
         handleSearch();
      }
   };

   // 로딩 상태 및 결과 렌더링 로직
   const renderContent = () => {
      // 언어 변경 중 상태
      if (isLanguageChanging) {
         return (
            <div className="flex-col items-center text-center mt-10">
               <p className="text-xl mb-4 text-gray-500">
                  {language === "ko"
                     ? "언어 변환 중..."
                     : "Changing language..."}
               </p>
               <img
                  src={LanguageGif}
                  alt="language changing"
                  className="mx-auto"
               />
            </div>
         );
      }

      // 초기 로딩 상태
      if (loading && !hasSearched && originalList.length === 0) {
         return (
            <div className="flex-col items-center text-center mt-20">
               <p className="text-xl mb-4 text-gray-500">
                  {language === "ko"
                     ? "포켓몬 불러오는 중..."
                     : "Loading Pokémon..."}
               </p>
               <img src={loadingGif} alt="loading" className="mx-auto" />
            </div>
         );
      }

      // 검색 로딩 상태
      if (searchLoading) {
         return (
            <div className="flex-col items-center text-center">
               <p className="text-xl mb-4 text-gray-500">
                  {language === "ko" ? "검색 중..." : "Searching..."}
               </p>
               <img src={loadingGif} alt="searching" className="mx-auto" />
            </div>
         );
      }

      // 검색 결과가 없음
      if (hasSearched && pokemonList.length === 0 && dataFullyLoaded) {
         return (
            <div className="flex-col items-center text-center">
               <p className="text-xl mb-4 text-gray-500">
                  {language === "ko" ? "결과가 없습니다" : "No results found"}
               </p>
               <img src={noResult} alt="no results" className="mx-auto" />
            </div>
         );
      }

      // 검색 결과 표시
      return pokemonList.map((pokemon) => (
         <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={() => openModal(pokemon)}
         />
      ));
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
            {renderContent()}
         </div>

         {more && (
            <div className="w-full flex justify-center">
               <div ref={observerRef} className="h-10 w-full"></div>
            </div>
         )}
         <Top />
      </main>
   );
}
