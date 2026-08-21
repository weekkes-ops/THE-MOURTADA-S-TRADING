import React, { useState } from 'react';
import { WeighIntakeBill, Currency, Commodity } from '../types';
import { 
  Award, 
  Search, 
  UserCheck, 
  Phone, 
  MapPin, 
  Eye, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Plus, 
  Edit3, 
  Trash2, 
  Printer, 
  FileSpreadsheet, 
  Lock, 
  Unlock, 
  Filter,
  RefreshCw,
  SlidersHorizontal,
  DollarSign,
  Scale
} from 'lucide-react';
import { SystemLogo } from './SystemLogo';
import { AdminRecordModal } from './AdminRecordModal';
import { exportFarmerLedgerToCSV } from '../utils/offlineStorage';

interface FarmerLedgerProps {
  bills: WeighIntakeBill[];
  currency: Currency;
  commodities: Commodity[];
  onViewVoucher: (bill: WeighIntakeBill) => void;
  onQuickIntake: () => void;
  onSaveRecord: (bill: WeighIntakeBill, isNew: boolean) => void;
  onDeleteRecord: (billId: string) => void;
  isOnline: boolean;
}

export const FarmerLedger: React.FC<FarmerLedgerProps> = ({
  bills,
  currency,
  commodities,
  onViewVoucher,
  onQuickIntake,
  onSaveRecord,
  onDeleteRecord,
  isOnline,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommodityFilter, setSelectedCommodityFilter] = useState<string>('ALL');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(true); // Admin record management enabled by default
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);
  const [editingBill, setEditingBill] = useState<WeighIntakeBill | null>(null);
  const [deletingBillId, setDeletingBillId] = useState<string | null>(null);
  const [exportToast, setExportToast] = useState<{ count: number; filename: string } | null>(null);

  // Filter bills by search term and commodity
  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      b.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.farmerPhone.includes(searchTerm) ||
      b.farmerLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.commodityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.cooperativeName && b.cooperativeName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCommodity =
      selectedCommodityFilter === 'ALL' || b.commodityId === selectedCommodityFilter;

    return matchesSearch && matchesCommodity;
  });

  const totalCumulativePayoutNLe = filteredBills.reduce((acc, b) => acc + b.netPayableNLe, 0);
  const totalCumulativeNetKg = filteredBills.reduce((acc, b) => acc + b.netWeightKg, 0);
  const totalBagCount = filteredBills.reduce((acc, b) => acc + b.bagCount, 0);

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

  // Handle CSV Export
  const handleExportCSV = () => {
    const res = exportFarmerLedgerToCSV(filteredBills);
    if (res.success) {
      setExportToast({ count: res.count, filename: res.filename });
      setTimeout(() => {
        setExportToast(null);
      }, 5000);
    } else {
      alert('No ledger records available to export.');
    }
  };

  // Handle Batch Print
  const handlePrintLedger = () => {
    window.print();
  };

  // Handle Edit Record
  const handleEdit = (bill: WeighIntakeBill) => {
    setEditingBill(bill);
    setIsRecordModalOpen(true);
  };

  // Handle Add Record
  const handleAddNew = () => {
    setEditingBill(null);
    setIsRecordModalOpen(true);
  };

  // Handle Delete Confirmation
  const confirmDelete = (billId: string) => {
    onDeleteRecord(billId);
    setDeletingBillId(null);
  };

  return (
    <div className="space-y-6">
      {/* CSV Export Success Toast */}
      {exportToast && (
        <div className="bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-white" />
            <div>
              <span className="font-bold text-xs">CSV Export Successful!</span>
              <p className="text-[11px] text-green-100">
                Downloaded {exportToast.count} intake records as <span className="font-mono font-bold text-white">{exportToast.filename}</span> for Excel & accounting reconciliation.
              </p>
            </div>
          </div>
          <button
            onClick={() => setExportToast(null)}
            className="text-green-200 hover:text-white text-xs font-bold px-2 py-1 bg-white/10 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Header Banner with System Logo */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <SystemLogo size="lg" className="shrink-0 drop-shadow-xs" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center gap-1.5 shadow-xs">
                <Award className="w-3.5 h-3.5 text-[#2563EB]" />
                "Farmers Friend" Loyalty & Audit Ledger
              </span>
              <span className="text-xs text-[#6B7280] font-mono">
                23 Prince Williams St, Bo City
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#111827] mt-1 tracking-tight">
              Produce Intake Ledger & Financial Record Management
            </h2>
            <p className="text-xs md:text-sm text-[#4B5563] max-w-2xl">
              Complete administrator oversight: Add, update, calculate, delete, print official slips, and export CSV files for external accounting.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Admin Mode Toggle */}
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              isAdminMode
                ? 'bg-blue-50 border-blue-200 text-[#2563EB]'
                : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]'
            }`}
            title="Toggle Admin Record Management Mode"
          >
            {isAdminMode ? <Unlock className="w-3.5 h-3.5 text-[#2563EB]" /> : <Lock className="w-3.5 h-3.5 text-[#6B7280]" />}
            <span>Admin Controls {isAdminMode ? 'Active' : 'Locked'}</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-[#F9FAFB] text-[#374151] border border-[#E5E7EB] text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            id="export-ledger-csv-btn"
            title="Download CSV for Excel / QuickBooks"
          >
            <Download className="w-3.5 h-3.5 text-green-600" />
            <span>Export CSV</span>
          </button>

          {/* Print Batch Ledger */}
          <button
            onClick={handlePrintLedger}
            className="px-3.5 py-2 bg-white hover:bg-[#F9FAFB] text-[#374151] border border-[#E5E7EB] text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            title="Print printable summary of current view"
          >
            <Printer className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="hidden sm:inline">Print Ledger</span>
          </button>

          {/* Add Record (Admin) */}
          {isAdminMode && (
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              id="admin-add-record-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Top 3 Quick Aggregates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
          <span className="text-[11px] text-[#6B7280] uppercase font-mono block">Filtered Payouts Settled</span>
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
            {totalCumulativeNetKg.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span className="text-xs text-[#6B7280]">KG</span>
          </div>
          <span className="text-[11px] text-[#6B7280] font-mono">
            ~{(totalCumulativeNetKg / 1000).toFixed(2)} Metric Tons
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
          <span className="text-[11px] text-[#6B7280] uppercase font-mono block">Total Intake Bags</span>
          <div className="text-xl md:text-2xl font-bold font-mono text-[#2563EB] mt-1">
            {totalBagCount.toLocaleString()} <span className="text-xs text-[#6B7280]">Bags</span>
          </div>
          <span className="text-[11px] text-[#6B7280] font-mono">
            Across {filteredBills.length} weigh-bills
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
          <span className="text-[11px] text-[#6B7280] uppercase font-mono block">"Farmers Friend" Partners</span>
          <div className="text-xl md:text-2xl font-bold font-mono text-[#111827] mt-1">
            {uniqueFarmers.length} <span className="text-xs text-[#6B7280]">Suppliers</span>
          </div>
          <span className="text-[11px] text-[#6B7280] font-mono">
            Bo, Kenema & Kailahun Districts
          </span>
        </div>
      </div>

      {/* Search, Filter & Admin Control Bar */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by farmer name, phone number, location, cooperative, commodity, or bill #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-2 text-xs font-medium text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>

          {/* Commodity Dropdown Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
            <select
              value={selectedCommodityFilter}
              onChange={(e) => setSelectedCommodityFilter(e.target.value)}
              className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="ALL">All Commodities ({bills.length})</option>
              {commodities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-3 py-2 text-xs text-[#6B7280] hover:text-[#111827] bg-[#F3F4F6] rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Bills Table with Full Admin Record Actions */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left" id="printable-ledger-table">
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
                <th className="p-3 text-center">Actions & Print</th>
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
                        {bill.cooperativeName && (
                          <span className="text-[#2563EB] font-semibold"> • {bill.cooperativeName}</span>
                        )}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[#111827] font-semibold block">{bill.commodityName}</span>
                      <span className="text-[10px] text-[#6B7280]">
                        Moisture: {bill.moisturePercent}% • {bill.grade}
                      </span>
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
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View & Print Slip */}
                        <button
                          onClick={() => onViewVoucher(bill)}
                          className="px-2 py-1 bg-white hover:bg-[#F9FAFB] text-[#2563EB] text-xs font-semibold rounded-md border border-[#E5E7EB] inline-flex items-center gap-1 shadow-xs transition-colors"
                          title="View Certified Slip / Print"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Slip</span>
                        </button>

                        {/* Admin Edit Record */}
                        {isAdminMode && (
                          <button
                            onClick={() => handleEdit(bill)}
                            className="p-1 bg-white hover:bg-blue-50 text-[#374151] hover:text-[#2563EB] rounded-md border border-[#E5E7EB] transition-colors"
                            title="Edit Record (Admin Update)"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Admin Delete Record */}
                        {isAdminMode && (
                          <button
                            onClick={() => setDeletingBillId(bill.id)}
                            className="p-1 bg-white hover:bg-red-50 text-[#6B7280] hover:text-red-600 rounded-md border border-[#E5E7EB] transition-colors"
                            title="Delete Record (Admin)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#6B7280]">
                    No intake records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingBillId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">Delete Intake Record</h3>
              <p className="text-xs text-[#4B5563] mt-1">
                Are you sure you want to permanently remove this weigh-bill record from the active ledger? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
              <button
                onClick={() => setDeletingBillId(null)}
                className="px-4 py-2 bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#374151] border border-[#E5E7EB] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deletingBillId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Farmers Friend" Top Producer Spotlight */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#111827] uppercase tracking-tight flex items-center gap-2">
            <Award className="w-4 h-4 text-[#2563EB]" />
            "Farmers Friend" Preferred Supplier Rankings
          </h3>
          <span className="text-xs text-[#6B7280] font-mono">
            {uniqueFarmers.length} Registered Producers
          </span>
        </div>

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

      {/* Admin Record Modal (Add / Edit) */}
      <AdminRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setEditingBill(null);
        }}
        onSaveRecord={onSaveRecord}
        editingBill={editingBill}
        commodities={commodities}
      />
    </div>
  );
};
