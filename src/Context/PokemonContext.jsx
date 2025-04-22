import {
   createContext,
   useContext,
   useEffect,
   useMemo,
   useReducer,
} from "react";
import { TypeColorContext } from "./TypeColorContext";
import { LanguageContext } from "./LanguageContext";
import { debounce } from "lodash";

export const PokemonContext = createContext();

const initialState = {
   pokemonList: [],
   filteredPokemonList: [],
   loading: false,
   nextUrl: "https://pokeapi.co/api/v2/pokemon?limit=24",
   more: true,
   searchQuery: "",
};

function reducer(state, action) {
   switch (action.type) {
      case "SET_POKEMON_LIST":
         return { ...state, pokemonList: action.payload };
      case "APPEND_POKEMON_LIST":
         return {
            ...state,
            pokemonList: [...state.pokemonList, ...action.payload],
         };
      case "SET_FILTERED_LIST":
         return { ...state, filteredPokemonList: action.payload };
      case "SET_LOADING":
         return { ...state, loading: action.payload };
      case "SET_NEXT_URL":
         return { ...state, nextUrl: action.payload };
      case "SET_MORE":
         return { ...state, more: action.payload };
      case "SET_SEARCH_QUERY":
         return { ...state, searchQuery: action.payload };
      case "RESET":
         return initialState;
      default:
         return state;
   }
}

export function PokemonProvider({ children }) {
   const { language } = useContext(LanguageContext);
   const typeKoMap = useContext(TypeColorContext);

   const [state, dispatch] = useReducer(reducer, initialState);

   const {
      pokemonList,
      filteredPokemonList,
      loading,
      nextUrl,
      more,
      searchQuery,
   } = state;

   const searchPokemon = (query) => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: query });

      if (loading) return;

      if (!query.trim()) {
         dispatch({ type: "SET_FILTERED_LIST", payload: pokemonList });
         return;
      }

      const filtered = pokemonList.filter(
         (pokemon) =>
            pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
            pokemon.id.toString().includes(query)
      );

      dispatch({ type: "SET_FILTERED_LIST", payload: filtered });
   };

   const debouncedSearch = useMemo(
      () => debounce(searchPokemon, 300),
      [pokemonList, loading]
   );

   const fetchMorePokemon = async () => {
      if (!nextUrl || loading) return;

      dispatch({ type: "SET_LOADING", payload: true });

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
                        type || { name: e.type.name, color: "bg-yellow-600" }
                     );
                  }),
                  height: detailData.height,
                  weight: detailData.weight,
                  abilities,
                  description,
                  front_shiny:
                     detailData.sprites?.other?.["official-artwork"]
                        ?.front_shiny,
               };
            })
         );

         // 중복 제거 후 리스트 추가
         const newUniquePokemon = detailedData.filter(
            (newPokemon) => !pokemonList.some((p) => p.id === newPokemon.id)
         );

         dispatch({ type: "APPEND_POKEMON_LIST", payload: newUniquePokemon });
         dispatch({ type: "SET_NEXT_URL", payload: data.next });
         dispatch({ type: "SET_MORE", payload: !!data.next });
      } catch (error) {
         console.error(
            language === "ko"
               ? "포켓몬 불러오기 실패"
               : "Failed to load Pokemon",
            error
         );
      } finally {
         dispatch({ type: "SET_LOADING", payload: false });
      }
   };

   // 포켓몬 리스트가 업데이트되면 필터링 다시 적용
   useEffect(() => {
      if (loading) return;

      if (searchQuery.trim()) {
         searchPokemon(searchQuery);
      } else {
         dispatch({ type: "SET_FILTERED_LIST", payload: pokemonList });
      }
   }, [pokemonList, loading]);

   // 언어 바뀌면 초기화
   useEffect(() => {
      dispatch({ type: "RESET" });
   }, [language]);

   // 초기 로딩
   useEffect(() => {
      if (nextUrl && pokemonList.length === 0) {
         fetchMorePokemon();
      }
   }, [nextUrl, language]);

   // 디바운스된 검색 실행
   useEffect(() => {
      debouncedSearch(searchQuery);
   }, [searchQuery]);

   return (
      <PokemonContext.Provider
         value={{
            pokemonList: filteredPokemonList,
            originalList: pokemonList,
            loading,
            fetchMorePokemon,
            more,
            searchQuery,
            searchPokemon,
            setSearchQuery: (query) =>
               dispatch({ type: "SET_SEARCH_QUERY", payload: query }),
         }}
      >
         {children}
      </PokemonContext.Provider>
   );
}
