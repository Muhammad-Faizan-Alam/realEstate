import React, { useState, useEffect } from "react";
import { Building, Home, MapPin, LucideHome, Layers, Filter, ChevronDown, ChevronRight, Building2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const states = ["All", "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];
const statusTypes = ["all", "verified", "unverified"];

interface AgentSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  activeState: string;
  setActiveState: (state: string) => void;
  activeStatus: string;
  setActiveStatus: (status: string) => void;
  agent: any;
  storiesTab: boolean;
  setStoriesTab: (storiesTab: boolean) => void;
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({
  activeSection,
  setActiveSection,
  activeState,
  setActiveState,
  activeStatus,
  setActiveStatus,
  agent,
  storiesTab,
  setStoriesTab
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

  const [openSections, setOpenSections] = useState({
    types: true,
    states: true,
    status: true
  });

  useEffect(() => {
    fetchCounts();
  }, [agent]);

  const fetchCounts = async () => {
    if (!agent?._id) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/agencies/${agent._id}/counts`
      );
      const data = await res.json();
      setCounts(data);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
    <div className="w-full h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 lg:p-6">
        {/* Agent Info */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          {agent?.image && (
            <img
              src={agent.image}
              alt={agent.user.name[0]}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{agent?.user.name}</h3>
            <Badge variant={agent?.verify ? "default" : "secondary"} className="text-xs mt-1">
              {agent?.verify ? "Verified" : "Unverified"}
            </Badge>
          </div>
        </div>

        {/* Agent Info */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate">Your Selected Cities</h3>
            <Badge variant="secondary" className="text-xs mt-1">
              {agent?.city.join(", ")}
            </Badge>
          </div>
        </div>

        {/* Agent Info */}
        <div className={`flex items-center gap-3 mb-6 p-2 rounded-md cursor-pointer
          ${storiesTab ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-50'}`}
          onClick={() => {setStoriesTab(!storiesTab)}}>
          <div className="min-w-0 flex flex-wrap items-center gap-2 cursor-pointer">
              <Video className="w-4 h-4" />
            <h3 className="font-semibold text-sm truncate">
              Stories</h3>
          </div>
        </div>

        {/* Property Type Sections */}
        <Collapsible open={openSections.types} onOpenChange={() => toggleSection('types')} className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full mb-3">
            <div className="flex flex-wrap gap-2">
              <Building2 className="h-3 w-3 flex-shrink-0" />
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Property Types
              </h4>
            </div>
            {openSections.types ? (
              <ChevronDown className="h-3 w-3 text-gray-500" />
            ) : (
              <ChevronRight className="h-3 w-3 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === section.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-left truncate">{section.label}</span>
                    {section.count > 0 && (
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {section.count}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* States Filter */}
        <Collapsible open={openSections.states} onOpenChange={() => toggleSection('states')} className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                States
              </h4>
            </div>
            {openSections.states ? (
              <ChevronDown className="h-3 w-3 text-gray-500" />
            ) : (
              <ChevronRight className="h-3 w-3 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-1">
              {states.map((state) => {
                const stateKey = state.toLowerCase();
                const count = stateCounts[stateKey as keyof typeof stateCounts] || 0;

                return (
                  <button
                    key={state}
                    onClick={() => setActiveState(stateKey)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeState === stateKey
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <span className="truncate">{state}</span>
                    {count > 0 && (
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Verification Status */}
        <Collapsible open={openSections.status} onOpenChange={() => toggleSection('status')} className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full mb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-3 w-3" />
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </h4>
            </div>
            {openSections.status ? (
              <ChevronDown className="h-3 w-3 text-gray-500" />
            ) : (
              <ChevronRight className="h-3 w-3 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-1">
              {statusTypes.map((status) => {
                const count = statusCounts[status as keyof typeof statusCounts] || 0;

                return (
                  <button
                    key={status}
                    onClick={() => setActiveStatus(status)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeStatus === status
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <span className="truncate capitalize">{status}</span>
                    {count > 0 && (
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default AgentSidebar;