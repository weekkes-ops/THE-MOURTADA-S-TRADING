import React, { useState, useEffect } from 'react';
import { WeighIntakeBill, Commodity } from '../types';
import { ShieldCheck, X, Save, Scale, AlertCircle, CheckCircle2, User, Phone, MapPin, Calculator } from 'lucide-react';

interface AdminRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecord: (bill: WeighIntakeBill, isNew: boolean) => void;
  editingBill: WeighIntakeBill | null;
  commodities: Commodity[];
}

export const AdminRecordModal: React.FC<AdminRecordModalProps> = ({
  isOpen,
  onClose,
  onSaveRecord,
  editingBill,
  commodities,
}) => {
  const isNew = !editingBill;

  const [receiptNumber, setReceiptNumber] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerLocation, setFarmerLocation] = useState('');
  const [cooperativeName, setCooperativeName] = useState('');
  const [commodityId, setCommodityId] = useState('cocoa-g1');
  const [grade, setGrade] = useState('Grade 1');
  const [bagCount, setBagCount] = useState<number>(10);
  const [grossWeightKg, setGrossWeightKg] = useState<number>(650);
  const [tareWeightKg, setTareWeightKg] = useState<number>(10);
  const [moisturePercent, setMoisturePercent] = useState<number>(7.2);
  const [pricePerKgNLe, setPricePerKgNLe] = useState<number>(142.5);
  const [qualityPremiumPercent, setQualityPremiumPercent] = useState<number>(0);
  const [defectDeductionPercent, setDefectDeductionPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<WeighIntakeBill['paymentMethod']>('Cash at Depot Desk');
  const [paymentStatus, setPaymentStatus] = useState<WeighIntakeBill['paymentStatus']>('Paid & Settled');
  const [scaleOperator, setScaleOperator] = useState('I. Mourtada (Depot Manager)');
  const [timestamp, setTimestamp] = useState('');

  // Reset or fill form when editingBill or isOpen changes
  useEffect(() => {
    if (editingBill) {
      setReceiptNumber(editingBill.receiptNumber);
      setFarmerName(editingBill.farmerName);
      setFarmerPhone(editingBill.farmerPhone);
      setFarmerLocation(editingBill.farmerLocation);
      setCooperativeName(editingBill.cooperativeName || '');
      setCommodityId(editingBill.commodityId);
      setGrade(editingBill.grade);
      setBagCount(editingBill.bagCount);
      setGrossWeightKg(editingBill.grossWeightKg);
      setTareWeightKg(editingBill.tareWeightKg);
      setMoisturePercent(editingBill.moisturePercent);
      setPricePerKgNLe(editingBill.pricePerKgNLe);
      setQualityPremiumPercent(editingBill.qualityPremiumPercent);
      setDefectDeductionPercent(editingBill.defectDeductionPercent);
      setPaymentMethod(editingBill.paymentMethod);
      setPaymentStatus(editingBill.paymentStatus);
      setScaleOperator(editingBill.scaleOperator);
      setTimestamp(editingBill.timestamp);
    } else {
      // Initialize new record
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      setReceiptNumber(`BO-${randomDigits}`);
      setFarmerName('');
      setFarmerPhone('07');
      setFarmerLocation('Bo District');
      setCooperativeName('');
      const defaultComm = commodities[0] || { id: 'cocoa-g1', name: 'Cocoa Beans (Grade 1)', spotPriceNLe: 142.5 };
      setCommodityId(defaultComm.id);
      setGrade('Grade 1');
      setBagCount(10);
      setGrossWeightKg(650);
      setTareWeightKg(10);
      setMoisturePercent(7.2);
      setPricePerKgNLe(defaultComm.spotPriceNLe || 142.5);
      setQualityPremiumPercent(0);
      setDefectDeductionPercent(0);
      setPaymentMethod('Cash at Depot Desk');
      setPaymentStatus('Paid & Settled');
      setScaleOperator('I. Mourtada (Depot Manager)');
      setTimestamp(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [editingBill, isOpen, commodities]);

  if (!isOpen) return null;

  const currentCommodityObj = commodities.find((c) => c.id === commodityId) || commodities[0];
  const commodityName = currentCommodityObj?.name || 'Cocoa Beans (Grade 1)';

  // Calculate live values
  const netWeightKg = Math.max(0, Number((grossWeightKg - tareWeightKg).toFixed(1)));
  const subtotalNLe = Number((netWeightKg * pricePerKgNLe).toFixed(2));
  const premiumAdjustment = subtotalNLe * (qualityPremiumPercent / 100);
  const deductionAdjustment = subtotalNLe * (defectDeductionPercent / 100);
  const netPayableNLe = Number(Math.max(0, subtotalNLe + premiumAdjustment - deductionAdjustment).toFixed(2));
  const netPayableUSD = Number((netPayableNLe / 22.7).toFixed(2));

  const handleCommodityChange = (id: string) => {
    setCommodityId(id);
    const found = commodities.find((c) => c.id === id);
    if (found) {
      setPricePerKgNLe(found.spotPriceNLe);
      setGrade(found.grade || 'Grade 1');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim()) {
      alert('Please enter a farmer or vendor name.');
      return;
    }
    if (netWeightKg <= 0) {
      alert('Gross weight must be greater than tare weight.');
      return;
    }

    const billRecord: WeighIntakeBill = {
      id: editingBill?.id || `bill-${Date.now()}`,
      receiptNumber: receiptNumber.trim() || `BO-${Date.now().toString().slice(-4)}`,
      farmerName: farmerName.trim(),
      farmerPhone: farmerPhone.trim() || '070-000000',
      farmerLocation: farmerLocation.trim() || 'Bo District',
      cooperativeName: cooperativeName.trim() || undefined,
      commodityId,
      commodityName,
      grade,
      bagCount: Number(bagCount) || 1,
      grossWeightKg: Number(grossWeightKg),
      tareWeightKg: Number(tareWeightKg),
      netWeightKg,
      moisturePercent: Number(moisturePercent),
      defectDeductionPercent: Number(defectDeductionPercent),
      qualityPremiumPercent: Number(qualityPremiumPercent),
      pricePerKgNLe: Number(pricePerKgNLe),
      subtotalNLe,
      netPayableNLe,
      paymentMethod,
      paymentStatus,
      timestamp: timestamp || new Date().toLocaleString(),
      scaleOperator: scaleOperator.trim() || 'I. Mourtada',
      depotAddress: '23 Prince Williams Street, Bo City',
    };

    onSaveRecord(billRecord, isNew);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#F9FAFB] px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827] tracking-tight">
                {isNew ? 'Add New Weigh-Bill Record (Admin Intake)' : `Edit Intake Record #${receiptNumber}`}
              </h3>
              <p className="text-xs text-[#6B7280]">
                Official ledger bookkeeping & audit record management • The Mourtada's Trading Bo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B7280] hover:text-[#111827] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Section 1: Farmer & Ticket Details */}
          <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] space-y-3">
            <span className="text-xs font-bold text-[#111827] uppercase tracking-wider block">
              1. Farmer Particulars & Receipt Info
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Receipt Number</label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#2563EB] focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Farmer / Vendor Name *</label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Mohamed Sesay"
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Phone Contact</label>
                <input
                  type="text"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  placeholder="e.g. 076-123456"
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono text-[#111827] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Village / Chiefdom</label>
                <input
                  type="text"
                  value={farmerLocation}
                  onChange={(e) => setFarmerLocation(e.target.value)}
                  placeholder="e.g. Tikonko, Bo District"
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Cooperative (Optional)</label>
                <input
                  type="text"
                  value={cooperativeName}
                  onChange={(e) => setCooperativeName(e.target.value)}
                  placeholder="e.g. Kakua Farmers Union"
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Intake Timestamp</label>
                <input
                  type="text"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono text-[#4B5563] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Commodity & Measurements */}
          <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] space-y-3">
            <span className="text-xs font-bold text-[#111827] uppercase tracking-wider block">
              2. Commodity Produce & Calibrated Scale Weights
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#374151] block mb-1">Produce Commodity</label>
                <select
                  value={commodityId}
                  onChange={(e) => handleCommodityChange(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#2563EB]"
                >
                  {commodities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.grade}) — Spot: NLe {c.spotPriceNLe.toFixed(2)}/kg
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Produce Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="Grade 1">Grade 1 (Export Ready)</option>
                  <option value="Grade 2">Grade 2 (Fair Average)</option>
                  <option value="Standard">Standard Commercial</option>
                  <option value="Premium">Premium Hand-Sorted</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Bag Count</label>
                <input
                  type="number"
                  min="1"
                  value={bagCount}
                  onChange={(e) => setBagCount(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#111827] focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Gross Scale Weight (Kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={grossWeightKg}
                  onChange={(e) => setGrossWeightKg(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#111827] focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Tare Bag Weight (Kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={tareWeightKg}
                  onChange={(e) => setTareWeightKg(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono text-red-600 font-bold focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">True Net Weight (Kg)</label>
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-green-700">
                  {netWeightKg.toFixed(1)} Kg Net
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Moisture Level (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="3.0"
                  max="25.0"
                  value={moisturePercent}
                  onChange={(e) => setMoisturePercent(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#111827] focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pricing, Adjustments & Settlements */}
          <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] space-y-3">
            <span className="text-xs font-bold text-[#111827] uppercase tracking-wider block">
              3. Rate per Kg, Quality Adjustments & Payout Settlement
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Base Buying Rate (NLe / Kg)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  value={pricePerKgNLe}
                  onChange={(e) => setPricePerKgNLe(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#2563EB] focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Quality Premium (+%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="25"
                  value={qualityPremiumPercent}
                  onChange={(e) => setQualityPremiumPercent(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono text-green-600 font-bold focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Defect / Moisture Deduction (-%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="35"
                  value={defectDeductionPercent}
                  onChange={(e) => setDefectDeductionPercent(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono text-red-600 font-bold focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as WeighIntakeBill['paymentMethod'])}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="Cash at Depot Desk">Cash at Depot Desk</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="Africell Money">Africell Money</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as WeighIntakeBill['paymentStatus'])}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="Paid & Settled">Paid & Settled</option>
                  <option value="Ready for Cashier">Ready for Cashier</option>
                  <option value="Processing">Processing</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">Scale Operator Attendant</label>
                <input
                  type="text"
                  value={scaleOperator}
                  onChange={(e) => setScaleOperator(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>
            </div>

            {/* Payout Calculation Display Box */}
            <div className="mt-3 bg-white p-4 rounded-xl border border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
              <div className="space-y-0.5 text-xs text-[#6B7280]">
                <div>Subtotal: NLe {subtotalNLe.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                {qualityPremiumPercent > 0 && <div className="text-green-600">+ Premium: +NLe {premiumAdjustment.toFixed(2)}</div>}
                {defectDeductionPercent > 0 && <div className="text-red-600">- Deduction: -NLe {deductionAdjustment.toFixed(2)}</div>}
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#6B7280] uppercase block font-sans">Final Net Cash Payable</span>
                <div className="text-2xl font-bold text-green-600 font-mono">
                  NLe {netPayableNLe.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-[#6B7280]">
                  &asymp; ${netPayableUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </span>
              </div>
            </div>
          </div>

          {/* Buttons Footer inside form */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>"Honesty is our Concern" Calibrated Ledger</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-gray-50 border border-[#E5E7EB] text-xs font-semibold text-[#374151] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isNew ? 'Save & Add Record' : 'Save Record Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
