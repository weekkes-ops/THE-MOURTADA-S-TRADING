export type Currency = 'NLe' | 'USD';

export interface Commodity {
  id: string;
  name: string;
  category: 'Cocoa' | 'Coffee' | 'Grains & Oilseeds' | 'Nuts & Spices';
  grade: 'Grade 1' | 'Grade 2' | 'Standard' | 'Premium';
  unit: string;
  spotPriceNLe: number;
  spotPriceUSD: number;
  change24h: number;
  change24hPercent: number;
  high24h: number;
  low24h: number;
  volumeBags24h: number;
  moistureThreshold: number;
  standardBagWeightKg: number;
  sparkline: number[];
  status: 'active' | 'high_demand' | 'volatile';
  description: string;
  seasonalNotes: string;
}

export interface WeighIntakeBill {
  id: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  cooperativeName?: string;
  commodityId: string;
  commodityName: string;
  grade: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  bagCount: number;
  moisturePercent: number;
  defectDeductionPercent: number;
  qualityPremiumPercent: number;
  pricePerKgNLe: number;
  subtotalNLe: number;
  netPayableNLe: number;
  paymentMethod: 'Cash at Depot Desk' | 'Orange Money' | 'Africell Money' | 'Bank Transfer';
  paymentStatus: 'Paid & Settled' | 'Ready for Cashier' | 'Processing';
  timestamp: string;
  scaleOperator: string;
  depotAddress: string;
  receiptNumber: string;
}

export interface DepotInventoryItem {
  commodityId: string;
  name: string;
  inStockBags: number;
  inStockTons: number;
  dryingFloorBags: number;
  readyForExportBags: number;
  warehouseSection: string;
  targetExportTons: number;
  lastUpdated: string;
}

export interface MarketOrder {
  id: string;
  type: 'BUY_BID' | 'SELL_ASK' | 'DEPOT_INTAKE';
  traderName: string;
  commodityName: string;
  quantityBags: number;
  weightKg: number;
  pricePerKgNLe: number;
  totalNLe: number;
  timestamp: string;
  status: 'Completed' | 'Pending Delivery' | 'Active';
}

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  village: string;
  chiefdom: string;
  totalDeliveries: number;
  totalTonnageKg: number;
  totalEarnedNLe: number;
  loyaltyTier: 'Champion Farmer Friend' | 'Gold Farmer Friend' | 'Silver Farmer Friend';
  lastDeliveryDate: string;
}

export interface QualityGradingResult {
  grade: string;
  qualityScore: number;
  moistureStatus: string;
  beanCountAssessment?: string;
  estimatedValueNLePerKg?: number;
  totalLotValueNLe?: number;
  agronomyTips?: string[];
  recommendations?: string[];
  complianceNotice?: string;
  honestyGuaranteeMessage?: string;
}

export interface ScheduledDropOff {
  id: string;
  farmerName: string;
  farmerPhone: string;
  commodityId: string;
  commodityName: string;
  estimatedBags: number;
  estimatedWeightKg: number;
  lockedPricePerKgNLe: number;
  scheduledDate: string;
  transportType: 'Pickup Truck' | 'Motorcycle (Okada)' | 'Heavy Truck' | 'Hand Delivery';
  status: 'Confirmed' | 'Pending' | 'Completed';
}

export interface PriceTick {
  commodityId: string;
  newPriceNLe: number;
  newPriceUSD: number;
  delta: number;
  timestamp: string;
}

export interface PriceAlert {
  id: string;
  commodityId: string;
  commodityName: string;
  targetPrice: number;
  currency: Currency;
  condition: 'ABOVE' | 'BELOW';
  createdAt: string;
  active: boolean;
  lastTriggeredAt?: string;
}
