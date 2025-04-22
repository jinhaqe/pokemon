import { useState, useEffect, useContext } from "react";
import { useModal } from "../Context/ModalContext";
import { TypeColorContext } from "../Context/TypeColorContext";
import { LanguageContext } from "../Context/LanguageContext";

export default function Modal() {
   const { selectPokemon: pokemon, closeModal } = useModal();
   const typeKoMap = useContext(TypeColorContext);
   const { language } = useContext(LanguageContext);

   const [frontLoaded, setFrontLoaded] = useState(false);
   const [shinyfrontLoaded, setShinyFrontLoaded] = useState(false);

   useEffect(() => {
      // 포켓몬이 바뀔 때마다 로딩 상태를 초기화
      setFrontLoaded(false);
      setShinyFrontLoaded(false);
   }, [pokemon]);

   const isAllLoaded = frontLoaded && shinyfrontLoaded;

   if (!pokemon) return null;

   const typeInfo = pokemon.types.map((type) => typeKoMap[type.name]);

   // 언어에 따른 텍스트 매핑
   const textMap = {
      ko: {
         loading: "이미지 불러오는 중...",
         frontImg: `${pokemon.name} 앞모습`,
         type: "타입 : ",
         height: "키 : ",
         weight: "무게 : ",
         abilities: "특성 : ",
         shiny: "이로치 모습",
         loadingShort: "로딩중...",
         close: "닫기",
         meter: "m",
         kg: "kg",
      },
      en: {
         loading: "Loading images...",
         frontImg: `${pokemon.name} front view`,
         type: "Type: ",
         height: "Height: ",
         weight: "Weight: ",
         abilities: "Abilities: ",
         shiny: "Shiny Form",
         loadingShort: "Loading...",
         close: "Close",
         meter: "m",
         kg: "kg",
      },
   };

   // 현재 언어에 맞는 텍스트 선택
   const text = textMap[language];

   return (
      <div>
         <div
            className="fixed inset-0 backdrop-blur-sm z-40"
            onClick={closeModal}
         ></div>
         <dialog
            open
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-3xl h-auto max-h-screen overflow-y-auto p-4 md:p-6 rounded-xl bg-white dark:bg-gray-900 shadow-lg z-50"
         >
            <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-4 text-center dark:text-white">
               {pokemon.name} (No.{pokemon.id})
            </h2>

            <div className="flex justify-center items-center h-auto min-h-40 md:min-h-64 bg-gray-100 rounded-xl dark:bg-gray-800">
               {!isAllLoaded ? (
                  <div className="text-gray-600 dark:text-gray-300 text-base md:text-lg animate-pulse">
                     {text.loading}
                  </div>
               ) : (
                  <img
                     src={pokemon.front}
                     alt={text.frontImg}
                     className="w-32 md:w-40 mx-2 my-4 p-2 md:p-5"
                  />
               )}

               {/* 로딩 상태 추적용 */}
               <img
                  src={pokemon.front}
                  style={{ display: "none" }}
                  onLoad={() => setFrontLoaded(true)}
                  alt="hidden loader"
               />
            </div>

            <div className="h-auto rounded-xl my-3 md:my-5 dark:bg-gray-900 py-2 md:py-3 px-3 md:px-5">
               <p className="text-sm md:text-md py-1 md:py-2 mb-3 md:mb-5 dark:text-white font-bold">
                  " {pokemon.description} "
               </p>
               <div className="flex flex-col md:flex-row md:gap-8 lg:gap-30">
                  <div className="mb-4 md:mb-0">
                     <div className="flex flex-wrap items-center mb-2">
                        <span className="mr-2 md:mr-3 dark:text-white">
                           {text.type}
                        </span>
                        <div className="flex flex-wrap gap-1 md:space-x-2">
                           {typeInfo.map((info, index) => (
                              <span
                                 key={index}
                                 className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium text-white ${info.color} flex items-center`}
                              >
                                 <img
                                    src={info.icon}
                                    alt={
                                       language === "ko" ? info.ko : info.name
                                    }
                                    className="w-3 h-3 md:w-4 md:h-4 inline mr-1"
                                 />
                                 {language === "ko" ? info.ko : info.name}
                              </span>
                           ))}
                        </div>
                     </div>
                     <p className="my-2 md:my-5 mr-3 md:mr-5 text-sm md:text-base dark:text-white">
                        {text.height} {pokemon.height / 10} {text.meter}
                     </p>
                     <p className="mb-2 md:mb-5 text-sm md:text-base dark:text-white">
                        {text.weight} {pokemon.weight / 10} {text.kg}
                     </p>
                     <p className="mb-2 md:mb-5 text-sm md:text-base dark:text-white">
                        {text.abilities} {pokemon.abilities}
                     </p>
                  </div>

                  <div className="mt-3 md:mt-0">
                     <p className="mb-2 md:mb-4 text-sm md:text-base dark:text-white">
                        {text.shiny}
                     </p>
                     <div className="flex mt-1 md:mt-2 items-center">
                        {!isAllLoaded ? (
                           <div className="text-gray-600 dark:text-gray-300 text-sm md:text-lg animate-pulse">
                              {text.loadingShort}
                           </div>
                        ) : (
                           <img
                              src={pokemon.front_shiny}
                              alt={text.frontImg}
                              className="w-24 md:w-30 mr-2 bg-gray-100 rounded-xl dark:bg-gray-800"
                           />
                        )}
                        <img
                           src={pokemon.front_shiny}
                           style={{ display: "none" }}
                           onLoad={() => setShinyFrontLoaded(true)}
                           alt="hidden shiny loader"
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="text-center mt-3 md:mt-7">
               <button
                  onClick={closeModal}
                  className="mt-2 md:mt-10 px-4 md:px-6 py-1 md:py-2 bg-gray-100 text-black text-sm md:text-base rounded hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
               >
                  {text.close}
               </button>
            </div>
         </dialog>
      </div>
   );
}
