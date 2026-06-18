import React from 'react';
import { Target, Car, Zap, Utensils, Lightbulb, ClipboardList } from 'lucide-react';

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

  // Local state for interactive tasks
  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    if (!personalized_actionable_tip) {
      setTasks([]);
      return;
    }
    const lines = personalized_actionable_tip.split('\n');
    const parsed = lines
      .map(line => {
        // Clean leading dashes, asterisks, and whitespaces
        let cleaned = line.replace(/^[-*\s]+/, '');
        // Clean trailing dashes, asterisks, and whitespaces
        cleaned = cleaned.replace(/[-*\s]+$/, '');
        return cleaned.trim();
      })
      .filter(text => text.length > 0)
      .map((text, idx) => ({
        id: `${idx}-${text}`,
        text,
        completed: false,
      }));
    setTasks(parsed);
  }, [personalized_actionable_tip]);

  const handleToggleTask = (id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;

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

          {/* AI Suggestions Section */}
          <div className="mt-10 pt-10 border-t border-gray-100">
            <div className="bg-amber-50/60 rounded-3xl p-6 border border-amber-200/50 flex flex-col md:flex-row items-start gap-5">
              <div className="p-3 bg-amber-100 text-amber-700 shrink-0 mt-1 shadow-sm rounded-2xl">
                <Lightbulb size={24} />
              </div>
              <div className="flex-1 w-full">
                <h4 className="font-extrabold text-amber-900 mb-4 text-lg">AI Insights & Suggestions</h4>
                <ul className="space-y-3">
                  {tasks.map((task, idx) => (
                    <li key={task.id} className="flex items-start gap-3 text-amber-900 leading-relaxed text-sm bg-white/80 p-4 rounded-xl border border-amber-100/50 shadow-xs">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white text-xs font-black shadow-xs">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{task.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive To-Do List Section */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="bg-green-50/80 rounded-3xl p-6 border border-green-200/60 flex flex-col md:flex-row items-start gap-5">
              <div className="p-3 bg-green-200/80 rounded-2xl text-green-700 shrink-0 mt-1 shadow-sm">
                <ClipboardList size={24} />
              </div>
              <div className="flex-1 w-full">
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <h4 className="font-extrabold text-green-900 text-lg shrink-0">Your Interactive To-Do List</h4>
                    <span 
                      className={`text-xs font-extrabold px-3.5 py-1.5 rounded-xl select-none transition-all duration-300 shadow-xs leading-normal
                        ${completedCount === totalCount && totalCount > 0
                          ? 'bg-green-700 text-white ring-4 ring-green-600/20 animate-in zoom-in-95 duration-300'
                          : 'bg-green-200/80 text-green-800'
                        }
                      `}
                      aria-live="polite"
                    >
                      {completedCount === totalCount && totalCount > 0
                        ? `${completedCount}/${totalCount} Steps Completed! 🎉 Excellent job reducing your footprint today!`
                        : `${completedCount}/${totalCount} Steps Completed`
                      }
                    </span>
                  </div>
                  {totalCount > 0 && (
                    <div className="w-full bg-green-200/40 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-green-700 h-1.5 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${(completedCount / totalCount) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <ul className="space-y-3" aria-label="Micro-Goals checklist">
                  {tasks.map((task) => (
                    <ChecklistRow 
                      key={task.id} 
                      task={task} 
                      onToggle={() => handleToggleTask(task.id)} 
                    />
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

const ChecklistRow = ({ task, onToggle }) => {
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <li 
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="checkbox"
      aria-checked={task.completed}
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2
        ${task.completed 
          ? 'bg-green-100/30 border-green-200/40 opacity-70' 
          : 'bg-white border-green-100/80 hover:bg-green-50/20 hover:border-green-200/50 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-center justify-center shrink-0 mt-0.5">
        <div 
          className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all
            ${task.completed 
              ? 'bg-green-700 border-green-700 text-white shadow-xs' 
              : 'border-green-700/60 bg-white hover:border-green-700'
            }
          `}
        >
          {task.completed && (
            <svg 
              className="h-3 w-3 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>
      <span 
        className={`text-sm leading-relaxed transition-all
          ${task.completed 
            ? 'line-through text-green-700/80 font-medium' 
            : 'text-green-800'
          }
        `}
      >
        {task.text}
      </span>
    </li>
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
