import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import LoginScreen from '../screens/Auth/LoginScreen.jsx';
import RegisterScreen from '../screens/Auth/RegisterScreen.jsx';
import PhysicalMetricsScreen from '../screens/Onboarding/PhysicalMetricsScreen.jsx';
import FoodPreferencesScreen from '../screens/Onboarding/FoodPreferencesScreen.jsx';
import GoalSelectionScreen from '../screens/Onboarding/GoalSelectionScreen.jsx';
import DietTypeScreen from '../screens/Onboarding/DietTypeScreen.jsx';
import AIGenerationRevealScreen from '../screens/Onboarding/AIGenerationRevealScreen.jsx';
import HomeScreen from '../screens/Dashboard/HomeScreen.jsx';
import DietScreen from '../screens/Diet/DietScreen.jsx';
import CampaignScreen from '../screens/Campaign/CampaignScreen.jsx';
import QuestsScreen from '../screens/Quests/QuestsScreen.jsx';
import LootStoreScreen from '../screens/Shop/LootStoreScreen.jsx';
import DailySummaryScreen from '../screens/Summary/DailySummaryScreen.jsx';
import PetWardrobeScreen from '../screens/Pet/PetWardrobeScreen.jsx';
import AIDietitianChatScreen from '../screens/Chat/AIDietitianChatScreen.jsx';
import AppHeader from '../components/Navigation/AppHeader.jsx';
import TopNavBar from '../components/Navigation/TopNavBar.jsx';
import MascotCelebration from '../components/Modals/MascotCelebration.jsx';
import TrapPenaltyModal from '../components/Modals/TrapPenaltyModal.jsx';
import KnockedOutModal from '../components/Modals/KnockedOutModal.jsx';
import { PixelMascot } from '../components/Mascot/PixelMascot.jsx';
import questService from '../services/questService.js';
import {
  Compass,
  Scroll,
  ShoppingBag,
  LogOut,
  Settings,
  Sparkles,
  Trophy,
  Utensils,
  TrendingUp,
  Globe,
  Heart,
  X,
  Bot,
  MessageSquare,
  Shirt
} from 'lucide-react';

