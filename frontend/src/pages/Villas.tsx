import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, MapPin, Bed, Bath, Square } from "lucide-react";
import { handleImageError, getPropertyImageFallback } from "@/lib/imageUtils";
import { useParams, useSearchParams } from "react-router-dom";

const Villas = () => {
  const [searchParams] = useSearchParams();
  const [filteredVillas, setFilteredVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state } = useParams(); // yahan se "in-dubai" milega

  // API call

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/properties?propertyType=Villas`, {
          credentials: 'include',
        });
        const data = await res.json();
        console.log("Fetched properties:", data);
        // Step 1: sirf villas filter karo
        let villasOnly = data.filter(
          (item) =>
            item.propertyType?.toLowerCase() === "villas" ||
            item.propertyInfo?.type?.toLowerCase() === "villas"
        );

        // Step 2: query params filters apply karo
        const beds = searchParams.get("beds");
        const baths = searchParams.get("baths");
        const location = searchParams.get("location");
        const priceRange = searchParams.get("priceRange");

        let filtered = villasOnly.filter((villa) => {
          const bedMatch =
            !beds || beds === "any" || villa.beds?.toString() === beds;
          const bathMatch =
            !baths || baths === "any" || villa.baths?.toString() === baths;

          const locationMatch =
            !state ||
            villa.state?.toLowerCase().replace(/\s+/g, "-") ===
            state.toLowerCase();

          let priceMatch = true;
          if (priceRange) {
            const [min, max] = priceRange.split("-").map(Number);
            const villaPrice = Number(
              villa.price?.toString().replace(/[^\d]/g, "") || 0
            );
            priceMatch = villaPrice >= min && villaPrice <= max;
          }

          return bedMatch && bathMatch && locationMatch && priceMatch;
        });

        setFilteredVillas(filtered);
      } catch (error) {
        console.error("Error fetching villas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVillas();
  }, [searchParams]);

  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Villas for Sale{" "}
            {filteredVillas.length > 0
              ? filteredVillas[0].state
              : state
                ? state.replace(/-/g, " ")
                : "in Dubai"}
          </h1>
          <p className="text-muted-foreground">
            Discover luxury villas in Dubai's most prestigious communities
          </p>
          {loading ? (
            <p className="text-muted-foreground">Loading properties...</p>
          ) : (
            <p className="text-muted-foreground">
              {filteredVillas.length} properties found
            </p>
          )}
        </div>

        {!loading && filteredVillas.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredVillas.map((villa) => (
              <Card
                key={villa._id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  const slug = slugify(villa.title);
                  window.location.href = `/villas-in-dubai/${slug}/${villa._id}`;
                }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={villa.image || getPropertyImageFallback(villa._id)}
                    alt={villa.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => handleImageError(e, villa._id)}
                  />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{villa.title}</h3>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{villa.state}</span>
                    </div>
                    <div className="text-xl font-bold text-primary">
                      {villa.price}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {villa.beds}
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        {villa.baths}
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        {villa.sqft?.toLocaleString()} sqft
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Home className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No villas found</h3>
                <p className="text-muted-foreground mb-4">
                  No villas match your current search criteria. Try adjusting
                  your filters.
                </p>
              </div>
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Villas;
