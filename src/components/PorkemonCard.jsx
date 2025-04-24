import { useContext } from "react";
import { TypeColorContext } from "../Context/TypeColorContext";
import { LanguageContext } from "../Context/LanguageContext";

export default function PokemonCard({ pokemon, onClick }) {
   const typeKoMap = useContext(TypeColorContext); // 타입 색상 매핑
   const { language } = useContext(LanguageContext);

   // 포켓몬 타입을 안전하게 가져오기
   const getTypeInfo = (type) => {
      const typeName = (type?.type?.name || type?.name)?.toLowerCase();
      return typeKoMap[typeName];
   };

   return (
      <div
         onClick={onClick} // 카드 클릭 시 onClick 호출
         className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all w-[220px] h-[280px] flex flex-col items-center cursor-pointer"
      >
         {/* 포켓몬 이미지 */}
         <img
            src={pokemon.gif}
            alt={pokemon.name}
            className="w-[80px] h-[150px] object-contain mb-2"
            loading="lazy" // 이미지 로딩 최적화
         />
         <h3 className="text-lg font-semibold mb-3 text-center text-ellipsis overflow-hidden">
            No.{pokemon.id} {pokemon.name}
         </h3>

         {/* 타입 정보 */}
         <div className="flex gap-2 justify-center flex-wrap">
            {pokemon.types.map((typeObj) => {
               const typeInfo = getTypeInfo(typeObj);

               if (!typeInfo) return null;

               return (
                  <div
                     key={typeObj.type?.name || typeObj.name}
                     className="flex items-center gap-1"
                  >
                     <span
                        className={`px-3 py-1 rounded-full text-sm font-medium text-white ${typeInfo.color} flex items-center`}
                     >
                        <img
                           src={typeInfo.icon}
                           alt={language === "ko" ? typeInfo.ko : typeInfo.name}
                           className="w-4 h-4 inline mr-1"
                        />
                        {language === "ko" ? typeInfo.ko : typeInfo.name}
                     </span>
                  </div>
               );
            })}
         </div>
      </div>
   );
}