export const AppNavigator = () => {
  const { user, isAuthenticated, isLoading, logout, updateProfile } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const {
    stats,
    celebrationModal,
    trapModal,
    levelUpModal,
    dailySummaryModal,
    knockedOutModal,
    resurrect,
    setCelebrationModal,
    setTrapModal,
    setLevelUpModal,
    closeDailySummary,
    statusNotification,
    loadGameData
  } = useGame();

  // Navigation states
  const [authScreen, setAuthScreen] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'diet' | 'campaign' | 'quests' | 'shop'
  const [campaignSubView, setCampaignSubView] = useState('daily'); // 'daily' | 'weekly'
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [tempGoal, setTempGoal] = useState('weight_loss');
  const [tempDiet, setTempDiet] = useState('Balanced');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReQuizOpen, setIsReQuizOpen] = useState(false);
  const [reQuizStep, setReQuizStep] = useState(1);

  const [quizData, setQuizData] = useState({
    age: '26-35',
    height_cm: '171-180cm',
    weight_kg: '71-85kg',
    liked_foods: ['Chicken', 'Rice', 'Vegetables'],
    disliked_foods: ['None'],
    favorite_cuisines: ['Egyptian', 'Mediterranean'],
    allergies: ['None'],
    user_goal: 'weight_loss',
    diet_type: 'Balanced'
  });

  // Sync quiz data with user state
  useEffect(() => {
    if (user) {
      setTempGoal(user.user_goal || 'weight_loss');
      setTempDiet(user.diet_type || 'Balanced');
      setQuizData({
        age: user.age || '26-35',
        height_cm: user.height_cm || '171-180cm',
        weight_kg: user.weight_kg || '71-85kg',
        liked_foods: user.liked_foods || ['Chicken', 'Rice', 'Vegetables'],
        disliked_foods: user.disliked_foods || ['None'],
        favorite_cuisines: user.favorite_cuisines || ['Egyptian', 'Mediterranean'],
        allergies: user.allergies || ['None'],
        user_goal: user.user_goal || 'weight_loss',
        diet_type: user.diet_type || 'Balanced'
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <PixelMascot state="idle" size={90} />
        <p className="font-pixel text-xs text-[#8B7CFF] mt-4 animate-pulse">
          COMMUNING WITH DIET QUEST REALM...
        </p>
      </div>
    );
  }

  // If user is not authenticated:
  if (!isAuthenticated || !user) {
    if (authScreen === 'register') {
      return (
        <RegisterScreen
          onNavigateToLogin={() => setAuthScreen('login')}
          onRegisterSuccess={() => {}}
        />
      );
    }
    return (
      <LoginScreen
        onNavigateToRegister={() => setAuthScreen('register')}
        onLoginSuccess={() => {}}
      />
    );
  }

  // If user has not completed onboarding:
  if (!user.onboardingCompleted) {
    if (onboardingStep === 1) {
      return (
        <PhysicalMetricsScreen
          currentAge={quizData.age}
          currentHeight={quizData.height_cm}
          currentWeight={quizData.weight_kg}
          onSaveMetrics={(metrics) => setQuizData((prev) => ({ ...prev, ...metrics }))}
          onNext={() => setOnboardingStep(2)}
        />
      );
    }
    if (onboardingStep === 2) {
      return (
        <FoodPreferencesScreen
          initialLikes={quizData.liked_foods}
          initialDislikes={quizData.disliked_foods}
          initialCuisines={quizData.favorite_cuisines}
          onSavePreferences={(prefs) => setQuizData((prev) => ({ ...prev, ...prefs }))}
          onNext={() => setOnboardingStep(3)}
          onBack={() => setOnboardingStep(1)}
        />
      );
    }
    if (onboardingStep === 3) {
      return (
        <GoalSelectionScreen
          currentGoal={tempGoal}
          onSelectGoal={(g) => {
            setTempGoal(g);
            setQuizData((prev) => ({ ...prev, user_goal: g }));
          }}
          onNext={() => setOnboardingStep(4)}
          onBack={() => setOnboardingStep(2)}
        />
      );
    }
    if (onboardingStep === 4) {
      return (
        <DietTypeScreen
          currentDiet={tempDiet}
          onSelectDiet={(d) => {
            setTempDiet(d);
            setQuizData((prev) => ({ ...prev, diet_type: d }));
          }}
          onNext={() => setOnboardingStep(5)}
          onBack={() => setOnboardingStep(3)}
        />
      );
    }
    if (onboardingStep === 5) {
      return (
        <AIGenerationRevealScreen
          quizData={{
            ...quizData,
            user_goal: tempGoal,
            diet_type: tempDiet
          }}
          onGeneratePlan={async (data) => {
            const res = await questService.generatePlan(data);
            if (res.user) {
              await updateProfile(res.user);
            }
            await loadGameData();
            return res;
          }}
          onProceed={async () => {
            await updateProfile({
              user_goal: tempGoal,
              diet_type: tempDiet,
              device_sync: 'In-App Walking Quests',
              onboardingCompleted: true
            });
            await loadGameData();
          }}
        />
      );
    }
  }

  // Re-Quiz Modal / Flow for existing users
  if (isReQuizOpen) {
    if (reQuizStep === 1) {
      return (
        <PhysicalMetricsScreen
          currentAge={quizData.age}
          currentHeight={quizData.height_cm}
          currentWeight={quizData.weight_kg}
          onSaveMetrics={(metrics) => setQuizData((prev) => ({ ...prev, ...metrics }))}
          onNext={() => setReQuizStep(2)}
          onBack={() => setIsReQuizOpen(false)}
          isReQuiz={true}
        />
      );
    }
    if (reQuizStep === 2) {
      return (
        <FoodPreferencesScreen
          initialLikes={quizData.liked_foods}
          initialDislikes={quizData.disliked_foods}
          initialCuisines={quizData.favorite_cuisines}
          onSavePreferences={(prefs) => setQuizData((prev) => ({ ...prev, ...prefs }))}
          onNext={() => setReQuizStep(3)}
          onBack={() => setReQuizStep(1)}
        />
      );
    }
    if (reQuizStep === 3) {
      return (
        <GoalSelectionScreen
          currentGoal={tempGoal}
          onSelectGoal={(g) => {
            setTempGoal(g);
            setQuizData((prev) => ({ ...prev, user_goal: g }));
          }}
          onNext={() => setReQuizStep(4)}
          onBack={() => setReQuizStep(2)}
        />
      );
    }
    if (reQuizStep === 4) {
      return (
        <DietTypeScreen
          currentDiet={tempDiet}
          onSelectDiet={(d) => {
            setTempDiet(d);
            setQuizData((prev) => ({ ...prev, diet_type: d }));
          }}
          onNext={() => setReQuizStep(5)}
          onBack={() => setReQuizStep(3)}
        />
      );
    }
    if (reQuizStep === 5) {
      return (
        <AIGenerationRevealScreen
          quizData={{
            ...quizData,
            user_goal: tempGoal,
            diet_type: tempDiet
          }}
          onGeneratePlan={async (data) => {
            const res = await questService.generatePlan(data);
            if (res.user) {
              await updateProfile(res.user);
            }
            await loadGameData();
            return res;
          }}
          onProceed={() => {
            setIsReQuizOpen(false);
            setReQuizStep(1);
          }}
          isReQuiz={true}
        />
      );
    }
  }

  // Navigation handlers
  const handleGoToDaily = () => {
    setActiveTab('campaign');
    setCampaignSubView('daily');
  };

  const handleGoToWeekly = () => {
    setActiveTab('campaign');
    setCampaignSubView('weekly');
  };

  // Main Authenticated Game View
  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans-app selection:bg-[#8B7CFF]/20 selection:text-[#8B7CFF]"
    >
      {/* 1. Global Header Layout (64px fixed) */}
      <AppHeader
        onOpenStore={() => setActiveTab('shop')}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Main Top Navigation Bar (48px fixed, 4 Equal-Width Tabs) */}
      <TopNavBar
        activeTab={activeTab === 'dashboard' ? 'hud' : activeTab}
        onSelectTab={(tab) => {
          if (tab === 'hud') setActiveTab('dashboard');
          else setActiveTab(tab);
        }}
      />

      {/* Main Content View (Strict 16px Padding & Responsive Container) */}
      <main className="flex-1 w-full max-w-5xl mx-auto">
        {(activeTab === 'dashboard' || activeTab === 'hud') && (
          <HomeScreen
            onNavigateToQuests={() => setActiveTab('quests')}
            onNavigateToShop={() => setActiveTab('shop')}
            onNavigateToDiet={() => setActiveTab('diet')}
            onNavigateToCampaign={() => setActiveTab('campaign')}
            onNavigateToDaily={handleGoToDaily}
            onNavigateToWeekly={handleGoToWeekly}
            onOpenQuiz={() => {
              setReQuizStep(1);
              setIsReQuizOpen(true);
            }}
          />
        )}
        {activeTab === 'diet' && (
          <DietScreen
            onOpenQuiz={() => {
              setReQuizStep(1);
              setIsReQuizOpen(true);
            }}
            onNavigateToProgress={handleGoToWeekly}
            onCompleteDayClick={handleGoToDaily}
          />
        )}
        {activeTab === 'pet' && <PetWardrobeScreen />}
        {activeTab === 'chat' && <AIDietitianChatScreen />}
        {activeTab === 'campaign' && (
          <CampaignScreen
            initialView={campaignSubView}
            onOpenDiet={() => setActiveTab('diet')}
          />
        )}
        {activeTab === 'quests' && (
          <QuestsScreen
            onOpenQuiz={() => {
              setReQuizStep(1);
              setIsReQuizOpen(true);
            }}
          />
        )}
        {activeTab === 'shop' && <LootStoreScreen />}
      </main>

      {/* Mobile Bottom Navigation Bar: 4 Core Tabs */}
      <div className="md:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 font-pixel text-[9px] cursor-pointer px-3 py-1 rounded-xl transition-all ${
            activeTab === 'dashboard' || activeTab === 'hud' ? 'text-[#8B7CFF] bg-[#8B7CFF]/10 font-bold' : 'text-[#64748B]'
          }`}
        >
          <Compass size={18} />
          <span>HUD</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('diet')}
          className={`flex flex-col items-center gap-0.5 font-pixel text-[9px] cursor-pointer px-3 py-1 rounded-xl transition-all ${
            activeTab === 'diet' ? 'text-[#8B7CFF] bg-[#8B7CFF]/10 font-bold' : 'text-[#64748B]'
          }`}
        >
          <Utensils size={18} />
          <span>DIET</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pet')}
          className={`flex flex-col items-center gap-0.5 font-pixel text-[9px] cursor-pointer px-3 py-1 rounded-xl transition-all ${
            activeTab === 'pet' ? 'text-[#8B7CFF] bg-[#8B7CFF]/10 font-bold' : 'text-[#64748B]'
          }`}
        >
          <Shirt size={18} />
          <span>PET</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-0.5 font-pixel text-[9px] cursor-pointer px-3 py-1 rounded-xl transition-all ${
            activeTab === 'chat' ? 'text-[#8B7CFF] bg-[#8B7CFF]/10 font-bold' : 'text-[#64748B]'
          }`}
        >
          <Bot size={18} />
          <span>AI CHAT</span>
        </button>
      </div>

      {/* Daily Summary Screen Modal */}
      {dailySummaryModal?.isOpen && (
        <DailySummaryScreen
          summaryData={dailySummaryModal.summary}
          onClose={closeDailySummary}
          onNavigateToProgress={handleGoToWeekly}
          onNavigateToMeals={() => {
            closeDailySummary();
            setActiveTab('diet');
          }}
        />
      )}

      {/* Knocked Out / Defeat Recovery Modal */}
      <KnockedOutModal
        isOpen={knockedOutModal?.isOpen}
        onResurrect={resurrect}
      />

      {/* Mascot Celebration Modal */}
      <MascotCelebration
        isOpen={celebrationModal.isOpen}
        message={celebrationModal.message}
        bonusXP={celebrationModal.bonusXP}
        onClose={() => setCelebrationModal({ ...celebrationModal, isOpen: false })}
      />

      {/* Fast Food Trap Penalty Modal */}
      <TrapPenaltyModal
        isOpen={trapModal.isOpen}
        xpDeducted={trapModal.xpDeducted}
        onAcceptRecovery={() => setActiveTab('quests')}
        onClose={() => setTrapModal({ ...trapModal, isOpen: false })}
      />

      {/* Level Up Banner Modal */}
      {levelUpModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl text-center space-y-3">
            <div className="p-3.5 bg-[#FACC15]/20 text-[#b45309] rounded-2xl inline-block">
              <Trophy size={36} />
            </div>
            <h3 className="font-pixel text-base text-[#0F172A] font-bold">LEVEL UP ACHIEVED!</h3>
            <p className="text-xs text-[#64748B] font-sans-app leading-relaxed">
              You have attained <strong>Level {levelUpModal.newLevel}</strong>! Your stamina reserves and energy expand!
            </p>
            <button
              type="button"
              onClick={() => setLevelUpModal({ ...levelUpModal, isOpen: false })}
              className="w-full py-3 bg-[#8B7CFF] hover:bg-[#7C3AED] text-white font-pixel text-xs rounded-2xl font-bold shadow-md shadow-[#8B7CFF]/20 cursor-pointer"
            >
              CONTINUE ONWARD
            </button>
          </div>
        </div>
      )}

      {/* Character Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-[#64748B] hover:text-[#0F172A] p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="font-pixel text-sm text-[#0F172A] mb-4 font-bold">ADVENTURER ATTRIBUTES</h3>

            <div className="space-y-4 text-xs font-sans-app">
              {/* Recalibrate AI Quiz Banner */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="font-pixel text-[10px] text-[#8B7CFF] flex items-center gap-1.5 font-bold">
                    <Sparkles size={12} /> ONBOARDING QUIZ & AI PLAN
                  </div>
                  <div className="text-[10px] text-[#64748B] mt-0.5">
                    Recalibrate biometrics, food preferences & meal quests
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setReQuizStep(1);
                    setIsReQuizOpen(true);
                  }}
                  className="px-3 py-1.5 bg-[#8B7CFF] hover:bg-[#7C3AED] text-white font-pixel text-[9px] rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  RE-CALIBRATE
                </button>
              </div>

              <div>
                <label className="block text-[#64748B] font-pixel text-[10px] mb-1 font-bold">FITNESS GOAL</label>
                <select
                  value={user.user_goal}
                  onChange={(e) => updateProfile({ user_goal: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 text-[#0F172A] outline-none font-sans-app"
                >
                  <option value="weight_loss">Weight Loss (Caloric Deficit Mode)</option>
                  <option value="weight_gain">Weight Gain (Caloric Surplus Mode)</option>
                  <option value="weight_maintenance">Weight Maintenance (Equilibrium Mode)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#64748B] font-pixel text-[10px] mb-1 font-bold">DIETARY PREFERENCE</label>
                <select
                  value={user.diet_type}
                  onChange={(e) => updateProfile({ diet_type: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 text-[#0F172A] outline-none font-sans-app"
                >
                  <option value="Balanced">Balanced</option>
                  <option value="Keto">Keto</option>
                  <option value="Intermittent Fasting">Intermittent Fasting</option>
                  <option value="Vegetarian">Vegetarian</option>
                </select>
              </div>

              {/* Food preferences preview */}
              <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200 space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Liked Foods:</span>
                  <span className="text-[#8B7CFF] font-mono-app font-bold">
                    {user.liked_foods?.length ? user.liked_foods.join(', ') : 'None specified'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Excluded Dislikes:</span>
                  <span className="text-[#FF6B6B] font-mono-app font-bold">
                    {user.disliked_foods?.length ? user.disliked_foods.join(', ') : 'None'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2.5 bg-[#8B7CFF] hover:bg-[#7C3AED] text-white font-pixel text-[10px] rounded-xl cursor-pointer font-bold shadow-sm"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Status Notification Toast */}
      {statusNotification && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 z-50 max-w-sm p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xl animate-in slide-in-from-bottom-5 duration-200 flex items-center gap-2.5">
          <Sparkles size={16} className="text-[#8B7CFF] shrink-0" />
          <span className="text-xs text-[#0F172A] font-sans-app font-medium">
            {statusNotification.message}
          </span>
        </div>
      )}
    </div>
  );
};

export default AppNavigator;
