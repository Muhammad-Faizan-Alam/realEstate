import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApartmentContent from "@/components/apartments/ApartmentContent";
import { popularAreas, faqData, apartmentTypes } from "@/data/apartmentData";

// Utility function to calculate distance between coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Function to filter properties within radius
const filterPropertiesWithinRadius = (
  properties: any[], 
  centerLat: number, 
  centerLng: number, 
  radiusKm: number = 10
) => {
  return properties.filter(property => {
    // Check if property has coordinates
    if (!property.latitude || !property.longitude) {
      return false; // Skip properties without coordinates
    }
    
    const distance = calculateDistance(
      centerLat, 
      centerLng,
      parseFloat(property.latitude),
      parseFloat(property.longitude)
    );
    return distance <= radiusKm;
  });
};

const Properties = () => {
    const [searchParams] = useSearchParams();
    const { state } = useParams();

    const [viewType, setViewType] = useState<"grid" | "list">("grid");
    const [propertyType, setPropertyType] = useState("apartment");
    const [priceRange, setPriceRange] = useState([500, 5000000]);
    const [beds, setBeds] = useState("any");
    const [baths, setBaths] = useState("any");
    const [isOffPlan, setIsOffPlan] = useState(false);
    const [location, setLocation] = useState("any");
    const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);

    const [properties, setProperties] = useState<any[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
    const [developers, setDevelopers] = useState<any[]>([]);
    const [isFilteringByRadius, setIsFilteringByRadius] = useState(false);

    // Fetch properties
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/properties`, {
                    credentials: 'include',
                });
                const data = await response.json();
                console.log("Fetched Properties:", data);
                
                setPropertyType(searchParams.get("property") || "apartment");
                let transactionType = searchParams.get("type");
                if (searchParams.get("type") === "buy") {
                    transactionType = "sale";
                }
                console.log("Transaction Type:", transactionType);

                // Check if we have coordinates from search
                const searchLat = searchParams.get("lat");
                const searchLng = searchParams.get("lng");
                const searchLocation = searchParams.get("location");

                if (searchLat && searchLng) {
                  setSelectedCoordinates({
                    lat: parseFloat(searchLat),
                    lng: parseFloat(searchLng)
                  });
                  setIsFilteringByRadius(true);
                }

                if (searchLocation) {
                  setLocation(searchLocation);
                }

                if (!searchParams.get("property")) {
                    setProperties(data);
                    setFilteredProperties(data);
                    return;
                }

                // Filter by propertyType and transactionType
                const filteredType = data.filter((p: any) => 
                  p.propertyType?.toLowerCase() === (searchParams.get("property")?.toLowerCase())
                );
                const filtered = transactionType ? 
                  filteredType.filter((p: any) => 
                    p.propertyInfo?.purpose?.toLowerCase() === transactionType.toLowerCase()
                  ) : filteredType;
                
                console.log("Filtered Properties by type:", filtered);
                setProperties(filtered);
                setFilteredProperties(filtered);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };
        fetchProjects();
    }, [searchParams]);

    // Fetch developers
    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/developers`, {
                    credentials: 'include',
                });
                const data = await response.json();
                setDevelopers(data);
            } catch (error) {
                console.error("Error fetching developers:", error);
            }
        };
        fetchDevelopers();
    }, []);

    // Sync filters with URL params
    useEffect(() => {
        const urlBeds = searchParams.get("beds") || "any";
        const urlBaths = searchParams.get("baths") || "any";
        const urlLocation = searchParams.get("location") || "any";
        const urlPriceRange = searchParams.get("priceRange");
        const urlIsOffPlan = searchParams.get("isOffPlan") === "true";
        const urlLat = searchParams.get("lat");
        const urlLng = searchParams.get("lng");

        setBeds(urlBeds);
        setBaths(urlBaths);
        setLocation(urlLocation);
        setIsOffPlan(urlIsOffPlan);

        if (urlLat && urlLng) {
          setSelectedCoordinates({
            lat: parseFloat(urlLat),
            lng: parseFloat(urlLng)
          });
          setIsFilteringByRadius(true);
        }

        if (urlPriceRange) {
            const priceMap: { [key: string]: [number, number] } = {
                "up to aed 500k": [0, 500000],
                "aed 500k - 1m": [500000, 1000000],
                "aed 1m - 2m": [1000000, 2000000],
                "aed 2m - 5m": [2000000, 5000000],
                "aed 5m+": [5000000, 10000000],
            };
            const range = priceMap[urlPriceRange.toLowerCase()];
            if (range) setPriceRange(range);
        }
    }, [searchParams]);

    // Apply filters including radius filtering
    useEffect(() => {
        const applyFilters = () => {
            let filtered = properties;

            // First apply radius filtering if coordinates are selected
            if (selectedCoordinates && isFilteringByRadius) {
                filtered = filterPropertiesWithinRadius(
                    filtered, 
                    selectedCoordinates.lat, 
                    selectedCoordinates.lng, 
                    10 // 10km radius
                );
                console.log(`Properties within 10km radius: ${filtered.length}`);
            }

            // Then apply other filters
            filtered = filtered.filter((apartment) => {
                const bedMatch =
                    beds === "any" ||
                    (beds === "studio" && apartment.beds === 0) ||
                    (beds !== "studio" && apartment.beds?.toString() === beds);

                const bathMatch =
                    baths === "any" || apartment.baths?.toString() === baths;

                const locationMatch =
                    location === "any" ||
                    apartment.location?.toLowerCase().includes(location.toLowerCase());

                // Handle price conversion safely
                let numericPrice = 0;
                if (apartment.price) {
                    if (typeof apartment.price === 'string') {
                        numericPrice = Number(apartment.price.replace(/[^\d]/g, "")) || 0;
                    } else if (typeof apartment.price === 'number') {
                        numericPrice = apartment.price;
                    }
                }

                const priceMatch =
                    numericPrice >= priceRange[0] && numericPrice <= priceRange[1];

                const offPlanMatch = !isOffPlan || apartment.isOffPlan;

                return bedMatch && bathMatch && locationMatch && priceMatch && offPlanMatch;
            });

            setFilteredProperties(filtered);
        };
        applyFilters();
    }, [beds, baths, location, priceRange, isOffPlan, properties, selectedCoordinates, isFilteringByRadius]);

    // Filter by state slug (for URL like /apartments/in-downtown-dubai)
    useEffect(() => {
        if (!properties.length) return;

        const selectedType = searchParams.get("property")?.toLowerCase();

        // ✅ If no property param, show all
        if (!selectedType) {
            setFilteredProperties(properties);
            return;
        }

        let filtered = properties.filter((property) => {
            const typeMatch = property.propertyType?.toLowerCase() === selectedType;

            const stateMatch = state
                ? property.state?.toLowerCase().replace(/\s+/g, "-") === state.toLowerCase()
                : true;

            return typeMatch && stateMatch;
        });

        setFilteredProperties(filtered);
    }, [properties, state, searchParams]);

    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `${(price / 1000000).toFixed(1)}M`;
        }
        return `${(price / 1000).toFixed(0)}K`;
    };

    const resetFilters = () => {
        setBeds("any");
        setBaths("any");
        setLocation("any");
        setPriceRange([400000, 5000000]);
        setIsOffPlan(false);
        setSelectedCoordinates(null);
        setIsFilteringByRadius(false);
        setFilteredProperties(properties); // ✅ restore original list
    };

    // Function to handle radius filter toggle
    const toggleRadiusFilter = () => {
        setIsFilteringByRadius(!isFilteringByRadius);
    };

    // Function to clear radius filter
    const clearRadiusFilter = () => {
        setSelectedCoordinates(null);
        setIsFilteringByRadius(false);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <ApartmentContent
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
                viewType={viewType}
                setViewType={setViewType}
                filteredApartments={filteredProperties}
                resetFilters={resetFilters}
                popularAreas={popularAreas}
                faqData={faqData}
                developers={developers}
                apartmentTypes={apartmentTypes}
                state={state}
                propertyType={propertyType}
                transactionType={searchParams.get("type") || "buy"}
                // New props for radius filtering
                selectedCoordinates={selectedCoordinates}
                isFilteringByRadius={isFilteringByRadius}
                onToggleRadiusFilter={toggleRadiusFilter}
                onClearRadiusFilter={clearRadiusFilter}
            />
            <Footer />
        </div>
    );
};

export default Properties;