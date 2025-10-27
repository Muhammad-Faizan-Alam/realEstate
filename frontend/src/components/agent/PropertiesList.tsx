import React, { useState } from "react";
import { Edit, Trash2, Eye, MoreVertical, CheckCircle, XCircle, MapPin, Bed, Bath, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditPropertyForm from "./EditPropertyForm";

interface PropertiesListProps {
  properties: any[];
  viewMode: "grid" | "list";
  onPropertyUpdated: () => void;
}

const PropertiesList: React.FC<PropertiesListProps> = ({
  properties,
  viewMode,
  onPropertyUpdated
}) => {
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  console.log("PropertiesList properties:", properties);
  const handleDelete = async (propertyId: string) => {
    // if (!confirm("Are you sure you want to delete this property?")) return;

    // setDeleteLoading(propertyId);
    // try {
    //   const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/${propertyId}`, {
    //     method: "DELETE",
    //     credentials: "include",
    //   });

    //   if (response.ok) {
    //     alert("Property deleted successfully!");
    //     onPropertyUpdated();
    //   } else {
    //     alert("Failed to delete property.");
    //   }
    // } catch (error) {
    //   console.error("Error deleting property:", error);
    //   alert("Error deleting property. Please try again.");
    // } finally {
    //   setDeleteLoading(null);
    // }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800";
      case "Sold": return "bg-red-100 text-red-800";
      case "Rented": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPurposeColor = (purpose: string) => {
    return purpose === "Sale" ? "bg-orange-100 text-orange-800" : "bg-purple-100 text-purple-800";
  };

  const formatPrice = (price: string) => {
    const numPrice = parseInt(price.replace(/[^0-9]/g, '')) || 0;
    if (numPrice >= 1000000) {
      return `AED ${(numPrice / 1000000).toFixed(1)}M`;
    } else if (numPrice >= 1000) {
      return `AED ${(numPrice / 1000).toFixed(0)}K`;
    }
    return `AED ${numPrice}`;
  };

  if (viewMode === "grid") {
    return (
      <>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {properties.map((property) => (
            <Card key={property._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                <img
                  src={property.images?.[0] || "/placeholder-property.jpg"}
                  alt={property.title}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  <Badge className={`${getPurposeColor(property.propertyInfo?.purpose)} text-xs`}>
                    {property.propertyInfo?.purpose}
                  </Badge>
                  {property.isOffPlan && (
                    <Badge variant="secondary" className="text-xs">Off Plan</Badge>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 bg-white/80 hover:bg-white">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => setEditingProperty(property)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(property._id)}
                        disabled={deleteLoading === property._id}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deleteLoading === property._id ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
                <CardTitle className="text-base sm:text-lg font-semibold line-clamp-1">
                  {property.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs sm:text-sm">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="line-clamp-1">{property.location}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="p-3 sm:p-4 pt-1 sm:pt-2">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-lg sm:text-xl font-bold text-blue-600">
                    {formatPrice(property.price)}
                  </span>
                  {property.propertyInfo?.truCheck ? (
                    <Badge variant="default" className="flex items-center gap-1 text-xs">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <XCircle className="h-3 w-3" />
                      Unverified
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1">
                      <Bed className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{property.beds}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{property.baths}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{property.sqft}</span>
                    </div>
                  </div>
                </div>

                <Badge className={`${getStatusColor(property.propertyInfo?.currentStatus)} text-xs mb-2`}>
                  {property.propertyInfo?.currentStatus}
                </Badge>

                <div className="flex flex-wrap gap-1 mt-2">
                  {property.tags?.slice(0, 2).map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {property.tags?.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{property.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {properties.length === 0 && (
          <Card className="text-center py-8 sm:py-12">
            <CardContent>
              <div className="text-gray-400 mb-3 sm:mb-4">
                <Eye className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                No properties match your current filters. Try adjusting your search criteria.
              </p>
            </CardContent>
          </Card>
        )}

        <EditPropertyForm
          open={!!editingProperty}
          onOpenChange={(open) => !open && setEditingProperty(null)}
          property={editingProperty}
          onPropertyUpdated={onPropertyUpdated}
        />
      </>
    );
  }

  // List View for mobile
  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {properties.map((property) => (
          <Card key={property._id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex gap-3 sm:gap-4">
                <img
                  src={property.images?.[0] || "/placeholder-property.jpg"}
                  alt={property.title}
                  className="w-20 h-16 sm:w-32 sm:h-24 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-1">{property.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1 mb-2">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="line-clamp-1">{property.location}</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-xl font-bold text-blue-600 whitespace-nowrap">
                        {formatPrice(property.price)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => setEditingProperty(property)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(property._id)}
                            disabled={deleteLoading === property._id}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {deleteLoading === property._id ? "Deleting..." : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 mb-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Bed className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{property.beds} bed{property.beds !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{property.baths} bath{property.baths !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`${getPurposeColor(property.propertyInfo?.purpose)} text-xs`}>
                      {property.propertyInfo?.purpose}
                    </Badge>
                    <Badge className={`${getStatusColor(property.propertyInfo?.currentStatus)} text-xs`}>
                      {property.propertyInfo?.currentStatus}
                    </Badge>
                    {property.isOffPlan && (
                      <Badge variant="secondary" className="text-xs">Off Plan</Badge>
                    )}
                    {property.propertyInfo?.truCheck ? (
                      <Badge variant="default" className="flex items-center gap-1 text-xs">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                        <XCircle className="h-3 w-3" />
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {properties.length === 0 && (
        <Card className="text-center py-8 sm:py-12">
          <CardContent>
            <div className="text-gray-400 mb-3 sm:mb-4">
              <Eye className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              No properties match your current filters. Try adjusting your search criteria.
            </p>
          </CardContent>
        </Card>
      )}

      <EditPropertyForm
        open={!!editingProperty}
        onOpenChange={(open) => !open && setEditingProperty(null)}
        property={editingProperty}
        onPropertyUpdated={onPropertyUpdated}
      />
    </>
  );
};

export default PropertiesList;