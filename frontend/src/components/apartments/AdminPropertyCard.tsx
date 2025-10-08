import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Bed, Bath, Square, MapPin, Heart, Share2, Verified, Trash2 } from "lucide-react";
import { handleImageError, getPropertyImageFallback } from "@/lib/imageUtils";

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

const AdminPropertyCard = ({ property }) => {
  const handleVerify = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/verify/${property._id}`, {
        method: 'PATCH',
      });
      if (response.ok) {
        alert("Property verification status changed successfully");
        window.location.reload();
      } else {
        alert("Failed to change verification status");
      }
    } catch (error) {
      alert(`Error verifying property: ${error}`);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/${property._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("Property deleted successfully");
        window.location.reload();
      } else {
        alert("Failed to delete property");
      }
    } catch (error) {
      alert(`Error deleting property: ${error}`);
    }
  };

  return (
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
        {/* <div className="absolute top-2 left-2 flex gap-1">
          {property.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white">
            <Heart className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white">
            <Share2 className="w-4 h-4" />
          </Button>
        </div> */}
      </div>
      <CardContent
        className="p-4 pb-0 cursor-pointer"
        onClick={() => {
          const slug = slugify(property.title);
          window.location.href = `/apartments-in-dubai/${slug}/${property._id}`;
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
        </div>
      </CardContent>
      <div className="flex gap-2 m-4">
            {
              property.propertyInfo.truCheck ? (
                <Button size="sm" className="flex-1 bg-green-500" onClick={handleVerify}>
                  <Verified className="w-4 h-4 mr-1" />
                  truChecked
                </Button>
              ) : (
                <Button size="sm" className="flex-1" onClick={handleVerify}>
                  <Verified className="w-4 h-4 mr-1" />
                  truCheck
                </Button>
              )
            }
            <Button size="sm" variant="outline" className="flex-1 bg-red-500" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
    </Card>
  );
};

export default AdminPropertyCard;