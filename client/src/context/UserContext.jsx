import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Coin balance state, syncing with localStorage or fallback to 200/60
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('user_coins');
    return saved !== null ? Number(saved) : 200;
  });

  // Central day progression tracking for meals & calories
  const [dayProgress, setDayProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('user_day_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      claimedMealIds: [],
      consumedCalories: 0,
      claimedCount: 0
    };
  });

  // Keep localStorage updated
  useEffect(() => {
    localStorage.setItem('user_coins', String(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('user_day_progress', JSON.stringify(dayProgress));
  }, [dayProgress]);

  // Centralized method to increment coins seamlessly
  const addCoins = useCallback((amount = 10) => {
    setCoins((prevCoins) => {
      const nextCoins = Math.max(0, (Number(prevCoins) || 0) + Number(amount));
      // Dispatch custom event so other contexts (GameContext) can sync immediately
      window.dispatchEvent(new CustomEvent('coins_updated', { detail: { coins: nextCoins, delta: amount } }));
      return nextCoins;
    });
  }, []);

  // Centralized claim meal handler updating calories bar & day progression counter
  const claimMealHandler = useCallback((mealId, mealKcal, mealType) => {
    const numericKcal = typeof mealKcal === 'string'
      ? parseInt(mealKcal.replace(/[^0-9]/g, ''), 10)
      : (Number(mealKcal) || 0);

    setDayProgress((prev) => {
      // Prevent duplicate claiming
      if (prev.claimedMealIds.includes(mealId)) return prev;

      const updatedClaimedIds = [...prev.claimedMealIds, mealId];
      const updatedConsumedCalories = prev.consumedCalories + (numericKcal || 0);
      const updatedMealsCount = updatedClaimedIds.length;

      const nextProgress = {
        ...prev,
        claimedMealIds: updatedClaimedIds,
        consumedCalories: updatedConsumedCalories,
        claimedCount: updatedMealsCount
      };

      window.dispatchEvent(new CustomEvent('meal_claimed_progress', { detail: nextProgress }));
      return nextProgress;
    });

    // Also reward coins per meal claim
    addCoins(10);
  }, [addCoins]);

  // Reset daily progression (used on Day Advance or reset)
  const resetDayProgress = useCallback(() => {
    setDayProgress({
      claimedMealIds: [],
      consumedCalories: 0,
      claimedCount: 0
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        coins,
        setCoins,
        addCoins,
        dayProgress,
        setDayProgress,
        claimMealHandler,
        resetDayProgress,
        consumedCalories: dayProgress.consumedCalories,
        claimedCount: dayProgress.claimedCount,
        claimedMealIds: dayProgress.claimedMealIds
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      coins: 200,
      setCoins: () => {},
      addCoins: () => {},
      dayProgress: { claimedMealIds: [], consumedCalories: 0, claimedCount: 0 },
      setDayProgress: () => {},
      claimMealHandler: () => {},
      resetDayProgress: () => {},
      consumedCalories: 0,
      claimedCount: 0,
      claimedMealIds: []
    };
  }
  return context;
};

export default UserContext;
