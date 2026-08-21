// Offline Storage and Caching Manager for The Mourtada's Trading (Bo City Depot)
import { Commodity, DepotInventoryItem, WeighIntakeBill, PriceAlert } from '../types';
import { INITIAL_COMMODITIES, INITIAL_INVENTORY, INITIAL_INTAKE_BILLS } from '../data/commoditiesData';

const KEYS = {
  COMMODITIES: 'mourtada_offline_commodities_v1',
  INVENTORY: 'mourtada_offline_inventory_v1',
  BILLS: 'mourtada_intake_bills_v1',
  ALERTS: 'mourtada_price_alerts_v1',
  LAST_SYNC: 'mourtada_last_sync_timestamp',
};

// Register Service Worker in browser
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[Bo Depot PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[Bo Depot PWA] Service Worker registration skipped or failed:', err);
        });
    });
  }
}

// Load Cached Commodities with fallback
export function loadCachedCommodities(): Commodity[] {
  try {
    const raw = localStorage.getItem(KEYS.COMMODITIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('[Cache] Could not read cached commodities:', err);
  }
  return INITIAL_COMMODITIES;
}

// Save Cached Commodities
export function saveCachedCommodities(commodities: Commodity[]) {
  try {
    localStorage.setItem(KEYS.COMMODITIES, JSON.stringify(commodities));
    localStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
  } catch (err) {
    console.warn('[Cache] Could not save commodities:', err);
  }
}

// Load Cached Inventory with fallback
export function loadCachedInventory(): DepotInventoryItem[] {
  try {
    const raw = localStorage.getItem(KEYS.INVENTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('[Cache] Could not read cached inventory:', err);
  }
  return INITIAL_INVENTORY;
}

// Save Cached Inventory
export function saveCachedInventory(inventory: DepotInventoryItem[]) {
  try {
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(inventory));
    localStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
  } catch (err) {
    console.warn('[Cache] Could not save inventory:', err);
  }
}

// Load Cached Intake Bills with fallback
export function loadCachedBills(): WeighIntakeBill[] {
  try {
    const raw = localStorage.getItem(KEYS.BILLS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('[Cache] Could not read cached bills:', err);
  }
  return INITIAL_INTAKE_BILLS;
}

// Save Cached Intake Bills
export function saveCachedBills(bills: WeighIntakeBill[]) {
  try {
    localStorage.setItem(KEYS.BILLS, JSON.stringify(bills));
    localStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
  } catch (err) {
    console.warn('[Cache] Could not save bills:', err);
  }
}

// Get Last Sync Timestamp
export function getLastSyncTime(): string {
  try {
    const timestamp = localStorage.getItem(KEYS.LAST_SYNC);
    if (timestamp) {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  } catch {
    // ignore
  }
  return 'Just now';
}

// Export Farmer Ledger Data to CSV for Excel / QuickBooks / Accounting
export function exportFarmerLedgerToCSV(bills: WeighIntakeBill[]): { success: boolean; filename: string; count: number } {
  if (!bills || bills.length === 0) {
    return { success: false, filename: '', count: 0 };
  }

  const headers = [
    'Receipt Number',
    'Date & Time',
    'Farmer Name',
    'Phone Contact',
    'Village / Location',
    'Cooperative Name',
    'Commodity Produce',
    'Grade Quality',
    'Bag Count',
    'Gross Weight (Kg)',
    'Tare Weight (Kg)',
    'Net Weight (Kg)',
    'Moisture Content (%)',
    'Base Spot Rate (NLe/Kg)',
    'Subtotal Gross (NLe)',
    'Quality Premium (%)',
    'Defect Deduction (%)',
    'Net Cash Payable (NLe)',
    'USD Equivalent ($)',
    'Payment Method',
    'Payment Status',
    'Scale Operator',
    'Depot Address',
  ];

  const escapeCSV = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = bills.map((b) => [
    escapeCSV(b.receiptNumber),
    escapeCSV(b.timestamp),
    escapeCSV(b.farmerName),
    escapeCSV(b.farmerPhone),
    escapeCSV(b.farmerLocation),
    escapeCSV(b.cooperativeName || 'N/A (Independent)'),
    escapeCSV(b.commodityName),
    escapeCSV(b.grade),
    escapeCSV(b.bagCount),
    escapeCSV(b.grossWeightKg.toFixed(2)),
    escapeCSV(b.tareWeightKg.toFixed(2)),
    escapeCSV(b.netWeightKg.toFixed(2)),
    escapeCSV(b.moisturePercent.toFixed(1)),
    escapeCSV(b.pricePerKgNLe.toFixed(2)),
    escapeCSV(b.subtotalNLe.toFixed(2)),
    escapeCSV(b.qualityPremiumPercent.toFixed(1)),
    escapeCSV(b.defectDeductionPercent.toFixed(1)),
    escapeCSV(b.netPayableNLe.toFixed(2)),
    escapeCSV((b.netPayableNLe / 22.7).toFixed(2)),
    escapeCSV(b.paymentMethod),
    escapeCSV(b.paymentStatus),
    escapeCSV(b.scaleOperator),
    escapeCSV(b.depotAddress),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  // Trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const filename = `Mourtada_Farmer_Ledger_Export_${dateStr}.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { success: true, filename, count: bills.length };
}
