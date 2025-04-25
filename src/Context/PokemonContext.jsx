import { createContext, useContext, useEffect, useState } from "react";
import { TypeColorContext } from "./TypeColorContext";
import { LanguageContext } from "./LanguageContext";

export const PokemonContext = createContext();

export function PokemonProvider({ children }) {
   const { language } = useContext(LanguageContext);
   const [allPokemonData, setAllPokemonData] = useState([]); // 모든 포켓몬 데이터
   const [pokemonList, setPokemonList] = useState([]); // 화면에 표시할 포켓몬 목록
   const [filteredPokemonList, setFilteredPokemonList] = useState([]); // 검색 결과 포켓몬 목록
   const [loading, setLoading] = useState(false);
   const [searchLoading, setSearchLoading] = useState(false);
   const [dataFullyLoaded, setDataFullyLoaded] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [more, setMore] = useState(true);
   const ITEMS_PER_PAGE = 24;

   // 검색 기능을 위한 상태 추가
   const [searchQuery, setSearchQuery] = useState("");

   const typeKoMap = useContext(TypeColorContext);

   // 검색 함수
   const searchPokemon = (query) => {
      setSearchQuery(query);
      setSearchLoading(true);
      setCurrentPage(1); // 검색 시 첫 페이지로 리셋

      try {
         if (!query.trim()) {
            // 검색어가 없으면 전체 목록의 첫 페이지
            const firstPageItems = allPokemonData.slice(0, ITEMS_PER_PAGE);
            setFilteredPokemonList(allPokemonData);
            setPokemonList(firstPageItems);
            setMore(allPokemonData.length > ITEMS_PER_PAGE);
         } else {
            // 검색어로 필터링
            const filtered = allPokemonData.filter(
               (pokemon) =>
                  pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
                  pokemon.id.toString().includes(query)
            );
            setFilteredPokemonList(filtered);

            // 필터링된 결과의 첫 페이지만 표시
            const firstPageItems = filtered.slice(0, ITEMS_PER_PAGE);
            setPokemonList(firstPageItems);
            setMore(filtered.length > ITEMS_PER_PAGE);
         }
      } catch (error) {
         console.error("검색 중 오류 발생:", error);
      } finally {
         setSearchLoading(false);
      }
   };

   // 무한 스크롤을 위한 함수
   const fetchMorePokemon = () => {
      if (!more || loading) return;

      setLoading(true);

      try {
         const nextPage = currentPage + 1;
         const startIndex = currentPage * ITEMS_PER_PAGE;
         const endIndex = startIndex + ITEMS_PER_PAGE;

         // 현재 필터링된 목록에서 다음 페이지 항목 가져오기
         const nextPageItems = filteredPokemonList.slice(startIndex, endIndex);

         if (nextPageItems.length > 0) {
            setPokemonList((prev) => [...prev, ...nextPageItems]);
            setCurrentPage(nextPage);
            setMore(endIndex < filteredPokemonList.length);
         } else {
            setMore(false);
         }
      } catch (error) {
         console.error("데이터 추가 로드 중 오류 발생:", error);
      } finally {
         setLoading(false);
      }
   };

   // 모든 포켓몬 데이터를 한 번에 가져오는 함수
   const fetchAllPokemon = async () => {
      if (loading) return;

      setLoading(true);
      try {
         // 포켓몬 전체 목록을 가져옴
         const response = await fetch(
            "https://pokeapi.co/api/v2/pokemon?limit=1500"
         );
         const data = await response.json();
         const results = data.results;

         // 각 포켓몬의 상세 정보를 가져옴
         const detailedData = await Promise.all(
            results.map(async (pokemon) => {
               try {
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
               } catch (error) {
                  console.error(
                     `Error fetching details for ${pokemon.name}:`,
                     error
                  );
                  return null; // 오류 발생 시 null 반환
               }
            })
         );

         // null 값 필터링
         const validPokemonData = detailedData.filter(
            (pokemon) => pokemon !== null
         );

         // 모든 포켓몬 데이터 저장
         setAllPokemonData(validPokemonData);
         setFilteredPokemonList(validPokemonData);

         // 첫 페이지 항목만 표시 목록에 추가
         const firstPageItems = validPokemonData.slice(0, ITEMS_PER_PAGE);
         setPokemonList(firstPageItems);

         setCurrentPage(1);
         setMore(validPokemonData.length > ITEMS_PER_PAGE);
         setDataFullyLoaded(true);
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

   // 언어가 변경되면 모든 상태 초기화하고 데이터 다시 불러오기
   useEffect(() => {
      setAllPokemonData([]);
      setPokemonList([]);
      setFilteredPokemonList([]);
      setSearchQuery("");
      setCurrentPage(1);
      setMore(true);
      setDataFullyLoaded(false);
      // 언어 변경 시 데이터 다시 로드
      fetchAllPokemon();
   }, [language]);

   // 컨텍스트 제공 값
   return (
      <PokemonContext.Provider
         value={{
            pokemonList, // 화면에 표시할 목록
            originalList: allPokemonData, // 전체 데이터 (필터링 전)
            loading,
            searchLoading,
            fetchMorePokemon, // 무한 스크롤을 위한 함수
            more, // 더 로드할 항목이 있는지 여부
            searchQuery,
            searchPokemon,
            setSearchQuery,
            dataFullyLoaded,
         }}
      >
         {children}
      </PokemonContext.Provider>
   );
}
