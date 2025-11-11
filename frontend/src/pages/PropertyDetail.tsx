import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyHero from "@/components/PropertyDetail/PropertyHero";
import PropertyDescription from "@/components/PropertyDetail/PropertyDescription";
import PropertyInfoTables from "@/components/PropertyDetail/PropertyInfoTables";
import PropertyAmenities from "@/components/PropertyDetail/PropertyAmenities";
import PropertyTransactions from "@/components/PropertyDetail/PropertyTransactions";
import PropertyTabs from "@/components/PropertyDetail/PropertyTabs";
import PropertySidebar from "@/components/PropertyDetail/PropertySidebar";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/properties/${id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setProperty(data);
        console.log("jj", data);
      } catch (err) {
        console.error("Error fetching property:", err);
      }
    };

    const fetchRecommended = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/properties`, {
          credentials: 'include',
        });
        const data = await res.json();
        console.log(data);
        const filtered = data.filter((p: any) => p._id !== id).slice(0, 3);
        setRecommended(filtered);
      } catch (err) {
        console.error("Error fetching recommended:", err);
      }
    };

    if (id) {
      fetchProperty();
      fetchRecommended();
    }
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Property not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* <div className="container mx-auto px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/apartments">For Sale</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#">{property.location}</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{property.title}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div> */}

      <div className="container mx-auto px-4 pb-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PropertyHero property={property} />
            <PropertyDescription description={property.description} />
            <PropertyInfoTables property={property} />
            <PropertyAmenities amenities={property.amenities} />
            {/* <PropertyTransactions transactions={property.similarTransactions} /> */}
            {/* <PropertyTabs property={property} /> */}
          </div>
          <div className="lg:col-span-1">
            <PropertySidebar property={property} recommended={recommended} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetailPage;