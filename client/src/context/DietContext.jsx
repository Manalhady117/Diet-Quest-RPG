import React, { createContext, useContext } from 'react';
import { useUser } from './UserContext.jsx';

const DietContext = createContext();

export const DietProvider = ({ children }) => {
  const userContext = useUser();

  return (
    <DietContext.Provider value={userContext}>
      {children}
    </DietContext.Provider>
  );
};

export const useDiet = () => {
  return useUser();
};

export default DietContext;
