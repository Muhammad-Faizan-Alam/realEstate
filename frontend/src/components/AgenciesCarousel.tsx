import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AgenciesCarousel = () => {
  const [agencies, setAgencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  // 🔹 API se data fetch
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/agencies`);
        const data = await res.json();
        console.log("Fetched agencies:", data);
        setAgencies(data);
      } catch (error) {
        console.error("Error fetching agencies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgencies();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerPage >= agencies.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - itemsPerPage < 0
        ? Math.max(0, agencies.length - itemsPerPage)
        : prev - itemsPerPage
    );
  };

  const visibleAgencies = agencies.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Featured Agencies</h2>
          <p className="text-muted-foreground">
            Connect with top-rated real estate agencies in the UAE
          </p>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading agencies...</p>
        ) : agencies.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No agencies available.
          </p>
        ) : (
          <div className="relative">
            {/* Carousel Controls */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="rounded-full shadow-card hover:shadow-card-hover"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex space-x-2">
                {Array.from({
                  length: Math.ceil(agencies.length / itemsPerPage),
                }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      Math.floor(currentIndex / itemsPerPage) === index
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                disabled={currentIndex + itemsPerPage >= agencies.length}
                className="rounded-full shadow-card hover:shadow-card-hover"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Agency Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visibleAgencies.map((agency) => (
                <Card
                  key={agency._id}
                  className="group hover:shadow-card-hover transition-smooth"
                >
                  <CardContent className="p-6 text-center">
                    {/* Agency Logo */}
                    <div className="w-36 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                      <img
                        src={agency.logo}
                        alt={agency.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Agency Name */}
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-smooth">
                      {agency.name}
                    </h3>

                    {/* Specialization */}
                    <Badge variant="secondary" className="mb-3">
                      {agency.specialization}
                    </Badge>

                    {/* Rating */}
                    <div className="flex items-center justify-center mb-2">
                      <div className="flex items-center mr-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`w-4 h-4 ${
                              index < Math.floor(agency.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {agency.rating}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        ({agency.reviewCount} reviews)
                      </span>
                    </div>

                    {/* Properties Count */}
                    <p className="text-sm text-muted-foreground mb-4">
                      {agency.propertiesCount?.toLocaleString()} Properties
                    </p>

                    {/* Contact Button */}
                    <Button className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Agency
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                View All Agencies
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AgenciesCarousel;
