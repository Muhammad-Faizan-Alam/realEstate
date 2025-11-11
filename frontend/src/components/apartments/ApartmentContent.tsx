import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Grid3X3,
  List,
  Home,
  Filter,
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Share2,
  X,
  Navigation,
} from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import PropertyCard from "./PropertyCard";
import { Badge } from "../ui/badge";

interface ApartmentContentProps {
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
  viewType: "grid" | "list";
  setViewType: (value: "grid" | "list") => void;
  filteredApartments: any[];
  resetFilters: () => void;
  state?: string;
  popularAreas: string[];
  faqData: { question: string; answer: string }[];
  developers: { name: string; logo: string }[];
  apartmentTypes: { type: string; description: string }[];
  propertyType?: string;
  transactionType?: string;
  selectedCoordinates?: { lat: number; lng: number } | null;
  isFilteringByRadius?: boolean;
  onToggleRadiusFilter?: () => void;
  onClearRadiusFilter?: () => void;
}

const ApartmentContent: React.FC<ApartmentContentProps> = ({
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
  viewType,
  setViewType,
  filteredApartments,
  resetFilters,
  popularAreas,
  faqData,
  developers,
  apartmentTypes,
  state,
  propertyType,
  transactionType,
  selectedCoordinates,
  isFilteringByRadius = false,
  onToggleRadiusFilter,
  onClearRadiusFilter,
}) => {
  // Format location name for display
  const getDisplayLocation = () => {
    if (selectedCoordinates && location && location !== "any") {
      return location;
    }
    return filteredApartments.length > 0
      ? filteredApartments[0]?.state
      : state
      ? state.replace(/-/g, " ")
      : "in Dubai";
  };

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{transactionType}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{propertyType} in Dubai</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <FilterSidebar
            beds={beds}
            setBeds={setBeds}
            baths={baths}
            setBaths={setBaths}
            isOffPlan={isOffPlan}
            setIsOffPlan={setIsOffPlan}
            location={location}
            setLocation={setLocation}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            formatPrice={formatPrice}
            popularAreas={popularAreas}
          />
          <div className="lg:col-span-3">
            {/* Radius Filter Status */}
            {selectedCoordinates && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Location Filter Active
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <MapPin className="w-3 h-3 mr-1" />
                      {location && location !== "any" ? location : "Selected Area"}
                    </Badge>
                    <Badge variant="outline" className="bg-white">
                      Within 10km radius
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="radiusToggle"
                        checked={isFilteringByRadius}
                        onChange={onToggleRadiusFilter}
                        className="w-4 h-4 text-blue-600 bg-white border-blue-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="radiusToggle" className="text-sm text-blue-700 font-medium">
                        Apply Radius Filter
                      </label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onClearRadiusFilter}
                      className="h-8 px-3 text-blue-600 border-blue-300 hover:bg-blue-100"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
                {!isFilteringByRadius && (
                  <p className="text-xs text-blue-600 mt-2">
                    Radius filter is disabled. Showing all properties in the area.
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-4">
                  {propertyType ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1) : "Apartments"} for {transactionType === "sale" ? "Sale" : "Rent"}{" "}
                  {getDisplayLocation()}
                </h1>

                <div className="flex items-center gap-4 text-muted-foreground">
                  <span>{filteredApartments.length} properties found</span>
                  {selectedCoordinates && isFilteringByRadius && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Navigation className="w-3 h-3 mr-1" />
                      Within 10km radius
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={viewType === "grid" ? "default" : "outline"}
                  onClick={() => setViewType("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewType === "list" ? "default" : "outline"}
                  onClick={() => setViewType("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {filteredApartments.length > 0 ? (
              <div
                className={`grid gap-6 mb-8 ${
                  viewType === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredApartments.map((property) => (
                  <PropertyCard 
                    key={property._id} 
                    property={property}
                    showDistance={isFilteringByRadius && selectedCoordinates}
                    centerCoordinates={selectedCoordinates}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Home className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    No properties found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedCoordinates && isFilteringByRadius 
                      ? "No properties found within 10km of your selected location. Try adjusting your filters or expanding the search area."
                      : "No properties match your current search criteria. Try adjusting your filters to see more results."
                    }
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" onClick={resetFilters}>
                      Reset All Filters
                    </Button>
                    {selectedCoordinates && (
                      <Button variant="outline" onClick={onClearRadiusFilter}>
                        Clear Location
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold mb-6">
                  Invest in Off-Plan {propertyType ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1) : "Apartments"}
                </h2>
                <div className="">
                  <Card className="p-6">
                    <h3 className="font-semibold mb-3">Off-Plan Benefits</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Lower prices compared to ready properties</li>
                      <li>• Flexible payment plans</li>
                      <li>• Potential for capital appreciation</li>
                      <li>• Choice of premium units</li>
                    </ul>
                  </Card>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">
                  Guide to {transactionType === "sale" ? "Buying" : "Renting"} {propertyType ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1) : "an Apartment"} {getDisplayLocation()}
                </h2>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground mb-4">
                    {getDisplayLocation()}'s real estate market offers exceptional opportunities
                    for both residents and investors. With its strategic
                    location, world-class infrastructure, and tax-free
                    environment, {getDisplayLocation()} has become a preferred destination for
                    property investment.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    When {transactionType === "sale" ? "buying" : "renting"} {propertyType ? propertyType : "an apartment"} in {getDisplayLocation()}, consider factors such as
                    location, developer reputation, payment plans, and future
                    development projects in the area. Popular areas offer different
                    lifestyle options and investment potential.
                  </p>
                  <p className="text-muted-foreground">
                    The {transactionType === "sale" ? "buying" : "renting"} process typically involves securing pre-approval,
                    choosing a property, conducting due diligence, and
                    completing the transaction through the Dubai Land
                    Department. Professional guidance from licensed real estate
                    agents can help navigate the process smoothly.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">
                  Top {propertyType ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1) : "Apartment"} Types for {transactionType === "sale" ? "Sale" : "Rent"} {getDisplayLocation()}
                </h2>
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {apartmentTypes.map((type, index) => (
                    <Card
                      key={index}
                      className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <Home className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold mb-1">{type.type}</h3>
                      <p className="text-xs text-muted-foreground">
                        {type.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6">
                  Top Locations with High ROI
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {["JVC", "Business Bay", "Dubai South", "Al Furjan"].map(
                    (area) => (
                      <Card key={area} className="p-4 text-center">
                        <h3 className="font-semibold mb-2">{area}</h3>
                        <p className="text-2xl font-bold text-primary mb-1">
                          8-12%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Annual ROI
                        </p>
                      </Card>
                    )
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApartmentContent;