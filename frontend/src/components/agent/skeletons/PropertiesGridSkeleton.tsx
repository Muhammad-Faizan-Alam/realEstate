import React from "react";
import AgentPropertyCardSkeleton from '@/components/apartments/AgentPropertyCard';

export const PropertiesGridSkeleton: React.FC = () => {
  return (
    <div className="p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      {/* Properties Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <AgentPropertyCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

// Sidebar Skeleton
export const SidebarSkeleton: React.FC = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 mt-16 p-6">
      {/* Agent Info Skeleton */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>

      {/* Sections Skeleton */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="mb-6">
          <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
          <div className="space-y-2">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};