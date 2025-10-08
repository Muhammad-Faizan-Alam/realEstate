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
}) => {
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-4">
                  Apartments for Sale{" "}
                  {filteredApartments.length > 0
                    ? filteredApartments[0].state
                    : state
                    ? state.replace(/-/g, " ")
                    : "in Dubai"}
                </h1>

                <p className="text-muted-foreground">
                  {filteredApartments.length} properties found
                </p>
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
                  <PropertyCard key={property._id} property={property} />
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
                    No properties match your current search criteria. Try
                    adjusting your filters to see more results.
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
            {/* <Pagination className="mb-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination> */}
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold mb-6">
                  Invest in Off-Plan Apartments
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
                  {/* <Card className="p-6">
                    <h3 className="font-semibold mb-3">New Projects</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Dubai South developments</li>
                      <li>• Mohammed Bin Rashid City</li>
                      <li>• Dubai Hills Estate</li>
                      <li>• Meydan City projects</li>
                    </ul>
                  </Card> */}
                </div>
              </section>
              <section>
                {/* <h2 className="text-2xl font-bold mb-6">
                  Guide to Buying an Apartment in Dubai
                </h2> */}
                <h2 className="text-2xl font-bold mb-4">
                  Guide to Buying an Apartment{" "}
                  {filteredApartments.length > 0
                    ? filteredApartments[0].state
                    : state
                    ? state.replace(/-/g, " ")
                    : "in Dubai"}
                </h2>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground mb-4">
                    Dubai's real estate market offers exceptional opportunities
                    for both residents and investors. With its strategic
                    location, world-class infrastructure, and tax-free
                    environment, Dubai has become a preferred destination for
                    property investment.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    When buying an apartment in Dubai, consider factors such as
                    location, developer reputation, payment plans, and future
                    development projects in the area. Popular areas like
                    Downtown Dubai, Dubai Marina, and JVC offer different
                    lifestyle options and investment potential.
                  </p>
                  <p className="text-muted-foreground">
                    The buying process typically involves securing pre-approval,
                    choosing a property, conducting due diligence, and
                    completing the transaction through the Dubai Land
                    Department. Professional guidance from licensed real estate
                    agents can help navigate the process smoothly.
                  </p>
                </div>
              </section>
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  Top Apartment Types for Sale{" "}
                  {filteredApartments.length > 0
                    ? filteredApartments[0].state
                    : state
                    ? state.replace(/-/g, " ")
                    : "in Dubai"}
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
              {/* <section>
                <h2 className="text-2xl font-bold mb-4">
                  Popular Developers for Apartments{" "}
                  {filteredApartments.length > 0
                    ? filteredApartments[0].state
                    : state
                    ? state.replace(/-/g, " ")
                    : "in Dubai"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {developers.map((developer, index) => (
                    <Card
                      key={index}
                      className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <img
                        src={developer.logo}
                        alt={developer.name}
                        className="w-16 h-16 mx-auto mb-2 rounded object-cover"
                      />
                      <p className="text-sm font-medium">{developer.name}</p>
                    </Card>
                  ))}
                </div>
              </section> */}
              {/* <section>
                <h2 className="text-2xl font-bold mb-4">
                  Popular Searches of Apartments for Sale{" "}
                  {filteredApartments.length > 0
                    ? filteredApartments[0].state
                    : state
                    ? state.replace(/-/g, " ")
                    : "in Dubai"}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">By Location</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularAreas.map((area) => (
                        <Badge
                          key={area}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        >
                          {area} Apartments
                        </Badge>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">By Type</h3>
                    <div className="space-y-2">
                      {apartmentTypes.map((type, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground mr-2"
                        >
                          {type.type} Apartments Dubai
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              </section> */}
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
              {/* <section>
                <h2 className="text-2xl font-bold mb-6">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqData.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApartmentContent;
