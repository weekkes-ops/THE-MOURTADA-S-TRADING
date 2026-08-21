import React, { useState } from 'react';
import { WeighIntakeBill, Currency } from '../types';
import { Award, Search, UserCheck, Phone, MapPin, Eye, FileText, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

interface FarmerLedgerProps {
  bills: WeighIntakeBill[];
  currency: Currency;
  onViewVoucher: (bill: WeighIntakeBill) => void;
  onQuickIntake: () => void;
}

export const FarmerLedger: React.FC<FarmerLedgerProps> = ({
  bills,
  currency,
  onViewVoucher,
  onQuickIntake,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmerDetail, setSelectedFarmerDetail] = useState<string | null>(null);

  const filteredBills = bills.filter(
    (b) =>
      b.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.farmerPhone.includes(searchTerm) ||
      b.farmerLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.commodityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCumulativePayoutNLe = bills.reduce((acc, b) => acc + b.netPayableNLe, 0);
  const totalCumulativeNetKg = bills.reduce((acc, b) => acc + b.netWeightKg, 0);

  interface FarmerStat {
    totalKg: number;
    totalNLe: number;
    deliveries: number;
    phone: string;
    location: string;
  }

  const farmerStatsMap: Record<string, FarmerStat> = bills.reduce((acc: Record<string, FarmerStat>, b) => {
    if (!acc[b.farmerName]) {
      acc[b.farmerName] = {
        totalKg: 0,
        totalNLe: 0,
        deliveries: 0,
        phone: b.farmerPhone,
        location: b.farmerLocation,
      };
    }
    acc[b.farmerName].totalKg += b.netWeightKg;
    acc[b.farmerName].totalNLe += b.netPayableNLe;
    acc[b.farmerName].deliveries += 1;
    return acc;
  }, {});

  const uniqueFarmers = Object.entries(farmerStatsMap).map(([name, stat]) => ({
    name,
    totalKg: stat.totalKg,
    totalNLe: stat.totalNLe,
    deliveries: stat.deliveries,
    phone: stat.phone,
    location: stat.location,
    tier: stat.totalKg > 2000 ? 'Gold Partner' : stat.totalKg > 500 ? 'Silver Partner' : 'Bronze Member',
  }));

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center gap-1.5 shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#2563EB]" />
              "Farmers Friend" Loyalty Ledger
            </span>
            <span className="text-xs text-[#6B7280] font-mono">
              The Mourtada's Trading • 23 Prince Williams St
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#111827] mt-1.5">
            Farmer Delivery History & Transparent Payout Ledger
          </h2>
          <p className="text-xs md:text-sm text-[#4B5563]">
            Every kilo weighed, moisture tested, and paid in full. Instant digital archive for cooperatives and individual growers.
          </p>
        </div>

        <button
          onClick={onQuickIntake}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs md:text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          + Record New Farmer Delivery
        </button>
      </div>

      {/* Top 3 Quick Aggregates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
          <span className="text-[11px] text-[#6B7280] uppercase font-mono block">Total Farmer Payouts Settled</span>
          <div className="text-xl md:text-2xl font-bold font-mono text-green-600 mt-1">
            NLe {totalCumulativePayoutNLe.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#6B7280] font-mono">
            &asymp; ${(totalCumulativePayoutNLe / 22.7).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
          <span className="text-[11px] text-[#6B7280] uppercase font-mono block">Total Net Commodity Weighed</span>
          <div className="text-xl md:text-2xl font-bold font-mono text-[#111827] mt-1">
            {totalCumulativeNetKg.toLocaleString()} <span className="text-xs text-[#6B7280]">KG</span>
          </div>
          <span className="text-[11px] text-[#6B7280] font-mono">
            ~{(totalCumulativeNetKg / 1000).toFixed(2)} Metric Tons
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
          <span className="text-[11px] text-[#6B7280] uppercase font-mono block">Registered "Farmers Friend" Partners</span>
          <div className="text-xl md:text-2xl font-bold font-mono text-[#2563EB] mt-1">
            {uniqueFarmers.length} <span className="text-xs text-[#6B7280]">Active Suppliers</span>
          </div>
          <span className="text-[11px] text-[#6B7280] font-mono">
            Across Bo, Kenema & Kailahun
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by farmer name, phone number, village, commodity, or receipt #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-2 text-xs font-medium text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-2 text-xs text-[#6B7280] hover:text-[#111827] bg-[#F3F4F6] rounded-lg"
            >
              Clear
            </button>
          )}
        </div>

        {/* Bills Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-mono text-[10px] uppercase border-b border-[#E5E7EB]">
              <tr>
                <th className="p-3">Weigh-Bill #</th>
                <th className="p-3">Farmer & Location</th>
                <th className="p-3">Commodity</th>
                <th className="p-3 text-center">Bags</th>
                <th className="p-3 text-right">Net Weight (Kg)</th>
                <th className="p-3 text-right">Rate / Kg</th>
                <th className="p-3 text-right">Net Payout</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] font-mono">
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="p-3">
                      <span className="font-bold text-[#2563EB] block">{bill.receiptNumber}</span>
                      <span className="text-[10px] text-[#6B7280] font-sans">{bill.timestamp}</span>
                    </td>
                    <td className="p-3 font-sans">
                      <span className="font-bold text-[#111827] block">{bill.farmerName}</span>
                      <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-[#9CA3AF]" />
                        {bill.farmerLocation}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[#111827] font-semibold block">{bill.commodityName}</span>
                      <span className="text-[10px] text-[#6B7280]">Moisture: {bill.moisturePercent}%</span>
                    </td>
                    <td className="p-3 text-center font-semibold text-[#374151]">{bill.bagCount}</td>
                    <td className="p-3 text-right font-bold text-green-600">{bill.netWeightKg.toFixed(1)}</td>
                    <td className="p-3 text-right text-[#4B5563]">NLe {bill.pricePerKgNLe.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-[#111827] text-sm">
                      NLe {bill.netPayableNLe.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200">
                        {bill.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onViewVoucher(bill)}
                        className="px-2.5 py-1 bg-white hover:bg-[#F9FAFB] text-[#2563EB] text-xs font-semibold rounded-md border border-[#E5E7EB] inline-flex items-center gap-1 shadow-xs transition-colors"
                        title="View & Print Official Slip"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Slip</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#6B7280]">
                    No intake records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* "Farmers Friend" Top Producer Spotlight */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#111827] uppercase tracking-tight flex items-center gap-2">
          <Award className="w-4 h-4 text-[#2563EB]" />
          "Farmers Friend" Preferred Supplier Rankings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {uniqueFarmers.map((f, idx) => (
            <div key={idx} className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-[#111827] block">{f.name}</span>
                  <span className="text-[10px] text-[#6B7280]">{f.location}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase bg-blue-50 text-[#2563EB] border border-blue-100">
                  {f.tier}
                </span>
              </div>

              <div className="pt-2 border-t border-[#E5E7EB] flex justify-between items-baseline font-mono text-xs">
                <span className="text-[#6B7280]">Total Supplied:</span>
                <span className="text-green-600 font-bold">{f.totalKg.toLocaleString()} Kg</span>
              </div>

              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-[#6B7280]">Total Earnings:</span>
                <span className="text-[#111827] font-bold">NLe {f.totalNLe.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
