import React from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { PixelIcon } from '../../components/Mascot/PixelMascot.jsx';
import InventoryItem from '../../components/Cards/InventoryItem.jsx';
import { ShoppingBag, Sparkles, Trophy, Shield, Pizza, Tent, Zap } from 'lucide-react';

export const LootStoreScreen = () => {
  const { stats, inventory, storeCatalog, buyStoreItem, useItem } = useGame();

  const inventoryList = [
    {
      id: 'speed_potion',
      name: 'Speed Potion',
      count: inventory.speedPotions || 0,
      icon: 'potion',
      description: 'Drink 15 mins before a meal with 500 mL water. Curbs hunger and grants +50 XP instant reward.',
      effect: '+50 XP, +500 mL water'
    },
    {
      id: 'shield_barrier',
      name: 'Aegis Shield',
      count: inventory.shields || 0,
      icon: 'shield',
      description: 'Pre-logging or prepping a meal activates a 6-hour shield barrier against caloric & junk food damage.',
      effect: '6 hours immunity',
      isBuffActive: stats.active_shield_until && new Date(stats.active_shield_until) > new Date()
    },
    {
      id: 'cheat_meal_pass',
      name: 'Cheat Meal Pass',
      count: inventory.cheatMealPasses || 0,
      icon: 'gold',
      description: 'Allows one controlled off-plan meal without deducting HP or triggering fast food traps.',
      effect: 'Guilt-free feast'
    },
    {
      id: 'rest_day_pass',
      name: 'Rest Day Pass',
      count: inventory.restDayPasses || 0,
      icon: 'energy',
      description: 'Exempts you from side quests for 24 hours while preserving your active 1.5x streak multiplier.',
      effect: '24h streak freeze',
      isBuffActive: stats.active_rest_day_until && new Date(stats.active_rest_day_until) > new Date()
    }
  ];

  return (
    <div className="space-y-6 pb-8 max-w-5xl mx-auto animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-pixel text-base sm:text-lg text-[#1E293B] font-bold">REDEEMABLE LOOT STORE</h1>
            <span className="text-[10px] font-pixel px-2.5 py-0.5 rounded-full bg-[#8B7CFF]/15 text-[#8B7CFF]">
              XP BAZAAR
            </span>
          </div>
          <p className="text-xs text-[#64748B] font-sans-app mt-1">
            Exchange your hard-earned quest XP for consumables, streak shields, and cheat passes
          </p>
        </div>

        {/* Current Available XP */}
        <div className="bg-[#F0F4F9] border border-slate-200 rounded-2xl px-4 py-2.5 flex items-center gap-3">
          <div className="p-2 bg-[#FACC15]/20 rounded-xl text-[#b45309]">
            <Trophy size={20} />
          </div>
          <div>
            <span className="text-[10px] font-pixel text-[#64748B] block">AVAILABLE XP TREASURE</span>
            <span className="font-pixel text-sm text-[#8B7CFF] font-bold">
              {(stats.xp_total || 0).toLocaleString()} <span className="text-xs">XP</span>
            </span>
          </div>
        </div>
      </div>

      {/* Store Catalog Items Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-pixel text-xs text-[#1E293B] flex items-center gap-1.5 font-bold">
            <ShoppingBag size={14} className="text-[#8B7CFF]" />
            <span>AVAILABLE STORE GOODS</span>
          </h3>
          <span className="text-[10px] text-[#64748B] font-mono-app">Purchased with Quest XP</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {storeCatalog.map((item) => {
            const canAfford = (stats.xp_total || 0) >= item.costXP;

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-100 hover:border-[#8B7CFF]/30 rounded-3xl p-5 shadow-sm flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-[#F0F4F9] border border-slate-200 rounded-2xl flex items-center justify-center p-2">
                        <PixelIcon name={item.icon} size={24} />
                      </div>
                      <div>
                        <h4 className="font-pixel text-xs text-[#1E293B] font-bold">{item.name}</h4>
                        <span className="text-[10px] text-[#64748B] font-mono-app uppercase">
                          Type: {item.type}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-pixel text-xs text-[#b45309] block font-bold">
                        {item.costXP} XP
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B] font-sans-app leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => buyStoreItem(item.id)}
                    className={`w-full py-2.5 px-3 rounded-2xl font-pixel text-[10px] transition-all flex items-center justify-center gap-2 font-bold ${
                      canAfford
                        ? 'bg-[#FACC15] text-[#1E293B] shadow-sm hover:brightness-105 active:scale-95 cursor-pointer'
                        : 'bg-slate-100 text-[#94A3B8] border border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles size={13} />
                    <span>{canAfford ? `ACQUIRE FOR ${item.costXP} XP` : 'NEED MORE XP'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adventurer Backpack / Active Inventory */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-pixel text-xs text-[#1E293B] flex items-center gap-1.5 font-bold">
            <Shield size={14} className="text-[#4ADE80]" />
            <span>ADVENTURER BACKPACK ({inventoryList.reduce((acc, i) => acc + i.count, 0)} ITEMS)</span>
          </h3>
          <span className="text-[10px] text-[#64748B] font-mono-app">Ready for deployment</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {inventoryList.map((item) => (
            <InventoryItem
              key={item.id}
              item={item}
              onUse={useItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LootStoreScreen;
