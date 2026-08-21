import React from 'react';
import { Commodity, Currency } from '../types';
import { TrendingUp, TrendingDown, Radio } from 'lucide-react';

interface LiveTickerBarProps {
  commodities: Commodity[];
  currency: Currency;
  onSelectCommodity: (c: Commodity) => void;
}

export const LiveTickerBar: React.FC<LiveTickerBarProps> = ({
  commodities,
  currency,
  onSelectCommodity,
}) => {
  return (
    <div className="bg-white border-b border-[#E5E7EB] py-2 overflow-hidden select-none relative group shadow-sm">
      {/* Live Badge indicator */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-3.5 bg-white border-r border-[#E5E7EB]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB]">
          <Radio className="w-3.5 h-3.5 text-green-500 animate-pulse" />
          <span className="font-mono tracking-tight uppercase text-[11px] font-semibold text-[#111827]">BO TICKS</span>
        </div>
      </div>

      {/* Marquee Content */}
      <div className="pl-32 overflow-hidden">
        <div className="animate-marquee flex items-center space-x-4">
          {commodities.concat(commodities).map((item, idx) => {
            const isUp = item.change24h >= 0;
            const price = currency === 'NLe' ? `NLe ${item.spotPriceNLe.toFixed(2)}` : `$${item.spotPriceUSD.toFixed(2)}`;
            const change = currency === 'NLe' ? `${isUp ? '+' : ''}${item.change24h.toFixed(2)}` : `${isUp ? '+' : ''}${(item.change24h / 22.7).toFixed(2)}`;

            return (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => onSelectCommodity(item)}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[#F9FAFB] hover:bg-[#F3F4F6] rounded-lg border border-[#E5E7EB] cursor-pointer transition-colors shrink-0 shadow-sm"
              >
                <span className="text-xs font-semibold text-[#374151]">{item.name}</span>
                <span className="font-mono text-xs font-bold text-[#111827]">{price}</span>
                <span
                  className={`inline-flex items-center text-[11px] font-mono font-bold ${
                    isUp ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {change} ({item.change24hPercent > 0 ? '+' : ''}{item.change24hPercent.toFixed(2)}%)
                </span>
                <span className="text-[10px] text-[#6B7280] font-mono">
                  {item.volumeBags24h.toLocaleString()} bags
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
