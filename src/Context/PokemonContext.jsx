import { createContext, useContext, useEffect, useState } from "react";
import { TypeColorContext } from "./TypeColorContext";
import { LanguageContext } from "./LanguageContext";

export const PokemonContext = createContext();

export function PokemonProvider({ children }) {
   const { language } = useContext(LanguageContext);
   const [pokemonList, setPokemonList] = useState([]);
   const [filteredPokemonList, setFilteredPokemonList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [searchLoading, setSearchLoading] = useState(false);
   const [nextUrl, setNextUrl] = useState(
      "https://pokeapi.co/api/v2/pokemon?limit=24"
   );
   const [more, setMore] = useState(true);

   // 검색 기능을 위한 상태 추가
   const [searchQuery, setSearchQuery] = useState("");

   const typeKoMap = useContext(TypeColorContext);

   // 검색 함수 - setTimeout 제거하고 즉시 필터링 수행
   const searchPokemon = (query) => {
      setSearchQuery(query);
      setSearchLoading(true);

      try {
         if (!query.trim()) {
            // 검색어가 없으면 전체 포켓몬 목록 사용
            setFilteredPokemonList(pokemonList);
         } else {
            // 이름 또는 ID로 검색 - 즉시 필터링
            const filtered = pokemonList.filter(
               (pokemon) =>
                  pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
                  pokemon.id.toString().includes(query)
            );
            setFilteredPokemonList(filtered);
         }
      } catch (error) {
         console.error("검색 중 오류 발생:", error);
      } finally {
         setSearchLoading(false);
      }
   };

   // 현재 검색 쿼리로 리스트 필터링하는 헬퍼 함수
   const filterPokemonList = (list, query) => {
      if (!query.trim()) {
         return list;
      }
      return list.filter(
         (pokemon) =>
            pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
            pokemon.id.toString().includes(query)
      );
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

         // 새 포켓몬 목록 생성 (중복 제거)
         const newPokemonList = [...pokemonList];
         detailedData.forEach((newPokemon) => {
            if (!newPokemonList.some((p) => p.id === newPokemon.id)) {
               newPokemonList.push(newPokemon);
            }
         });

         // 전체 목록 업데이트
         setPokemonList(newPokemonList);

         // 현재 검색 쿼리를 기준으로 필터링된 목록 업데이트
         const filtered = filterPokemonList(newPokemonList, searchQuery);
         setFilteredPokemonList(filtered);

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

   // 언어가 변경되면 모든 상태 초기화
   useEffect(() => {
      setPokemonList([]);
      setFilteredPokemonList([]);
      setSearchQuery("");
      setNextUrl("https://pokeapi.co/api/v2/pokemon?limit=24");
      setMore(true);
   }, [language]);

   // 초기 데이터 로드 또는 언어 변경 후 데이터 다시 가져오기
   useEffect(() => {
      if (pokemonList.length === 0 && nextUrl) {
         fetchMorePokemon();
      }
   }, [nextUrl, language]);

   // pokemonList나 searchQuery가 변경될 때마다 필터링 수행
   useEffect(() => {
      // 검색어가 있을 때만 필터링 실행 (검색 로딩 중이 아닐 때)
      if (!searchLoading) {
         const filtered = filterPokemonList(pokemonList, searchQuery);
         setFilteredPokemonList(filtered);
      }
   }, [pokemonList, searchQuery]);

   // 컨텍스트 제공 값
   return (
      <PokemonContext.Provider
         value={{
            pokemonList: filteredPokemonList,
            originalList: pokemonList,
            loading,
            searchLoading,
            fetchMorePokemon,
            more,
            searchQuery,
            searchPokemon,
            setSearchQuery,
         }}
      >
         {children}
      </PokemonContext.Provider>
   );
}
