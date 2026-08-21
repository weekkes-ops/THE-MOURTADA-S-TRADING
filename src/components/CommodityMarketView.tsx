import React, { useState } from 'react';
import { Commodity, Currency, PriceAlert } from '../types';
import { 
  TrendingUp, TrendingDown, Scale, Sparkles, Calculator, 
  CheckCircle2, AlertCircle, Info, ChevronRight, Layers, Flame, ArrowUpRight,
  Bell, BellRing
} from 'lucide-react';
import { PriceAlertModal } from './PriceAlertModal';

interface CommodityMarketViewProps {
  commodities: Commodity[];
  currency: Currency;
  onSelectCommodityForScale: (c: Commodity) => void;
  onInspectWithAI: (c: Commodity) => void;
  onOpenBooking: () => void;
  alerts?: PriceAlert[];
  onAddAlert?: (newAlert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  onToggleAlert?: (id: string) => void;
  onDeleteAlert?: (id: string) => void;
  onTestNotification?: (commodity: Commodity, targetPrice: number, condition: 'ABOVE' | 'BELOW') => void;
  notificationPermission?: NotificationPermission;
  onRequestPermission?: () => void;
}

export const CommodityMarketView: React.FC<CommodityMarketViewProps> = ({
  commodities,
  currency,
  onSelectCommodityForScale,
  onInspectWithAI,
  onOpenBooking,
  alerts = [],
  onAddAlert = () => {},
  onToggleAlert = () => {},
  onDeleteAlert = () => {},
  onTestNotification = () => {},
  notificationPermission = 'default',
  onRequestPermission = () => {},
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCommodityModal, setSelectedCommodityModal] = useState<Commodity | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [alertTargetCommodity, setAlertTargetCommodity] = useState<Commodity | null>(null);

  // Quick Calculator State
  const [calcCommodityId, setCalcCommodityId] = useState<string>(commodities[0]?.id || 'cocoa-g1');
  const [calcInputType, setCalcInputType] = useState<'bags' | 'kg'>('bags');
  const [calcQuantity, setCalcQuantity] = useState<number>(10);
  const [calcMoisture, setCalcMoisture] = useState<number>(7.2);

  const categories = ['All', 'Cocoa', 'Coffee', 'Grains & Oilseeds', 'Nuts & Spices'];

  const filteredCommodities = selectedCategory === 'All'
    ? commodities
    : commodities.filter(c => c.category === selectedCategory);

  // Active calculator commodity
  const currentCalcCommodity = commodities.find(c => c.id === calcCommodityId) || commodities[0];
  const weightKg = calcInputType === 'bags'
    ? calcQuantity * currentCalcCommodity.standardBagWeightKg
    : calcQuantity;
  
  // Calculate quality adjustments
  const isMoistureOptimal = calcMoisture <= currentCalcCommodity.moistureThreshold;
  const moisturePenalty = !isMoistureOptimal ? Math.min(15, (calcMoisture - currentCalcCommodity.moistureThreshold) * 2.5) : 0;
  const qualityBonus = isMoistureOptimal && calcMoisture <= currentCalcCommodity.moistureThreshold - 0.5 ? 2 : 0;
  const netAdjustment = qualityBonus - moisturePenalty;
  
  const basePricePerKg = currentCalcCommodity.spotPriceNLe;
  const adjustedPricePerKg = basePricePerKg * (1 + netAdjustment / 100);
  const totalSubtotalNLe = weightKg * basePricePerKg;
  const totalPayoutNLe = weightKg * adjustedPricePerKg;
  const totalPayoutUSD = totalPayoutNLe / 22.7;

  const activeAlertsCount = alerts.filter(a => a.active).length;

  const openAlertForCommodity = (item: Commodity) => {
    setAlertTargetCommodity(item);
    setIsAlertModalOpen(true);
  };

  // Mini Sparkline SVG generator
  const renderSparkline = (points: number[], isUp: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 120;
    const height = 36;
    const padding = 4;

    const pathD = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((val - min) / range) * (height - padding * 2) - padding;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor = isUp ? '#16A34A' : '#DC2626';
    const fillColor = isUp ? 'rgba(22, 163, 74, 0.08)' : 'rgba(220, 38, 38, 0.08)';

    const areaD = `${pathD} L ${width - padding} ${height} L ${padding} ${height} Z`;

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path d={areaD} fill={fillColor} />
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero Overview Header */}
      <div className="relative overflow-hidden rounded-xl bg-white border border-[#E5E7EB] p-6 md:p-8 shadow-sm">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-[#2563EB]" />
              Bo City Produce Buying Session Active
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
              Real-Time Produce Spot Exchange & Fair Price Terminal
            </h2>
            <p className="text-sm text-[#4B5563] max-w-2xl leading-relaxed">
              Transparent, certified digital scale purchasing for farmers, cooperatives, and produce brokers across Bo, Kenema, Kailahun, and Southern Province. Guaranteed same-day cash & mobile money settlements.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs md:text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 active:scale-95 transition-colors"
                id="lock-spot-rate-btn"
              >
                <span>Lock Spot Rate & Book Drop-Off</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setAlertTargetCommodity(null);
                  setIsAlertModalOpen(true);
                }}
                className="px-4 py-2.5 bg-white hover:bg-[#F9FAFB] text-[#2563EB] border border-[#E5E7EB] text-xs md:text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 active:scale-95 transition-colors"
                id="manage-price-alerts-btn"
              >
                <Bell className="w-4 h-4 text-[#2563EB]" />
                <span>Push Price Alerts</span>
                {activeAlertsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#2563EB] text-white text-[10px] font-bold">
                    {activeAlertsCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 text-xs text-[#6B7280] pl-1">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Zero Hidden Fees • 100% Calibrated Scale Honesty</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="grid grid-cols-2 gap-3 bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
            <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] shadow-sm">
              <span className="text-[11px] text-[#6B7280] font-medium uppercase block">Main Crop Grade 1 Cocoa</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold font-mono text-[#111827]">
                  {currency === 'NLe' ? 'NLe 146.50' : '$6.45'}
                </span>
                <span className="text-[10px] text-[#6B7280]">/kg</span>
              </div>
              <span className="text-[10px] text-green-600 font-semibold font-mono">+2.23% Today</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] shadow-sm">
              <span className="text-[11px] text-[#6B7280] font-medium uppercase block">24h Bo Intake Volume</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold font-mono text-[#111827]">7,160</span>
                <span className="text-[10px] text-[#6B7280]">Bags</span>
              </div>
              <span className="text-[10px] text-[#6B7280] font-medium font-mono">~458.2 Metric Tons</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] shadow-sm col-span-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#6B7280] uppercase font-medium">Depot Scale Location</span>
                <span className="text-xs font-semibold text-[#111827] block">23 Prince Williams St, Bo City</span>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 rounded-md">
                OPEN 7:00 AM - 7:00 PM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Commodity Cards + Live Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Category Tabs and Commodity Cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
            <div className="flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'bg-white text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB] border border-[#E5E7EB] shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setAlertTargetCommodity(null);
                setIsAlertModalOpen(true);
              }}
              className="text-xs text-[#2563EB] hover:underline font-semibold flex items-center gap-1 shrink-0 px-2"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Set Alert Threshold</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCommodities.map((item) => {
              const isUp = item.change24h >= 0;
              const formattedPrice = currency === 'NLe' ? `NLe ${item.spotPriceNLe.toFixed(2)}` : `$${item.spotPriceUSD.toFixed(2)}`;
              const perBagNLe = item.spotPriceNLe * item.standardBagWeightKg;
              const formattedPerBag = currency === 'NLe' ? `NLe ${perBagNLe.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : `$${(perBagNLe / 22.7).toFixed(1)}`;
              const itemAlerts = alerts.filter(a => a.commodityId === item.id && a.active);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#E5E7EB] hover:border-blue-300 p-5 transition-all duration-200 flex flex-col justify-between group shadow-sm"
                  id={`commodity-card-${item.id}`}
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                            {item.category}
                          </span>
                          <span className="text-[10px] font-semibold text-blue-700 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100">
                            {item.grade}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#111827] mt-1.5 group-hover:text-[#2563EB] transition-colors">
                          {item.name}
                        </h3>
                      </div>

                      {/* Sparkline */}
                      <div className="shrink-0 pt-1">
                        {renderSparkline(item.sparkline, isUp)}
                      </div>
                    </div>

                    {/* Price and 24h delta */}
                    <div className="mt-3 flex items-baseline justify-between border-y border-[#E5E7EB] py-2.5">
                      <div>
                        <span className="text-[10px] text-[#6B7280] block font-mono">Spot Rate per Kg</span>
                        <div className="text-xl font-bold font-mono text-[#111827]">
                          {formattedPrice}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[#6B7280] block font-mono">Per {item.standardBagWeightKg}kg Bag</span>
                        <div className="text-sm font-semibold font-mono text-[#374151]">
                          {formattedPerBag}
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-flex items-center text-xs font-mono font-bold px-2 py-1 rounded ${
                            isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                          {isUp ? '+' : ''}{item.change24hPercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    {/* Specs / Moisture details */}
                    <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] text-[#6B7280] font-mono">
                      <div>
                        <span className="text-[#9CA3AF]">Max Moisture:</span>{' '}
                        <span className="text-[#374151] font-semibold">{item.moistureThreshold}%</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#9CA3AF]">24h Vol:</span>{' '}
                        <span className="text-[#374151] font-semibold">{item.volumeBags24h.toLocaleString()} bags</span>
                      </div>
                    </div>

                    {/* Active Alert indicator if configured */}
                    {itemAlerts.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] bg-blue-50/70 border border-blue-100 text-[#2563EB] px-2.5 py-1 rounded-lg">
                        <BellRing className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          Alert active: {itemAlerts.map(a => `${a.condition === 'ABOVE' ? '≥' : '≤'} ${a.currency} ${a.targetPrice.toFixed(2)}`).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center gap-2">
                    <button
                      onClick={() => onSelectCommodityForScale(item)}
                      className="flex-1 py-2 px-3 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                      title="Direct scale intake for this produce"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Weigh In</span>
                    </button>

                    <button
                      onClick={() => openAlertForCommodity(item)}
                      className="py-2 px-2.5 bg-white hover:bg-[#F9FAFB] text-[#2563EB] text-xs font-semibold rounded-lg border border-[#E5E7EB] shadow-sm flex items-center gap-1 transition-colors"
                      title="Set Push Notification Price Threshold Alert"
                    >
                      <Bell className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span className="hidden sm:inline">Alert</span>
                    </button>

                    <button
                      onClick={() => onInspectWithAI(item)}
                      className="py-2 px-2.5 bg-white hover:bg-[#F9FAFB] text-[#2563EB] text-xs font-semibold rounded-lg border border-[#E5E7EB] shadow-sm flex items-center gap-1 transition-colors"
                      title="AI Quality Grading & Moisture Inspection"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span className="hidden sm:inline">AI Check</span>
                    </button>

                    <button
                      onClick={() => setSelectedCommodityModal(item)}
                      className="p-2 bg-white hover:bg-[#F9FAFB] text-[#6B7280] hover:text-[#111827] rounded-lg border border-[#E5E7EB] shadow-sm transition-colors"
                      title="View Lot Specifications"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Real-time Lot Payout Calculator */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827] uppercase tracking-tight">
                    Instant Lot Payout Calculator
                  </h3>
                  <span className="text-[11px] text-[#6B7280]">"Honesty is our Concern" Instant Estimate</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3.5">
              {/* Select Commodity */}
              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">
                  Select Produce
                </label>
                <select
                  value={calcCommodityId}
                  onChange={(e) => setCalcCommodityId(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                >
                  {commodities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({currency === 'NLe' ? `NLe ${c.spotPriceNLe.toFixed(2)}` : `$${c.spotPriceUSD.toFixed(2)}`}/kg)
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit Toggle & Quantity Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#374151]">
                    Quantity Lot Size
                  </label>
                  <div className="flex text-[11px] bg-[#F3F4F6] rounded-lg border border-[#E5E7EB] p-0.5">
                    <button
                      onClick={() => setCalcInputType('bags')}
                      className={`px-2 py-0.5 rounded-md font-semibold ${
                        calcInputType === 'bags' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280]'
                      }`}
                    >
                      Bags ({currentCalcCommodity.standardBagWeightKg}kg)
                    </button>
                    <button
                      onClick={() => setCalcInputType('kg')}
                      className={`px-2 py-0.5 rounded-md font-semibold ${
                        calcInputType === 'kg' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280]'
                      }`}
                    >
                      Total Kg
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm font-mono font-bold text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#6B7280] font-mono">
                    = {weightKg.toLocaleString()} Kg Net
                  </span>
                </div>
              </div>

              {/* Moisture Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#374151] mb-1">
                  <span>Moisture Content Meter:</span>
                  <span className={`font-mono font-bold ${isMoistureOptimal ? 'text-green-600' : 'text-amber-600'}`}>
                    {calcMoisture.toFixed(1)}% {isMoistureOptimal ? '(Optimal)' : '(High Moisture)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="16.0"
                  step="0.1"
                  value={calcMoisture}
                  onChange={(e) => setCalcMoisture(Number(e.target.value))}
                  className="w-full accent-[#2563EB] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#9CA3AF] font-mono mt-0.5">
                  <span>5.0% (Extra Dry)</span>
                  <span>Standard &le; {currentCalcCommodity.moistureThreshold}%</span>
                  <span>16.0% (Wet)</span>
                </div>
              </div>

              {/* Calculation Summary Box */}
              <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB] space-y-2">
                <div className="flex justify-between text-xs text-[#6B7280] font-mono">
                  <span>Gross Lot Weight:</span>
                  <span className="text-[#111827] font-semibold">{weightKg} Kg</span>
                </div>
                <div className="flex justify-between text-xs text-[#6B7280] font-mono">
                  <span>Base Spot Rate:</span>
                  <span className="text-[#111827] font-semibold">NLe {basePricePerKg.toFixed(2)}/kg</span>
                </div>
                {netAdjustment !== 0 && (
                  <div className="flex justify-between text-xs font-mono">
                    <span className={netAdjustment > 0 ? 'text-green-600' : 'text-red-600'}>
                      {netAdjustment > 0 ? '+ Low Moisture Bonus:' : '- Wet Lot Deduction:'}
                    </span>
                    <span className={netAdjustment > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {netAdjustment > 0 ? '+' : ''}{netAdjustment.toFixed(1)}%
                    </span>
                  </div>
                )}
                
                <div className="pt-2 border-t border-[#E5E7EB] flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-[#111827] uppercase block">Total Net Cash Payout:</span>
                    <span className="text-[10px] text-[#6B7280] font-mono">Immediate payout at Bo Depot</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg md:text-xl font-bold font-mono text-green-600">
                      NLe {totalPayoutNLe.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-[#6B7280] font-mono">
                      &asymp; ${totalPayoutUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onSelectCommodityForScale(currentCalcCommodity)}
                className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-colors"
              >
                <Scale className="w-4 h-4" />
                <span>Open Digital Scale with this Lot</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Commodity Specifications Modal */}
      {selectedCommodityModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-100">
                  {selectedCommodityModal.category} • {selectedCommodityModal.grade}
                </span>
                <h3 className="text-xl font-bold text-[#111827] mt-1">
                  {selectedCommodityModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCommodityModal(null)}
                className="text-[#9CA3AF] hover:text-[#111827] text-lg font-bold p-1"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-[#4B5563] leading-relaxed">
              {selectedCommodityModal.description}
            </p>

            <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Spot Rate (Bo City Depot):</span>
                <span className="text-[#111827] font-bold">NLe {selectedCommodityModal.spotPriceNLe.toFixed(2)}/kg (${selectedCommodityModal.spotPriceUSD.toFixed(2)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">24h Day Range:</span>
                <span className="text-[#374151]">NLe {selectedCommodityModal.low24h.toFixed(2)} - NLe {selectedCommodityModal.high24h.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Standard Bag Packing:</span>
                <span className="text-[#374151]">{selectedCommodityModal.standardBagWeightKg} Kg Jute/Poly Bag</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Quality Moisture Limit:</span>
                <span className="text-green-700 font-bold">&le; {selectedCommodityModal.moistureThreshold}% Moisture</span>
              </div>
            </div>

            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-xs text-[#1E40AF]">
              <span className="font-bold block mb-0.5">Seasonal & Quality Note:</span>
              <p>{selectedCommodityModal.seasonalNotes}</p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  const comm = selectedCommodityModal;
                  setSelectedCommodityModal(null);
                  onSelectCommodityForScale(comm);
                }}
                className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <Scale className="w-4 h-4" />
                <span>Start Weigh-In Intake</span>
              </button>
              <button
                onClick={() => {
                  const comm = selectedCommodityModal;
                  setSelectedCommodityModal(null);
                  openAlertForCommodity(comm);
                }}
                className="px-3.5 py-2.5 bg-white hover:bg-[#F9FAFB] text-[#2563EB] text-xs font-semibold rounded-lg border border-[#E5E7EB] shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span>Set Alert</span>
              </button>
              <button
                onClick={() => {
                  const comm = selectedCommodityModal;
                  setSelectedCommodityModal(null);
                  onInspectWithAI(comm);
                }}
                className="px-4 py-2.5 bg-white hover:bg-[#F9FAFB] text-[#2563EB] text-xs font-semibold rounded-lg border border-[#E5E7EB] shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Grade</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Push Notification Price Alert Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => {
          setIsAlertModalOpen(false);
          setAlertTargetCommodity(null);
        }}
        commodities={commodities}
        currency={currency}
        preSelectedCommodity={alertTargetCommodity}
        alerts={alerts}
        onAddAlert={onAddAlert}
        onToggleAlert={onToggleAlert}
        onDeleteAlert={onDeleteAlert}
        onTestNotification={onTestNotification}
        notificationPermission={notificationPermission}
        onRequestPermission={onRequestPermission}
      />
    </div>
  );
};

