import { useState, useEffect } from "react";
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Bed,
  Bath,
  Square,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface APIProperty {
  _id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  images: string[];
  propertyType: string;
  area?: string;
  whatsappLink: string;
  emailLink: string;
  // optional if you have phone in API
  phone?: string;
  state?: string;
}

interface PropertiesGridProps {
  city: string;
}

const PropertiesGrid = ({ city }: PropertiesGridProps) => {
  const [properties, setProperties] = useState<APIProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/properties`);
        const data = await res.json();

        // Agar tumhari API array return karti hai:
        let filtered = data;

        // Filter by city/state if available
        if (city) {
          filtered = filtered.filter(
            (p: APIProperty) =>
              (p.state && p.state.toLowerCase().includes(city.toLowerCase())) ||
              (p.location &&
                p.location.toLowerCase().includes(city.toLowerCase()))
          );
        }

        setProperties(filtered);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [city]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (properties.length === 0)
    return <p className="text-center py-10">No properties found in {city}</p>;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Properties for Sale in {city}
          </h2>
          <p className="text-muted-foreground">
            Discover exclusive property listings in {city}'s most sought-after
            locations
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {properties.map((property) => (
            <Card
              key={property._id}
              className="group overflow-hidden shadow-card hover:shadow-card-hover transition-smooth"
            >
              {/* Property Image */}
              <div className="relative overflow-hidden">
                <img
                  src={property.images?.[0] || "/placeholder.jpg"}
                  alt={property.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  {property.propertyType}
                </Badge>
                <div className="absolute top-3 right-3 bg-black/40 text-white px-2 py-1 rounded text-sm backdrop-blur-sm">
                  {property.price}
                </div>
              </div>

              <CardContent className="p-4">
                {/* Title */}
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-smooth line-clamp-2">
                  {property.title}
                </h3>

                {/* Location */}
                <div className="flex items-center text-muted-foreground text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{property.location}</span>
                </div>

                {/* Property Details */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-4">
                    {property.beds > 0 && (
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span>{property.beds}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      <span>{property.baths}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1" />
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>
                </div>

                {/* Price Highlight */}
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    {property.price}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                {/* Contact Buttons */}
                <div className="flex space-x-2 w-full">
                  {property.whatsappLink && (
                    <Button
                      size="sm"
                      className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() =>
                        window.open(property.whatsappLink, "_blank")
                      }
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WhatsApp
                    </Button>
                  )}
                  {property.emailLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(property.emailLink, "_blank")}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                  )}
                  {property.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(`tel:${property.phone}`, "_blank")
                      }
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            View More Properties in {city}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PropertiesGrid;
