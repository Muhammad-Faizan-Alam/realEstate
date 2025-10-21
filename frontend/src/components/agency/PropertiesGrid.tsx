// components/agency/PropertiesGrid.tsx (Updated)
import React, { useState, useEffect } from "react";
import { Plus, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyFilters from "./PropertyFilters";
import PropertiesList from "./PropertiesList";
import AddPropertyDialog from "./AddPropertyDialog";
import { PropertiesGridSkeleton } from "./skeletons/PropertiesGridSkeleton";

interface PropertiesGridProps {
  activeSection: string;
  activeState: string;
  activeStatus: string;
  agency: any;
}

const PropertiesGrid: React.FC<PropertiesGridProps> = ({
  activeSection,
  activeState,
  activeStatus,
  agency
}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    type: "all",
    priceRange: [0, 10000000],
    beds: "all",
    baths: "all",
    area: [0, 10000],
    developer: "all",
    offPlan: "all",
    currentStatus: "all"
  });
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProperties: 0,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    fetchProperties();
  }, [activeSection, activeState, activeStatus, agency, filters, pagination.currentPage]);

  const fetchProperties = async () => {
    if (!agency?._id) return;
    
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        agency: agency._id,
        propertyType: activeSection === "all" ? "" : activeSection,
        state: activeState === "all" ? "" : activeState,
        status: activeStatus === "all" ? "" : activeStatus,
        type: filters.type,
        beds: filters.beds,
        baths: filters.baths,
        developer: filters.developer,
        offPlan: filters.offPlan,
        currentStatus: filters.currentStatus,
        page: pagination.currentPage.toString(),
        limit: '12'
      });

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/agencies/${agency._id}/properties?${queryParams}`
      );
      const data = await res.json();
      
      if (data.properties) {
        setProperties(data.properties);
        setPagination(data.pagination);
      }
      console.log("Fetched properties:", data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  if (loading) {
    return <PropertiesGridSkeleton />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties Management</h1>
          <p className="text-gray-600 mt-1">
            {pagination.totalProperties} properties found
            {pagination.totalPages > 1 && ` • Page ${pagination.currentPage} of ${pagination.totalPages}`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <AddPropertyDialog
            open={addPropertyOpen}
            onOpenChange={setAddPropertyOpen}
            agency={agency}
            onPropertyAdded={fetchProperties}
          >
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </AddPropertyDialog>
        </div>
      </div>

      {/* Filters */}
      <PropertyFilters filters={filters} setFilters={setFilters} />

      {/* Properties List */}
      <PropertiesList
        properties={properties}
        viewMode={viewMode}
        onPropertyUpdated={fetchProperties}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
          >
            Previous
          </Button>
          
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={pagination.currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertiesGrid;