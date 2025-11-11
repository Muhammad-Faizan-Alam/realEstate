import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Square, Home } from "lucide-react";
import { handleImageError, getPropertyImageFallback } from "@/lib/imageUtils";

const OtherProperties = () => {
  const { state } = useParams();
  const [searchParams] = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const location = searchParams.get("location") || "";
        const priceRange = searchParams.get("priceRange") || "";

        const queryParams = new URLSearchParams();
        if (location) queryParams.append("city", location);
        if (priceRange) queryParams.append("priceRange", priceRange);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/properties?${queryParams.toString()}`, {
          credentials: 'include',
        });
        const data = await res.json();

        setFilteredProperties(
          data.filter(
            (p) =>
              p.propertyType !== "Apartment" &&
              p.propertyType !== "Villa" &&
              (!state ||
                p.state?.toLowerCase().replace(/\s+/g, "-") ===
                state.toLowerCase())
          )
        );
      } catch (err) {
        console.error("Error fetching properties:", err);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams, state]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Other Properties for Sale{" "}
            {filteredProperties.length > 0
              ? filteredProperties[0].state
              : state
                ? state.replace(/-/g, " ")
                : "in Dubai"}
          </h1>
          <p className="text-muted-foreground">
            Explore townhouses, penthouses, commercial properties and more
          </p>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <p className="text-muted-foreground">
              {filteredProperties.length} properties found
            </p>
          )}
        </div>

        {!loading && filteredProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredProperties.map((property) => (
              <Card
                key={property._id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() =>
                (window.location.href = `/other-properties/${property.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}/${property._id}`)
                }
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={
                      property.image || getPropertyImageFallback(property._id)
                    }
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => handleImageError(e, property._id)}
                  />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="text-xl font-bold text-primary">
                      {property.price}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="secondary">{property.type}</Badge>
                      <div className="flex items-center text-muted-foreground">
                        <Square className="w-4 h-4 mr-1" />
                        {property.sqft?.toLocaleString()} sqft
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Home className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                No properties found
              </h3>
              <p className="text-muted-foreground mb-4">
                No properties match your current search criteria. Try adjusting
                your filters.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
};

export default OtherProperties;
