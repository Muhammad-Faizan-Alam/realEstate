import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const PropertyAmenities = ({ amenities }) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const displayedAmenities = showAllAmenities ? amenities : amenities.slice(0, 6);
  const remainingAmenitiesCount = amenities.length - 6;

  return (
    <Card>
      <CardHeader><h3 className="font-semibold">Features / Amenities</h3></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {displayedAmenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
              <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded bg-primary"></div>
              </div>
              <span className="text-sm">{amenity}</span>
            </div>
          ))}
        </div>
        {!showAllAmenities && remainingAmenitiesCount > 0 && (
          <Button
            variant="link"
            className="p-0 h-auto mt-4"
            onClick={() => setShowAllAmenities(true)}
          >
            +{remainingAmenitiesCount} more
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        )}
        {showAllAmenities && (
          <Button
            variant="link"
            className="p-0 h-auto mt-4"
            onClick={() => setShowAllAmenities(false)}
          >
            Show less
            <ChevronUp className="w-4 h-4 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyAmenities;