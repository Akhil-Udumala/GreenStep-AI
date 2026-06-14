import React from 'react';
import { Target, Car, Zap, Utensils, Info } from 'lucide-react';

const InsightsDashboard = ({ data }) => {
  if (!data) return null;

  const { total_co2_kg, category_breakdown, personalized_actionable_tip } = data;
  
  // Calculate percentages for the simple progress bars
  const maxCategory = Math.max(
    category_breakdown.transportation,
    category_breakdown.food,
    category_breakdown.energy
  );
  
  const getPercentage = (value) => maxCategory > 0 ? (value / maxCategory) * 100 : 0;

  // Parse the tips into a list of items (robust to both newlines and inline dashes)
  const tips = React.useMemo(() => {
    if (!personalized_actionable_tip) return [];
    
    // Split by newlines first
    let parts = personalized_actionable_tip.split('\n');
    
    // If it's single line but contains multiple inline dashes, split by them
    if (parts.length === 1 && (parts[0].includes(' - ') || parts[0].includes(' -'))) {
      parts = parts[0].split(/\s+-\s+/);
    }
    
    return parts
      .map(tip => tip.replace(/^[-*\s]+/, '').trim())
      .filter(tip => tip.length > 0);
  }, [personalized_actionable_tip]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
        
        {/* Header - Total CO2 */}
        <div className="bg-gradient-to-br from-green-500 to-green-700 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Target size={120} />
          </div>
          <h3 className="text-green-100 font-medium tracking-wide uppercase text-sm mb-2 relative z-10">
            Estimated Daily Footprint
          </h3>
          <div className="flex items-end justify-center gap-2 relative z-10">
            <span className="text-6xl font-black tracking-tighter">{total_co2_kg.toFixed(1)}</span>
            <span className="text-2xl font-bold text-green-200 mb-2">kg CO₂</span>
          </div>
        </div>

        <div className="p-8">
          {/* Category Breakdown */}
          <h4 className="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">
            Emission Breakdown
          </h4>
          
          <div className="space-y-6">
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

          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="bg-green-50 rounded-xl p-6 border border-green-200 flex items-start gap-4">
              <div className="p-2 bg-green-200 rounded-full text-green-700 shrink-0 mt-1">
                <Target size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-green-800 mb-3">Your Micro-Goals for Tomorrow</h4>
                <ul className="space-y-2.5">
                  {tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-green-700 leading-relaxed text-sm bg-white/60 p-3 rounded-lg border border-green-100/50 shadow-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-200 text-green-800 text-xs font-extrabold mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
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
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-gray-700 font-medium">
        <span className="text-gray-400">{icon}</span>
        {label}
      </div>
      <span className="font-bold text-gray-800">{value.toFixed(1)} kg</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <div 
        className={`h-2.5 rounded-full ${color} transition-all duration-1000 ease-out`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

export default InsightsDashboard;
