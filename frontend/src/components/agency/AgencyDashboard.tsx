// components/agency/AgencyDashboard.tsx (Updated for responsiveness)
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgencySidebar from "./AgencySidebar";
import PropertiesGrid from "./PropertiesGrid";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const AgencyDashboard = () => {
  const [user, setUser] = useState(null);
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("apartments");
  const [activeState, setActiveState] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          const agencyRes = await fetch(`${import.meta.env.VITE_API_URL}/agencies/find/${data._id}`, {
            credentials: "include"
          });
          if (agencyRes.ok) {
            const agencyData = await agencyRes.json();
            setAgency(agencyData);
          } else {
            window.location.href = "/agency/register";
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

  // Close sidebar when section changes on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [activeSection, activeState, activeStatus]);

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

      {/* Mobile Sidebar Trigger */}
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 w-10 p-0 bg-white shadow-lg">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Navigation</h2>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <AgencySidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              activeState={activeState}
              setActiveState={setActiveState}
              activeStatus={activeStatus}
              setActiveStatus={setActiveStatus}
              agency={agency}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
          <AgencySidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            activeState={activeState}
            setActiveState={setActiveState}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            agency={agency}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
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