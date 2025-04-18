import { createContext } from "react";
import normalIcon from "../assets/icons/normal.svg";
import fireIcon from "../assets/icons/fire.svg";
import waterIcon from "../assets/icons/water.svg";
import grassIcon from "../assets/icons/grass.svg";
import electricIcon from "../assets/icons/electric.svg";
import iceIcon from "../assets/icons/ice.svg";
import fightingIcon from "../assets/icons/fighting.svg";
import poisonIcon from "../assets/icons/poison.svg";
import groundIcon from "../assets/icons/ground.svg";
import flyingIcon from "../assets/icons/flying.svg";
import psychicIcon from "../assets/icons/psychic.svg";
import bugIcon from "../assets/icons/bug.svg";
import rockIcon from "../assets/icons/rock.svg";
import ghostIcon from "../assets/icons/ghost.svg";
import dragonIcon from "../assets/icons/dragon.svg";
import darkIcon from "../assets/icons/dark.svg";
import steelIcon from "../assets/icons/steel.svg";
import fairyIcon from "../assets/icons/fairy.svg";

export const TypeColorContext = createContext();

export const typeKoMap = {
   normal: {
      ko: "노말",
      name: "normal",
      color: "bg-gray-300",
      icon: normalIcon,
   },
   fire: {
      ko: "불꽃",
      name: "fire",
      color: "bg-red-500",
      icon: fireIcon,
   },
   water: {
      ko: "물",
      name: "water",
      color: "bg-blue-400",
      icon: waterIcon,
   },
   grass: {
      ko: "풀",
      name: "grass",
      color: "bg-green-500",
      icon: grassIcon,
   },
   electric: {
      ko: "전기",
      name: "electric",
      color: "bg-yellow-400",
      icon: electricIcon,
   },
   ice: {
      ko: "얼음",
      name: "ice",
      color: "bg-cyan-300",
      icon: iceIcon,
   },
   fighting: {
      ko: "격투",
      name: "fighting",
      color: "bg-red-700",
      icon: fightingIcon,
   },
   poison: {
      ko: "독",
      name: "poison",
      color: "bg-purple-600",
      icon: poisonIcon,
   },
   ground: {
      ko: "땅",
      name: "ground",
      color: "bg-yellow-600",
      icon: groundIcon,
   },
   flying: {
      ko: "비행",
      name: "flying",
      color: "bg-indigo-300",
      icon: flyingIcon,
   },
   psychic: {
      ko: "에스퍼",
      name: "psychic",
      color: "bg-pink-500",
      icon: psychicIcon,
   },
   bug: {
      ko: "벌레",
      name: "bug",
      color: "bg-lime-500",
      icon: bugIcon,
   },
   rock: {
      ko: "바위",
      name: "rock",
      color: "bg-yellow-700",
      icon: rockIcon,
   },
   ghost: {
      ko: "고스트",
      name: "ghost",
      color: "bg-indigo-800",
      icon: ghostIcon,
   },
   dragon: {
      ko: "드래곤",
      name: "dragon",
      color: "bg-purple-700",
      icon: dragonIcon,
   },
   dark: {
      ko: "악",
      name: "dark",
      color: "bg-gray-800",
      icon: darkIcon,
   },
   steel: {
      ko: "강철",
      name: "steel",
      color: "bg-gray-500",
      icon: steelIcon,
   },
   fairy: {
      ko: "페어리",
      name: "fairy",
      color: "bg-pink-300",
      icon: fairyIcon,
   },
};

export function TypeMapProvider({ children }) {
   return (
      <TypeColorContext.Provider value={typeKoMap}>
         {children}
      </TypeColorContext.Provider>
   );
}
