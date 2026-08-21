import React, { useState, useEffect, useRef } from 'react';
import { Commodity, WeighIntakeBill, DepotInventoryItem, Currency, ScheduledDropOff, PriceAlert } from './types';
import { INITIAL_COMMODITIES, INITIAL_INTAKE_BILLS, INITIAL_INVENTORY } from './data/commoditiesData';
import { Header } from './components/Header';
import { LiveTickerBar } from './components/LiveTickerBar';
import { CommodityMarketView } from './components/CommodityMarketView';
import { WeighBridgeIntake } from './components/WeighBridgeIntake';
import { AIQualityInspector } from './components/AIQualityInspector';
import { DepotLogisticsHub } from './components/DepotLogisticsHub';
import { FarmerLedger } from './components/FarmerLedger';
import { MarketplaceOrderBook } from './components/MarketplaceOrderBook';
import { HonestyVoucherModal } from './components/HonestyVoucherModal';
import { ContactDepotModal } from './components/ContactDepotModal';
import { SystemLogo } from './components/SystemLogo';
import { 
  loadCachedCommodities, 
  saveCachedCommodities, 
  loadCachedInventory, 
  saveCachedInventory, 
  loadCachedBills, 
  saveCachedBills 
} from './utils/offlineStorage';
import { ShieldCheck, Phone, MapPin, Scale, Award, Sparkles, TrendingUp, Warehouse, Clock, BellRing, X, ArrowUpRight, WifiOff, CheckCircle2 } from 'lucide-react';

