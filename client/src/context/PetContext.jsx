import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const [petStats, setPetStats] = useState(() => {
    try {
      const saved = localStorage.getItem('pet_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      nourishment: 70, // Can reach 100%
      happiness: 85,
      energy: 80,
      hunger: 30
    };
  });

  useEffect(() => {
    localStorage.setItem('pet_stats', JSON.stringify(petStats));
  }, [petStats]);

  // Feed handler allowing nourishment to cleanly reach 100%
  const feedPet = useCallback((nourishmentBoost = 10) => {
    setPetStats((prev) => {
      const currentNourishment = prev.nourishment !== undefined ? prev.nourishment : 70;
      // Correctly allow increment up to 100% without arbitrary 80% cap
      const updatedNourishment = Math.min(currentNourishment + nourishmentBoost, 100);
      const updatedHunger = Math.max(0, 100 - updatedNourishment);

      window.dispatchEvent(new CustomEvent('pet_fed', { detail: { nourishment: updatedNourishment } }));

      return {
        ...prev,
        nourishment: updatedNourishment,
        hunger: updatedHunger,
        happiness: Math.min(100, (prev.happiness || 80) + 5)
      };
    });
  }, []);

  return (
    <PetContext.Provider value={{ petStats, setPetStats, feedPet, nourishment: petStats.nourishment }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    return {
      petStats: { nourishment: 70, happiness: 85, energy: 80, hunger: 30 },
      setPetStats: () => {},
      feedPet: () => {},
      nourishment: 70
    };
  }
  return context;
};

export default PetContext;
