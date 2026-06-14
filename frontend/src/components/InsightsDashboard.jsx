import React from 'react';
import { Target, Car, Zap, Utensils } from 'lucide-react';

const InsightsDashboard = ({ data, isLoading }) => {
  // 1. Skeleton Loading State
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl shadow-xl border border-green-50 overflow-hidden animate-pulse">
          
          {/* Skeleton Header */}
          <div className="bg-green-100 p-8 flex flex-col items-center justify-center min-h-[200px]">
            <div className="h-4 bg-green-200/60 rounded w-48 mb-6"></div>
            <div className="h-16 bg-green-200/60 rounded w-64"></div>
          </div>

          <div className="p-8">
            {/* Skeleton Breakdown */}
            <div className="h-6 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full">
                  <div className="flex justify-between mb-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full w-full"></div>
                </div>
              ))}
            </div>

            {/* Skeleton Tips */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100">
                <div className="h-5 bg-green-200/50 rounded w-56 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-12 bg-white/60 rounded-lg w-full"></div>
                  <div className="h-12 bg-white/60 rounded-lg w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. No Data State (Fallback, shouldn't normally render if guarded properly in App.jsx)
  if (!data) return null;

  // 3. Results State
  const { total_co2_kg, category_breakdown, personalized_actionable_tip } = data;
  
  const maxCategory = Math.max(
    category_breakdown.transportation,
    category_breakdown.food,
    category_breakdown.energy
  );
  
  const getPercentage = (value) => maxCategory > 0 ? (value / maxCategory) * 100 : 0;

  // Parse the tips into a list of items
  const tips = React.useMemo(() => {
    if (!personalized_actionable_tip) return [];
    let parts = personalized_actionable_tip.split('\n');
    if (parts.length === 1 && (parts[0].includes(' - ') || parts[0].includes(' -'))) {
      parts = parts[0].split(/\s+-\s+/);
    }
    return parts
      .map(tip => tip.replace(/^[-*\s]+/, '').trim())
      .filter(tip => tip.length > 0);
  }, [personalized_actionable_tip]);

  return (
    <div className="w-full max-w-2xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out">
      <div className="bg-white rounded-3xl shadow-2xl shadow-green-900/10 border border-green-100 overflow-hidden">
        
        {/* Header - Total CO2 */}
        <div className="bg-gradient-to-br from-green-500 to-green-700 p-8 md:p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
            <Target size={160} />
          </div>
          <h3 className="text-green-100 font-bold tracking-widest uppercase text-xs mb-3 relative z-10">
            Estimated Daily Footprint
          </h3>
          <div className="flex items-end justify-center gap-2 relative z-10">
            <span className="text-7xl font-black tracking-tighter">{total_co2_kg.toFixed(1)}</span>
            <span className="text-2xl font-bold text-green-200 mb-2">kg CO₂</span>
          </div>
        </div>

        <div className="p-8 md:p-10">
          {/* Category Breakdown */}
          <h4 className="text-gray-900 font-extrabold text-xl mb-8">
            Emission Breakdown
          </h4>
          
          <div className="space-y-7">
            <CategoryRow 
              icon={<Car size={20} />} 
              label="Transportation" 
              value={category_breakdown.transportation} 
              percentage={getPercentage(category_breakdown.transportation)}
              color="bg-blue-500"
            />
            <CategoryRow 
              icon={<Utensils size={20} />} 
              label="Food" 
              value={category_breakdown.food} 
              percentage={getPercentage(category_breakdown.food)}
              color="bg-orange-400"
            />
            <CategoryRow 
              icon={<Zap size={20} />} 
              label="Energy" 
              value={category_breakdown.energy} 
              percentage={getPercentage(category_breakdown.energy)}
              color="bg-yellow-400"
            />
          </div>

          <div className="mt-10 pt-10 border-t border-gray-100">
            <div className="bg-green-50/80 rounded-3xl p-6 border border-green-200/60 flex flex-col md:flex-row items-start gap-5">
              <div className="p-3 bg-green-200/80 rounded-2xl text-green-700 shrink-0 mt-1 shadow-sm">
                <Target size={24} />
              </div>
              <div className="flex-1 w-full">
                <h4 className="font-extrabold text-green-900 mb-4 text-lg">Your Micro-Goals for Tomorrow</h4>
                <ul className="space-y-3">
                  {tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-green-800 leading-relaxed text-sm bg-white/70 p-4 rounded-xl border border-green-100/80 shadow-sm transition-all hover:bg-white hover:shadow-md">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-white text-xs font-black shadow-sm">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const CategoryRow = ({ icon, label, value, percentage, color }) => (
  <div className="flex flex-col gap-2.5">
    <div className="flex items-center justify-between text-base">
      <div className="flex items-center gap-3 text-gray-700 font-semibold">
        <span className="text-gray-400">{icon}</span>
        {label}
      </div>
      <span className="font-bold text-gray-900">{value.toFixed(1)} kg</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <div 
        className={`h-3 rounded-full ${color} transition-all duration-1000 ease-out`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

export default InsightsDashboard;
