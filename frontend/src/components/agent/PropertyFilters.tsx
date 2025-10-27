import React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface PropertyFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ filters, setFilters }) => {
  const updateFilter = (key: string, value: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      priceRange: [0, 10000000],
      beds: "all",
      baths: "all",
      area: [0, 10000],
      developer: "all",
      offPlan: "all",
      currentStatus: "all"
    });
  };

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `AED ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `AED ${(value / 1000).toFixed(0)}K`;
    }
    return `AED ${value}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
          Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 self-start sm:self-center">
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Type</label>
          <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">All Types</SelectItem>
              <SelectItem value="Sale" className="text-sm">For Sale</SelectItem>
              <SelectItem value="Rent" className="text-sm">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Beds Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Beds</label>
          <Select value={filters.beds} onValueChange={(value) => updateFilter("beds", value)}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Any beds" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">Any</SelectItem>
              <SelectItem value="1" className="text-sm">1+</SelectItem>
              <SelectItem value="2" className="text-sm">2+</SelectItem>
              <SelectItem value="3" className="text-sm">3+</SelectItem>
              <SelectItem value="4" className="text-sm">4+</SelectItem>
              <SelectItem value="5" className="text-sm">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Baths Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Baths</label>
          <Select value={filters.baths} onValueChange={(value) => updateFilter("baths", value)}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Any baths" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">Any</SelectItem>
              <SelectItem value="1" className="text-sm">1+</SelectItem>
              <SelectItem value="2" className="text-sm">2+</SelectItem>
              <SelectItem value="3" className="text-sm">3+</SelectItem>
              <SelectItem value="4" className="text-sm">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Current Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select value={filters.currentStatus} onValueChange={(value) => updateFilter("currentStatus", value)}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">All Status</SelectItem>
              <SelectItem value="Available" className="text-sm">Available</SelectItem>
              <SelectItem value="Sold" className="text-sm">Sold</SelectItem>
              <SelectItem value="Rented" className="text-sm">Rented</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price Range Slider */}
      {/* <div className="mt-4 sm:mt-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Price Range: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
        </label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => updateFilter("priceRange", value)}
          max={10000000}
          step={100000}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatPrice(0)}</span>
          <span>{formatPrice(10000000)}</span>
        </div>
      </div> */}

      {/* Area Range Slider */}
      {/* <div className="mt-4 sm:mt-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Area: {filters.area[0]} - {filters.area[1]} sqft
        </label>
        <Slider
          value={filters.area}
          onValueChange={(value) => updateFilter("area", value)}
          max={10000}
          step={100}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 sqft</span>
          <span>10,000 sqft</span>
        </div>
      </div> */}
    </div>
  );
};

export default PropertyFilters;