import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import userService from '../services/userService.js';
import questService from '../services/questService.js';
import healthService from '../services/healthService.js';
import sounds from '../utils/soundEffects.js';
import { generateLocalRerolledMeal } from '../utils/mealRerollGenerator.js';
import { useAuth } from './AuthContext.jsx';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const { isAuthenticated, user, setUser } = useAuth();

  const [dietPlan, setDietPlan] = useState(() => {
    if (user?.diet_plan) return user.diet_plan;
    try {
      const stored = localStorage.getItem('diet_quest_plan');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    if (user?.diet_plan) {
      setDietPlan(user.diet_plan);
    }
  }, [user?.diet_plan]);

  const [stats, setStats] = useState({
    hp_current: 100,
    hp_max: 100,
    xp_total: 0,
    level: 1,
    coins: 200, // Exactly 200 starting coins
    streak_count: 0,
    streak_multiplier: 1.0,
    water_current_ml: 0, // Strict 0
    water_target_ml: 3000,
    steps_current: 0, // Strict 0
    steps_target: 8000,
    bpm_current: 72,
    energy_bar: 0,
    active_shield_until: null,
    has_unplanned_trap: false,
    active_rest_day_until: null,
    pet_customization: {
      name: 'Pip',
      stage: 'baby',
      equipped_hat: null,
      equipped_glasses: null,
      equipped_outfit: null,
      equipped_background: 'bg_cozy_guild',
      unlocked_items: ['bg_cozy_guild'],
      happiness: 50,
      hunger: 50,
      last_interaction: new Date().toISOString()
    },
    scout_badges: []
  });

  const [inventory, setInventory] = useState({
    speedPotions: 2,
    shields: 1,
    cheatMealPasses: 0,
    restDayPasses: 1
  });

  const [quests, setQuests] = useState([]);
  const [storeCatalog, setStoreCatalog] = useState([]);
  const [mascotState, setMascotState] = useState('idle'); // 'idle' | 'celebrate' | 'damage'
  const [statusNotification, setStatusNotification] = useState(null);

  // Modals state
  const [celebrationModal, setCelebrationModal] = useState({
    isOpen: false,
    message: '',
    bonusXP: 200
  });

  const [trapModal, setTrapModal] = useState({
    isOpen: false,
    xpDeducted: 300,
    recoveryQuest: null
  });

  const [levelUpModal, setLevelUpModal] = useState({
    isOpen: false,
    newLevel: 1
  });

  const [dailySummaryModal, setDailySummaryModal] = useState({
    isOpen: false,
    summary: null
  });

  const [knockedOutModal, setKnockedOutModal] = useState({
    isOpen: false
  });

  // Watch for zero HP defeat condition to open Knocked Out modal
  useEffect(() => {
    if (stats?.hp_current !== undefined && stats.hp_current <= 0) {
      setKnockedOutModal({ isOpen: true });
    }
  }, [stats?.hp_current]);

  const notify = (message, type = 'info') => {
    setStatusNotification({ message, type, id: Date.now() });
    setTimeout(() => setStatusNotification(null), 4000);
  };

  // Load user game data
  const loadGameData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [statsRes, questsRes, storeRes] = await Promise.all([
        userService.getStats(),
        questService.getQuests(),
        userService.getStoreCatalog()
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
        if (statsRes.inventory) setInventory(statsRes.inventory);
      }
      if (questsRes.success) {
        setQuests(questsRes.quests);
      }
      if (storeRes.success) {
        setStoreCatalog(storeRes.catalog);
      }
    } catch (err) {
      console.warn('[GameContext] Error loading initial game state:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadGameData();
    }
  }, [isAuthenticated, loadGameData]);

  // Log water intake
  const logWater = async (amount_ml = 250) => {
    try {
      sounds.playWaterSip();
      const res = await userService.logWater(amount_ml);
      if (res.success) {
        setStats(res.stats);
        if (res.bonusToast || res.bonusEarned) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
          notify(res.bonusToast || 'Bonus Earned! 🎉 You surpassed your daily goal!', 'success');
        } else {
          notify(res.message, 'success');
        }
        return res;
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to log water', 'danger');
    }
  };

  // Apply HP damage
  const applyDamage = async (damage = 20, reason = 'Unplanned junk food') => {
    try {
      const res = await userService.applyDamage(damage, reason);
      if (res.success) {
        setStats(res.stats);
        if (res.inventory) setInventory(res.inventory);

        if (res.shieldBlocked) {
          sounds.playCoinSound();
          notify(res.message, 'success');
        } else {
          sounds.playDamageSound();
          setMascotState('damage');
          setTimeout(() => setMascotState('idle'), 3000);
          notify(res.message, 'danger');
        }
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Error applying damage', 'danger');
    }
  };

  // Trigger Fast Food Trap
  const triggerTrap = async () => {
    try {
      sounds.playDamageSound();
      const res = await userService.triggerTrap();
      if (res.success) {
        if (res.shieldBlocked) {
          notify(res.message, 'success');
          setStats(res.stats);
        } else {
          setStats(res.stats);
          setMascotState('damage');
          setTimeout(() => setMascotState('idle'), 3500);

          // Open Trap Penalty Modal
          setTrapModal({
            isOpen: true,
            xpDeducted: res.xpDeducted,
            recoveryQuest: res.recoveryQuest
          });

          // Refresh quest list to show recovery quest
          const qRes = await questService.getQuests();
          if (qRes.success) setQuests(qRes.quests);
        }
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to spring trap', 'danger');
    }
  };

  // Complete & Claim Quests
  const completeQuest = async (questId) => {
    try {
      const res = await questService.completeQuest(questId);
      if (res.success) {
        sounds.playCoinSound();
        setQuests(prev => prev.map(q => q.id === questId ? res.quest : q));
        notify(res.message, 'success');
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Error completing quest', 'danger');
    }
  };

  const claimQuest = async (questId) => {
    try {
      const res = await questService.claimQuest(questId);
      if (res.success) {
        sounds.playVictoryChime();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });

        setStats(res.stats);
        setQuests(prev => prev.map(q => q.id === questId ? res.quest : q));
        notify(res.message, 'success');

        if (res.leveledUp) {
          sounds.playLevelUp();
          setLevelUpModal({
            isOpen: true,
            newLevel: res.newLevel
          });
        }
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Error claiming XP', 'danger');
    }
  };

  // Use Inventory item
  const useItem = async (itemId) => {
    try {
      const res = await userService.useInventoryItem(itemId);
      if (res.success) {
        sounds.playCoinSound();
        setInventory(res.inventory);
        setStats(res.stats);
        notify(res.message, 'success');
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Error using item', 'danger');
    }
  };

  // Buy item from loot store
  const buyStoreItem = async (itemId) => {
    try {
      const res = await userService.buyStoreItem(itemId);
      if (res.success) {
        sounds.playCoinSound();
        confetti({ particleCount: 40, spread: 50 });
        setInventory(res.inventory);
        setStats(res.stats);
        notify(res.message, 'success');
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Purchase failed', 'danger');
    }
  };

  // Update specific quest progress (e.g. In-App Walking Session or Hydration)
  const updateQuestProgress = async (questId, amount, isIncremental = true) => {
    try {
      const res = await questService.updateProgress(questId, amount, isIncremental);
      if (res.success) {
        setQuests(res.quests || []);
        if (res.stats) setStats(res.stats);
        if (res.quest?.completed) {
          sounds.playVictoryChime();
          notify(`⚔️ Quest Completed: "${res.quest.title}"! Claim your XP!`, 'success');
        }
        return res;
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to update quest progress', 'danger');
    }
  };

  // Record In-App Walking Session (Handled directly inside app - no smartwatch required)
  const recordWalkingSession = async (steps, bpm = 82, caloriesBurned = 250) => {
    try {
      const res = await healthService.syncTelemetry({
        steps,
        bpm,
        caloriesBurned,
        deviceType: 'In-App Walking Quest'
      });

      if (res.success) {
        setStats(res.stats);

        // Check celebration event from step milestone
        if (res.celebration && res.celebration.triggered) {
          sounds.playVictoryChime();
          setMascotState('celebrate');

          // Trigger fireworks confetti
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 }
          });

          setCelebrationModal({
            isOpen: true,
            message: res.celebration.message,
            bonusXP: res.celebration.bonusXP
          });
        } else {
          notify(`Recorded in-app walk: ${steps} total steps`, 'info');
        }
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to record walking session', 'danger');
    }
  };

  // Backwards compatibility alias for syncSmartwatch
  const syncSmartwatch = recordWalkingSession;

  // Quick increment for interactive testing
  const mockStepIncrement = async (deltaSteps = 1000) => {
    const newSteps = (stats.steps_current || 0) + deltaSteps;
    const randomBpm = Math.floor(Math.random() * 25) + 75;
    await recordWalkingSession(newSteps, randomBpm);
  };

  // Complete Day and trigger Daily Summary Screen
  const finishDay = async (completedMealIds = [], dayNotes = '') => {
    try {
      sounds.playLevelUp();
      const res = await userService.completeDay(completedMealIds, dayNotes);
      if (res.success) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
        if (res.stats) setStats(res.stats);
        if (res.quests) setQuests(res.quests);
        if (res.user && setUser) setUser(res.user);

        setDailySummaryModal({
          isOpen: true,
          summary: res.summary
        });
        notify(`🌟 Day ${res.summary?.completedDayNumber || 1} Complete! XP recorded!`, 'success');
        return res;
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to complete day', 'danger');
    }
  };

  const closeDailySummary = () => {
    setDailySummaryModal({
      isOpen: false,
      summary: null
    });
  };

  // Explicit Complete Day & Go to Next Day engine
  const advanceToNextDay = async () => {
    try {
      sounds?.playLevelUp?.();
      const res = await userService.nextDay();
      if (res && res.success) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
        if (res.stats) setStats(res.stats);
        if (res.quests) setQuests(res.quests);
        if (res.user && setUser) setUser(res.user);

        notify(res.message || `🎉 Welcome to Day ${res.currentActiveDay || 2}! Progress reset for the new day.`, 'success');
        return res;
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to advance to next day', 'danger');
      throw err;
    }
  };

  // Bonus Rewards for Over-Achieving Steps (> 3.0 km -> +20 Coins / +50 XP per extra 1.0 km)
  const logWalkBonus = async (extraKm = 1.0) => {
    try {
      const res = await userService.logWalkBonus(extraKm);
      if (res && res.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (res.stats) setStats(res.stats);
        notify('Bonus Earned! 🎉 You surpassed your daily goal!', 'success');
        return res;
      }
    } catch (err) {
      console.warn('logWalkBonus error:', err);
    }
  };

  // Record Weekly Weigh-In to unlock next week
  const recordWeighIn = async (weight_kg, note = '') => {
    try {
      const res = await userService.recordWeighIn(weight_kg, note);
      if (res.success) {
        sounds.playVictoryChime();
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.5 }
        });
        if (res.stats) setStats(res.stats);
        if (res.quests) setQuests(res.quests);
        if (res.user && setUser) setUser(res.user);
        notify(res.message, 'success');
        return res;
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to record weigh-in', 'danger');
      throw err;
    }
  };

  // Reroll single meal with AI generator & claim lock
  const rerollMeal = async (day = 1, mealId) => {
    try {
      sounds?.playEquipClick?.();
    } catch (e) {}

    // Find current meal to verify if already claimed
    let currentMeal = null;
    if (dietPlan?.week_schedule && Array.isArray(dietPlan.week_schedule)) {
      const daySched = dietPlan.week_schedule.find((s) => s.day === Number(day));
      if (daySched?.meals) {
        currentMeal = daySched.meals.find((m) => m.id === mealId);
      }
    } else if (dietPlan?.[day]?.meals) {
      currentMeal = dietPlan[day].meals.find((m) => m.id === mealId);
    } else if (user?.diet_plan?.week_schedule) {
      const daySched = user.diet_plan.week_schedule.find((s) => s.day === Number(day));
      if (daySched?.meals) {
        currentMeal = daySched.meals.find((m) => m.id === mealId);
      }
    }

    if (currentMeal && (currentMeal.isClaimed || currentMeal.claimed)) {
      notify('This meal has already been logged. Swapping is locked.', 'warning');
      return { success: false, message: 'Meal already claimed' };
    }

    let backendSuccess = false;
    let newMeal = null;

    // 1. Attempt remote AI backend update
    try {
      const res = await userService.rerollMeal(
        day,
        mealId,
        currentMeal,
        currentMeal?.calories || Math.round((user?.metrics?.caloric_target || 2000) * 0.3),
        user?.user_goal
      );
      if (res && (res.success || res.newMeal || res.meal)) {
        backendSuccess = true;
        if (res.user && setUser) setUser(res.user);
        if (res.quests) setQuests(res.quests);
        if (res.newMeal || res.meal) newMeal = res.newMeal || res.meal;
      }
    } catch (err) {
      console.warn('[GameContext] Remote AI reroll failed, generating fresh meal:', err?.message);
    }

    // 2. If backend did not provide newMeal, generate locally from smart catalog
    if (!newMeal) {
      let currentMeal = null;
      if (dietPlan?.week_schedule && Array.isArray(dietPlan.week_schedule)) {
        const daySched = dietPlan.week_schedule.find((s) => s.day === Number(day));
        if (daySched?.meals) {
          currentMeal = daySched.meals.find((m) => m.id === mealId);
        }
      } else if (dietPlan?.[day]?.meals) {
        currentMeal = dietPlan[day].meals.find((m) => m.id === mealId);
      } else if (user?.diet_plan?.week_schedule) {
        const daySched = user.diet_plan.week_schedule.find((s) => s.day === Number(day));
        if (daySched?.meals) {
          currentMeal = daySched.meals.find((m) => m.id === mealId);
        }
      }

      newMeal = generateLocalRerolledMeal({
        mealId,
        currentMeal,
        userGoal: user?.user_goal,
        dietType: user?.diet_type
      });
    }

    // 3. Update dietPlan state in memory and localStorage
    setDietPlan((prevPlan) => {
      const plan = prevPlan ? JSON.parse(JSON.stringify(prevPlan)) : { week_schedule: [] };
      if (plan.week_schedule && Array.isArray(plan.week_schedule)) {
        let daySched = plan.week_schedule.find((s) => s.day === Number(day));
        if (!daySched) {
          daySched = { day: Number(day), theme: `Day ${day} Metabolic Focus`, meals: [] };
          plan.week_schedule.push(daySched);
        }
        const existingIdx = daySched.meals.findIndex((m) => m.id === mealId);
        if (existingIdx !== -1) {
          daySched.meals[existingIdx] = newMeal;
        } else {
          daySched.meals.push(newMeal);
        }
      } else {
        if (!plan[day]) plan[day] = { theme: `Day ${day} Metabolic Focus`, meals: [] };
        const existingIdx = plan[day].meals.findIndex((m) => m.id === mealId);
        if (existingIdx !== -1) {
          plan[day].meals[existingIdx] = newMeal;
        } else {
          plan[day].meals.push(newMeal);
        }
      }

      try {
        localStorage.setItem('diet_quest_plan', JSON.stringify(plan));
      } catch (e) {}
      return plan;
    });

    // 4. Update user object if available
    if (setUser && user) {
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        const updated = { ...prevUser };
        if (updated.diet_plan && updated.diet_plan.week_schedule) {
          const dayItem = updated.diet_plan.week_schedule.find((s) => s.day === Number(day));
          if (dayItem && dayItem.meals) {
            const mIdx = dayItem.meals.findIndex((m) => m.id === mealId);
            if (mIdx !== -1) dayItem.meals[mIdx] = newMeal;
          }
        }
        return updated;
      });
    }

    // 5. Update corresponding meal quests
    setQuests((prevQuests) =>
      prevQuests.map((q) => {
        if (
          q.relatedMealId === mealId ||
          q.id === `quest_meal_${mealId}` ||
          (q.title && q.title.toLowerCase().includes(mealId.toLowerCase()))
        ) {
          return {
            ...q,
            title: `Meal Quest: ${newMeal.name} (+200 XP)`,
            description: `Fuel your adventure with ${newMeal.name} (${newMeal.calories} kcal, ${newMeal.protein_g}g Protein).`
          };
        }
        return q;
      })
    );

    // 6. Play success audio & notify
    try {
      sounds?.playChestOpen?.() || sounds?.playVictoryChime?.();
    } catch (e) {}
    notify(`🎲 Swapped meal for: ${newMeal.name}`, 'success');

    return { success: true, newMeal, localFallback: !backendSuccess };
  };

  // Claim Meal reward (+200 XP) and lock meal
  const claimMealReward = async (mealId, day = 1) => {
    try {
      sounds?.playClaimReward?.() || sounds?.playVictoryChime?.();

      // 1. Mark meal as claimed in local dietPlan state immediately
      setDietPlan((prevPlan) => {
        if (!prevPlan) return prevPlan;
        const plan = JSON.parse(JSON.stringify(prevPlan));
        if (plan.week_schedule && Array.isArray(plan.week_schedule)) {
          const daySched = plan.week_schedule.find((s) => s.day === Number(day));
          if (daySched?.meals) {
            daySched.meals = daySched.meals.map((m) =>
              m.id === mealId ? { ...m, isClaimed: true, claimed: true } : m
            );
          }
        }
        if (plan.meals) {
          plan.meals = plan.meals.map((m) =>
            m.id === mealId ? { ...m, isClaimed: true, claimed: true } : m
          );
        }
        if (plan[day]?.meals) {
          plan[day].meals = plan[day].meals.map((m) =>
            m.id === mealId ? { ...m, isClaimed: true, claimed: true } : m
          );
        }
        return plan;
      });

      // 2. Persist to backend database
      try {
        const claimRes = await userService.claimMeal(day, mealId);
        if (claimRes?.stats) setStats(claimRes.stats);
        if (claimRes?.user && setUser) setUser(claimRes.user);
        if (claimRes?.quests) setQuests(claimRes.quests);
      } catch (e) {
        console.warn('[GameContext] Remote meal claim sync error:', e);
      }

      // 3. Complete and claim associated quest
      const matchingQuest = quests.find(
        (q) =>
          q.relatedMealId === mealId ||
          q.id === `quest_${mealId}` ||
          q.title?.toLowerCase().includes(mealId.toLowerCase())
      );

      if (matchingQuest) {
        if (!matchingQuest.completed) {
          try {
            await questService.completeQuest(matchingQuest.id);
          } catch (e) {}
        }
        try {
          const res = await questService.claimQuest(matchingQuest.id);
          if (res?.stats) setStats(res.stats);
          if (res?.quest) setQuests(prev => prev.map(q => q.id === matchingQuest.id ? res.quest : q));
          return res;
        } catch (e) {}
      }

      setStats((prev) => ({
        ...prev,
        coins: (prev?.coins !== undefined ? Number(prev.coins) : 200) + 10,
        xp_total: (prev?.xp_total || 0) + 200,
        streak_count: prev?.streak_count || 1
      }));

      // Notify window for UserContext / top bar synchronization
      window.dispatchEvent(new CustomEvent('coins_updated', {
        detail: { coins: (stats?.coins !== undefined ? Number(stats.coins) : 200) + 10, delta: 10 }
      }));

      notify('Meal logged! +200 XP claimed!', 'success');
      return { success: true };
    } catch (err) {
      console.warn('[GameContext] claimMealReward error:', err);
    }
  };

  // Resurrect Knocked Out player
  const resurrect = async (method = 'recovery_walk') => {
    try {
      const res = await userService.resurrect(method);
      if (res.success) {
        sounds.playVictoryChime();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        if (res.stats) setStats(res.stats);
        setKnockedOutModal({ isOpen: false });
        notify(res.message, 'success');
        return res;
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to resurrect hero', 'danger');
      throw err;
    }
  };

  // Buy pet cosmetic item with Coins
  const buyPetItem = async (itemId, costCoins, itemType) => {
    try {
      const res = await userService.buyPetItem(itemId, costCoins, itemType);
      if (res.success && res.stats) {
        setStats(res.stats);
        sounds.playPurchaseSuccess();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
        notify(res.message, 'success');
        return res;
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to purchase pet cosmetic', 'danger');
      throw err;
    }
  };

  // Equip or unequip pet cosmetic item
  const equipPetItem = async (slot, itemId) => {
    try {
      const res = await userService.equipPetItem(slot, itemId);
      if (res.success && res.stats) {
        setStats(res.stats);
        sounds.playEquipItem();
        notify(res.message, 'success');
        return res;
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to equip item', 'danger');
      throw err;
    }
  };

  // Interactive My Talking Tom actions (pet, feed, play)
  const interactPet = async (action = 'pet') => {
    try {
      const res = await userService.interactPet(action);
      if (res.success && res.stats) {
        setStats(res.stats);
        if (action === 'feed') sounds.playPotionConsume();
        else sounds.playClick();
        notify(res.message, 'success');
        return res;
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Pet interaction failed', 'warning');
      throw err;
    }
  };

  // Claim Scout Honor Badge
  const claimBadge = async (badgeId) => {
    try {
      const res = await userService.claimBadge(badgeId);
      if (res.success && res.stats) {
        setStats(res.stats);
        sounds.playVictoryChime();
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.5 }
        });
        notify(res.message, 'success');
        return res;
      }
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to claim badge reward', 'warning');
      throw err;
    }
  };

  // Add Coins handler to dynamically update coins state
  const addCoins = useCallback((amount = 10) => {
    setStats((prev) => {
      const currentCoins = prev?.coins !== undefined ? Number(prev.coins) : 200;
      const nextCoins = Math.max(0, currentCoins + Number(amount));
      return {
        ...prev,
        coins: nextCoins
      };
    });
  }, []);

  // Listen for coins updates from other components/UserContext
  useEffect(() => {
    const handleCoinsUpdate = (e) => {
      if (e.detail?.coins !== undefined) {
        setStats(prev => ({
          ...prev,
          coins: e.detail.coins
        }));
      }
    };
    window.addEventListener('coins_updated', handleCoinsUpdate);
    return () => window.removeEventListener('coins_updated', handleCoinsUpdate);
  }, []);

  return (
    <GameContext.Provider
      value={{
        stats,
        coins: stats?.coins !== undefined ? Number(stats.coins) : 200,
        addCoins,
        setStats,
        inventory,
        quests,
        dietPlan,
        setDietPlan,
        storeCatalog,
        mascotState,
        setMascotState,
        statusNotification,
        celebrationModal,
        trapModal,
        levelUpModal,
        dailySummaryModal,
        knockedOutModal,
        setCelebrationModal,
        setTrapModal,
        setLevelUpModal,
        setDailySummaryModal,
        setKnockedOutModal,
        resurrect,
        buyPetItem,
        equipPetItem,
        interactPet,
        claimBadge,
        logWater,
        applyDamage,
        triggerTrap,
        completeQuest,
        claimQuest,
        updateQuestProgress,
        useItem,
        buyStoreItem,
        recordWalkingSession,
        syncSmartwatch,
        mockStepIncrement,
        loadGameData,
        finishDay,
        advanceToNextDay,
        logWalkBonus,
        closeDailySummary,
        recordWeighIn,
        rerollMeal,
        claimMealReward,
        notify
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;
