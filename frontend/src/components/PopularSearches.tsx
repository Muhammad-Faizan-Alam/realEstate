import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Home, MapPin, Landmark } from "lucide-react";

const PopularSearches = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sale");
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/properties`);
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };
    fetchData();
  }, []);

  // Helper function to categorize properties
  const categorize = (list: any[]) => {
    const apartments = list.filter(
      (p) => p.propertyType?.toLowerCase() === "apartment"
    );
    const villas = list.filter(
      (p) => p.propertyType?.toLowerCase() === "villa" || p.propertyType?.toLowerCase() === "villas"
    );
    const townhouses = list.filter(
      (p) => p.propertyType?.toLowerCase() === "townhouse" || p.propertyType?.toLowerCase() === "townhouses"
    );
    const others = list.filter(
      (p) =>
        !["apartment", "villa", "villas", "townhouse", "townhouses"].includes(
          p.propertyType?.toLowerCase()
        )
    );
    return { apartments, villas, townhouses, others };
  };

  // Separate Sale and Rent
  const saleProperties = properties.filter(
    (p) => p.propertyInfo?.purpose?.toLowerCase() === "sale"
  );
  const rentProperties = properties.filter(
    (p) => p.propertyInfo?.purpose?.toLowerCase() === "rent"
  );

  // Categorize
  const saleCategories = categorize(saleProperties);
  const rentCategories = categorize(rentProperties);

  const handleCardClick = (property: any) => {
    const type = property.propertyType?.toLowerCase().replace(/\s+/g, "-");
    navigate(`/property-details/${property._id}`);
  };

  const SearchCard = ({ property, icon: Icon }: { property: any; icon: any }) => (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all group"
      onClick={() => handleCardClick(property)}
    >
      <CardContent className="p-5 flex items-center space-x-3">
        <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
        <div>
          <p className="font-medium group-hover:text-primary transition-colors">
            {property.title || `${property.propertyType}`}
          </p>
          <p className="text-sm text-muted-foreground">{property.location}</p>
        </div>
      </CardContent>
    </Card>
  );

  // Reusable block for each category
  const CategoryBlock = ({
    title,
    icon: Icon,
    data,
  }: {
    title: string;
    icon: any;
    data: any[];
  }) => (
    <div>
      <h3 className="text-xl font-semibold mb-5 flex items-center">
        <Icon className="w-5 h-5 mr-2 text-primary" /> {title}
      </h3>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((p, idx) => (
            <SearchCard key={idx} property={p} icon={Icon} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No {title.toLowerCase()} found.</p>
      )}
    </div>
  );

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Popular Real Estate Searches</h2>
          <p className="text-muted-foreground">
            Explore the most sought-after properties in the UAE
          </p>
        </div>

        {/* Tabs for Sale / Rent */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="sale">For Sale</TabsTrigger>
            <TabsTrigger value="rent">For Rent</TabsTrigger>
          </TabsList>

          {/* For Sale */}
          <TabsContent value="sale">
            <div className="space-y-12">
              <CategoryBlock title="Apartments" icon={Building} data={saleCategories.apartments} />
              <CategoryBlock title="Villas" icon={Home} data={saleCategories.villas} />
              <CategoryBlock title="Townhouses" icon={Landmark} data={saleCategories.townhouses} />
              {saleCategories.others.length > 0 &&
                <CategoryBlock title="Other Properties" icon={MapPin} data={saleCategories.others} />
              }
            </div>
          </TabsContent>

          {/* For Rent */}
          <TabsContent value="rent">
            <div className="space-y-12">
              <CategoryBlock title="Apartments" icon={Building} data={rentCategories.apartments} />
              <CategoryBlock title="Villas" icon={Home} data={rentCategories.villas} />
              <CategoryBlock title="Townhouses" icon={Landmark} data={rentCategories.townhouses} />
              {rentCategories.others.length > 0 &&
                <CategoryBlock title="Other Properties" icon={MapPin} data={rentCategories.others} />
              }
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default PopularSearches;