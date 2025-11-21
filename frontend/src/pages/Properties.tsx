import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApartmentContent from "@/components/apartments/ApartmentContent";
import { popularAreas, faqData, apartmentTypes } from "@/data/apartmentData";

const normalizeCoord = (val: any): number | null => {
    if (!val) return null;

    if (typeof val === "number") return val;
    if (typeof val === "string") return parseFloat(val);

    // Mongo nested structure
    if (typeof val === "object" && "$numberDouble" in val) {
        return parseFloat(val.$numberDouble);
    }

    return null;
};

// Utility function to calculate distance between coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Function to filter properties within radius
const filterPropertiesWithinRadius = (
    properties: any[],
    centerLat: number,
    centerLng: number,
    radiusKm: number = 50  // Increased to 50km to catch more properties
) => {
    const filtered = properties.filter(property => {
        const lat = normalizeCoord(property.coordinates?.lat);
        const lng = normalizeCoord(property.coordinates?.lng);

        if (lat === null || lng === null) {
            console.log(`Property ${property.title} has no coordinates`);
            return false;
        }

        const distance = calculateDistance(centerLat, centerLng, lat, lng);
        
        // Debug logging
        console.log(`📍 ${property.title}: ${distance.toFixed(2)}km from search center`);
        console.log(`   Property coords: ${lat}, ${lng}`);
        console.log(`   Search coords: ${centerLat}, ${centerLng}`);
        
        return distance <= radiusKm;
    });

    console.log(`🎯 Radius filter: ${filtered.length} properties within ${radiusKm}km`);
    return filtered;
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
    const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [radius, setRadius] = useState<number>(50); // Added radius state

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
                console.log("🏠 Fetched Properties:", data.length);

                setPropertyType(searchParams.get("property") || "apartment");
                let transactionType = searchParams.get("type");
                if (searchParams.get("type") === "buy") {
                    transactionType = "sale";
                }
                console.log("💰 Transaction Type:", transactionType);

                // Check if we have coordinates from search
                const searchLat = searchParams.get("lat");
                const searchLng = searchParams.get("lng");

                if (searchLat && searchLng) {
                    const lat = parseFloat(searchLat);
                    const lng = parseFloat(searchLng);
                    setSelectedCoordinates({ lat, lng });
                    setIsFilteringByRadius(true);
                    console.log(`🎯 Setting coordinates from URL: ${lat}, ${lng}`);
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

                console.log(`🔍 Filtered by type: ${filtered.length} properties`);
                setProperties(filtered);
                setFilteredProperties(filtered);
            } catch (error) {
                console.error("❌ Error fetching properties:", error);
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
        const urlPriceRange = searchParams.get("priceRange");
        const urlIsOffPlan = searchParams.get("isOffPlan") === "true";
        const urlLat = searchParams.get("lat");
        const urlLng = searchParams.get("lng");
        const urlRadius = searchParams.get("radius");

        setBeds(urlBeds);
        setBaths(urlBaths);
        setIsOffPlan(urlIsOffPlan);

        if (urlRadius) {
            setRadius(parseInt(urlRadius));
        }

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
            let filtered = [...properties];

            console.log(`🎯 Applying filters to ${filtered.length} properties`);
            console.log(`📍 Radius filtering: ${isFilteringByRadius}`);
            console.log(`📍 Coordinates:`, selectedCoordinates);
            console.log(`📏 Radius: ${radius}km`);

            // 1) Radius Filter First
            if (selectedCoordinates && isFilteringByRadius) {
                filtered = filterPropertiesWithinRadius(
                    filtered,
                    selectedCoordinates.lat,
                    selectedCoordinates.lng,
                    radius
                );
            }

            // 2) Standard Filters (without location)
            filtered = filtered.filter((item) => {
                // Beds
                const bedMatch =
                    beds === "any" ||
                    (beds === "studio" && item.beds === 0) ||
                    item.beds?.toString() === beds;

                // Baths
                const bathMatch =
                    baths === "any" ||
                    item.baths?.toString() === baths;

                // Price
                let numericPrice = 0;
                if (item.price) {
                    if (typeof item.price === "string") {
                        numericPrice = Number(item.price.replace(/[^\d]/g, "")) || 0;
                    } else {
                        numericPrice = item.price;
                    }
                }

                const priceMatch =
                    numericPrice >= priceRange[0] &&
                    numericPrice <= priceRange[1];

                // Off-plan
                const offPlanMatch = !isOffPlan || item.isOffPlan;

                return (
                    bedMatch &&
                    bathMatch &&
                    priceMatch &&
                    offPlanMatch
                );
            });

            console.log("✅ Final filtered properties:", filtered.length, filtered);
            setFilteredProperties(filtered);
        };

        applyFilters();
    }, [
        beds,
        baths,
        priceRange,
        isOffPlan,
        properties,
        selectedCoordinates,
        isFilteringByRadius,
        radius,
    ]);

    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `${(price / 1000000).toFixed(1)}M`;
        }
        return `${(price / 1000).toFixed(0)}K`;
    };

    const resetFilters = () => {
        setBeds("any");
        setBaths("any");
        setPriceRange([400000, 5000000]);
        setIsOffPlan(false);
        setSelectedCoordinates(null);
        setIsFilteringByRadius(false);
        setRadius(50);
        setFilteredProperties(properties);
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
                radius={radius}
                setRadius={setRadius}
            />
            <Footer />
        </div>
    );
};

export default Properties;