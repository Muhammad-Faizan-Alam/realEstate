// components/agency/AddPropertyDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload } from "lucide-react";

const dummyDevelopers = [
  { id: "1", name: "DAMAC Properties" },
  { id: "2", name: "Emaar Properties" },
  { id: "3", name: "Nakheel" },
];

const propertyTypes = ["Apartment", "Villa", "Townhouse", "Penthouse", "Office", "Shop", "Other"];
const states = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];
const purposes = ["Sale", "Rent"];
const furnishingTypes = ["Furnished", "Unfurnished", "Partially Furnished"];

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agency: any;
  onPropertyAdded: () => void;
  children: React.ReactNode;
}

const AddPropertyDialog: React.FC<AddPropertyDialogProps> = ({
  open,
  onOpenChange,
  agency,
  onPropertyAdded,
  children
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
      agency: agency?._id || "",
      ded: "",
      rera: "",
      brn: ""
    },

    coordinates: {
      lat: "",
      lng: ""
    }
  });

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
          currentStatus: formData.propertyInfo.currentStatus,
          addedOn: new Date().toISOString().split('T')[0]
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
          agency: formData.regulatoryInfo.agency,
          ded: formData.regulatoryInfo.ded,
          rera: formData.regulatoryInfo.rera,
          brn: formData.regulatoryInfo.brn
        },

        coordinates: {
          lat: formData.coordinates.lat ? Number(formData.coordinates.lat) : 0,
          lng: formData.coordinates.lng ? Number(formData.coordinates.lng) : 0
        }
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Property added successfully!");
        onOpenChange(false);
        resetForm();
        onPropertyAdded();
      } else {
        alert(`Error: ${data.message || "Failed to add property"}`);
      }
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Failed to add property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
        agency: agency?._id || "",
        ded: "",
        rera: "",
        brn: ""
      },
      coordinates: {
        lat: "",
        lng: ""
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Property
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

            {/* Basic Info */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="Luxury Apartment in Downtown"
                    value={formData.title}
                    onChange={(e) => handleBasicChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Downtown Dubai"
                    value={formData.location}
                    onChange={(e) => handleBasicChange("location", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (AED) *</Label>
                  <Input
                    id="price"
                    placeholder="2,500,000"
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
                    placeholder="2"
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
                    placeholder="2"
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
                    placeholder="1500"
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

                <div className="space-y-2">
                  <Label htmlFor="developer">Developer</Label>
                  <Select
                    value={formData.developer}
                    onValueChange={(value) => handleBasicChange("developer", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select developer" />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyDevelopers.map(dev => (
                        <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the property features, location advantages, and unique selling points..."
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

            {/* Property Details */}
            <TabsContent value="property" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="refNo">Reference Number</Label>
                  <Input
                    id="refNo"
                    placeholder="REF-001"
                    value={formData.propertyInfo.refNo}
                    onChange={(e) => handleNestedChange("propertyInfo", "refNo", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="completion">Completion Date</Label>
                  <Input
                    id="completion"
                    type="date"
                    value={formData.propertyInfo.completion}
                    onChange={(e) => handleNestedChange("propertyInfo", "completion", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="furnishing">Furnishing</Label>
                  <Select
                    value={formData.propertyInfo.furnishing}
                    onValueChange={(value) => handleNestedChange("propertyInfo", "furnishing", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select furnishing" />
                    </SelectTrigger>
                    <SelectContent>
                      {furnishingTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
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

                {formData.propertyInfo.purpose === "Rent" && (
                  <div className="space-y-2">
                    <Label htmlFor="avgRent">Average Rent (AED)</Label>
                    <Input
                      id="avgRent"
                      placeholder="120,000"
                      value={formData.propertyInfo.avgRent}
                      onChange={(e) => handleNestedChange("propertyInfo", "avgRent", e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="paymentPlan">Payment Plan</Label>
                  <Input
                    id="paymentPlan"
                    placeholder="40/60 Payment Plan"
                    value={formData.paymentPlan}
                    onChange={(e) => handleBasicChange("paymentPlan", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="truCheck"
                  checked={formData.propertyInfo.truCheck}
                  onChange={(e) => handleNestedChange("propertyInfo", "truCheck", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="truCheck">TruCheck Verified</Label>
              </div>
            </TabsContent>

            {/* Building Info */}
            <TabsContent value="building" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingName">Building Name</Label>
                  <Input
                    id="buildingName"
                    placeholder="Burj Khalifa"
                    value={formData.buildingInfo.name}
                    onChange={(e) => handleNestedChange("buildingInfo", "name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    placeholder="2010"
                    value={formData.buildingInfo.year}
                    onChange={(e) => handleNestedChange("buildingInfo", "year", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floors">Total Floors</Label>
                  <Input
                    id="floors"
                    placeholder="163"
                    value={formData.buildingInfo.floors}
                    onChange={(e) => handleNestedChange("buildingInfo", "floors", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pools">Swimming Pools</Label>
                  <Input
                    id="pools"
                    placeholder="2"
                    value={formData.buildingInfo.pools}
                    onChange={(e) => handleNestedChange("buildingInfo", "pools", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parking">Parking Spaces</Label>
                  <Input
                    id="parking"
                    placeholder="2"
                    value={formData.buildingInfo.parking}
                    onChange={(e) => handleNestedChange("buildingInfo", "parking", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="elevators">Elevators</Label>
                  <Input
                    id="elevators"
                    placeholder="8"
                    value={formData.buildingInfo.elevators}
                    onChange={(e) => handleNestedChange("buildingInfo", "elevators", e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Amenities */}
            <TabsContent value="amenities" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities</Label>
                <Input
                  id="amenities"
                  placeholder="Press Enter to add amenities (e.g., Gym, Pool, Security)"
                  onKeyDown={(e) => addTag(e, "amenities", formData.amenities)}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeTag("amenities", index)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Press Enter to add tags (e.g., Luxury, Waterfront, New)"
                  onKeyDown={(e) => addTag(e, "tags", formData.tags)}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag("tags", index)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Media */}
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
                  {loading && <p className="text-sm text-blue-600 mt-2">Uploading images...</p>}
                  
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

                <div>
                  <Label>Property Videos</Label>
                  <Input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, "video")}
                    disabled={loading}
                  />
                  {formData.videos.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {formData.videos.map((video, index) => (
                        <li key={index} className="text-sm text-blue-600">
                          Video {index + 1}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Regulatory */}
            <TabsContent value="regulatory" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="permitNo">Permit Number</Label>
                  <Input
                    id="permitNo"
                    placeholder="PER-2024-001"
                    value={formData.regulatoryInfo.permitNo}
                    onChange={(e) => handleNestedChange("regulatoryInfo", "permitNo", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zone">Zone</Label>
                  <Input
                    id="zone"
                    placeholder="Commercial"
                    value={formData.regulatoryInfo.zone}
                    onChange={(e) => handleNestedChange("regulatoryInfo", "zone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ded">DED Number</Label>
                  <Input
                    id="ded"
                    placeholder="DED-123456"
                    value={formData.regulatoryInfo.ded}
                    onChange={(e) => handleNestedChange("regulatoryInfo", "ded", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rera">RERA Number</Label>
                  <Input
                    id="rera"
                    placeholder="RERA-789012"
                    value={formData.regulatoryInfo.rera}
                    onChange={(e) => handleNestedChange("regulatoryInfo", "rera", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brn">BRN Number</Label>
                  <Input
                    id="brn"
                    placeholder="BRN-345678"
                    value={formData.regulatoryInfo.brn}
                    onChange={(e) => handleNestedChange("regulatoryInfo", "brn", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    placeholder="25.2048"
                    value={formData.coordinates.lat}
                    onChange={(e) => handleNestedChange("coordinates", "lat", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    placeholder="55.2708"
                    value={formData.coordinates.lng}
                    onChange={(e) => handleNestedChange("coordinates", "lng", e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
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
              {loading ? "Adding Property..." : "Add Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyDialog;