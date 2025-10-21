// components/agency/PropertyFilters.tsx
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
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Type Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
          <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Sale">For Sale</SelectItem>
              <SelectItem value="Rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Beds Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Beds</label>
          <Select value={filters.beds} onValueChange={(value) => updateFilter("beds", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any beds" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Baths Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Baths</label>
          <Select value={filters.baths} onValueChange={(value) => updateFilter("baths", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any baths" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Current Status */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
          <Select value={filters.currentStatus} onValueChange={(value) => updateFilter("currentStatus", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
              <SelectItem value="Rented">Rented</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="mt-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Price Range: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
        </label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => updateFilter("priceRange", value)}
          max={10000000}
          step={100000}
          className="mt-2"
        />
      </div>

      {/* Area Range Slider */}
      <div className="mt-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Area: {filters.area[0]} - {filters.area[1]} sqft
        </label>
        <Slider
          value={filters.area}
          onValueChange={(value) => updateFilter("area", value)}
          max={10000}
          step={100}
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default PropertyFilters;