import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Phone, Mail, Bed, Bath, Square, MapPin, Heart, Share2, Navigation } from "lucide-react";
import { handleImageError, getPropertyImageFallback } from "@/lib/imageUtils";

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
};

// Distance calculation function
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

interface PropertyCardProps {
  property: any;
  showDistance?: boolean;
  centerCoordinates?: { lat: number; lng: number } | null;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  showDistance = false, 
  centerCoordinates 
}) => {
  // Calculate distance if needed
  const distance = showDistance && centerCoordinates && property.latitude && property.longitude 
    ? calculateDistance(
        centerCoordinates.lat,
        centerCoordinates.lng,
        parseFloat(property.latitude),
        parseFloat(property.longitude)
      )
    : null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {property.images && property.images.length > 0 ? (
              property.images.map((image: string, index: number) => (
                <CarouselItem key={index}>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={image || getPropertyImageFallback(property.id)}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => handleImageError(e, property.id)}
                    />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="aspect-[4/3] overflow-hidden bg-muted flex items-center justify-center">
                  <img
                    src={getPropertyImageFallback(property.id)}
                    alt={`${property.title} - Default image`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        
        {/* Tags */}
        <div className="absolute top-2 left-2 flex gap-1">
          {property.tags && property.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>

        {/* Distance Badge */}
        {distance !== null && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              <Navigation className="w-3 h-3 mr-1" />
              {distance.toFixed(1)}km
            </Badge>
          </div>
        )}

        {/* Action Buttons - Moved to bottom right to avoid overlap with distance badge */}
        {/* <div className="absolute bottom-2 right-2 flex gap-1">
          <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white">
            <Heart className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white">
            <Share2 className="w-4 h-4" />
          </Button>
        </div> */}
      </div>
      
      <CardContent
        className="p-4 cursor-pointer"
        onClick={() => {
          const slug = slugify(property.title);
          window.location.href = `/property-details/${property._id}`;
        }}
      >
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">{property.title}</h3>
            <p className="text-muted-foreground text-sm flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{property.location}</span>
            </p>
          </div>
          
          <div className="text-2xl font-bold text-primary">
            {property.price}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.beds === 0 ? "Studio" : `${property.beds} BD`}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.baths} BA</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{property.sqft ? property.sqft.toLocaleString() : 'N/A'} sqft</span>
            </div>
          </div>

          {/* Additional info if distance is available */}
          {distance !== null && (
            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-200">
              📍 {distance.toFixed(1)} km from your searched location
            </div>
          )}

          <div className="flex gap-2 mt-4 justify-between">
            <a 
              href={property.whatsappLink} 
              className="w-[50%]"
              onClick={(e) => e.stopPropagation()}
            >
              <Button size="sm" className="flex-1 w-[100%]">
                <Phone className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
            </a>
            <a 
              href={property.emailLink} 
              className="w-[50%]"
              onClick={(e) => e.stopPropagation()}
            >
              <Button size="sm" variant="outline" className="flex-1 w-[100%]">
                <Mail className="w-4 h-4 mr-1" />
                Email
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;