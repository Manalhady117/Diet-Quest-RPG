import React from 'react';
import { PixelIcon } from '../Mascot/PixelMascot.jsx';
import { Sparkles, Check } from 'lucide-react';

export const InventoryItem = ({ item, onUse, isUsing = false }) => {
  const { id, name, count = 0, icon, description, effect, isBuffActive = false } = item;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between hover:border-[#8B7CFF]/30 transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#F0F4F9] border border-slate-200 rounded-2xl flex items-center justify-center p-2">
              <PixelIcon name={icon || (id.includes('shield') ? 'shield' : id.includes('potion') ? 'potion' : 'gold')} size={22} />
            </div>
            <div>
              <h4 className="font-pixel text-[11px] text-[#1E293B] leading-snug font-bold">{name}</h4>
              <span className="text-[10px] text-[#64748B] font-mono-app">Stock: <strong className="text-[#8B7CFF]">{count}</strong></span>
            </div>
          </div>

          {isBuffActive && (
            <span className="text-[9px] font-pixel text-[#16a34a] bg-[#4ADE80]/15 px-2.5 py-0.5 rounded-full font-bold">
              ACTIVE
            </span>
          )}
        </div>

        <p className="text-xs text-[#64748B] font-sans-app leading-relaxed mb-3">
          {description}
        </p>
      </div>

      {/* Action */}
      <div className="pt-2 border-t border-slate-100">
        <button
          disabled={count <= 0 || isUsing}
          onClick={() => onUse(id)}
          className={`w-full py-2.5 px-3 rounded-2xl font-pixel text-[10px] transition-all flex items-center justify-center gap-1.5 font-bold ${
            count > 0
              ? 'bg-[#8B7CFF] hover:brightness-105 text-white shadow-sm active:scale-95 cursor-pointer'
              : 'bg-slate-100 text-[#94A3B8] cursor-not-allowed'
          }`}
        >
          {count > 0 ? (
            <>
              <Sparkles size={11} />
              <span>USE / ACTIVATE</span>
            </>
          ) : (
            <span>OUT OF STOCK</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default InventoryItem;
