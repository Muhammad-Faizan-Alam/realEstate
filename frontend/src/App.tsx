import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import Apartments from "./pages/Apartments";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Villas from "./pages/Villas";
import OtherProperties from "./pages/OtherProperties";
import AgencyDashboard from "./components/agency/AgencyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./components/agent/AgentDashboard";
import Auth from './pages/Auth'
import FindMyAgent from './pages/FindMyAgent'
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/new-project/:title/:id" element={<ProjectDetail />} />
          <Route path="/apartment" element={<Apartments />} />
          <Route path="/properties" element={<Properties />} />

          <Route path="/apartments/:state" element={<Apartments />} />
          <Route path="/villas/:state" element={<Villas />} />
          <Route
            path="/other-properties/:state"
            element={<OtherProperties />}
          />
          

          <Route
            path="/apartments-in-dubai/:title/:id"
            element={<PropertyDetail />}
          />
          <Route
            path="/villas-in-dubai/:title/:id"
            element={<PropertyDetail />}
          />
          <Route
            path="/other-properties/:title/:id"
            element={<PropertyDetail />}
          />
          <Route
            path="/other-properties/:title/:id"
            element={<PropertyDetail />}
          />

          <Route
            path="/apartments-in-dubai/:title/:id"
            element={<PropertyDetail />}
          />

          <Route
            path="/property-details/:id"
            element={<PropertyDetail />}
          />
          {/* <Route path="/apartments-in-dubai/:slug/:id" element={<PropertyDetail />} /> */}

          <Route path="/villas-in-dubai/:title/:id" element={<Villas />} />
          <Route path="/land" element={<OtherProperties />} />
          <Route path="/building" element={<OtherProperties />} />
          <Route path="/floor" element={<OtherProperties />} />
          {/* Legacy routes for backwards compatibility */}
          <Route path="/apartments-in-dubai" element={<Apartments />} />
          <Route path="/villas-in-dubai" element={<Villas />} />
          <Route path="/other-properties" element={<OtherProperties />} />


          {/* Dashboards */}
          <Route path="/agency/dashboard" element={<AgencyDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/agent/dashboard" element={<AgentDashboard />} />

          <Route path="/agents" element={<FindMyAgent />} />

          {/* Auth */}
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
