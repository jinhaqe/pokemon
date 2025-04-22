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
      if (pokemon) {
         setFrontLoaded(false);
         setShinyFrontLoaded(false);
      }
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] p-6 rounded-xl bg-white dark:bg-gray-900 shadow-lg z-50"
         >
            <h2 className="text-xl font-bold mb-4 text-center dark:text-white">
               {pokemon.name} (No.{pokemon.id})
            </h2>

            <div className="flex justify-center items-center h-[250px] bg-gray-100 rounded-xl dark:bg-gray-800">
               {!isAllLoaded ? (
                  <div className="text-gray-600 dark:text-gray-300 text-lg animate-pulse">
                     {text.loading}
                  </div>
               ) : (
                  <img
                     src={pokemon.front}
                     alt={text.frontImg}
                     className="w-50 mx-2 mb-4 p-5"
                  />
               )}

               {/* 로딩 상태 추적용 */}
               <img
                  src={pokemon.front}
                  style={{ display: "none" }}
                  onLoad={() => setFrontLoaded(true)}
               />
            </div>

            <div className="h-[230px] rounded-xl my-5 dark:bg-gray-900 py-3 px-5">
               <p className="text-md py-2 mb-5 dark:text-white font-bold">
                  " {pokemon.description} "
               </p>
               <div className="flex gap-30">
                  <div>
                     <div className="flex">
                        <span className="mr-3 dark:text-white">
                           {text.type}
                        </span>
                        <div className="flex space-x-2 mr-4">
                           {typeInfo.map((info, index) => (
                              <span
                                 key={index}
                                 className={`px-3 py-1 rounded-full text-sm font-medium text-white ${info.color} flex items-center`}
                              >
                                 <img
                                    src={info.icon}
                                    alt={
                                       language === "ko" ? info.ko : info.name
                                    }
                                    className="w-4 h-4 inline mr-1"
                                 />
                                 {language === "ko" ? info.ko : info.name}
                              </span>
                           ))}
                        </div>
                     </div>
                     <p className="my-5 mr-5 dark:text-white">
                        {text.height} {pokemon.height / 10} {text.meter}
                     </p>
                     <p className="mb-5 dark:text-white">
                        {text.weight} {pokemon.weight / 10} {text.kg}
                     </p>
                     <p className="mb-5 dark:text-white">
                        {text.abilities} {pokemon.abilities}
                     </p>
                  </div>

                  <div>
                     <p className="mb-4 dark:text-white">{text.shiny}</p>
                     <div className="flex mt-2 items-center">
                        {!isAllLoaded ? (
                           <div className="text-gray-600 dark:text-gray-300 text-lg animate-pulse">
                              {text.loadingShort}
                           </div>
                        ) : (
                           <img
                              src={pokemon.front_shiny}
                              alt={text.frontImg}
                              className="w-30 mr-2 bg-gray-100 rounded-xl dark:bg-gray-800"
                           />
                        )}
                        <img
                           src={pokemon.front_shiny}
                           style={{ display: "none" }}
                           onLoad={() => setShinyFrontLoaded(true)}
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="text-center mt-7">
               <button
                  onClick={closeModal}
                  className="mt-10 px-6 py-2 bg-gray-100 text-black rounded hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
               >
                  {text.close}
               </button>
            </div>
         </dialog>
      </div>
   );
}
