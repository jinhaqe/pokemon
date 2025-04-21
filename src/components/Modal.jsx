import { useState, useEffect, useContext } from "react";
import { useModal } from "../Context/ModalContext";
import { TypeColorContext } from "../Context/TypeColorContext";

export default function Modal() {
   const { selectPokemon: pokemon, closeModal } = useModal();
   const typeKoMap = useContext(TypeColorContext); // 타입 색상 매핑

   const [frontLoaded, setFrontLoaded] = useState(false);
   const [shinyfrontLoaded, setShinyFrontLoaded] = useState(false);

   // 모달 열릴 때마다 로딩 상태 초기화
   useEffect(() => {
      if (pokemon) {
         setFrontLoaded(false);
         setShinyFrontLoaded(false);
      }
   }, [pokemon]);

   const isAllLoaded = frontLoaded && shinyfrontLoaded;

   if (!pokemon) return null;

   // Pokémon 타입 정보 가져오기
   const typeInfo = pokemon.types.map((type) => typeKoMap[type.name]);

   return (
      <div>
         <div className="fixed inset-0 backdrop-blur-sm z-40"></div>
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
                     이미지 불러오는 중...
                  </div>
               ) : (
                  <img
                     src={pokemon.front}
                     alt={`${pokemon.name} 앞모습`}
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
                        <span className="mr-3 dark:text-white">타입 : </span>
                        <div className="flex space-x-2 mr-4">
                           {typeInfo.map((info, index) => (
                              <span
                                 key={index}
                                 className={`px-3 py-1 rounded-full text-sm font-medium text-white ${info.color} flex items-center`}
                              >
                                 <img
                                    src={info.icon}
                                    alt={info.ko}
                                    className="w-4 h-4 inline mr-1"
                                 />
                                 {info.ko}
                              </span>
                           ))}
                        </div>
                     </div>
                     <p className="my-5 mr-5 dark:text-white">
                        키 : {pokemon.height / 10} m
                     </p>
                     <p className="mb-5 dark:text-white">
                        무게 : {pokemon.weight / 10} kg
                     </p>
                     <p className="mb-5 dark:text-white">
                        특성 : {pokemon.abilities}
                     </p>
                  </div>

                  <div>
                     <p className="mb-4 dark:text-white">이로치 모습</p>
                     <div className="flex mt-2 items-center">
                        {!isAllLoaded ? (
                           <div className="text-gray-600 dark:text-gray-300 text-lg animate-pulse">
                              로딩중...
                           </div>
                        ) : (
                           <img
                              src={pokemon.front_shiny}
                              alt={`${pokemon.name} 앞모습`}
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
                  className="mt-10 px-6 py-2 bg-gray-100 text-black rounded hover:bg-gray-200"
               >
                  닫기
               </button>
            </div>
         </dialog>
      </div>
   );
}
