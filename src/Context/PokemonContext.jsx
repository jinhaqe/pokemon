import { createContext, useContext, useEffect, useState } from "react";
import { TypeColorContext } from "./TypeColorContext";
import { LanguageContext } from "./LanguageContext";

export const PokemonContext = createContext();

export function PokemonProvider({ children }) {
   const { language } = useContext(LanguageContext);
   const [pokemonList, setPokemonList] = useState([]);
   const [filteredPokemonList, setFilteredPokemonList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [nextUrl, setNextUrl] = useState(
      "https://pokeapi.co/api/v2/pokemon?limit=24"
   );
   const [more, setMore] = useState(true);

   // 검색 기능을 위한 상태 추가
   const [searchQuery, setSearchQuery] = useState("");

   const typeKoMap = useContext(TypeColorContext);

   // 검색 함수
   const searchPokemon = (query) => {
      setSearchQuery(query);

      if (!query.trim()) {
         // 검색어가 없으면 전체 포켓몬 목록 사용
         setFilteredPokemonList(pokemonList);
         return;
      }

      // 이름 또는 ID로 검색
      const filtered = pokemonList.filter(
         (pokemon) =>
            pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
            pokemon.id.toString().includes(query)
      );

      setFilteredPokemonList(filtered);
   };

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

               const localizedName = speciesData.names.find(
                  (name) => name.language.name === language
               );

               const displayImage =
                  detailData.sprites.versions["generation-v"]["black-white"]
                     ?.animated?.front_default ||
                  detailData.sprites?.other?.showdown?.front_default ||
                  detailData.sprites.front_default;

               const explanation = speciesData.flavor_text_entries.find(
                  (entry) => entry.language.name === language
               );

               const description = explanation
                  ? explanation.flavor_text
                  : language === "ko"
                  ? "설명 없음"
                  : "No description available";

               const abilities = detailData.abilities.map((ability) => {
                  return ability.ability.name;
               });

               return {
                  id: detailData.id,
                  name: localizedName ? localizedName.name : detailData.name,
                  gif: displayImage,
                  front: detailData.sprites?.other?.["official-artwork"]
                     ?.front_default,
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
                  front_shiny:
                     detailData.sprites?.other?.["official-artwork"]
                        ?.front_shiny,
               };
            })
         );

         setPokemonList((prev) => {
            const newPokemonList = [...prev];
            detailedData.forEach((newPokemon) => {
               if (!newPokemonList.some((p) => p.id === newPokemon.id)) {
                  newPokemonList.push(newPokemon);
               }
            });
            return newPokemonList;
         });

         setNextUrl(data.next);
         setMore(!!data.next);
      } catch (error) {
         console.log(
            language === "ko"
               ? "포켓몬 불러오기 실패"
               : "Failed to load Pokemon",
            error
         );
      } finally {
         setLoading(false);
      }
   };

   // pokemonList가 변경될 때마다 필터링된 목록도 업데이트
   useEffect(() => {
      // 검색어가 있으면 다시 필터링, 없으면 전체 목록 사용
      if (searchQuery.trim()) {
         searchPokemon(searchQuery);
      } else {
         setFilteredPokemonList(pokemonList);
      }
   }, [pokemonList]);

   useEffect(() => {
      setPokemonList([]);
      setFilteredPokemonList([]); // 필터링된 목록도 초기화
      setSearchQuery(""); // 검색어도 초기화
      setNextUrl("https://pokeapi.co/api/v2/pokemon?limit=24"); // Reset URL
      setMore(true);
   }, [language]);

   useEffect(() => {
      if (nextUrl && pokemonList.length === 0) {
         fetchMorePokemon();
      }
   }, [nextUrl, language]);

   // 컨텍스트 값에 검색 관련 상태와 함수 추가
   return (
      <PokemonContext.Provider
         value={{
            pokemonList: filteredPokemonList, // 필터링된 목록 제공
            originalList: pokemonList, // 원본 목록도 필요할 수 있음
            loading,
            fetchMorePokemon,
            more,
            searchQuery,
            searchPokemon, // 검색 함수를 컨텍스트에 포함
            setSearchQuery, // 검색어 설정 함수도 컨텍스트에 포함
         }}
      >
         {children}
      </PokemonContext.Provider>
   );
}
