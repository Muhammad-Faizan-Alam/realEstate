// components/agency/PropertiesGrid.tsx (Updated for responsiveness)
import React, { useState, useEffect } from "react";
import { Plus, Filter, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [activeSection, activeState, activeStatus, agency, filters, pagination.currentPage]);

  const fetchProperties = async () => {
    if (!agency?._id) return;

    try {
      setLoading(true);

      const propertyTypeMap: { [key: string]: string } = {
        'apartments': 'Apartment',
        'villas': 'Villa',
        'townhouse': 'Townhouse',
        'others': 'others'
      };

      const queryParams = new URLSearchParams({
        agency: agency._id,
        propertyType: activeSection === "all" ? "" : (propertyTypeMap[activeSection] || activeSection),
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
        `${import.meta.env.VITE_API_URL}/agencies/${agency._id}/properties?${queryParams}`, {
        credentials: "include"
      });

      const data = await res.json();

      if (data.properties) {
        setProperties(data.properties);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const PaginationButtons = () => {
    if (pagination.totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = window.innerWidth < 768 ? 3 : 5;

    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrev}
          className="flex items-center gap-1 text-xs sm:text-sm"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant={pagination.currentPage === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(1)}
              className="text-xs sm:text-sm"
            >
              1
            </Button>
            {startPage > 2 && <span className="px-1 sm:px-2 text-gray-500">...</span>}
          </>
        )}

        {pageNumbers.map(number => (
          <Button
            key={number}
            variant={pagination.currentPage === number ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(number)}
            className="text-xs sm:text-sm"
          >
            {number}
          </Button>
        ))}

        {endPage < pagination.totalPages && (
          <>
            {endPage < pagination.totalPages - 1 && <span className="px-1 sm:px-2 text-gray-500">...</span>}
            <Button
              variant={pagination.currentPage === pagination.totalPages ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pagination.totalPages)}
              className="text-xs sm:text-sm"
            >
              {pagination.totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNext}
          className="flex items-center gap-1 text-xs sm:text-sm"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    );
  };

  if (loading) {
    return <PropertiesGridSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
            Properties Management
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {pagination.totalProperties} properties found
            {pagination.totalPages > 1 && ` • Page ${pagination.currentPage} of ${pagination.totalPages}`}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>

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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Property</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </AddPropertyDialog>
        </div>
      </div>

      {/* Filters - Mobile */}
      {showFilters && (
        <div className="lg:hidden mb-6">
          <PropertyFilters filters={filters} setFilters={setFilters} />
        </div>
      )}

      {/* Filters - Desktop */}
      <div className="hidden lg:block mb-6">
        <PropertyFilters filters={filters} setFilters={setFilters} />
      </div>

      {/* Properties List */}
      <PropertiesList
        properties={properties}
        viewMode={viewMode}
        onPropertyUpdated={fetchProperties}
      />

      {/* Pagination */}
      <PaginationButtons />
    </div>
  );
};

export default PropertiesGrid;