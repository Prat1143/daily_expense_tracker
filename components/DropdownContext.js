import React, { createContext, useContext, useState } from 'react';

const DropdownContext = createContext();

export const useDropdown = () => useContext(DropdownContext);

export const DropdownProvider = ({ children }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  return (
    <DropdownContext.Provider value={{ isDropdownVisible, setIsDropdownVisible }}>
      {children}
    </DropdownContext.Provider>
  );
};