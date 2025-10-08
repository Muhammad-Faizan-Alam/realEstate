import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Phone, Mail, Bed, Bath, Square, MapPin, Heart, Share2 } from "lucide-react";
import { handleImageError, getPropertyImageFallback } from "@/lib/imageUtils";

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
};

const PropertyCard = ({ property }: { property: any }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {property.images.map((image: string, index: number) => (
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
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      <div className="absolute top-2 left-2 flex gap-1">
        {property.tags.map((tag: string, index: number) => (
          <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
        ))}
      </div>
      {/* <div className="absolute top-2 right-2 flex gap-1">
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
        // window.location.href = `/apartments-in-dubai/${slug}/${property._id}`;
        window.location.href = `/property-details/${property._id}`;
      }}
    >
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg leading-tight">{property.title}</h3>
          <p className="text-muted-foreground text-sm flex items-center mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            {property.location}
          </p>
        </div>
        <div className="text-2xl font-bold text-primary">{property.price}</div>
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
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4 justify-between">
          <a href={property.whatsappLink} className="w-[50%]">
            <Button size="sm" className="flex-1 w-[100%]" onClick={(e) => e.stopPropagation()}>
              <Phone className="w-4 h-4 mr-1" />
              WhatsApp
            </Button>
          </a>
          <a href={property.emailLink} className="w-[50%]">
            <Button size="sm" variant="outline" className="flex-1 w-[100%]" onClick={(e) => e.stopPropagation()}>
              <Mail className="w-4 h-4 mr-1" />
              Email
            </Button>
          </a>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default PropertyCard;