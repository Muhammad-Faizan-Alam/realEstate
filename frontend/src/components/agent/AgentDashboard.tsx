"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgentSidebar from "./AgentSidebar";
import PropertiesGrid from "./PropertiesGrid";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import StoriesGallery from './StoriesGallery'

const AgentDashboard = () => {
  const [user, setUser] = useState(null);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("apartments");
  const [activeState, setActiveState] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storiesTab, setStoriesTab] = useState(true);
  useEffect(() => {
    console.log("-----------------------------", storiesTab);
  }, [storiesTab])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
          credentials: "include"
        });
        const data = await res.json();
        if (data?._id) {
          setUser(data);
          // Fetch agent data
          const agentRes = await fetch(`${import.meta.env.VITE_API_URL}/agents/find/${data._id}`, {
          credentials: "include"
        });
          if (agentRes.ok) {
            const agentData = await agentRes.json();
            setAgent(agentData);
            console.log("Agent Data:", agentData);
          } else {
            window.location.href = "/agent/register";
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

  if (user && user.role !== "agent") {
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
      <div className={`${storiesTab ? 'hidden' : 'block'}`}>
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
              <AgentSidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                activeState={activeState}
                setActiveState={setActiveState}
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
                agent={agent}
                storiesTab={storiesTab}
                setStoriesTab={setStoriesTab}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
            <AgentSidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              activeState={activeState}
              setActiveState={setActiveState}
              activeStatus={activeStatus}
              setActiveStatus={setActiveStatus}
              agent={agent}
              storiesTab={storiesTab}
              setStoriesTab={setStoriesTab}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-0">
            <PropertiesGrid
              activeSection={activeSection}
              activeState={activeState}
              activeStatus={activeStatus}
              agent={agent}
            />
          </div>
        </div>
      </div>

      {storiesTab &&
        <div className="min-h-screen">
          <StoriesGallery agent={agent} />
        </div>
      }
      <Footer />
    </div>
  );
};

export default AgentDashboard;