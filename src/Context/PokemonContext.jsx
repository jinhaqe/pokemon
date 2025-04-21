import { createContext, useContext, useEffect, useState } from "react";
import { TypeColorContext } from "./TypeColorContext";
export const PokemonContext = createContext();

export function PokemonProvider({ children }) {
   const [pokemonList, setPokemonList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [nextUrl, setNextUrl] = useState(
      "https://pokeapi.co/api/v2/pokemon?limit=24"
   );
   const [more, setMore] = useState(true);

   const typeKoMap = useContext(TypeColorContext);

   const fetchMorePokemon = async () => {
      if (!nextUrl || loading) return;

      setLoading(true);

      try {
         const response = await fetch(nextUrl);
         const data = await response.json();

         const results = data.results;
         const detailedData = await Promise.all(
            results.map(async (pokemon) => {
               const detailRes = await fetch(pokemon.url);
               const detailData = await detailRes.json();

               const speciesRes = await fetch(detailData.species.url);
               const speciesData = await speciesRes.json();

               const koreanName = speciesData.names.find(
                  (name) => name.language.name === "ko"
               );

               const displayImage =
                  detailData.sprites.versions["generation-v"]["black-white"]
                     ?.animated?.front_default ||
                  detailData.sprites.front_default;

               const explanation = speciesData.flavor_text_entries.find(
                  (entry) => entry.language.name === "ko"
               );

               const description = explanation
                  ? explanation.flavor_text
                  : "설명 없음";

               const abilities = detailData.abilities.map((ability) => {
                  return ability.ability.name;
               });

               return {
                  id: detailData.id,
                  name: koreanName ? koreanName.name : detailData.name,
                  gif: displayImage,
                  front: detailData.sprites.front_default,
                  back: detailData.sprites.back_default,
                  types: detailData.types.map((e) => {
                     const type = typeKoMap[e.type.name];
                     return (
                        type || { name: e.type.name, color: "bg-yellow-600" }
                     );
                  }),
                  height: detailData.height,
                  weight: detailData.weight,
                  abilities: abilities,
                  description: description,
                  front_shiny: detailData.sprites.front_shiny,
                  back_shiny: detailData.sprites.back_shiny,
               };
            })
         );

         setPokemonList((prev) => {
            const newPokemonList = [...prev]; // 기존 포켓몬 목록 복사
            detailedData.forEach((newPokemon) => {
               // 새로 추가할 포켓몬이 기존 목록에 있는지 확인
               if (!newPokemonList.some((p) => p.id === newPokemon.id)) {
                  newPokemonList.push(newPokemon); // 중복되지 않으면 추가
               }
            });
            return newPokemonList; // 최종 목록 반환
         });

         setNextUrl(data.next); // 다음 URL 저장
         setMore(!!data.next); // 더 불러올 수 있는지 체크
      } catch (error) {
         console.log("포켓몬 불러오기 실패", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchMorePokemon(); // 최초 1회 호출
   }, []);

   return (
      <PokemonContext.Provider
         value={{ pokemonList, loading, fetchMorePokemon, more }}
      >
         {children}
      </PokemonContext.Provider>
   );
}
