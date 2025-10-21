// components/agency/AgencyDashboard.tsx
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgencySidebar from "./AgencySidebar";
import PropertiesGrid from "./PropertiesGrid";
import { AgencyPropertyCardSkeleton } from '@/components/apartments/AgencyPropertyCard';

const AgencyDashboard = () => {
  const [user, setUser] = useState(null);
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("apartments");
  const [activeState, setActiveState] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
          credentials: "include"
        });
        const data = await res.json();
        if (data?._id) {
          setUser(data);
          // Fetch agency data
          const agencyRes = await fetch(`${import.meta.env.VITE_API_URL}/agencies/find/${data._id}`);
          if (agencyRes.ok) {
            const agencyData = await agencyRes.json();
            setAgency(agencyData);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
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

  if (user && user.role !== "agency") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          {/* Access Restricted Card */}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <AgencySidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          activeState={activeState}
          setActiveState={setActiveState}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          agency={agency}
        />
        <div className="flex-1 ml-64">
          <PropertiesGrid
            activeSection={activeSection}
            activeState={activeState}
            activeStatus={activeStatus}
            agency={agency}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AgencyDashboard;