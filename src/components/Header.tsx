import React, { useState, useEffect } from 'react';
import { Currency } from '../types';
import { Phone, MapPin, Mail, ShieldCheck, Scale, Clock, Award, Sparkles, TrendingUp, Menu, X, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { SystemLogo } from './SystemLogo';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  onOpenContact: () => void;
  onQuickIntake: () => void;
  isOnline?: boolean;
  onSyncCache?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  currency,
  setCurrency,
  onOpenContact,
  onQuickIntake,
  isOnline = true,
  onSyncCache,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Africa/Freetown',
        }) + ' (GMT Bo)'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncClick = () => {
    setIsSyncing(true);
    if (onSyncCache) onSyncCache();
    setTimeout(() => setIsSyncing(false), 800);
  };

  const navItems = [
    { id: 'exchange', label: 'Live Exchange', icon: TrendingUp, badge: 'Live' },
    { id: 'weighbridge', label: 'Digital Scale & Intake', icon: Scale, badge: 'Honesty Scale' },
    { id: 'ai-grader', label: 'AI Quality Grader', icon: Sparkles, badge: 'Gemini' },
    { id: 'depot-stock', label: 'Bo Warehouse', icon: MapPin },
    { id: 'farmers', label: 'Farmers Friend Ledger', icon: Award },
    { id: 'orders', label: 'Trade Book & Booking', icon: Clock },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
      {/* Top Utility Announcement Bar */}
      <div className="bg-[#F9FAFB] text-[#4B5563] text-xs py-1.5 px-4 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] font-semibold border border-blue-200 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              "Honesty is our Concern"
            </span>
            
            {/* Bo City Network & Cache Status */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F3F4F6]">
              {isOnline ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-[#374151] font-mono">Bo City Live Sync</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-600" />
                  <span className="text-xs text-amber-700 font-mono">Bo Offline Cache Active</span>
                </>
              )}
              {onSyncCache && (
                <button
                  onClick={handleSyncClick}
                  className="ml-1 text-[#6B7280] hover:text-[#2563EB] p-0.5"
                  title="Sync offline cache snapshot"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-[#2563EB]' : ''}`} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-[#4B5563] text-[11px]">
            <div className="hidden sm:flex items-center gap-1.5 text-[#6B7280]">
              <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="font-mono">{timeStr || '11:42:00 (GMT Bo)'}</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:072803080"
                className="flex items-center gap-1 text-[#2563EB] hover:underline font-semibold font-mono"
                title="Call Depot Manager"
              >
                <Phone className="w-3 h-3" />
                <span>072803080 / 077803080</span>
              </a>
              <span className="text-[#D1D5DB] hidden sm:inline">|</span>
              <a
                href="mailto:mourtadatrading@gmail.com"
                className="hidden md:flex items-center gap-1 text-[#4B5563] hover:text-[#111827] transition-colors"
              >
                <Mail className="w-3 h-3 text-[#2563EB]" />
                <span>mourtadatrading@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand Identity with Official System Logo */}
        <div 
          onClick={() => setCurrentTab('exchange')}
          className="flex items-center gap-3.5 cursor-pointer group"
          id="brand-logo-button"
        >
          {/* Official Seal Emblem */}
          <SystemLogo size={46} className="group-hover:scale-105 transition-transform" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#111827] uppercase group-hover:text-[#2563EB] transition-colors font-sans">
                THE MOURTADA'S TRADING
              </h1>
              <span className="hidden lg:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-50 text-[#2563EB] border border-blue-200 rounded">
                PRODUCE DEALER
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <span className="text-[#2563EB] font-semibold">"Farmers Friend"</span>
              <span className="text-[#D1D5DB]">•</span>
              <span className="flex items-center gap-1 text-[#4B5563]">
                <MapPin className="w-3 h-3 text-[#2563EB] inline" />
                23 Prince Williams St, Bo City
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Currency Toggle */}
          <div className="hidden sm:flex items-center bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg p-0.5">
            <button
              onClick={() => setCurrency('NLe')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                currency === 'NLe'
                  ? 'bg-white text-[#111827] shadow-sm font-mono'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
              id="currency-nle-btn"
            >
              NLe (Leones)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                currency === 'USD'
                  ? 'bg-white text-[#111827] shadow-sm font-mono'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
              id="currency-usd-btn"
            >
              USD ($)
            </button>
          </div>

          {/* Quick Intake Button */}
          <button
            onClick={onQuickIntake}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs md:text-sm font-semibold rounded-lg shadow-sm active:scale-95 transition-all"
            id="quick-intake-btn"
          >
            <Scale className="w-4 h-4" />
            <span className="hidden sm:inline">New Scale Intake</span>
            <span className="sm:hidden">Weigh In</span>
          </button>

          {/* Contact Button */}
          <button
            onClick={onOpenContact}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F9FAFB] text-[#374151] text-xs font-semibold rounded-lg border border-[#E5E7EB] shadow-sm transition-all"
            id="contact-depot-btn"
          >
            <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Depot Desk</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 bg-white border border-[#E5E7EB] rounded-lg text-[#4B5563] hover:text-[#111827]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation Tabs */}
      <div className="hidden md:block bg-white border-t border-[#E5E7EB] px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  id={`nav-tab-${item.id}`}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-[#2563EB] font-semibold'
                      : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        item.badge === 'Gemini'
                          ? 'bg-blue-100 text-[#2563EB]'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 text-xs text-[#6B7280]">
            <div className="flex items-center gap-2 bg-[#F3F4F6] px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-mono text-xs font-semibold text-[#374151]">BO SCALES CALIBRATED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E7EB] px-4 py-3 space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB] mb-2">
            <span className="text-xs font-semibold text-[#6B7280] uppercase">Currency:</span>
            <div className="flex items-center bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg p-0.5">
              <button
                onClick={() => setCurrency('NLe')}
                className={`px-2 py-0.5 text-xs font-bold rounded ${
                  currency === 'NLe' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280]'
                }`}
              >
                NLe (Leones)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 text-xs font-bold rounded ${
                  currency === 'USD' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280]'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium border text-left ${
                    isActive
                      ? 'bg-blue-50 border-blue-200 text-[#2563EB] font-semibold'
                      : 'bg-white border-[#E5E7EB] text-[#4B5563]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'} shrink-0`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#E5E7EB] flex gap-2">
            <button
              onClick={() => {
                onOpenContact();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-xs font-semibold bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB] rounded-lg"
            >
              Contact 23 Prince Williams St
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
