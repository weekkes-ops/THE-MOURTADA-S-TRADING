import React, { useState } from 'react';
import { DepotInventoryItem, Currency } from '../types';
import { Warehouse, Truck, SunMedium, ShieldCheck, MapPin, BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DepotLogisticsHubProps {
  inventory: DepotInventoryItem[];
  currency: Currency;
  onQuickIntake: () => void;
}

export const DepotLogisticsHub: React.FC<DepotLogisticsHubProps> = ({
  inventory,
  currency,
  onQuickIntake,
}) => {
  const [chartMetric, setChartMetric] = useState<'tons' | 'bags'>('tons');
  const totalTonsInStock = inventory.reduce((acc, item) => acc + item.inStockTons, 0);
  const totalBagsInStock = inventory.reduce((acc, item) => acc + item.inStockBags, 0);
  const totalDryingBags = inventory.reduce((acc, item) => acc + item.dryingFloorBags, 0);
  const totalReadyExportBags = inventory.reduce((acc, item) => acc + item.readyForExportBags, 0);

  // Prepare chart dataset
  const chartData = inventory.map((item) => {
    // Shorten long commodity names for clean x-axis rendering
    const shortName = item.name.replace('Clean ', '').replace('Grade 1 ', 'G1 ').replace('Grade 2 ', 'G2 ');
    
    // Estimate drying floor tons based on proportion of bags
    const bagToTonFactor = item.inStockBags > 0 ? item.inStockTons / item.inStockBags : 0.064;
    const dryingTons = Number((item.dryingFloorBags * bagToTonFactor).toFixed(1));
    const readyTons = Number((item.readyForExportBags * bagToTonFactor).toFixed(1));

    return {
      name: shortName,
      fullName: item.name,
      inStockTons: Number(item.inStockTons.toFixed(1)),
      readyForExportTons: readyTons,
      dryingFloorTons: dryingTons,
      targetExportTons: item.targetExportTons,
      inStockBags: item.inStockBags,
      readyForExportBags: item.readyForExportBags,
      dryingFloorBags: item.dryingFloorBags,
      warehouseSection: item.warehouseSection,
    };
  });

  // Custom clean tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const itemData = payload[0]?.payload;
      return (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-lg text-xs font-sans space-y-2 min-w-[200px]">
          <div className="border-b border-[#E5E7EB] pb-1.5">
            <span className="font-bold text-[#111827] block text-sm">{itemData?.fullName || label}</span>
            <span className="text-[10px] text-[#6B7280]">Bay: {itemData?.warehouseSection}</span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex justify-between items-center gap-4">
                <span className="flex items-center gap-1.5 text-[#4B5563]">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-bold text-[#111827]">
                  {entry.value?.toLocaleString()} {chartMetric === 'tons' ? 'MT' : 'Bags'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center gap-1.5 shadow-xs">
              <Warehouse className="w-3.5 h-3.5 text-[#2563EB]" />
              Central Produce Depot
            </span>
            <span className="text-xs text-[#6B7280] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
              23 Prince Williams Street, Bo City
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#111827] mt-1.5">
            Depot Warehouse & Export Logistics Hub
          </h2>
          <p className="text-xs md:text-sm text-[#4B5563]">
            Realtime stockpile tracking, sun-drying yard management, and dispatch consolidation to Freetown Queen Elizabeth II Port.
          </p>
        </div>

        <button
          onClick={onQuickIntake}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs md:text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          + Record Stock Intake
        </button>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#6B7280]">
            <span className="text-[11px] font-mono uppercase">Total Warehouse Stock</span>
            <Warehouse className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#111827] mt-2">
            {totalTonsInStock.toFixed(1)} <span className="text-xs font-normal text-[#6B7280]">Tons</span>
          </div>
          <span className="text-[11px] text-[#6B7280] font-mono">
            {totalBagsInStock.toLocaleString()} standard bags
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#6B7280]">
            <span className="text-[11px] font-mono uppercase">On Drying Terraces</span>
            <SunMedium className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#111827] mt-2">
            {totalDryingBags.toLocaleString()} <span className="text-xs font-normal text-[#6B7280]">Bags</span>
          </div>
          <span className="text-[11px] text-[#6B7280] font-mono">
            Raised wooden drying beds
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#6B7280]">
            <span className="text-[11px] font-mono uppercase">Ready for Port Dispatch</span>
            <Truck className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-green-600 mt-2">
            {totalReadyExportBags.toLocaleString()} <span className="text-xs font-normal text-[#6B7280]">Bags</span>
          </div>
          <span className="text-[11px] text-green-700 font-mono">
            Grade 1 Certified & Sealed
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#6B7280]">
            <span className="text-[11px] font-mono uppercase">Warehouse Capacity</span>
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#2563EB] mt-2">
            68.4% <span className="text-xs font-normal text-[#6B7280]">Filled</span>
          </div>
          <span className="text-[11px] text-[#6B7280] font-mono">
            Ventilated & pest-controlled
          </span>
        </div>
      </div>

      {/* Recharts Real-Time Inventory Visualizer */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-tight">
                Real-Time Commodity Inventory Distribution & Quotas
              </h3>
              <p className="text-xs text-[#6B7280]">
                Interactive stock levels, export batch preparation, and warehouse quotas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7280] font-medium">Display Unit:</span>
            <div className="inline-flex bg-[#F3F4F6] p-0.5 rounded-lg border border-[#E5E7EB] text-xs">
              <button
                onClick={() => setChartMetric('tons')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  chartMetric === 'tons'
                    ? 'bg-white text-[#2563EB] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Metric Tons (MT)
              </button>
              <button
                onClick={() => setChartMetric('bags')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  chartMetric === 'bags'
                    ? 'bg-white text-[#2563EB] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Bag Count
              </button>
            </div>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="h-[340px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
                interval={0}
                angle={-12}
                textAnchor="end"
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => (chartMetric === 'tons' ? `${value} MT` : `${value}`)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 15, fontSize: '11px', fontFamily: 'sans-serif' }}
              />
              <Bar
                dataKey={chartMetric === 'tons' ? 'inStockTons' : 'inStockBags'}
                name={chartMetric === 'tons' ? 'Total In Warehouse (MT)' : 'In Stock (Bags)'}
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
              />
              <Bar
                dataKey={chartMetric === 'tons' ? 'readyForExportTons' : 'readyForExportBags'}
                name={chartMetric === 'tons' ? 'Port-Ready Export (MT)' : 'Port-Ready (Bags)'}
                fill="#16A34A"
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
              />
              <Bar
                dataKey={chartMetric === 'tons' ? 'dryingFloorTons' : 'dryingFloorBags'}
                name={chartMetric === 'tons' ? 'Sun-Drying Yard (MT)' : 'Drying Beds (Bags)'}
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Table by Produce */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#111827] uppercase tracking-tight flex items-center gap-2">
          <Warehouse className="w-4 h-4 text-[#2563EB]" />
          Depot Commodity Stockpile Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase font-mono text-[10px] border-b border-[#E5E7EB]">
              <tr>
                <th className="p-3">Produce Commodity</th>
                <th className="p-3">Warehouse Bay / Location</th>
                <th className="p-3 text-right">In Stock (Bags)</th>
                <th className="p-3 text-right">Tonnage (MT)</th>
                <th className="p-3 text-right">Drying Yard</th>
                <th className="p-3 text-right">Ready for Container</th>
                <th className="p-3 text-right">Export Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] font-mono">
              {inventory.map((item) => {
                const progressPct = Math.min(100, Math.round((item.inStockTons / item.targetExportTons) * 100));

                return (
                  <tr key={item.commodityId} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="p-3">
                      <span className="font-bold text-[#111827] block">{item.name}</span>
                      <span className="text-[10px] text-[#6B7280] font-sans">Updated {item.lastUpdated}</span>
                    </td>
                    <td className="p-3 text-[#4B5563]">{item.warehouseSection}</td>
                    <td className="p-3 text-right font-semibold text-[#111827]">{item.inStockBags.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-[#111827]">{item.inStockTons.toFixed(2)} MT</td>
                    <td className="p-3 text-right text-[#6B7280]">{item.dryingFloorBags} bags</td>
                    <td className="p-3 text-right text-green-600 font-semibold">{item.readyForExportBags} bags</td>
                    <td className="p-3 text-right">
                      <div className="w-28 ml-auto space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-[#6B7280]">{item.inStockTons.toFixed(0)}/{item.targetExportTons} MT</span>
                          <span className="text-[#2563EB] font-bold">{progressPct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#F3F4F6] rounded-full overflow-hidden border border-[#E5E7EB]">
                          <div
                            className="h-full bg-[#2563EB] rounded-full"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outbound Export Logistics Schedule */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#111827] uppercase tracking-tight flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#2563EB]" />
          Scheduled Transit Departures (Bo Depot &rarr; Freetown Port)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#111827] font-mono">CONVOY TRUCK #1 (40ft Container)</span>
              <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 text-[10px] font-bold border border-green-200">
                LOADING IN PROGRESS
              </span>
            </div>
            <p className="text-xs text-[#4B5563] font-mono">
              Cargo: 450 Bags Grade 1 Cocoa (28.8 Metric Tons)
            </p>
            <div className="flex justify-between text-[11px] text-[#6B7280] font-mono pt-2 border-t border-[#E5E7EB]">
              <span>Driver: Alpha Koroma</span>
              <span>Departure: Today 4:00 PM</span>
            </div>
          </div>

          <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#111827] font-mono">CONVOY TRUCK #2 (Heavy Tipper)</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] text-[10px] font-bold border border-blue-100">
                SCHEDULED TOMORROW
              </span>
            </div>
            <p className="text-xs text-[#4B5563] font-mono">
              Cargo: 380 Bags Clean Robusta Coffee (22.8 Metric Tons)
            </p>
            <div className="flex justify-between text-[11px] text-[#6B7280] font-mono pt-2 border-t border-[#E5E7EB]">
              <span>Destination: Queen Elizabeth II Quay</span>
              <span>Departure: Tomorrow 06:00 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

