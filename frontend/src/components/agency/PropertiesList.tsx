// components/agency/PropertiesList.tsx
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
import { AgencyPropertyCardSkeleton } from '@/components/apartments/AgencyPropertyCard';

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

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    setDeleteLoading(propertyId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/${propertyId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        alert("Property deleted successfully!");
        onPropertyUpdated();
      } else {
        alert("Failed to delete property.");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Error deleting property. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
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
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(parseInt(price.replace(/[^0-9]/g, '')) || 0);
  };

  if (viewMode === "grid") {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={property.images?.[0] || "/placeholder-property.jpg"}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  <Badge className={getPurposeColor(property.propertyInfo?.purpose)}>
                    {property.propertyInfo?.purpose}
                  </Badge>
                  <Badge className={getStatusColor(property.propertyInfo?.currentStatus)}>
                    {property.propertyInfo?.currentStatus}
                  </Badge>
                  {property.isOffPlan && (
                    <Badge variant="secondary">Off Plan</Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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

              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg font-semibold line-clamp-1">
                  {property.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-1">{property.location}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(property.price)}
                  </span>
                  {property.propertyInfo?.truCheck ? (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Unverified
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>{property.beds} bed{property.beds !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.baths} bath{property.baths !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {property.tags?.slice(0, 3).map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {property.tags?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{property.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {properties.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <Eye className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-600">
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

  // List View
  return (
    <>
      <div className="space-y-4">
        {properties.map((property) => (
          <Card key={property._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={property.images?.[0] || "/placeholder-property.jpg"}
                  alt={property.title}
                  className="w-32 h-24 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                      <p className="text-gray-600 text-sm flex items-center gap-1 mb-2">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(property.price)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.beds} bed{property.beds !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.baths} bath{property.baths !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        <span>{property.sqft} sqft</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getPurposeColor(property.propertyInfo?.purpose)}>
                      {property.propertyInfo?.purpose}
                    </Badge>
                    <Badge className={getStatusColor(property.propertyInfo?.currentStatus)}>
                      {property.propertyInfo?.currentStatus}
                    </Badge>
                    {property.isOffPlan && (
                      <Badge variant="secondary">Off Plan</Badge>
                    )}
                    {property.propertyInfo?.truCheck ? (
                      <Badge variant="default" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Unverified
                      </Badge>
                    )}
                    {property.tags?.slice(0, 2).map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {properties.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <Eye className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600">
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