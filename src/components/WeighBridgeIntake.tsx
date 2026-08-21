import React, { useState, useEffect } from 'react';
import { Commodity, WeighIntakeBill, Currency } from '../types';
import confetti from 'canvas-confetti';
import { 
  Scale, ShieldCheck, CheckCircle2, RefreshCw, Zap, Printer, 
  Smartphone, Banknote, UserCheck, Droplets, Award, FileText, Check, AlertTriangle
} from 'lucide-react';

interface WeighBridgeIntakeProps {
  commodities: Commodity[];
  currency: Currency;
  preSelectedCommodity?: Commodity | null;
  onIntakeCompleted: (bill: WeighIntakeBill) => void;
  onViewVoucher: (bill: WeighIntakeBill) => void;
}

export const WeighBridgeIntake: React.FC<WeighBridgeIntakeProps> = ({
  commodities,
  currency,
  preSelectedCommodity,
  onIntakeCompleted,
  onViewVoucher,
}) => {
  // Form State
  const [farmerName, setFarmerName] = useState<string>('Pa Momoh Koroma');
  const [farmerPhone, setFarmerPhone] = useState<string>('078-449-210');
  const [farmerLocation, setFarmerLocation] = useState<string>('Tikonko Chiefdom, Bo District');
  const [cooperativeName, setCooperativeName] = useState<string>('Southern Farmers Cocoa Union');
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(
    preSelectedCommodity ? preSelectedCommodity.id : (commodities[0]?.id || 'cocoa-g1')
  );

  // Digital Scale State
  const [bagCount, setBagCount] = useState<number>(20);
  const [tarePerBagKg, setTarePerBagKg] = useState<number>(2.0); // standard jute bag weight
  const [grossWeightKg, setGrossWeightKg] = useState<number>(1320.0);
  const [isScaleLocked, setIsScaleLocked] = useState<boolean>(true);
  const [isSimulatingScale, setIsSimulatingScale] = useState<boolean>(false);

  // Quality & Moisture testing
  const [moisturePercent, setMoisturePercent] = useState<number>(7.1);
  const [beanCount100g, setBeanCount100g] = useState<number>(95);
  const [defectsObserved, setDefectsObserved] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash at Depot Desk' | 'Orange Money' | 'Africell Money' | 'Bank Transfer'>('Cash at Depot Desk');
  const [scaleOperator, setScaleOperator] = useState<string>('Ibrahim Mourtada (Depot Manager)');

  // Selected commodity object
  const currentCommodity = commodities.find(c => c.id === selectedCommodityId) || commodities[0];

  useEffect(() => {
    if (preSelectedCommodity) {
      setSelectedCommodityId(preSelectedCommodity.id);
      // Auto-set typical gross weight
      const defaultGross = bagCount * preSelectedCommodity.standardBagWeightKg + bagCount * 2.0;
      setGrossWeightKg(defaultGross);
    }
  }, [preSelectedCommodity]);

  // Scale simulation jitter
  const triggerSimulatedScaleReading = () => {
    setIsSimulatingScale(true);
    setIsScaleLocked(false);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      const randomOffset = (Math.random() - 0.5) * 8;
      const base = bagCount * currentCommodity.standardBagWeightKg + bagCount * tarePerBagKg;
      setGrossWeightKg(Number((base + randomOffset).toFixed(1)));
      if (count > 8) {
        clearInterval(interval);
        setIsSimulatingScale(false);
        setIsScaleLocked(true);
      }
    }, 120);
  };

  // Math Calculations
  const totalTareWeightKg = Number((bagCount * tarePerBagKg).toFixed(1));
  const netWeightKg = Math.max(0, Number((grossWeightKg - totalTareWeightKg).toFixed(1)));
  
  // Quality adjustments
  const isMoistureOptimal = moisturePercent <= currentCommodity.moistureThreshold;
  const qualityPremiumPercent = isMoistureOptimal && moisturePercent <= currentCommodity.moistureThreshold - 0.3 ? 2.0 : 0.0;
  const defectDeductionPercent = !isMoistureOptimal 
    ? Math.min(15, Number(((moisturePercent - currentCommodity.moistureThreshold) * 2.5).toFixed(1)))
    : defectsObserved.length * 1.5;

  const netAdjustmentPercent = qualityPremiumPercent - defectDeductionPercent;
  const basePricePerKg = currentCommodity.spotPriceNLe;
  const subtotalNLe = Number((netWeightKg * basePricePerKg).toFixed(2));
  const netPayableNLe = Number((subtotalNLe * (1 + netAdjustmentPercent / 100)).toFixed(2));
  const netPayableUSD = Number((netPayableNLe / 22.7).toFixed(2));

  // Handle Form Submission / Bill Creation
  const handleCompleteIntake = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const randomSerial = Math.floor(10000 + Math.random() * 90000);
    const newBill: WeighIntakeBill = {
      id: `MT-BILL-${Date.now().toString().slice(-8)}`,
      farmerName,
      farmerPhone,
      farmerLocation,
      cooperativeName: cooperativeName || undefined,
      commodityId: currentCommodity.id,
      commodityName: currentCommodity.name,
      grade: currentCommodity.grade,
      grossWeightKg,
      tareWeightKg: totalTareWeightKg,
      netWeightKg,
      bagCount,
      moisturePercent,
      defectDeductionPercent,
      qualityPremiumPercent,
      pricePerKgNLe: basePricePerKg,
      subtotalNLe,
      netPayableNLe,
      paymentMethod,
      paymentStatus: 'Paid & Settled',
      timestamp,
      scaleOperator,
      depotAddress: '23 Prince Williams Street, Bo City',
      receiptNumber: `REC-MT-${randomSerial}`,
    };

    // Confetti celebration for the farmer
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24']
      });
    } catch {
      // ignore
    }

    onIntakeCompleted(newBill);
    onViewVoucher(newBill);
  };

  const toggleDefect = (defect: string) => {
    if (defectsObserved.includes(defect)) {
      setDefectsObserved(defectsObserved.filter(d => d !== defect));
    } else {
      setDefectsObserved([...defectsObserved, defect]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              "Honesty is our Concern"
            </span>
            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Digital Platform Scale #1 Active
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#111827] mt-1">
            Farmer Produce Delivery & Digital Scale Weigh-Bridge
          </h2>
          <p className="text-xs md:text-sm text-[#4B5563]">
            Intake Terminal at 23 Prince Williams Street, Bo City. Calibrated digital weighing with zero hidden cuts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-[#6B7280] font-mono uppercase block">Scale Attendant</span>
            <span className="text-xs font-bold text-[#111827]">{scaleOperator}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleCompleteIntake} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (7 cols): Scale Reading + Farmer Details + Quality Test */}
        <div className="lg:col-span-7 space-y-6">
          {/* DIGITAL SCALE TERMINAL DISPLAY */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#2563EB]" />
                <span className="text-xs font-mono font-bold text-[#111827] uppercase tracking-wider">
                  BO DEPOT ELECTRONIC WEIGHING TERMINAL (HEAVY DUTY 3000KG)
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                isScaleLocked ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {isScaleLocked ? 'WEIGHT STABILIZED' : 'READING LIVE...'}
              </span>
            </div>

            {/* LCD Big Display */}
            <div className="mt-4 bg-[#F9FAFB] rounded-xl p-4 md:p-6 border border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {/* Gross */}
              <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] shadow-sm">
                <span className="text-[11px] text-[#6B7280] font-mono uppercase block">1. Gross Scale Weight</span>
                <div className="text-2xl md:text-3xl font-bold font-mono text-[#2563EB] tracking-tight mt-1">
                  {grossWeightKg.toFixed(1)} <span className="text-xs text-[#6B7280]">KG</span>
                </div>
                <span className="text-[10px] text-[#9CA3AF] font-mono">Bags + Produce</span>
              </div>

              {/* Tare */}
              <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] shadow-sm">
                <span className="text-[11px] text-[#6B7280] font-mono uppercase block">2. Tare Deduction ({bagCount} bags)</span>
                <div className="text-2xl md:text-3xl font-bold font-mono text-red-600 tracking-tight mt-1">
                  -{totalTareWeightKg.toFixed(1)} <span className="text-xs text-[#6B7280]">KG</span>
                </div>
                <span className="text-[10px] text-[#9CA3AF] font-mono">{tarePerBagKg}kg / jute bag tare</span>
              </div>

              {/* Net Payable Weight */}
              <div className="p-3 bg-green-50/70 rounded-lg border border-green-200 shadow-sm">
                <span className="text-[11px] text-green-800 font-mono uppercase font-bold block">3. True Net Weight</span>
                <div className="text-2xl md:text-3xl font-bold font-mono text-green-700 tracking-tight mt-1">
                  {netWeightKg.toFixed(1)} <span className="text-xs text-green-600">KG</span>
                </div>
                <span className="text-[10px] text-green-700/80 font-mono font-medium">Payable Commodity</span>
              </div>
            </div>

            {/* Scale Interaction Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerSimulatedScaleReading}
                  disabled={isSimulatingScale}
                  className="px-3 py-1.5 bg-white hover:bg-[#F9FAFB] text-[#374151] text-xs font-semibold rounded-lg border border-[#E5E7EB] shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingScale ? 'animate-spin text-[#2563EB]' : ''}`} />
                  <span>{isSimulatingScale ? 'Stabilizing Scale...' : 'Simulate Scale Weigh'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsScaleLocked(!isScaleLocked)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border shadow-sm transition-colors ${
                    isScaleLocked
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-[#2563EB] text-white font-semibold border-transparent'
                  }`}
                >
                  {isScaleLocked ? 'Scale Locked' : 'Lock Reading'}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#6B7280] font-mono">
                <span>Manual Adjust Gross:</span>
                <input
                  type="number"
                  step="0.5"
                  value={grossWeightKg}
                  onChange={(e) => setGrossWeightKg(Math.max(0, Number(e.target.value)))}
                  className="w-24 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-2 py-1 text-xs text-[#111827] font-bold text-right focus:outline-none focus:border-[#2563EB] focus:bg-white"
                />
                <span>Kg</span>
              </div>
            </div>
          </div>

          {/* Section 1: Farmer & Cooperative Details */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-tight flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#2563EB]" />
                Farmer & Supply Lot Information
              </h3>
              <span className="text-[11px] text-[#2563EB] font-semibold font-mono">"Farmers Friend"</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">
                  Farmer / Trader Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Pa Momoh Koroma"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-medium text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">
                  Phone Number (Orange / Africell) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  placeholder="e.g. 078-449-210"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono font-medium text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">
                  Village / Chiefdom / District
                </label>
                <input
                  type="text"
                  value={farmerLocation}
                  onChange={(e) => setFarmerLocation(e.target.value)}
                  placeholder="e.g. Tikonko Chiefdom, Bo District"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">
                  Cooperative Union (Optional)
                </label>
                <input
                  type="text"
                  value={cooperativeName}
                  onChange={(e) => setCooperativeName(e.target.value)}
                  placeholder="e.g. Southern Farmers Cocoa Union"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                />
              </div>
            </div>

            {/* Commodity & Bag specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E5E7EB]">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#374151] block mb-1">
                  Select Produce Commodity
                </label>
                <select
                  value={selectedCommodityId}
                  onChange={(e) => {
                    setSelectedCommodityId(e.target.value);
                    const sel = commodities.find(c => c.id === e.target.value);
                    if (sel) {
                      setGrossWeightKg(bagCount * sel.standardBagWeightKg + bagCount * tarePerBagKg);
                    }
                  }}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                >
                  {commodities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — NLe {c.spotPriceNLe.toFixed(2)} / kg
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">
                  Bag Count
                </label>
                <input
                  type="number"
                  min="1"
                  value={bagCount}
                  onChange={(e) => {
                    const cnt = Math.max(1, Number(e.target.value));
                    setBagCount(cnt);
                    setGrossWeightKg(cnt * currentCommodity.standardBagWeightKg + cnt * tarePerBagKg);
                  }}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Moisture Meter & Quality Inspection */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-tight flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#2563EB]" />
                Produce Quality & Moisture Test
              </h3>
              <span className="text-xs text-[#6B7280]">Standard &le; {currentCommodity.moistureThreshold}%</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#374151] mb-1">
                  <span>Moisture Meter Content:</span>
                  <span className={`font-mono font-bold ${isMoistureOptimal ? 'text-green-600' : 'text-red-600'}`}>
                    {moisturePercent.toFixed(1)}% {isMoistureOptimal ? '— Optimal Dry Quality' : '— Elevated Moisture'}
                  </span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="15.0"
                  step="0.1"
                  value={moisturePercent}
                  onChange={(e) => setMoisturePercent(Number(e.target.value))}
                  className="w-full accent-[#2563EB] cursor-pointer"
                />
              </div>

              {/* Defect Check Pills */}
              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1.5">
                  Visual Cut-Test Observations (Select if present):
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'None (Clean Lot)',
                    'Slaty Beans (>3%)',
                    'Moldy Beans (>3%)',
                    'Insect Damaged',
                    'Flat / Immature Beans',
                    'Smoky / Off-flavor'
                  ].map((defect) => {
                    const isSelected = defect === 'None (Clean Lot)' 
                      ? defectsObserved.length === 0 
                      : defectsObserved.includes(defect);

                    return (
                      <button
                        type="button"
                        key={defect}
                        onClick={() => {
                          if (defect === 'None (Clean Lot)') {
                            setDefectsObserved([]);
                          } else {
                            toggleDefect(defect);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                          isSelected
                            ? defect === 'None (Clean Lot)'
                              ? 'bg-green-50 text-green-700 border-green-200 shadow-sm'
                              : 'bg-red-50 text-red-700 border-red-200 shadow-sm'
                            : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] hover:bg-[#F3F4F6]'
                        }`}
                      >
                        {defect}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col (5 cols): "Honesty is our Concern" Transparent Voucher Ledger */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4 relative">
            {/* Slogan Banner */}
            <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#2563EB] uppercase font-bold tracking-widest block">
                  TRANSPARENCY GUARANTEE
                </span>
                <span className="text-sm font-bold text-[#111827]">
                  "Honesty is our Concern"
                </span>
              </div>
              <Award className="w-6 h-6 text-[#2563EB] shrink-0" />
            </div>

            {/* Price Breakdown Line by Line */}
            <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB] space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-[#6B7280] pb-1.5 border-b border-[#E5E7EB]">
                <span>Commodity Lot:</span>
                <span className="text-[#111827] font-bold">{currentCommodity.name}</span>
              </div>

              <div className="flex justify-between text-[#6B7280]">
                <span>Scale Gross Weight:</span>
                <span className="text-[#111827] font-semibold">{grossWeightKg.toFixed(1)} Kg</span>
              </div>

              <div className="flex justify-between text-[#6B7280]">
                <span>Tare Deduction ({bagCount} Bags):</span>
                <span className="text-red-600 font-semibold">-{totalTareWeightKg.toFixed(1)} Kg</span>
              </div>

              <div className="flex justify-between text-[#111827] font-bold bg-white p-2 rounded-lg border border-[#E5E7EB] shadow-sm">
                <span>Payable Net Weight:</span>
                <span className="text-green-600 font-bold">{netWeightKg.toFixed(1)} Kg</span>
              </div>

              <div className="flex justify-between text-[#6B7280]">
                <span>Certified Spot Rate / Kg:</span>
                <span className="text-[#111827] font-bold">NLe {basePricePerKg.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[#6B7280]">
                <span>Base Subtotal:</span>
                <span className="text-[#374151] font-semibold">NLe {subtotalNLe.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              {/* Bonus / Deduction */}
              {qualityPremiumPercent > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>+ Quality Moisture Bonus (+{qualityPremiumPercent}%):</span>
                  <span>+NLe {(subtotalNLe * (qualityPremiumPercent / 100)).toFixed(2)}</span>
                </div>
              )}

              {defectDeductionPercent > 0 && (
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>- Moisture / Defect Adj (-{defectDeductionPercent}%):</span>
                  <span>-NLe {(subtotalNLe * (defectDeductionPercent / 100)).toFixed(2)}</span>
                </div>
              )}

              {/* Big Final Payout */}
              <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold uppercase text-[#111827] block font-sans">
                    Total Cash Payout:
                  </span>
                  <span className="text-[10px] text-[#6B7280]">Same-day settlement</span>
                </div>

                <div className="text-right">
                  <div className="text-xl md:text-2xl font-bold text-green-600">
                    NLe {netPayableNLe.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-[#6B7280] font-mono">
                    &asymp; ${netPayableUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#374151] block">
                Select Farmer Payout Channel
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Cash at Depot Desk', label: 'Cash at Desk', icon: Banknote },
                  { id: 'Orange Money', label: 'Orange Money', icon: Smartphone },
                  { id: 'Africell Money', label: 'Africell Money', icon: Smartphone },
                  { id: 'Bank Transfer', label: 'Bank Transfer', icon: ShieldCheck },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2 rounded-lg border text-left text-xs font-semibold flex items-center gap-2 transition-colors ${
                        isSelected
                          ? 'bg-blue-50 border-[#2563EB] text-[#2563EB] font-bold shadow-sm'
                          : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#2563EB]" />
                      <span className="truncate">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-colors"
              id="complete-weighin-btn"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Complete Weigh-In & Print Voucher</span>
            </button>

            <div className="text-center text-[11px] text-[#6B7280]">
              Official intake voucher will be generated with verification QR code and depot stamp.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
