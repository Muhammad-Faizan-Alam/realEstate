import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApartmentContent from "@/components/apartments/ApartmentContent";
import { popularAreas, faqData, apartmentTypes } from "@/data/apartmentData";

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

    //   const [apartments, setApartments] = useState<any[]>([]);
    //   const [filteredApartments, setFilteredApartments] = useState<any[]>([]);
    const [properties, setProperties] = useState<any[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
    const [developers, setDevelopers] = useState<any[]>([]); // ✅ developers from API

    // Fetch properties
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/properties`);
                const data = await response.json();
                console.log("Fetched Properties:", data);
                setPropertyType(searchParams.get("property"));
                let transactionType = searchParams.get("type");
                if (searchParams.get("type") === "buy") {
                    transactionType = "sale";
                }
                console.log("Transaction Type:", transactionType);
                if (!searchParams.get("property")) {
                    setProperties(data);
                    setFilteredProperties(data);
                    return;
                }
                // filtered by propertyType and transactionType
                const filteredType = data.filter((p: any) => p.propertyType?.toLowerCase() === (searchParams.get("property").toLowerCase()));
                const filtered = transactionType ? filteredType.filter((p: any) => p.propertyInfo.purpose?.toLowerCase() === transactionType.toLowerCase()) : filteredType;
                console.log("Filtered Properties by type:", filtered);
                // ✅ only apartments
                // const onlyApartments = data.filter(
                //     (p: any) => p.propertyType?.toLowerCase() === "apartment"
                // );

                // setApartments(onlyApartments);
                // setFilteredApartments(onlyApartments);
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
                const response = await fetch(`${import.meta.env.VITE_API_URL}/developers`);
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

        setBeds(urlBeds);
        setBaths(urlBaths);
        setLocation(urlLocation);
        setIsOffPlan(urlIsOffPlan);

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

    // Apply filters
    useEffect(() => {
        const applyFilters = () => {
            let filtered = properties.filter((apartment) => {
                const bedMatch =
                    beds === "any" ||
                    (beds === "studio" && apartment.beds === 0) ||
                    (beds !== "studio" && apartment.beds.toString() === beds);

                const bathMatch =
                    baths === "any" || apartment.baths.toString() === baths;

                const locationMatch =
                    location === "any" ||
                    apartment.location.toLowerCase().includes(location.toLowerCase());

                const numericPrice = Number(apartment.price.replace(/[^\d]/g, "")) || 0;

                const priceMatch =
                    numericPrice >= priceRange[0] && numericPrice <= priceRange[1];

                const offPlanMatch = !isOffPlan || apartment.isOffPlan;

                return bedMatch && bathMatch && locationMatch && priceMatch && offPlanMatch;
            });

            setFilteredProperties(filtered);
        };
        applyFilters();
    }, [beds, baths, location, priceRange, isOffPlan, properties]);

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
        setFilteredProperties(properties); // ✅ restore original list
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
            />
            <Footer />
        </div>
    );
};

export default Properties;