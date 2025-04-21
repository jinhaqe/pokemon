import { useContext } from "react";
import { TypeColorContext } from "../Context/TypeColorContext";

export default function PokemonCard({ pokemon, onClick }) {
  const typeKoMap = useContext(TypeColorContext); // 타입 색상 매핑

  return (
    <div
      onClick={onClick} // 카드 클릭 시 onClick 호출
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all w-[220px] h-[280px] flex flex-col items-center cursor-pointer"
    >
      <img
        src={pokemon.gif}
        alt={pokemon.name}
        className="w-[80px] h-[150px] object-contain mb-2"
      />
      <h3 className="text-lg font-semibold mb-3 text-center">
        No.{pokemon.id} {pokemon.name}
      </h3>

      <div className="flex gap-2 justify-center flex-wrap">
        {pokemon.types.map((typeObj) => {
          const typeName = typeObj.type?.name || typeObj.name;
          const typeInfo = typeKoMap[typeName.toLowerCase()];

          if (!typeInfo) {
            return null;
          }

          return (
            <div key={typeName} className="flex items-center gap-1">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium text-white ${typeInfo.color} flex items-center`}
              >
                <img
                  src={typeInfo.icon}
                  alt={typeInfo.ko}
                  className="w-4 h-4 inline mr-1"
                />
                {typeInfo.ko}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
