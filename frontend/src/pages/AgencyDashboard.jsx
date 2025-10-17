"use client";
import React, { useState, useEffect } from "react";
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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Plus, Upload, MapPin, Calendar, Shield, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgencyPropertyCard, { AgencyPropertyCardSkeleton } from '@/components/apartments/AgencyPropertyCard';

const dummyDevelopers = [
  { id: "1", name: "DAMAC Properties" },
  { id: "2", name: "Emaar Properties" },
  { id: "3", name: "Nakheel" },
];

const AgencyDashboard = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [agency, setAgency] = useState(null);
  const [isAgency, setIsAgency] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  
  // Loading states
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAgency, setLoadingAgency] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(6);

  // Form state matching the exact schema structure
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
      purpose: "",
      refNo: "",
      completion: "",
      furnishing: "",
      truCheck: false,
      avgRent: "",
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
      agency: "",
      ded: "",
      rera: "",
      brn: ""
    },

    coordinates: {
      lat: "",
      lng: ""
    }
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingUser(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
          credentials: "include"
        });
        const data = await res.json();
        console.log("Fetched user profile:", data);
        if (data?._id) {
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchProfile();
  }, []);

  // Check if already an agency
  useEffect(() => {
    if (!user?._id) return;

    const findAgency = async () => {
      try {
        setLoadingAgency(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/agencies/find/${user._id}`);
        if (res.ok) setIsAgency(true);
        const data = await res.json();
        setAgency(data);
        setFormData(prev => ({
          ...prev,
          regulatoryInfo: {
            ...prev.regulatoryInfo,
            agency: data._id
          }
        }));
        console.log("Agency data:", data);
      } catch (error) {
        console.error("Error fetching agency:", error);
      } finally {
        setLoadingAgency(false);
      }
    };

    findAgency();
  }, [user]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoadingProperties(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/properties/byagency/${agency._id}`);
        const data = await res.json();
        console.log("Fetched properties:", data);
        setProperties(data);
        // Reset to first page when properties change
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoadingProperties(false);
      }
    };

    if (agency && user?._id) {
      fetchProperties();
    }
  }, [agency, user]);

  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle basic field changes
  const handleBasicChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle nested object changes
  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (e, type) => {
    const files = e.target.files;
    const uploaded = [];

    try {
      for (let file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "my_unsigned_preset");
        const res = await fetch("https://api.cloudinary.com/v1_1/dqt60inwv/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        console.log("Upload response:", data);
        uploaded.push(data.secure_url);
      }

      if (type === "image") {
        handleBasicChange("images", [...formData.images, ...uploaded]);
      }
      if (type === "video") {
        handleBasicChange("videos", [...formData.videos, ...uploaded]);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("upload_preset", "my_unsigned_preset");
      const res = await fetch("https://api.cloudinary.com/v1_1/dqt60inwv/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();
      console.log("Upload response:", data);
      setImageUrl(data.secure_url);
    } catch (error) {
      console.error("Error uploading logo:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = (e, field, values) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      handleBasicChange(field, [...values, e.target.value.trim()]);
      e.target.value = "";
      e.preventDefault();
    }
  };

  // Submit Agency Profile
  const handleSubmitAgency = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!imageUrl) {
      alert("Please upload a logo");
      setLoading(false);
      return;
    } else if (!description) {
      alert("Please enter a description");
      setLoading(false);
      return;
    }
    try {
      const payload = {
        name: user.name,
        logo: imageUrl,
        description: description,
        user: user._id
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/agencies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Agency profile created successfully!");
        setIsAgency(true);
        setAgency(data);
        console.log("Created agency:", data);
        setLoading(false);
        window.location.reload();
      } else {
        alert(`Error: ${data.message || "Failed to create agency"}`);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating agency:", error);
      alert("Failed to create agency. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
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

      console.log("Submitting payload:", payload);

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
        setOpen(false);
        resetForm();
        // Refresh properties list
        setLoadingProperties(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/properties/byagency/${agency.user._id}`);
        const updatedProperties = await res.json();
        setProperties(updatedProperties);
      } else {
        alert(`Error: ${data.message || "Failed to add property"}`);
      }
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Failed to add property. Please try again.");
    } finally {
      setLoading(false);
      setLoadingProperties(false);
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
        purpose: "",
        refNo: "",
        completion: "",
        furnishing: "",
        truCheck: false,
        avgRent: "",
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

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => paginate(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pageNumbers.map(number => (
          <Button
            key={number}
            variant={currentPage === number ? "default" : "outline"}
            size="sm"
            onClick={() => paginate(number)}
          >
            {number}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant={currentPage === totalPages ? "default" : "outline"}
              size="sm"
              onClick={() => paginate(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Show loading state while checking user
  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not an agency
  if (user && user.role !== "agency") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Access Restricted
              </CardTitle>
              <CardDescription>
                This area is reserved for registered agencies only.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                You need to have an agency account to access the dashboard.
                Please contact administration if you believe this is an error.
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Agency Registration Form
  if (!isAgency && user?.role === "agency" && !loadingAgency) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center border-b">
                <CardTitle className="text-2xl text-blue-600 flex items-center justify-center gap-2">
                  <Building className="h-8 w-8" />
                  Complete Your Agency Profile
                </CardTitle>
                <CardDescription className="text-lg">
                  Welcome, {user.name}! Complete your profile to start listing properties.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmitAgency} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="logo" className="text-sm font-medium text-gray-700">
                        Agency Logo *
                      </Label>
                      <div className="mt-1 flex items-center gap-4">
                        <input
                          type="file"
                          id="logo"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {loading && (
                          <div className="text-sm text-blue-600">Uploading...</div>
                        )}
                      </div>
                      {imageUrl && (
                        <div className="mt-3">
                          <img
                            src={imageUrl}
                            alt="Agency logo preview"
                            className="w-32 h-32 rounded-lg object-cover border-2 border-blue-200"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Agency Description *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your agency's expertise, services, and unique value proposition..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 h-32"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                  >
                    {loading ? "Creating Profile..." : "Complete Registration"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show loading while agency data is being fetched
  if (loadingAgency || !agency) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading agency dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {agency ? (
        <>
          {/* Agency Header */}
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {agency?.logo && (
                    <img
                      src={agency.logo}
                      alt={`${agency?.name} logo`}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {agency?.name || user?.name}
                    </h1>
                    <p className="text-gray-600 mt-1">{agency?.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>Agency ID: {agency?._id?.slice(-8)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {formatDate(agency?.createdAt)}</span>
                      </div>
                      <Badge
                        variant={agency?.verify ? "default" : "secondary"}
                        className="flex items-center gap-1"
                      >
                        {agency?.verify ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {agency?.verify ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 shadow-sm flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add New Property
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        Add New Property
                      </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                      <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-6">
                          <TabsTrigger value="basic">Basic</TabsTrigger>
                          <TabsTrigger value="propertyInfo">Property Info</TabsTrigger>
                          <TabsTrigger value="building">Building</TabsTrigger>
                          <TabsTrigger value="validated">Validated</TabsTrigger>
                          <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
                          <TabsTrigger value="extra">Extras</TabsTrigger>
                        </TabsList>

                        {/* Basic Info */}
                        <TabsContent value="basic" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Property Title *"
                            value={formData.title}
                            onChange={(e) => handleBasicChange("title", e.target.value)}
                            required
                          />
                          <Input
                            placeholder="Location *"
                            value={formData.location}
                            onChange={(e) => handleBasicChange("location", e.target.value)}
                            required
                          />
                          <Input
                            placeholder="Price *"
                            value={formData.price}
                            onChange={(e) => handleBasicChange("price", e.target.value)}
                            type="number"
                            min="100"
                            required
                          />
                          <Input
                            placeholder="Beds *"
                            type="number"
                            min="0"
                            value={formData.beds}
                            onChange={(e) => handleBasicChange("beds", e.target.value)}
                            required
                          />
                          <Input
                            placeholder="Baths *"
                            type="number"
                            min="0"
                            value={formData.baths}
                            onChange={(e) => handleBasicChange("baths", e.target.value)}
                            required
                          />
                          <Input
                            placeholder="Area in Square Feet *"
                            type="number"
                            min="100"
                            value={formData.sqft}
                            onChange={(e) => handleBasicChange("sqft", e.target.value)}
                            required
                          />
                          <Select
                            value={formData.propertyType}
                            onValueChange={(value) => handleBasicChange("propertyType", value)}
                          >
                            <SelectTrigger><SelectValue placeholder="Property Type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Apartment">Apartment</SelectItem>
                              <SelectItem value="Villas">Villas</SelectItem>
                              <SelectItem value="Townhouse">Townhouse</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="State"
                            value={formData.state}
                            onChange={(e) => handleBasicChange("state", e.target.value)}
                          />
                          <Textarea
                            placeholder="Description"
                            className="md:col-span-2"
                            value={formData.description}
                            onChange={(e) => handleBasicChange("description", e.target.value)}
                          />
                          <Select
                            value={formData.developer}
                            onValueChange={(value) => handleBasicChange("developer", value)}
                          >
                            <SelectTrigger><SelectValue placeholder="Developer" /></SelectTrigger>
                            <SelectContent>
                              {dummyDevelopers.map((d) => (
                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                          <Input
                            placeholder="Payment Plan"
                            value={formData.paymentPlan}
                            onChange={(e) => handleBasicChange("paymentPlan", e.target.value)}
                          />
                          <Input
                            placeholder="WhatsApp Link"
                            value={formData.whatsappLink}
                            onChange={(e) => handleBasicChange("whatsappLink", e.target.value)}
                          />
                          <Input
                            placeholder="Email Link"
                            value={formData.emailLink}
                            onChange={(e) => handleBasicChange("emailLink", e.target.value)}
                          />
                          <Input
                            placeholder="Reference Number"
                            value={formData.refNumber}
                            onChange={(e) => handleBasicChange("refNumber", e.target.value)}
                          />

                          {/* Tags */}
                          <div className="md:col-span-2">
                            <Label>Tags</Label>
                            <Input
                              placeholder="Press Enter to add tags"
                              onKeyDown={(e) => addTag(e, "tags", formData.tags)}
                            />
                            <div className="flex gap-2 flex-wrap mt-2">
                              {formData.tags.map((t, i) => (
                                <Badge key={i} variant="secondary" className="px-2 py-1">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TabsContent>

                        {/* Property Info */}
                        <TabsContent value="propertyInfo" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Select
                            value={formData.propertyInfo.type}
                            onValueChange={(value) => handleNestedChange("propertyInfo", "type", value)}
                          >
                            <SelectTrigger><SelectValue placeholder="Property Type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Apartment">Apartment</SelectItem>
                              <SelectItem value="Villas">Villas</SelectItem>
                              <SelectItem value="Townhouse">Townhouse</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={formData.propertyInfo.purpose}
                            onValueChange={(value) => handleNestedChange("propertyInfo", "purpose", value)}
                          >
                            <SelectTrigger><SelectValue placeholder="Purpose" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sale">For Sale</SelectItem>
                              <SelectItem value="Rent">For Rent</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Ref No"
                            value={formData.propertyInfo.refNo}
                            onChange={(e) => handleNestedChange("propertyInfo", "refNo", e.target.value)}
                          />
                          <Input
                            placeholder="Completion"
                            value={formData.propertyInfo.completion}
                            onChange={(e) => handleNestedChange("propertyInfo", "completion", e.target.value)}
                          />
                          <Input
                            placeholder="Furnishing"
                            value={formData.propertyInfo.furnishing}
                            onChange={(e) => handleNestedChange("propertyInfo", "furnishing", e.target.value)}
                          />
                          <Input
                            placeholder="Average Rent"
                            value={formData.propertyInfo.avgRent}
                            onChange={(e) => handleNestedChange("propertyInfo", "avgRent", e.target.value)}
                          />
                        </TabsContent>

                        {/* Building Info */}
                        <TabsContent value="building" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Building Name or Title"
                            value={formData.buildingInfo.name}
                            onChange={(e) => handleNestedChange("buildingInfo", "name", e.target.value)}
                          />
                          <Input
                            placeholder="Year Built"
                            value={formData.buildingInfo.year}
                            onChange={(e) => handleNestedChange("buildingInfo", "year", e.target.value)}
                          />
                          <Input
                            placeholder="Total Floors"
                            value={formData.buildingInfo.floors}
                            onChange={(e) => handleNestedChange("buildingInfo", "floors", e.target.value)}
                          />
                          <Input
                            placeholder="Pools"
                            value={formData.buildingInfo.pools}
                            onChange={(e) => handleNestedChange("buildingInfo", "pools", e.target.value)}
                          />
                          <Input
                            placeholder="Parking"
                            value={formData.buildingInfo.parking}
                            onChange={(e) => handleNestedChange("buildingInfo", "parking", e.target.value)}
                          />
                          <Input
                            placeholder="Area (Street Address or Locality)"
                            value={formData.buildingInfo.area}
                            onChange={(e) => handleNestedChange("buildingInfo", "area", e.target.value)}
                          />
                          <Input
                            placeholder="Elevators"
                            value={formData.buildingInfo.elevators}
                            onChange={(e) => handleNestedChange("buildingInfo", "elevators", e.target.value)}
                          />
                        </TabsContent>

                        {/* Validated Info */}
                        <TabsContent value="validated" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Select
                            value={formData.validatedInfo.developer}
                            onValueChange={(value) => handleNestedChange("validatedInfo", "developer", value)}
                          >
                            <SelectTrigger><SelectValue placeholder="Developer" /></SelectTrigger>
                            <SelectContent>
                              {dummyDevelopers.map((d) => (
                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Ownership"
                            value={formData.validatedInfo.ownership}
                            onChange={(e) => handleNestedChange("validatedInfo", "ownership", e.target.value)}
                          />
                          <Input
                            placeholder="Build Up Area (sqft)"
                            value={formData.validatedInfo.buildUpArea}
                            onChange={(e) => handleNestedChange("validatedInfo", "buildUpArea", e.target.value)}
                          />
                          <Input
                            placeholder="Usage"
                            value={formData.validatedInfo.usage}
                            onChange={(e) => handleNestedChange("validatedInfo", "usage", e.target.value)}
                          />
                          <Input
                            placeholder="Parking"
                            value={formData.validatedInfo.parking}
                            onChange={(e) => handleNestedChange("validatedInfo", "parking", e.target.value)}
                          />
                        </TabsContent>

                        {/* Regulatory Info */}
                        <TabsContent value="regulatory" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Permit No"
                            value={formData.regulatoryInfo.permitNo}
                            onChange={(e) => handleNestedChange("regulatoryInfo", "permitNo", e.target.value)}
                          />
                          <Input
                            placeholder="Zone"
                            value={formData.regulatoryInfo.zone}
                            onChange={(e) => handleNestedChange("regulatoryInfo", "zone", e.target.value)}
                          />
                          <Input
                            value={agency.name ? agency.name : "Your Agency Name"}
                            disabled
                            placeholder="Agency (auto-filled)"
                          />
                          <Input
                            placeholder="DED"
                            value={formData.regulatoryInfo.ded}
                            onChange={(e) => handleNestedChange("regulatoryInfo", "ded", e.target.value)}
                          />
                          <Input
                            placeholder="RERA"
                            value={formData.regulatoryInfo.rera}
                            onChange={(e) => handleNestedChange("regulatoryInfo", "rera", e.target.value)}
                          />
                          <Input
                            placeholder="BRN"
                            value={formData.regulatoryInfo.brn}
                            onChange={(e) => handleNestedChange("regulatoryInfo", "brn", e.target.value)}
                          />
                        </TabsContent>

                        {/* Extras */}
                        <TabsContent value="extra" className="space-y-6">
                          {/* Amenities */}
                          <div>
                            <Label>Amenities</Label>
                            <Input
                              placeholder="Press Enter to add amenities like Gym, Pool, etc."
                              onKeyDown={(e) => addTag(e, "amenities", formData.amenities)}
                            />
                            <div className="flex gap-2 flex-wrap mt-2">
                              {formData.amenities.map((a, i) => (
                                <Badge key={i} variant="outline" className="px-2 py-1">
                                  {a}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Media Upload */}
                          <div>
                            <Label>Images</Label>
                            <Input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, "image")}
                            />
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              {formData.images.map((img, i) => (
                                <img key={i} src={img} alt="property" className="rounded-lg shadow h-20 object-cover" />
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label>Videos</Label>
                            <Input
                              type="file"
                              multiple
                              accept="video/*"
                              onChange={(e) => handleFileUpload(e, "video")}
                            />
                            <ul className="list-disc pl-5 mt-2 text-sm">
                              {formData.videos.map((vid, i) => (
                                <li key={i} className="text-blue-600">{vid}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Coordinates */}
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              type="number"
                              placeholder="Latitude"
                              value={formData.coordinates.lat}
                              onChange={(e) => handleNestedChange("coordinates", "lat", e.target.value)}
                            />
                            <Input
                              type="number"
                              placeholder="Longitude"
                              value={formData.coordinates.lng}
                              onChange={(e) => handleNestedChange("coordinates", "lng", e.target.value)}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>

                      {/* Footer Buttons */}
                      <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setOpen(false)}
                          type="button"
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save Property"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Properties Section */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Properties Portfolio</h2>
                <p className="text-gray-600 mt-1">
                  {loadingProperties ? (
                    "Loading properties..."
                  ) : (
                    `Showing ${currentProperties.length} of ${properties.length} propert${properties.length === 1 ? 'y' : 'ies'}${totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}`
                  )}
                </p>
              </div>
            </div>

            {loadingProperties ? (
              // Show skeleton cards while loading
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {Array.from({ length: propertiesPerPage }).map((_, index) => (
                  <AgencyPropertyCardSkeleton key={index} />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {currentProperties.map((property) => (
                    <AgencyPropertyCard key={property._id} property={property} />
                  ))}
                </div>
                
                {/* Pagination */}
                <Pagination />
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Listed</h3>
                  <p className="text-gray-600 mb-4">
                    Get started by adding your first property to your portfolio.
                  </p>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Property
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading agency dashboard...</p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AgencyDashboard;