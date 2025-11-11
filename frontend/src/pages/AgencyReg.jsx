"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AgencyReg = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [agency, setAgency] = useState(null);
  const [isAgency, setIsAgency] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  // Loading states
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAgency, setLoadingAgency] = useState(true);

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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/agencies/find/${user._id}`, {
          credentials: 'include',
        });
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
        credentials: 'include',
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
        setLoading(false);
        window.location.href = "/agency/dashboard";
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

  // Show loading state while checking user
  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
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
};

export default AgencyReg;