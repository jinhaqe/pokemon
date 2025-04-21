import { createContext, useState, useContext } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [selectPokemon, setSelectPokemon] = useState(null);

  const openModal = (pokemon) => setSelectPokemon(pokemon);
  const closeModal = () => setSelectPokemon(null);

  return (
    <ModalContext.Provider value={{ selectPokemon, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
