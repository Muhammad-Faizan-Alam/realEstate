import React from 'react';

const StatsCard = ({ title, value, icon, color, change }) => {
  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>
          {change !== undefined && (
            <p className={`text-xs ${getChangeColor(change)} flex items-center space-x-1 mt-1`}>
              <span>{getChangeIcon(change)}</span>
              <span>{Math.abs(change)}% from last month</span>
            </p>
          )}
        </div>
        <div className={`text-2xl lg:text-3xl ${color} ml-4 flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;