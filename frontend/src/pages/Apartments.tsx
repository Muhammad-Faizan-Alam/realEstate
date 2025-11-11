import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApartmentContent from "@/components/apartments/ApartmentContent";
import { popularAreas, faqData, apartmentTypes } from "@/data/apartmentData";

const Apartments = () => {
  const [searchParams] = useSearchParams();
  const { state } = useParams();

  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([500, 5000000]);
  const [beds, setBeds] = useState("any");
  const [baths, setBaths] = useState("any");
  const [isOffPlan, setIsOffPlan] = useState(false);
  const [location, setLocation] = useState("any");

  const [apartments, setApartments] = useState<any[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]); // ✅ developers from API

  // Fetch properties
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/properties`, {
          credentials: 'include',
        });
        const data = await response.json();

        // ✅ only apartments
        const onlyApartments = data.filter(
          (p: any) => p.propertyType?.toLowerCase() === "apartment"
        );

        setApartments(onlyApartments);
        setFilteredApartments(onlyApartments);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProjects();
  }, []);

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
      let filtered = apartments.filter((apartment) => {
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

      setFilteredApartments(filtered);
    };
    applyFilters();
  }, [beds, baths, location, priceRange, isOffPlan, apartments]);

  // Filter by state slug (for URL like /apartments/in-downtown-dubai)
  useEffect(() => {
    if (!apartments.length) return;

    let filtered = apartments.filter((property) => {
      const typeMatch = property.propertyType?.toLowerCase() === "apartment";

      const stateMatch = state
        ? property.state?.toLowerCase().replace(/\s+/g, "-") === state.toLowerCase()
        : true;

      return typeMatch && stateMatch;
    });

    setFilteredApartments(filtered);
  }, [apartments, state]);

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
    setFilteredApartments(apartments); // ✅ restore original list
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
        filteredApartments={filteredApartments}
        resetFilters={resetFilters}
        popularAreas={popularAreas}
        faqData={faqData}
        developers={developers}   
        apartmentTypes={apartmentTypes}
        state={state}
      />
      <Footer />
    </div>
  );
};

export default Apartments;