const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: 'alert-1',
    commodityId: 'cocoa-g1',
    commodityName: 'Cocoa Beans (Grade 1)',
    targetPrice: 147.50,
    currency: 'NLe',
    condition: 'ABOVE',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'alert-2',
    commodityId: 'coffee-robusta',
    commodityName: 'Robusta Coffee (Clean)',
    targetPrice: 98.00,
    currency: 'NLe',
    condition: 'ABOVE',
    active: true,
    createdAt: new Date().toISOString(),
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('exchange');
  const [currency, setCurrency] = useState<Currency>('NLe');
  
  // Offline connectivity state
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true;
  });

  // Cached Commodities (Bo City Offline Resilience)
  const [commodities, setCommodities] = useState<Commodity[]>(() => loadCachedCommodities());
  
  // Cached Inventory (Bo City Offline Resilience)
  const [inventory, setInventory] = useState<DepotInventoryItem[]>(() => loadCachedInventory());

  // Cached Bills / Intake Records (Bo City Offline Resilience)
  const [bills, setBills] = useState<WeighIntakeBill[]>(() => loadCachedBills());

  // Stored Price Alerts
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('mourtada_price_alerts_v1');
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [activeAlertBanner, setActiveAlertBanner] = useState<{
    id: string;
    title: string;
    message: string;
    timestamp: string;
  } | null>(null);

  const [cacheSyncNotice, setCacheSyncNotice] = useState<string | null>(null);
  const [activeVoucher, setActiveVoucher] = useState<WeighIntakeBill | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [selectedCommodityForScale, setSelectedCommodityForScale] = useState<Commodity | null>(null);
  const [aiInspectCommodity, setAiInspectCommodity] = useState<Commodity | null>(null);

  // Network online/offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setCacheSyncNotice('Network Restored • Bo Depot Live Synced');
      setTimeout(() => setCacheSyncNotice(null), 4000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setCacheSyncNotice('Internet Connection Dropped • Bo Offline Cache Active');
      setTimeout(() => setCacheSyncNotice(null), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save bills to offline storage
  useEffect(() => {
    saveCachedBills(bills);
  }, [bills]);

  // Save inventory to offline storage
  useEffect(() => {
    saveCachedInventory(inventory);
  }, [inventory]);

  // Save commodities to offline storage
  useEffect(() => {
    saveCachedCommodities(commodities);
  }, [commodities]);

  // Save alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mourtada_price_alerts_v1', JSON.stringify(alerts));
    } catch {
      // ignore
    }
  }, [alerts]);

  const handleSyncCacheManual = () => {
    saveCachedCommodities(commodities);
    saveCachedInventory(inventory);
    saveCachedBills(bills);
    setCacheSyncNotice('Bo Depot Snapshot Cached for Offline Operation');
    setTimeout(() => setCacheSyncNotice(null), 3000);
  };

  const handleRequestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
      } catch (err) {
        console.warn('Failed to request notification permission:', err);
      }
    }
  };

  const handleSendPushNotification = (title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/logo.svg',
        });
      } catch (err) {
        console.warn('Web notification error:', err);
      }
    }
  };

  const handleAddAlert = (newAlert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const created: PriceAlert = {
      ...newAlert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAlerts((prev) => [created, ...prev]);

    if (notificationPermission === 'default') {
      handleRequestNotificationPermission();
    }
  };

  const handleToggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleTestNotification = (commodity: Commodity, targetPrice: number, condition: 'ABOVE' | 'BELOW') => {
    const title = `🎯 Test Price Alert: ${commodity.name}`;
    const body = `Alert threshold test (${condition === 'ABOVE' ? '≥' : '≤'} NLe ${targetPrice.toFixed(2)}/kg). Current spot rate at Bo Depot is NLe ${commodity.spotPriceNLe.toFixed(2)}/kg.`;
    handleSendPushNotification(title, body);

    setActiveAlertBanner({
      id: `test-${Date.now()}`,
      title,
      message: body,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  // Realtime Price Fluctuation Simulation (Real-world trading simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setCommodities((prev) =>
        prev.map((c) => {
          // 30% chance each 4s to fluctuate slightly
          if (Math.random() > 0.3) return c;
          const delta = (Math.random() - 0.48) * (c.spotPriceNLe * 0.006);
          const newPriceNLe = Number(Math.max(c.low24h * 0.95, c.spotPriceNLe + delta).toFixed(2));
          const newPriceUSD = Number((newPriceNLe / 22.7).toFixed(2));
          const change24h = Number((newPriceNLe - c.low24h).toFixed(2));
          const change24hPercent = Number(((change24h / c.low24h) * 100).toFixed(2));

          const updatedSparkline = [...c.sparkline.slice(1), newPriceNLe];

          return {
            ...c,
            spotPriceNLe: newPriceNLe,
            spotPriceUSD: newPriceUSD,
            change24h,
            change24hPercent,
            sparkline: updatedSparkline,
            high24h: Math.max(c.high24h, newPriceNLe),
            low24h: Math.min(c.low24h, newPriceNLe),
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Monitor price fluctuations against active alerts
  useEffect(() => {
    alerts.forEach((alert) => {
      if (!alert.active) return;
      const commodity = commodities.find((c) => c.id === alert.commodityId);
      if (!commodity) return;

      const currentPrice = alert.currency === 'NLe' ? commodity.spotPriceNLe : commodity.spotPriceUSD;
      const isThresholdMet = alert.condition === 'ABOVE'
        ? currentPrice >= alert.targetPrice
        : currentPrice <= alert.targetPrice;

      if (isThresholdMet) {
        const timeNow = new Date().toLocaleTimeString();
        if (alert.lastTriggeredAt !== timeNow) {
          const title = `🚨 Target Hit: ${alert.commodityName}`;
          const body = `Spot price reached ${alert.currency} ${currentPrice.toFixed(2)}/kg (${alert.condition === 'ABOVE' ? 'risen above' : 'dropped below'} target ${alert.currency} ${alert.targetPrice.toFixed(2)}).`;

          handleSendPushNotification(title, body);
          setActiveAlertBanner({
            id: alert.id,
            title,
            message: body,
            timestamp: timeNow,
          });

          setAlerts((prev) =>
            prev.map((a) =>
              a.id === alert.id ? { ...a, lastTriggeredAt: timeNow } : a
            )
          );
        }
      }
    });
  }, [commodities, alerts]);

  // Handle Scale Intake Bill
  const handleIntakeCompleted = (newBill: WeighIntakeBill) => {
    setBills((prev) => [newBill, ...prev]);

    // Also update depot inventory
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.commodityId === newBill.commodityId) {
          const addedTons = newBill.netWeightKg / 1000;
          return {
            ...inv,
            inStockBags: inv.inStockBags + newBill.bagCount,
            inStockTons: Number((inv.inStockTons + addedTons).toFixed(2)),
            lastUpdated: 'Just now',
          };
        }
        return inv;
      })
    );
  };

  // Admin Save Record (Add or Update)
  const handleSaveRecord = (bill: WeighIntakeBill, isNew: boolean) => {
    if (isNew) {
      setBills((prev) => [bill, ...prev]);
    } else {
      setBills((prev) => prev.map((b) => (b.id === bill.id ? bill : b)));
    }
  };

  // Admin Delete Record
  const handleDeleteRecord = (billId: string) => {
    setBills((prev) => prev.filter((b) => b.id !== billId));
  };

  const handleSelectCommodityForScale = (c: Commodity) => {
    setSelectedCommodityForScale(c);
    setCurrentTab('weighbridge');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInspectWithAI = (c: Commodity) => {
    setAiInspectCommodity(c);
    setCurrentTab('ai-grader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendAiLotToScale = (c: Commodity, _moisture: number, _weightKg: number) => {
    setSelectedCommodityForScale(c);
    setCurrentTab('weighbridge');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Top Header & Brand Bar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currency={currency}
        setCurrency={setCurrency}
        onOpenContact={() => setIsContactModalOpen(true)}
        onQuickIntake={() => {
          setSelectedCommodityForScale(null);
          setCurrentTab('weighbridge');
        }}
        isOnline={isOnline}
        onSyncCache={handleSyncCacheManual}
      />

      {/* Real-time Marquee Ticker */}
      <LiveTickerBar
        commodities={commodities}
        currency={currency}
        onSelectCommodity={handleSelectCommodityForScale}
      />

      {/* Cache Sync Status Notification */}
      {cacheSyncNotice && (
        <div className="max-w-7xl w-full mx-auto px-4 pt-2">
          <div className="bg-slate-900 text-white rounded-lg p-2.5 text-xs flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>{cacheSyncNotice}</span>
            </div>
            <button
              onClick={() => setCacheSyncNotice(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Triggered Push Notification In-App Toast Banner */}
      {activeAlertBanner && (
        <div className="max-w-7xl w-full mx-auto px-4 pt-4">
          <div className="bg-blue-600 text-white rounded-xl p-4 shadow-lg flex items-center justify-between gap-4 border border-blue-700 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg shrink-0">
                <BellRing className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold tracking-tight">{activeAlertBanner.title}</h4>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">
                    {activeAlertBanner.timestamp}
                  </span>
                </div>
                <p className="text-xs text-blue-100 mt-0.5 leading-relaxed">
                  {activeAlertBanner.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setCurrentTab('exchange');
                  setActiveAlertBanner(null);
                }}
                className="px-3 py-1.5 bg-white text-[#2563EB] hover:bg-blue-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                <span>View Exchange</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveAlertBanner(null)}
                className="p-1.5 text-blue-200 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8 space-y-6">
        {currentTab === 'exchange' && (
          <CommodityMarketView
            commodities={commodities}
            currency={currency}
            onSelectCommodityForScale={handleSelectCommodityForScale}
            onInspectWithAI={handleInspectWithAI}
            onOpenBooking={() => setCurrentTab('orders')}
            alerts={alerts}
            onAddAlert={handleAddAlert}
            onToggleAlert={handleToggleAlert}
            onDeleteAlert={handleDeleteAlert}
            onTestNotification={handleTestNotification}
            notificationPermission={notificationPermission}
            onRequestPermission={handleRequestNotificationPermission}
          />
        )}

        {currentTab === 'weighbridge' && (
          <WeighBridgeIntake
            commodities={commodities}
            currency={currency}
            preSelectedCommodity={selectedCommodityForScale}
            onIntakeCompleted={handleIntakeCompleted}
            onViewVoucher={(bill) => setActiveVoucher(bill)}
          />
        )}

        {currentTab === 'ai-grader' && (
          <AIQualityInspector
            commodities={commodities}
            currency={currency}
            initialCommodity={aiInspectCommodity}
            onSendToScale={handleSendAiLotToScale}
          />
        )}

        {currentTab === 'depot-stock' && (
          <DepotLogisticsHub
            inventory={inventory}
            currency={currency}
            onQuickIntake={() => setCurrentTab('weighbridge')}
          />
        )}

        {currentTab === 'farmers' && (
          <FarmerLedger
            bills={bills}
            currency={currency}
            commodities={commodities}
            onViewVoucher={(bill) => setActiveVoucher(bill)}
            onQuickIntake={() => setCurrentTab('weighbridge')}
            onSaveRecord={handleSaveRecord}
            onDeleteRecord={handleDeleteRecord}
            isOnline={isOnline}
          />
        )}

        {currentTab === 'orders' && (
          <MarketplaceOrderBook
            commodities={commodities}
            currency={currency}
            onBookDropOff={(_booking) => {
              // Booking handled inside
            }}
          />
        )}
      </main>

      {/* Footer with Official Logo */}
      <footer className="mt-12 bg-white border-t border-[#E5E7EB] py-8 px-4 text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <SystemLogo size={36} className="shrink-0 drop-shadow-xs" />
              <span className="font-bold text-[#111827] uppercase text-sm tracking-tight">
                THE MOURTADA'S TRADING
              </span>
            </div>
            <p className="text-[12px] text-[#4B5563] leading-relaxed">
              Produce Dealer & Agricultural Commodity Exporter. "Honesty is our Concern" & "Farmers Friend".
            </p>
            <div className="flex items-center gap-1.5 text-[#2563EB] font-semibold text-xs pt-1">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>Certified Digital Scale Weight Honesty</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-[#111827] uppercase block mb-1 text-xs">Bo City Buying Depot</span>
            <div className="flex items-center gap-1.5 text-[#4B5563]">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              <span>23 Prince Williams Street, Bo City</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#4B5563]">
              <Clock className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
              <span>Mon &ndash; Sat: 7:00 AM &ndash; 7:00 PM</span>
            </div>
            <div className="text-green-700 font-semibold text-xs">
              Southern Province, Sierra Leone
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-[#111827] uppercase block mb-1 text-xs">Direct Contacts</span>
            <div className="flex items-center gap-1.5 text-[#2563EB] font-bold">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <a href="tel:072803080" className="hover:underline font-mono">072803080</a>
              <span className="text-[#9CA3AF]">/</span>
              <a href="tel:077803080" className="hover:underline font-mono">077803080</a>
            </div>
            <div className="text-[#4B5563]">
              <a href="mailto:mourtadatrading@gmail.com" className="hover:underline text-[#2563EB]">
                mourtadatrading@gmail.com
              </a>
            </div>
            <span className="text-[#9CA3AF] block text-[11px]">Depot Manager Desk & Weigh Attendant</span>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-[#111827] uppercase text-xs block">Quick Actions</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedCommodityForScale(null);
                  setCurrentTab('weighbridge');
                }}
                className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm text-xs transition-colors"
              >
                Scale Intake
              </button>
              <button
                onClick={() => setCurrentTab('farmers')}
                className="px-3 py-1.5 bg-white hover:bg-[#F9FAFB] text-[#374151] font-semibold rounded-lg border border-[#E5E7EB] shadow-sm text-xs transition-colors"
              >
                Farmer Ledger
              </button>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-3 py-1.5 bg-white hover:bg-[#F9FAFB] text-[#374151] font-semibold rounded-lg border border-[#E5E7EB] shadow-sm text-xs transition-colors"
              >
                Depot Desk
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#6B7280]">
          <div>
            &copy; {new Date().getFullYear()} The Mourtada's Trading - Produce Dealer. All rights reserved.
          </div>
          <div>
            "Honesty is our Concern" • 23 Prince Williams St, Bo City, Sierra Leone
          </div>
        </div>
      </footer>

      {/* Official Printable & Exportable Honesty Weigh-Bill Voucher Modal */}
      <HonestyVoucherModal
        bill={activeVoucher}
        onClose={() => setActiveVoucher(null)}
      />

      {/* Contact Depot & Location Modal */}
      <ContactDepotModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
