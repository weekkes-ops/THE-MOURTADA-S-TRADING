import React, { useState } from 'react';
import { Commodity, ScheduledDropOff, Currency } from '../types';
import { Calendar, Clock, Lock, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Truck, AlertCircle } from 'lucide-react';

interface MarketplaceOrderBookProps {
  commodities: Commodity[];
  currency: Currency;
  onBookDropOff: (dropOff: ScheduledDropOff) => void;
}

export const MarketplaceOrderBook: React.FC<MarketplaceOrderBookProps> = ({
  commodities,
  currency,
  onBookDropOff,
}) => {
  const [farmerName, setFarmerName] = useState('Chief Brima Conteh');
  const [farmerPhone, setFarmerPhone] = useState('076-882-911');
  const [selectedCommodityId, setSelectedCommodityId] = useState(commodities[0]?.id || 'cocoa-g1');
  const [estimatedBags, setEstimatedBags] = useState(35);
  const [scheduledDate, setScheduledDate] = useState('Tomorrow (08:30 AM)');
  const [transportType, setTransportType] = useState<'Pickup Truck' | 'Motorcycle (Okada)' | 'Heavy Truck' | 'Hand Delivery'>('Pickup Truck');
  const [isSuccess, setIsSuccess] = useState(false);

  const currentCommodity = commodities.find(c => c.id === selectedCommodityId) || commodities[0];
  const lockedRateNLe = currentCommodity.spotPriceNLe;
  const estimatedKg = estimatedBags * currentCommodity.standardBagWeightKg;
  const estimatedPayoutNLe = estimatedKg * lockedRateNLe;

  const [activeBookings, setActiveBookings] = useState<ScheduledDropOff[]>([
    {
      id: 'BK-BO-901',
      farmerName: 'Cooperative Union Baoma',
      farmerPhone: '077-334-112',
      commodityId: 'cocoa-g1',
      commodityName: 'Cocoa Beans (Grade 1 Export)',
      estimatedBags: 80,
      estimatedWeightKg: 5120,
      lockedPricePerKgNLe: 146.50,
      scheduledDate: 'Today, 2:30 PM',
      transportType: 'Heavy Truck',
      status: 'Confirmed',
    },
    {
      id: 'BK-BO-902',
      farmerName: 'Sahr Yamba',
      farmerPhone: '078-901-443',
      commodityId: 'coffee-robusta',
      commodityName: 'Robusta Coffee (Clean Screen 18)',
      estimatedBags: 25,
      estimatedWeightKg: 1500,
      lockedPricePerKgNLe: 98.00,
      scheduledDate: 'Tomorrow, 9:00 AM',
      transportType: 'Pickup Truck',
      status: 'Confirmed',
    }
  ]);

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: ScheduledDropOff = {
      id: `BK-BO-${Math.floor(100 + Math.random() * 900)}`,
      farmerName,
      farmerPhone,
      commodityId: currentCommodity.id,
      commodityName: currentCommodity.name,
      estimatedBags,
      estimatedWeightKg: estimatedKg,
      lockedPricePerKgNLe: lockedRateNLe,
      scheduledDate,
      transportType,
      status: 'Confirmed',
    };

    setActiveBookings([newBooking, ...activeBookings]);
    onBookDropOff(newBooking);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center gap-1.5 shadow-xs">
              <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
              Depot Forward Price Lock
            </span>
            <span className="text-xs text-[#6B7280]">
              Guaranteed Spot Buying Rates for Scheduled Lots
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#111827] mt-1.5">
            Book Produce Drop-Off & Lock Spot Rate
          </h2>
          <p className="text-xs md:text-sm text-[#4B5563]">
            Secure priority scale weighing slot at 23 Prince Williams Street, Bo City. Lock today's peak spot prices before transporting your harvest.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (5 cols): Booking Form */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleSubmitBooking} className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              Lock Today's Rate & Schedule Delivery
            </h3>

            {isSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Drop-off appointment confirmed! Scale slot reserved at Bo depot.</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[#374151] block mb-1">
                Farmer / Cooperative Representative
              </label>
              <input
                type="text"
                required
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-medium text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">
                  Produce
                </label>
                <select
                  value={selectedCommodityId}
                  onChange={(e) => setSelectedCommodityId(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                >
                  {commodities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">
                  Estimated Bags
                </label>
                <input
                  type="number"
                  min="1"
                  value={estimatedBags}
                  onChange={(e) => setEstimatedBags(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">
                  Arrival Slot
                </label>
                <select
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                >
                  <option value="Today (2:00 PM - 5:00 PM)">Today (2:00 PM - 5:00 PM)</option>
                  <option value="Tomorrow (08:00 AM - 11:00 AM)">Tomorrow (08:00 AM - 11:00 AM)</option>
                  <option value="Tomorrow (01:00 PM - 4:00 PM)">Tomorrow (01:00 PM - 4:00 PM)</option>
                  <option value="Saturday (Morning Slot)">Saturday (Morning Slot)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#374151] block mb-1">
                Transport Vehicle Mode
              </label>
              <select
                value={transportType}
                onChange={(e) => setTransportType(e.target.value as any)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
              >
                <option value="Pickup Truck">Pickup Truck (Toyota Hilux / Canter)</option>
                <option value="Heavy Truck">Heavy Truck (10-wheeler / Trailer)</option>
                <option value="Motorcycle (Okada)">Motorcycle (Okada carrier bags)</option>
                <option value="Hand Delivery">Hand Delivery / Wheelbarrow</option>
              </select>
            </div>

            {/* Price Lock Preview Box */}
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[#6B7280]">
                <span>Locked Spot Rate:</span>
                <span className="text-[#2563EB] font-bold">NLe {lockedRateNLe.toFixed(2)}/kg</span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span>Estimated Lot Weight:</span>
                <span className="text-[#111827]">{estimatedKg.toLocaleString()} Kg</span>
              </div>
              <div className="pt-2 border-t border-blue-200 flex justify-between items-baseline">
                <span className="text-xs font-semibold text-[#1E40AF] font-sans">Guaranteed Value:</span>
                <span className="text-green-700 font-bold text-sm">
                  NLe {estimatedPayoutNLe.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
            >
              Lock Spot Price & Reserve Scale Slot
            </button>
          </form>
        </div>

        {/* Right Col (7 cols): Active Orderbook & Scheduled Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                Active Bo Depot Scale Reservation Queue
              </h3>
              <span className="text-xs text-[#6B7280] font-mono">
                {activeBookings.length} Scheduled Deliveries
              </span>
            </div>

            <div className="space-y-3">
              {activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] space-y-2 hover:border-blue-200 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#111827]">{booking.farmerName}</span>
                        <span className="text-[10px] font-mono font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {booking.id}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B7280]">{booking.commodityName}</span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200">
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E5E7EB] text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-[#6B7280] uppercase block">Lot Size</span>
                      <span className="text-[#111827] font-semibold">{booking.estimatedBags} Bags ({booking.estimatedWeightKg}kg)</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#6B7280] uppercase block">Locked Rate</span>
                      <span className="text-[#2563EB] font-bold">NLe {booking.lockedPricePerKgNLe.toFixed(2)}/kg</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#6B7280] uppercase block">Arrival Slot</span>
                      <span className="text-[#111827] font-semibold">{booking.scheduledDate}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#6B7280] uppercase block">Transport</span>
                      <span className="text-[#4B5563]">{booking.transportType}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
