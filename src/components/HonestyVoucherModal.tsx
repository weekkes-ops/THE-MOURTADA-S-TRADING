import React from 'react';
import { WeighIntakeBill } from '../types';
import { Printer, Download, CheckCircle2, ShieldCheck, X, Share2, Phone, MapPin, Mail } from 'lucide-react';

interface HonestyVoucherModalProps {
  bill: WeighIntakeBill | null;
  onClose: () => void;
}

export const HonestyVoucherModal: React.FC<HonestyVoucherModalProps> = ({
  bill,
  onClose,
}) => {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summary = `THE MOURTADA'S TRADING (Produce Dealer - Bo City)
Weigh-Bill #${bill.receiptNumber}
Farmer: ${bill.farmerName} (${bill.farmerLocation})
Produce: ${bill.commodityName} (${bill.grade})
Bags: ${bill.bagCount} | Net Weight: ${bill.netWeightKg} Kg
Rate: NLe ${bill.pricePerKgNLe.toFixed(2)}/kg
TOTAL PAYOUT: NLe ${bill.netPayableNLe.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Paid via: ${bill.paymentMethod}
Address: 23 Prince Williams Street, Bo City
Phone: 072803080 / 077803080
"Honesty is our Concern"`;

    navigator.clipboard.writeText(summary);
    alert('Weigh-Bill summary copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-6">
        {/* Modal Top Actions */}
        <div className="bg-[#F9FAFB] px-6 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
            <ShieldCheck className="w-4 h-4" />
            <span>OFFICIAL CERTIFIED WEIGH-BILL & SETTLEMENT SLIP</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="p-1.5 rounded-lg bg-white hover:bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB] text-xs flex items-center gap-1 px-2.5 transition-colors shadow-xs"
              title="Copy slip summary"
            >
              <Share2 className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Copy</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 px-3 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#6B7280] hover:text-[#111827] p-1 text-lg font-bold ml-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Physical Slip Container */}
        <div id="printable-voucher" className="p-6 md:p-8 bg-white text-[#111827] font-sans space-y-6">
          {/* Slip Header matching Business Card */}
          <div className="border-b-2 border-dashed border-[#E5E7EB] pb-5 text-center relative">
            <div className="flex items-center justify-center gap-3 mb-2">
              {/* MT Logo Crest */}
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-[#2563EB] font-mono text-lg shadow-xs">
                MT
              </div>
              <div className="text-left">
                <h1 className="text-xl md:text-2xl font-bold text-[#111827] uppercase tracking-tight">
                  THE MOURTADA'S TRADING
                </h1>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB] uppercase">
                  <span>PRODUCE DEALER</span>
                  <span className="text-[#6B7280]">• "Farmers Friend"</span>
                </div>
              </div>
            </div>

            {/* Slogan Banner */}
            <div className="inline-block px-3 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-medium italic tracking-wide my-1">
              "Honesty is our Concern"
            </div>

            {/* Contact Details from Card */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[#6B7280] mt-2 font-mono">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#9CA3AF] inline" />
                23 Prince Williams Street, Bo City
              </span>
              <span className="flex items-center gap-1 text-[#111827] font-semibold">
                <Phone className="w-3 h-3 text-[#2563EB] inline" />
                072803080 / 077803080
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#9CA3AF] inline" />
                mourtadatrading@gmail.com
              </span>
            </div>
          </div>

          {/* Meta Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F9FAFB] p-3.5 rounded-xl border border-[#E5E7EB] text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#6B7280] uppercase block">Weigh-Bill No.</span>
              <span className="font-bold text-[#2563EB]">{bill.receiptNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6B7280] uppercase block">Scale Date & Time</span>
              <span className="font-semibold text-[#111827]">{bill.timestamp}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6B7280] uppercase block">Depot Scale Desk</span>
              <span className="font-semibold text-[#111827]">Scale #1 (Calibrated)</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6B7280] uppercase block">Weigh Attendant</span>
              <span className="font-semibold text-[#111827]">{bill.scaleOperator}</span>
            </div>
          </div>

          {/* Farmer & Cooperative Details */}
          <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] space-y-1 text-xs">
            <span className="text-[10px] text-[#6B7280] uppercase font-bold tracking-wider block mb-1">
              Farmer / Vendor Particulars
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
              <div>
                <span className="text-[#6B7280]">Farmer Name:</span>{' '}
                <span className="text-[#111827] font-bold text-sm">{bill.farmerName}</span>
              </div>
              <div>
                <span className="text-[#6B7280]">Phone Contact:</span>{' '}
                <span className="text-[#111827] font-semibold">{bill.farmerPhone}</span>
              </div>
              <div>
                <span className="text-[#6B7280]">Village / Chiefdom:</span>{' '}
                <span className="text-[#111827]">{bill.farmerLocation}</span>
              </div>
              {bill.cooperativeName && (
                <div>
                  <span className="text-[#6B7280]">Cooperative:</span>{' '}
                  <span className="text-[#2563EB] font-semibold">{bill.cooperativeName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Scale Measurements Table */}
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F9FAFB] text-[#6B7280] font-mono text-[11px] uppercase border-b border-[#E5E7EB]">
                <tr>
                  <th className="p-3">Commodity & Grade</th>
                  <th className="p-3 text-center">Bags</th>
                  <th className="p-3 text-right">Gross (Kg)</th>
                  <th className="p-3 text-right">Tare (Kg)</th>
                  <th className="p-3 text-right">True Net (Kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] font-mono">
                <tr>
                  <td className="p-3">
                    <span className="font-bold text-[#111827] block">{bill.commodityName}</span>
                    <span className="text-[10px] text-[#6B7280]">Moisture: {bill.moisturePercent}% • {bill.grade}</span>
                  </td>
                  <td className="p-3 text-center font-semibold text-[#374151]">{bill.bagCount}</td>
                  <td className="p-3 text-right text-[#4B5563]">{bill.grossWeightKg.toFixed(1)}</td>
                  <td className="p-3 text-right text-red-600">-{bill.tareWeightKg.toFixed(1)}</td>
                  <td className="p-3 text-right font-bold text-green-600 text-sm">{bill.netWeightKg.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown & Transparency Summary */}
          <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB] space-y-2 font-mono text-xs">
            <div className="flex justify-between text-[#6B7280]">
              <span>Spot Buying Rate per Kg:</span>
              <span className="text-[#2563EB] font-bold">NLe {bill.pricePerKgNLe.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-[#6B7280]">
              <span>Gross Subtotal ({bill.netWeightKg} kg &times; NLe {bill.pricePerKgNLe.toFixed(2)}):</span>
              <span className="text-[#111827] font-semibold">NLe {bill.subtotalNLe.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            {bill.qualityPremiumPercent > 0 && (
              <div className="flex justify-between text-green-700">
                <span>+ Optimal Moisture Quality Premium (+{bill.qualityPremiumPercent}%):</span>
                <span>+NLe {(bill.subtotalNLe * (bill.qualityPremiumPercent / 100)).toFixed(2)}</span>
              </div>
            )}

            {bill.defectDeductionPercent > 0 && (
              <div className="flex justify-between text-red-600">
                <span>- High Moisture / Defect Deduction (-{bill.defectDeductionPercent}%):</span>
                <span>-NLe {(bill.subtotalNLe * (bill.defectDeductionPercent / 100)).toFixed(2)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold uppercase text-[#111827] block font-sans">
                  TOTAL NET CASH SETTLEMENT:
                </span>
                <span className="text-[11px] text-green-700 font-semibold">
                  Status: {bill.paymentStatus} ({bill.paymentMethod})
                </span>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  NLe {bill.netPayableNLe.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-[#6B7280] font-mono">
                  &asymp; ${(bill.netPayableNLe / 22.7).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </div>
              </div>
            </div>
          </div>

          {/* Signatures & Stamp Footer */}
          <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-[#6B7280] uppercase block">Scale Attendant Signature</span>
              <div className="w-48 h-8 border-b border-[#9CA3AF] flex items-end pb-1 text-[#374151] italic font-serif">
                I. Mourtada (Depot Mgr)
              </div>
            </div>

            {/* Official Stamp Simulation */}
            <div className="p-2.5 rounded-xl border-2 border-dashed border-[#2563EB] text-[#2563EB] text-center font-bold rotate-[-2deg] shadow-xs">
              <div className="text-[9px] uppercase tracking-wider">THE MOURTADA'S TRADING</div>
              <div className="text-xs font-bold uppercase">BO CITY DEPOT • PAID</div>
              <div className="text-[8px] text-[#6B7280] font-mono">{bill.timestamp}</div>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] text-[#6B7280] uppercase block">Farmer / Vendor Acknowledgment</span>
              <div className="w-48 h-8 border-b border-[#9CA3AF] flex items-end justify-end pb-1 text-[#374151] italic">
                {bill.farmerName}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-[#F9FAFB] px-6 py-4 border-t border-[#E5E7EB] flex justify-between items-center">
          <span className="text-xs text-[#6B7280] font-mono">
            Receipt ID: {bill.id}
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB] text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Done & Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Bill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
