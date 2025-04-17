import PokemonCard from "./PorkemonCard";

export default function Main() {
   const dummyPokemons = [
      {
         id: 1,
         name: "이상해씨",
         image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
         types: ["grass", "poison"],
      },
      {
         id: 4,
         name: "파이리",
         image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
         types: ["fire"],
      },
      {
         id: 7,
         name: "꼬부기",
         image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
         types: ["water"],
      },
      {
         id: 25,
         name: "피카츄",
         image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
         types: ["electric"],
      },
      {
         id: 39,
         name: "푸린",
         image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
         types: ["normal", "fairy"],
      },
      {
         id: 133,
         name: "이브이",
         image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
         types: ["normal"],
      },
   ];

   return (
      <main className="pt-24 px-5 max-w-[1400px] mx-auto w-full">
         <div className="mb-8 flex justify-center">
            <input
               type="text"
               placeholder="포켓몬 이름 또는 번호를 입력하세요"
               className="w-full max-w-lg px-5 py-3 mt-10 rounded-lg border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
         </div>
         <div className="flex flex-wrap justify-center gap-5 py-5">
            {dummyPokemons.map((pokemon) => (
               <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
         </div>
      </main>
   );
}
