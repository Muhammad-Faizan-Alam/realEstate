import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Upload } from "lucide-react";

const dummyDevelopers = [
  { id: "1", name: "DAMAC Properties" },
  { id: "2", name: "Emaar Properties" },
  { id: "3", name: "Nakheel" },
];

const propertyTypes = ["Apartment", "Villa", "Townhouse", "Penthouse", "Office", "Shop", "Other"];
const states = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];
const purposes = ["Sale", "Rent"];
const furnishingTypes = ["Furnished", "Unfurnished", "Partially Furnished"];

interface EditPropertyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: any;
  onPropertyUpdated: () => void;
}

const EditPropertyForm: React.FC<EditPropertyFormProps> = ({
  open,
  onOpenChange,
  property,
  onPropertyUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    beds: "",
    baths: "",
    sqft: "",
    images: [],
    videos: [],
    propertyType: "",
    state: "",
    tags: [],
    developer: "",
    isOffPlan: false,
    paymentPlan: "",
    whatsappLink: "",
    emailLink: "",
    refNumber: "",
    description: "",

    propertyInfo: {
      type: "",
      purpose: "Sale",
      refNo: "",
      completion: "",
      furnishing: "",
      truCheck: false,
      avgRent: "",
      currentStatus: "Available"
    },

    validatedInfo: {
      developer: "",
      ownership: "",
      buildUpArea: "",
      usage: "",
      parking: ""
    },

    buildingInfo: {
      name: "",
      year: "",
      floors: "",
      pools: "",
      parking: "",
      area: "",
      elevators: ""
    },

    amenities: [],

    regulatoryInfo: {
      permitNo: "",
      zone: "",
      agent: "",
      ded: "",
      rera: "",
      brn: ""
    },

    coordinates: {
      lat: "",
      lng: ""
    }
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        location: property.location || "",
        price: property.price || "",
        beds: property.beds?.toString() || "",
        baths: property.baths?.toString() || "",
        sqft: property.sqft?.toString() || "",
        images: property.images || [],
        videos: property.videos || [],
        propertyType: property.propertyType || "",
        state: property.state || "",
        tags: property.tags || [],
        developer: property.developer || "",
        isOffPlan: property.isOffPlan || false,
        paymentPlan: property.paymentPlan || "",
        whatsappLink: property.whatsappLink || "",
        emailLink: property.emailLink || "",
        refNumber: property.refNumber || "",
        description: property.description || "",

        propertyInfo: {
          type: property.propertyInfo?.type || "",
          purpose: property.propertyInfo?.purpose || "Sale",
          refNo: property.propertyInfo?.refNo || "",
          completion: property.propertyInfo?.completion || "",
          furnishing: property.propertyInfo?.furnishing || "",
          truCheck: property.propertyInfo?.truCheck || false,
          avgRent: property.propertyInfo?.avgRent || "",
          currentStatus: property.propertyInfo?.currentStatus || "Available"
        },

        validatedInfo: {
          developer: property.validatedInfo?.developer || "",
          ownership: property.validatedInfo?.ownership || "",
          buildUpArea: property.validatedInfo?.buildUpArea || "",
          usage: property.validatedInfo?.usage || "",
          parking: property.validatedInfo?.parking || ""
        },

        buildingInfo: {
          name: property.buildingInfo?.name || "",
          year: property.buildingInfo?.year || "",
          floors: property.buildingInfo?.floors || "",
          pools: property.buildingInfo?.pools || "",
          parking: property.buildingInfo?.parking || "",
          area: property.buildingInfo?.area || "",
          elevators: property.buildingInfo?.elevators || ""
        },

        amenities: property.amenities || [],

        regulatoryInfo: {
          permitNo: property.regulatoryInfo?.permitNo || "",
          zone: property.regulatoryInfo?.zone || "",
          agent: property.regulatoryInfo?.agent || "",
          ded: property.regulatoryInfo?.ded || "",
          rera: property.regulatoryInfo?.rera || "",
          brn: property.regulatoryInfo?.brn || ""
        },

        coordinates: {
          lat: property.coordinates?.lat?.toString() || "",
          lng: property.coordinates?.lng?.toString() || ""
        }
      });
    }
  }, [property]);

  const handleBasicChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const files = e.target.files;
    if (!files) return;

    const uploaded = [];
    setLoading(true);

    try {
      for (let file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "my_unsigned_preset");
        
        const res = await fetch("https://api.cloudinary.com/v1_1/dqt60inwv/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        uploaded.push(data.secure_url);
      }

      if (type === "image") {
        handleBasicChange("images", [...formData.images, ...uploaded]);
      } else if (type === "video") {
        handleBasicChange("videos", [...formData.videos, ...uploaded]);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>, field: "tags" | "amenities", values: string[]) => {
    if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim() !== "") {
      handleBasicChange(field, [...values, (e.target as HTMLInputElement).value.trim()]);
      (e.target as HTMLInputElement).value = "";
      e.preventDefault();
    }
  };

  const removeTag = (field: "tags" | "amenities", index: number) => {
    const newTags = formData[field].filter((_, i) => i !== index);
    handleBasicChange(field, newTags);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    handleBasicChange("images", newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        location: formData.location,
        price: formData.price,
        beds: formData.beds ? Number(formData.beds) : 0,
        baths: formData.baths ? Number(formData.baths) : 0,
        sqft: formData.sqft ? Number(formData.sqft) : 0,
        images: formData.images,
        videos: formData.videos,
        propertyType: formData.propertyType,
        state: formData.state,
        tags: formData.tags,
        developer: formData.developer,
        isOffPlan: formData.isOffPlan,
        paymentPlan: formData.paymentPlan,
        whatsappLink: formData.whatsappLink,
        emailLink: formData.emailLink,
        refNumber: formData.refNumber,
        description: formData.description,

        propertyInfo: {
          type: formData.propertyInfo.type,
          purpose: formData.propertyInfo.purpose,
          refNo: formData.propertyInfo.refNo,
          completion: formData.propertyInfo.completion,
          furnishing: formData.propertyInfo.furnishing,
          truCheck: formData.propertyInfo.truCheck,
          avgRent: formData.propertyInfo.avgRent,
          currentStatus: formData.propertyInfo.currentStatus
        },

        validatedInfo: {
          developer: formData.validatedInfo.developer,
          ownership: formData.validatedInfo.ownership,
          buildUpArea: formData.validatedInfo.buildUpArea,
          usage: formData.validatedInfo.usage,
          parking: formData.validatedInfo.parking
        },

        buildingInfo: {
          name: formData.buildingInfo.name,
          year: formData.buildingInfo.year,
          floors: formData.buildingInfo.floors,
          pools: formData.buildingInfo.pools,
          parking: formData.buildingInfo.parking,
          area: formData.buildingInfo.area,
          elevators: formData.buildingInfo.elevators
        },

        amenities: formData.amenities,

        regulatoryInfo: {
          permitNo: formData.regulatoryInfo.permitNo,
          zone: formData.regulatoryInfo.zone,
          agent: formData.regulatoryInfo.agent,
          ded: formData.regulatoryInfo.ded,
          rera: formData.regulatoryInfo.rera,
          brn: formData.regulatoryInfo.brn
        },

        coordinates: {
          lat: formData.coordinates.lat ? Number(formData.coordinates.lat) : 0,
          lng: formData.coordinates.lng ? Number(formData.coordinates.lng) : 0
        }
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/${property._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Property updated successfully!");
        onOpenChange(false);
        onPropertyUpdated();
      } else {
        alert(`Error: ${data.message || "Failed to update property"}`);
      }
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Property
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="property">Property Details</TabsTrigger>
              <TabsTrigger value="building">Building Info</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
            </TabsList>

            {/* Basic Info - Same structure as AddPropertyDialog but with current values */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleBasicChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleBasicChange("location", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (AED) *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleBasicChange("price", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleBasicChange("propertyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beds">Bedrooms *</Label>
                  <Input
                    id="beds"
                    type="number"
                    min="0"
                    value={formData.beds}
                    onChange={(e) => handleBasicChange("beds", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baths">Bathrooms *</Label>
                  <Input
                    id="baths"
                    type="number"
                    min="0"
                    value={formData.baths}
                    onChange={(e) => handleBasicChange("baths", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sqft">Area (sqft) *</Label>
                  <Input
                    id="sqft"
                    type="number"
                    min="100"
                    value={formData.sqft}
                    onChange={(e) => handleBasicChange("sqft", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleBasicChange("state", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleBasicChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isOffPlan"
                  checked={formData.isOffPlan}
                  onChange={(e) => handleBasicChange("isOffPlan", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isOffPlan">Off Plan Property</Label>
              </div>
            </TabsContent>

            {/* Other tabs with similar structure - just replicate the pattern */}
            {/* Property Details */}
            <TabsContent value="property" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose *</Label>
                  <Select
                    value={formData.propertyInfo.purpose}
                    onValueChange={(value) => handleNestedChange("propertyInfo", "purpose", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      {purposes.map(purpose => (
                        <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentStatus">Current Status</Label>
                  <Select
                    value={formData.propertyInfo.currentStatus}
                    onValueChange={(value) => handleNestedChange("propertyInfo", "currentStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                      <SelectItem value="Rented">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Add other property detail fields similarly */}
              </div>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Property Images</Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "image")}
                    disabled={loading}
                  />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Property ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Add other tabs as needed */}
          </Tabs>

          <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Updating Property..." : "Update Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyForm;