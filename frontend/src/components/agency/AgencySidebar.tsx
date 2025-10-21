// components/agency/AgencySidebar.tsx (Updated)
import React, { useState, useEffect } from "react";
import { Building, Home, MapPin, LucideHome, Layers, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const states = ["All", "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];
const statusTypes = ["all", "verified", "unverified"];

interface AgencySidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  activeState: string;
  setActiveState: (state: string) => void;
  activeStatus: string;
  setActiveStatus: (status: string) => void;
  agency: any;
}

const AgencySidebar: React.FC<AgencySidebarProps> = ({
  activeSection,
  setActiveSection,
  activeState,
  setActiveState,
  activeStatus,
  setActiveStatus,
  agency
}) => {
  const [counts, setCounts] = useState({
    types: {
      apartments: 0,
      villas: 0,
      townhouse: 0,
      others: 0
    },
    states: {
      dubai: 0,
      abuDhabi: 0,
      sharjah: 0,
      ajman: 0,
      rasAlKhaimah: 0,
      fujairah: 0,
      ummAlQuwain: 0
    },
    status: {
      verified: 0,
      unverified: 0
    }
  });

  useEffect(() => {
    fetchCounts();
  }, [agency]);

  const fetchCounts = async () => {
    if (!agency?._id) return;
    
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/agencies/${agency._id}/counts`
      );
      const data = await res.json();
      setCounts(data);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const sections = [
    { id: "apartments", label: "Apartments", icon: Building, count: counts.types.apartments },
    { id: "villas", label: "Villas", icon: Home, count: counts.types.villas },
    { id: "townhouse", label: "Townhouse", icon: LucideHome, count: counts.types.townhouse },
    { id: "others", label: "Others", icon: Layers, count: counts.types.others }
  ];

  const stateCounts = {
    all: Object.values(counts.states).reduce((sum, count) => sum + count, 0),
    dubai: counts.states.dubai,
    "abu dhabi": counts.states.abuDhabi,
    sharjah: counts.states.sharjah,
    ajman: counts.states.ajman,
    "ras al khaimah": counts.states.rasAlKhaimah,
    fujairah: counts.states.fujairah,
    "umm al quwain": counts.states.ummAlQuwain
  };

  const statusCounts = {
    all: counts.status.verified + counts.status.unverified,
    verified: counts.status.verified,
    unverified: counts.status.unverified
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 mt-16 pb-10 overflow-y-auto">
      <div className="p-6">
        {/* Agency Info */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          {agency?.logo && (
            <img
              src={agency.logo}
              alt={agency.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          )}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{agency?.name}</h3>
            <Badge variant={agency?.verify ? "default" : "secondary"} className="text-xs">
              {agency?.verify ? "Verified" : "Unverified"}
            </Badge>
          </div>
        </div>

        {/* Property Type Sections */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Property Types
          </h4>
          <div className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{section.label}</span>
                  {section.count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {section.count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* States Filter */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            States
          </h4>
          <div className="space-y-1">
            {states.map((state) => {
              const stateKey = state.toLowerCase();
              const count = stateCounts[stateKey as keyof typeof stateCounts] || 0;
              
              return (
                <button
                  key={state}
                  onClick={() => setActiveState(stateKey)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeState === stateKey
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{state}</span>
                  {count > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Verification Status */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Filter className="h-3 w-3" />
            Status
          </h4>
          <div className="space-y-1">
            {statusTypes.map((status) => {
              const count = statusCounts[status as keyof typeof statusCounts] || 0;
              
              return (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeStatus === status
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  {count > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencySidebar;