import { createContext, useContext, useEffect, useState } from "react";
import { TypeColorContext, TypeMapProvider } from "./TypeColorContext";
export const PokemonContext = createContext();

export function PokemonProvider({ children }) {
   const [pokemonList, setPokemonList] = useState([]);
   const [loading, setLoading] = useState(true);
   const typeKoMap = useContext(TypeColorContext);

   const getPokemon = async () => {
      let baseURL = "https://pokeapi.co/api/v2/pokemon";

      try {
         const response = await fetch(`${baseURL}?limit=1000`);
         const data = await response.json();

         const results = data.results;
         const detailedData = await Promise.all(
            results.map(async (pokemon) => {
               // 기본 정보
               const detailRes = await fetch(pokemon.url);
               const detailData = await detailRes.json();
               console.log(detailData);
               // species 정보 (한글 이름 포함)
               const speciesRes = await fetch(detailData.species.url);
               const speciesData = await speciesRes.json();

               const koreanName = speciesData.names.find(
                  (name) => name.language.name === "ko"
               );

               const displayImage =
                  detailData.sprites.versions["generation-v"]["black-white"]
                     ?.animated?.front_default ||
                  detailData.sprites.front_default;

               return {
                  id: detailData.id,
                  name: koreanName ? koreanName.name : detailData.name,
                  gif: displayImage,
                  types: detailData.types.map((e) => {
                     const type = typeKoMap[e.type.name];
                     return (
                        type || { name: e.type.name, color: "bg-yellow-600" }
                     );
                  }),
               };
            })
         );

         setPokemonList(detailedData);
         setLoading(false);
      } catch (error) {
         console.log("포켓몬 불러오기 실패", error);
         setLoading(false);
      }
   };

   useEffect(() => {
      getPokemon();
   }, []);

   return (
      <PokemonContext.Provider value={{ pokemonList, loading }}>
         {children}
      </PokemonContext.Provider>
   );
}
