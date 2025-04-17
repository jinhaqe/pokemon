export default function PokemonCard({ pokemon }) {
   const typeColors = {
      grass: "bg-green-500",
      fire: "bg-red-500",
      water: "bg-blue-500",
      electric: "bg-yellow-400 text-black",
      normal: "bg-yellow-600",
      fairy: "bg-pink-300",
      poison: "bg-purple-600",
   };

   return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all w-[200px] h-[280px] flex flex-col items-center cursor-pointer">
         <img
            src={pokemon.image}
            alt={pokemon.name}
            className="w-full h-[150px] object-contain mb-4"
         />
         <h3 className="text-lg font-semibold mb-2 text-center">
            {pokemon.name}
         </h3>
         <div className="flex gap-2 justify-center flex-wrap">
            {pokemon.types.map((type) => (
               <span
                  key={type}
                  className={`px-3 py-1  rounded-full text-sm font-medium text-white leading-normal ${
                     typeColors[type] || "bg-gray-500"
                  }`}
               >
                  {type}
               </span>
            ))}
         </div>
      </div>
   );
}
