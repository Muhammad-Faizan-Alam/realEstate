import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState("buy");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");

  const propertyTypes = [
    "Apartment",
    "Villa",
    "Townhouse",
    "Other",
    // "Penthouse",
    // "Land",
    // "Floor",
    // "Building"
  ];

  const priceRanges = [
    "Any Price",
    "Up to AED 500K",
    "AED 500K - 1M",
    "AED 1M - 2M",
    "AED 2M - 5M",
    "AED 5M+"
  ];

  const bedsOptions = ["Any", "Studio", "1", "2", "3", "4", "5+"];
  const bathsOptions = ["Any", "1", "2", "3", "4", "5+"];

  const handleSearch = () => {
    if (!propertyType) return;

    const params = new URLSearchParams();
    params.set('property', propertyType);
    if (transactionType) params.set('type', transactionType);
    if (location) params.set('location', location);
    if (priceRange && priceRange !== 'any price') params.set('priceRange', priceRange);
    if (beds && beds !== 'any') params.set('beds', beds);
    if (baths && baths !== 'any') params.set('baths', baths);

    const routes: { [key: string]: string } = {
      'apartment': '/apartment',
      'villa': '/villa',
      'townhouse': '/townhouse',
      'other': '/other',
      // 'penthouse': '/apartment',
      // 'land': '/land',
      // 'floor': '/floor',
      // 'building': '/building'
    };

    // const route = routes[propertyType] || '/apartments';
    const route = 'properties'
    navigate(`${route}?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4">
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Find Your Dream Home
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Discover the perfect property in the UAE
          </p>
        </div>

        {/* Search Tabs */}
        <Tabs defaultValue="properties" className="w-full">
          {/* <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto mb-6 bg-white/10 backdrop-blur">
            <TabsTrigger 
              value="properties" 
              className="text-white data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              All Properties
            </TabsTrigger>
            <TabsTrigger 
              value="projects"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              New Projects
            </TabsTrigger>
            <TabsTrigger 
              value="transactions"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger 
              value="estimate"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              TruEstimate™
            </TabsTrigger>
            <TabsTrigger 
              value="agents"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              Agents
            </TabsTrigger>
          </TabsList> */}

          <TabsContent value="properties">
            <div className="bg-white/10 backdrop-blur rounded-lg shadow-card-hover p-6">
              {/* Buy/Rent Toggle */}
              <div className="flex gap-2 mb-4">
                <Badge
                  variant={transactionType === "buy" ? "default" : "secondary"}
                  className="px-8 py-2 cursor-pointer text-sm font-medium"
                  onClick={() => setTransactionType("buy")}
                >
                  Buy
                </Badge>
                <Badge
                  variant={transactionType === "rent" ? "default" : "secondary"}
                  className="px-8 py-2 cursor-pointer text-sm font-medium"
                  onClick={() => setTransactionType("rent")}
                >
                  Rent
                </Badge>

                {/* Location */}
                <div className="lg:col-span-2 w-full">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Location (e.g., Dubai Marina)"
                      className="pl-10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Search Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Property Type */}
                <div className="lg:col-span-2">
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="lg:col-span-2">
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Price" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range} value={range.toLowerCase()}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Beds */}
                <div className="lg:col-span-1">
                  <Select value={beds} onValueChange={setBeds}>
                    <SelectTrigger>
                      <SelectValue placeholder="Beds" />
                    </SelectTrigger>
                    <SelectContent>
                      {bedsOptions.map((bedOption) => (
                        <SelectItem key={bedOption} value={bedOption.toLowerCase()}>
                          {bedOption} {bedOption !== "Any" && bedOption !== "Studio" ? "Bed" + (bedOption === "1" ? "" : "s") : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <div>
                  <Button
                    className="w-full h-10 bg-primary hover:bg-primary-hover"
                    onClick={handleSearch}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Other Tab Contents */}
          <TabsContent value="projects">
            <div className="bg-white rounded-lg shadow-card-hover p-6 text-center">
              <p className="text-muted-foreground">Search new projects coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <div className="bg-white rounded-lg shadow-card-hover p-6 text-center">
              <p className="text-muted-foreground">Transaction search coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="estimate">
            <div className="bg-white rounded-lg shadow-card-hover p-6 text-center">
              <p className="text-muted-foreground">Property estimation coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="agents">
            <div className="bg-white rounded-lg shadow-card-hover p-6 text-center">
              <p className="text-muted-foreground">Agent search coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Hero;
