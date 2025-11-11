"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { handleImageError, getPropertyImageFallback } from "@/lib/imageUtils";

interface Agent {
  id: string;
  name: string;
  image: string;
  properties: number;
}

interface FilterSidebarProps {
  beds: string;
  setBeds: (value: string) => void;
  baths: string;
  setBaths: (value: string) => void;
  isOffPlan: boolean;
  setIsOffPlan: (value: boolean) => void;
  location: string;
  setLocation: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  formatPrice: (price: number) => string;
  popularAreas: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  beds,
  setBeds,
  baths,
  setBaths,
  isOffPlan,
  setIsOffPlan,
  location,
  setLocation,
  priceRange,
  setPriceRange,
  formatPrice,
  popularAreas,
}) => {
  const [agents, setAgents] = useState<Agent[]>([]);

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/agents`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error("Failed to fetch agents");
        const data = await res.json();
        setAgents(data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, []);

  return (
    <div className="lg:col-span-1">
      {/* Filters */}
      <Card className="p-6 sticky top-28">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <div className="space-y-6">
          {/* Location */}
          {/* <div>
            <label className="text-sm font-medium mb-2 block">Location</label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Location</SelectItem>
                {popularAreas.map((area) => (
                  <SelectItem key={area} value={area.toLowerCase()}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Price Range: AED {formatPrice(priceRange[0])} - AED{" "}
              {formatPrice(priceRange[1])}
            </label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={5000000}
              min={500}
              step={50000}
              className="mt-2"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="text-sm font-medium mb-2 block">Bedrooms</label>
            <Select value={beds} onValueChange={setBeds}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4+">4+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="text-sm font-medium mb-2 block">Bathrooms</label>
            <Select value={baths} onValueChange={setBaths}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1 Bathroom</SelectItem>
                <SelectItem value="2">2 Bathrooms</SelectItem>
                <SelectItem value="3">3 Bathrooms</SelectItem>
                <SelectItem value="4+">4+ Bathrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Off-Plan */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Off-Plan Only</label>
            <Switch checked={isOffPlan} onCheckedChange={setIsOffPlan} />
          </div>
        </div>
      </Card>

      {/* Popular Areas */}
      {/* <Card className="p-6 mt-4">
        <h3 className="font-semibold mb-4">Popular Areas</h3>
        <div className="flex flex-wrap gap-2">
          {popularAreas.slice(0, 8).map((area) => (
            <Badge
              key={area}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              {area}
            </Badge>
          ))}
        </div>
      </Card> */}

      {/* Top Agents */}
      {/* <Card className="p-6 mt-4">
        <h3 className="font-semibold mb-4">Top Agents in Dubai</h3>
        <div className="space-y-3">
          {agents.slice(0, 3).map((agent) => (
            <div key={agent.id} className="flex items-center gap-3">
              <img
                src={agent.image || getPropertyImageFallback(agent.id)}
                alt={agent.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => handleImageError(e, agent.id)}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{agent.name}</p>
                <p className="text-xs text-muted-foreground">
                  {agent.properties} properties
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card> */}
    </div>
  );
};

export default FilterSidebar;
