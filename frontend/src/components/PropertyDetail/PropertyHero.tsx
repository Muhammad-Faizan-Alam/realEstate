import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Video } from "lucide-react";

const PropertyHero = ({ property }) => {
  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {property?.images && property?.images.length > 0 ? property?.images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="aspect-[16/10] overflow-hidden rounded-lg">
                <img
                  src={image || "https://via.placeholder.com/800x500"}
                  alt={`${property.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/800x500";
                  }}
                />
              </div>
            </CarouselItem>
          )) : (
            <div className="aspect-[16/10] overflow-hidden rounded-lg">
              <img
                src={property?.images || "https://via.placeholder.com/800x500"}
                alt={`${property.title}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/800x500";
                }}
              />
            </div>
          )}
          {property.videos.map((video, index) => (
            <CarouselItem key={`video-${index}`}>
              <div className="aspect-[16/10] overflow-hidden rounded-lg bg-black flex items-center justify-center">
                <Video className="w-16 h-16 text-white" />
                <span className="text-white ml-2">Video {index + 1}</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      <div className="absolute top-4 left-4 flex gap-2">
        {property.tags.map((tag, index) => (
          <Badge key={index} variant="secondary">{tag}</Badge>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
          <p className="text-muted-foreground flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {property.location}
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>Ref: {property.refNumber}</span>
            <span>Posted: {new Date(property.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="text-4xl font-bold text-primary">{property.price}</div>
        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="w-5 h-5" />
            <span>{property.beds === 0 ? "Studio" : `${property.beds} BD`}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-5 h-5" />
            <span>{property.baths} BA</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-5 h-5" />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyHero;