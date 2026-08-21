import React, { useState, useEffect } from 'react';
import { Commodity, Currency, PriceAlert } from '../types';
import { Bell, BellRing, Check, Trash2, X, AlertCircle, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  commodities: Commodity[];
  currency: Currency;
  preSelectedCommodity: Commodity | null;
  alerts: PriceAlert[];
  onAddAlert: (newAlert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  onToggleAlert: (id: string) => void;
  onDeleteAlert: (id: string) => void;
  onTestNotification: (commodity: Commodity, targetPrice: number, condition: 'ABOVE' | 'BELOW') => void;
  notificationPermission: NotificationPermission;
  onRequestPermission: () => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  commodities,
  currency,
  preSelectedCommodity,
  alerts,
  onAddAlert,
  onToggleAlert,
  onDeleteAlert,
  onTestNotification,
  notificationPermission,
  onRequestPermission,
}) => {
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(
    preSelectedCommodity ? preSelectedCommodity.id : commodities[0]?.id || 'cocoa-g1'
  );
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [alertCurrency, setAlertCurrency] = useState<Currency>(currency);
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync selected commodity when prop changes
  useEffect(() => {
    if (preSelectedCommodity) {
      setSelectedCommodityId(preSelectedCommodity.id);
    }
  }, [preSelectedCommodity]);

  const currentCommodity = commodities.find((c) => c.id === selectedCommodityId) || commodities[0];
  const currentSpot = alertCurrency === 'NLe' ? currentCommodity.spotPriceNLe : currentCommodity.spotPriceUSD;

  // Initialize target price when commodity or currency changes
  useEffect(() => {
    if (currentCommodity) {
      const base = alertCurrency === 'NLe' ? currentCommodity.spotPriceNLe : currentCommodity.spotPriceUSD;
      const initialTarget = condition === 'ABOVE' 
        ? Number((base * 1.05).toFixed(2))
        : Number((base * 0.95).toFixed(2));
      setTargetPrice(initialTarget);
    }
  }, [selectedCommodityId, alertCurrency, condition]);

  if (!isOpen) return null;

  const handleApplyPreset = (percent: number) => {
    const calculated = Number((currentSpot * (1 + percent / 100)).toFixed(2));
    setTargetPrice(calculated);
    if (percent > 0) setCondition('ABOVE');
    if (percent < 0) setCondition('BELOW');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPrice <= 0) return;

    onAddAlert({
      commodityId: currentCommodity.id,
      commodityName: currentCommodity.name,
      targetPrice,
      currency: alertCurrency,
      condition,
      active: true,
    });

    setSuccessMsg(`Push alert created for ${currentCommodity.name} at ${alertCurrency} ${targetPrice.toFixed(2)}`);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden space-y-5 p-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111827] tracking-tight">
                Produce Spot Price Push Alerts
              </h3>
              <p className="text-xs text-[#6B7280]">
                Receive immediate push notifications when Bo Depot spot prices cross your target rate
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#111827] p-1 text-lg font-bold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="space-y-5 overflow-y-auto flex-1 pr-1">
          {/* Push Permission Banner */}
          {notificationPermission !== 'granted' ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Enable desktop / mobile push notifications to receive real-time spot rate threshold triggers.
                </span>
              </div>
              <button
                onClick={onRequestPermission}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shrink-0 transition-colors"
              >
                Enable Push
              </button>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between text-xs text-green-800">
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-green-600" />
                Browser Push Notifications Active & Calibrated
              </span>
              <button
                type="button"
                onClick={() => onTestNotification(currentCommodity, targetPrice, condition)}
                className="text-[11px] font-semibold text-[#2563EB] hover:underline"
              >
                Send Test Alert
              </button>
            </div>
          )}

          {successMsg && (
            <div className="bg-blue-50 border border-blue-200 text-[#2563EB] rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-[#2563EB]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Alert Form */}
          <form onSubmit={handleSave} className="space-y-4 bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Create New Price Threshold Alert
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Select Commodity */}
              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">
                  Commodity Produce
                </label>
                <select
                  value={selectedCommodityId}
                  onChange={(e) => setSelectedCommodityId(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#2563EB]"
                >
                  {commodities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({alertCurrency === 'NLe' ? `NLe ${c.spotPriceNLe.toFixed(2)}` : `$${c.spotPriceUSD.toFixed(2)}`}/kg)
                    </option>
                  ))}
                </select>
              </div>

              {/* Currency Selector */}
              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1">
                  Alert Currency
                </label>
                <div className="flex bg-white rounded-lg border border-[#E5E7EB] p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setAlertCurrency('NLe')}
                    className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
                      alertCurrency === 'NLe' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#6B7280]'
                    }`}
                  >
                    Leones (NLe/kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlertCurrency('USD')}
                    className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
                      alertCurrency === 'USD' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#6B7280]'
                    }`}
                  >
                    USD ($/kg)
                  </button>
                </div>
              </div>
            </div>

            {/* Condition: Rises Above vs Drops Below */}
            <div>
              <label className="text-xs font-semibold text-[#374151] block mb-1">
                Alert Trigger Condition
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition('ABOVE')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    condition === 'ABOVE'
                      ? 'bg-blue-50 border-[#2563EB] text-[#2563EB] shadow-xs'
                      : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span>Price Rises Above (&ge;)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('BELOW')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    condition === 'BELOW'
                      ? 'bg-blue-50 border-[#2563EB] text-[#2563EB] shadow-xs'
                      : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4 text-amber-600" />
                  <span>Price Drops Below (&le;)</span>
                </button>
              </div>
            </div>

            {/* Target Price Input with Presets */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#374151]">
                  Target Rate Threshold ({alertCurrency}/kg)
                </label>
                <span className="text-[11px] text-[#6B7280] font-mono">
                  Current: <strong className="text-[#111827]">{alertCurrency} {currentSpot.toFixed(2)}</strong>
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  value={targetPrice || ''}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-base font-mono font-bold text-[#111827] focus:outline-none focus:border-[#2563EB]"
                  placeholder="Enter target threshold..."
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#6B7280] font-mono">
                  {alertCurrency} / kg
                </span>
              </div>

              {/* Quick Percent Presets */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[10px] text-[#6B7280]">Quick Target:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(2)}
                  className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 border border-[#E5E7EB] text-[10px] font-mono text-green-700 font-semibold"
                >
                  +2%
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(5)}
                  className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 border border-[#E5E7EB] text-[10px] font-mono text-green-700 font-semibold"
                >
                  +5%
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(10)}
                  className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 border border-[#E5E7EB] text-[10px] font-mono text-green-700 font-semibold"
                >
                  +10%
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(-2)}
                  className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 border border-[#E5E7EB] text-[10px] font-mono text-amber-700 font-semibold"
                >
                  -2%
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(-5)}
                  className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 border border-[#E5E7EB] text-[10px] font-mono text-amber-700 font-semibold"
                >
                  -5%
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span>Set Push Notification Alert</span>
            </button>
          </form>

          {/* Active Configured Alerts */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                Configured Price Alerts ({alerts.length})
              </h4>
              <span className="text-[11px] text-[#6B7280]">Real-time evaluation active</span>
            </div>

            {alerts.length === 0 ? (
              <div className="p-4 bg-[#F9FAFB] rounded-xl border border-dashed border-[#E5E7EB] text-center text-xs text-[#6B7280]">
                No price alerts configured yet. Set an alert above to get notified on market moves.
              </div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {alerts.map((alert) => {
                  const comm = commodities.find((c) => c.id === alert.commodityId);
                  const currentPrice = comm ? (alert.currency === 'NLe' ? comm.spotPriceNLe : comm.spotPriceUSD) : 0;
                  const isMet = alert.condition === 'ABOVE' ? currentPrice >= alert.targetPrice : currentPrice <= alert.targetPrice;

                  return (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                        alert.active
                          ? isMet
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white border-[#E5E7EB]'
                          : 'bg-gray-50 border-[#E5E7EB] opacity-60'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#111827] truncate">
                            {alert.commodityName}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                              alert.condition === 'ABOVE'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {alert.condition === 'ABOVE' ? '≥' : '≤'} {alert.currency} {alert.targetPrice.toFixed(2)}
                          </span>
                          {isMet && alert.active && (
                            <span className="px-1.5 py-0.5 rounded bg-green-600 text-white text-[9px] font-bold uppercase animate-pulse">
                              Trigger Met
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#6B7280] font-mono mt-0.5 flex items-center gap-2">
                          <span>Current: {alert.currency} {currentPrice.toFixed(2)}</span>
                          <span>•</span>
                          <span>Created {new Date(alert.createdAt).toLocaleDateString()}</span>
                          {alert.lastTriggeredAt && (
                            <>
                              <span>•</span>
                              <span className="text-green-700 font-semibold">Fired {alert.lastTriggeredAt}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onToggleAlert(alert.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                            alert.active
                              ? 'bg-blue-50 text-[#2563EB] border-blue-200 hover:bg-blue-100'
                              : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-gray-100'
                          }`}
                        >
                          {alert.active ? 'Active' : 'Paused'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteAlert(alert.id)}
                          className="p-1.5 text-[#9CA3AF] hover:text-red-600 rounded-md transition-colors"
                          title="Delete Alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E5E7EB] pt-3 flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 text-[#6B7280]">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
            <span>Real-time spot rate feed from Bo Depot</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-[#374151] border border-[#E5E7EB] font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
