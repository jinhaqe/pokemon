import { createContext, useContext, useEffect, useState } from "react";
import { TypeColorContext } from "./TypeColorContext";
import { LanguageContext } from "./LanguageContext";

export const PokemonContext = createContext();

export function PokemonProvider({ children }) {
   const { language } = useContext(LanguageContext);
   const [allPokemonData, setAllPokemonData] = useState([]);
   const [pokemonList, setPokemonList] = useState([]);
   const [filteredPokemonList, setFilteredPokemonList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [searchLoading, setSearchLoading] = useState(false);
   const [dataFullyLoaded, setDataFullyLoaded] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [more, setMore] = useState(true);
   const [searchQuery, setSearchQuery] = useState("");
   const ITEMS_PER_PAGE = 24;

   const typeKoMap = useContext(TypeColorContext);

   const searchPokemon = (query) => {
      setSearchQuery(query);
      setSearchLoading(true);
      setCurrentPage(1);

      try {
         if (!query.trim()) {
            const firstPageItems = allPokemonData.slice(0, ITEMS_PER_PAGE);
            setFilteredPokemonList(allPokemonData);
            setPokemonList(firstPageItems);
            setMore(allPokemonData.length > ITEMS_PER_PAGE);
         } else {
            const filtered = allPokemonData.filter(
               (pokemon) =>
                  pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
                  pokemon.id.toString().includes(query)
            );
            setFilteredPokemonList(filtered);
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

   const fetchMorePokemon = () => {
      if (!more || loading) return;
      setLoading(true);

      try {
         const nextPage = currentPage + 1;
         const startIndex = currentPage * ITEMS_PER_PAGE;
         const endIndex = startIndex + ITEMS_PER_PAGE;
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

   const fetchPokemonInBatches = async (results, batchSize = 50) => {
      const allData = [];

      for (let i = 0; i < results.length; i += batchSize) {
         const batch = results.slice(i, i + batchSize);
         const detailedBatch = await Promise.all(
            batch.map(async (pokemon) => {
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

                  const abilities = detailData.abilities.map(
                     (ability) => ability.ability.name
                  );

                  return {
                     id: detailData.id,
                     name: localizedName ? localizedName.name : detailData.name,
                     gif: displayImage,
                     front: detailData.sprites?.other?.["official-artwork"]
                        ?.front_default,
                     types: detailData.types.map((e) => {
                        const type = typeKoMap[e.type.name];
                        return (
                           type || {
                              name: e.type.name,
                              color: "bg-yellow-600",
                           }
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
                  console.error(`Error fetching ${pokemon.name}`, error);
                  return null;
               }
            })
         );

         allData.push(...detailedBatch.filter((p) => p !== null));
      }

      return allData;
   };

   const fetchAllPokemon = async () => {
      if (loading) return;

      setLoading(true);
      try {
         const response = await fetch(
            "https://pokeapi.co/api/v2/pokemon?limit=1250"
         );
         const data = await response.json();
         const results = data.results;

         const validPokemonData = await fetchPokemonInBatches(results);

         setAllPokemonData(validPokemonData);
         setFilteredPokemonList(validPokemonData);
         setPokemonList(validPokemonData.slice(0, ITEMS_PER_PAGE));
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

   useEffect(() => {
      setAllPokemonData([]);
      setPokemonList([]);
      setFilteredPokemonList([]);
      setSearchQuery("");
      setCurrentPage(1);
      setMore(true);
      setDataFullyLoaded(false);
      fetchAllPokemon();
   }, [language]);

   return (
      <PokemonContext.Provider
         value={{
            pokemonList,
            originalList: allPokemonData,
            loading,
            searchLoading,
            fetchMorePokemon,
            more,
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
