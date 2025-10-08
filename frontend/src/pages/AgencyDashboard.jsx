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
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgencyPropertyCard from '@/components/apartments/AgencyPropertyCard'

const dummyDevelopers = [
  { id: "1", name: "DAMAC Properties" },
  { id: "2", name: "Emaar Properties" },
  { id: "3", name: "Nakheel" },
];

const AddPropertyForm = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);

  // Form state matching the exact schema structure
  const [formData, setFormData] = useState({
    // Basic fields
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
    // postedDate: "",
    description: "",

    // Nested objects
    propertyInfo: {
      type: "",
      purpose: "",
      refNo: "",
      completion: "",
      furnishing: "",
      truCheck: false,
      avgRent: "",
      // addedOn: ""
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
      // retailCentres: "",
      pools: "",
      parking: "",
      area: "",
      elevators: ""
    },

    amenities: [],

    // similarTransactions: [
    //   {
    //     date: "",
    //     location: "",
    //     area: "",
    //     price: ""
    //   }
    // ],

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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
          credentials: "include"
        });
        const data = await res.json();
        console.log("Fetched user profile:", data);
        if (data?._id) {
          setUser(data);
          setFormData(prev => ({
            ...prev,
            regulatoryInfo: {
              ...prev.regulatoryInfo,
              agency: data._id
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/properties/byagency/${user._id}`);
        const data = await res.json();
        console.log("Fetched projects:", data);
        setProperties(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProperties();
  }, [user])

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

  const addTag = (e, field, values) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      handleBasicChange(field, [...values, e.target.value.trim()]);
      e.target.value = "";
      e.preventDefault(); // Prevent form submission on Enter
    }
  };

  // const handleTransactionChange = (index, field, value) => {
  //   const updated = [...formData.similarTransactions];
  //   updated[index][field] = value;
  //   handleBasicChange("similarTransactions", updated);
  // };

  // const addTransaction = () => {
  //   handleBasicChange("similarTransactions", [
  //     ...formData.similarTransactions, 
  //     { date: "", location: "", area: "", price: "" }
  //   ]);
  // };

  // const removeTransaction = (index) => {
  //   const updated = formData.similarTransactions.filter((_, i) => i !== index);
  //   handleBasicChange("similarTransactions", updated);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty similar transactions
      // const filteredTransactions = formData.similarTransactions.filter(
      //   transaction => transaction.date || transaction.location || transaction.area || transaction.price
      // );

      // Prepare payload exactly matching schema
      const payload = {
        // Basic fields
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
        // postedDate: formData.postedDate,
        description: formData.description,

        // Nested objects
        propertyInfo: {
          type: formData.propertyInfo.type,
          purpose: formData.propertyInfo.purpose,
          refNo: formData.propertyInfo.refNo,
          completion: formData.propertyInfo.completion,
          furnishing: formData.propertyInfo.furnishing,
          truCheck: formData.propertyInfo.truCheck,
          avgRent: formData.propertyInfo.avgRent,
          // addedOn: formData.propertyInfo.addedOn
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
          // retailCentres: formData.buildingInfo.retailCentres,
          pools: formData.buildingInfo.pools,
          parking: formData.buildingInfo.parking,
          area: formData.buildingInfo.area,
          elevators: formData.buildingInfo.elevators
        },

        amenities: formData.amenities,

        // similarTransactions: filteredTransactions,

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

      console.log("Submitting payload:", payload); // For debugging

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
      // postedDate: "",
      description: "",
      propertyInfo: {
        type: "",
        purpose: "",
        refNo: "",
        completion: "",
        furnishing: "",
        truCheck: false,
        avgRent: "",
        // addedOn: ""
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
        // retailCentres: "",
        pools: "",
        parking: "",
        area: "",
        elevators: ""
      },
      amenities: [],
      // similarTransactions: [
      //   {
      //     date: "",
      //     location: "",
      //     area: "",
      //     price: ""
      //   }
      // ],
      regulatoryInfo: {
        permitNo: "",
        zone: "",
        agency: user?._id || "",
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
    <div>
      <Header />
      {user && (
        <div className="bg-gray-100 p-4 text-center text-sm text-gray-700">
          Logged in as <span className="font-semibold">{user.name}</span> ({user.email})
        </div>
      )}
      <div className="p-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2 shadow-md">
              + Add New Property
            </Button>
          </DialogTrigger>

          <DialogContent className="w-full sm:w-11/12 lg:w-3/4 max-w-6xl h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-blue-800">
                Add Property
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
                  {/* <span className="flex flex-wrap items-center gap-2">
                    <label className="text-gray-500 ml-2">Posted Date</label>
                  <Input 
                    type="date" 
                    placeholder="Posted Date" 
                    value={formData.postedDate}
                    onChange={(e) => handleBasicChange("postedDate", e.target.value)}
                      className="w-1/2"
                  />
                  </span> */}

                  {/* Tags */}
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Press Enter to add tags"
                      onKeyDown={(e) => addTag(e, "tags", formData.tags)}
                    />
                    <div className="flex gap-2 flex-wrap mt-2">
                      {formData.tags.map((t, i) => (
                        <span key={i} className="bg-gray-200 px-2 py-1 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Property Info */}
                <TabsContent value="propertyInfo" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* <Input 
                    placeholder="Type" 
                    value={formData.propertyInfo.type}
                    onChange={(e) => handleNestedChange("propertyInfo", "type", e.target.value)}
                  /> */}
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
                  {/* <Input 
                    placeholder="Purpose" 
                    value={formData.propertyInfo.purpose}
                    onChange={(e) => handleNestedChange("propertyInfo", "purpose", e.target.value)}
                  /> */}
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
                  <Input className="hidden"
                    placeholder="TruCheck"
                    value={formData.propertyInfo.truCheck}
                    onChange={(e) => handleNestedChange("propertyInfo", "truCheck", e.target.value)}
                  />
                  <Input
                    placeholder="Average Rent"
                    value={formData.propertyInfo.avgRent}
                    onChange={(e) => handleNestedChange("propertyInfo", "avgRent", e.target.value)}
                  />
                  {/* <Input 
                    type="date" 
                    placeholder="Added On" 
                    value={formData.propertyInfo.addedOn}
                    onChange={(e) => handleNestedChange("propertyInfo", "addedOn", e.target.value)}
                  /> */}
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
                  {/* <Input 
                    placeholder="Retail Centres" 
                    value={formData.buildingInfo.retailCentres}
                    onChange={(e) => handleNestedChange("buildingInfo", "retailCentres", e.target.value)}
                  /> */}
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
                    value={user ? user.name : "Loading..."}
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
                        <span key={i} className="bg-green-200 px-2 py-1 rounded">{a}</span>
                      ))}
                    </div>
                  </div>

                  {/* Similar Transactions */}
                  {/* <div>
                    <Label>Similar Transactions</Label>
                    {formData.similarTransactions.map((st, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
                        <Input 
                          placeholder="Date" 
                          value={st.date}
                          onChange={(e) => handleTransactionChange(idx, "date", e.target.value)}
                        />
                        <Input 
                          placeholder="Location" 
                          value={st.location}
                          onChange={(e) => handleTransactionChange(idx, "location", e.target.value)}
                        />
                        <Input 
                          placeholder="Area" 
                          value={st.area}
                          onChange={(e) => handleTransactionChange(idx, "area", e.target.value)}
                        />
                        <Input 
                          placeholder="Price" 
                          value={st.price}
                          onChange={(e) => handleTransactionChange(idx, "price", e.target.value)}
                        />
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeTransaction(idx)}
                          disabled={formData.similarTransactions.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addTransaction} type="button">
                      + Add Transaction
                    </Button>
                  </div> */}

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
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
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

      {/* properties */}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
        {properties.length > 0 ? (
          properties.map((property) => (
            <AgencyPropertyCard key={property._id} property={property} />
          ))
        ) : (
          <p className='text-center text-gray-500 mt-10'>No properties available</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AddPropertyForm;