import { MapPin, TrendingUp, Building, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AboutCityProps {
  city: string;
}

const AboutCity = ({ city }: AboutCityProps) => {
  // City-specific content (for demo, using Dubai as example)
  const cityInfo = {
    description: `${city} stands as one of the world's most dynamic and cosmopolitan cities, offering an unparalleled lifestyle experience that seamlessly blends luxury, innovation, and opportunity. This remarkable emirate has transformed from a modest trading port into a global hub for business, tourism, and real estate investment, attracting millions of residents and visitors from around the world.

    The city's strategic location, world-class infrastructure, and business-friendly environment have made it a preferred destination for international investors and expatriates seeking high-quality living standards. With its stunning architecture, pristine beaches, and year-round sunshine, ${city} offers a unique combination of urban sophistication and natural beauty that is truly unmatched.

    From luxury shopping destinations and fine dining restaurants to cultural attractions and recreational facilities, ${city} provides endless opportunities for entertainment and leisure. The city's commitment to innovation and sustainable development continues to shape its future, making it an ideal place to live, work, and invest in real estate.`,
    
    stats: [
      {
        icon: Building,
        value: "200+",
        label: "Luxury Developments",
        description: "World-class residential and commercial projects"
      },
      {
        icon: Users,
        value: "3.5M+",
        label: "Residents",
        description: "Diverse multicultural population"
      },
      {
        icon: TrendingUp,
        value: "7-9%",
        label: "Rental Yield",
        description: "Average annual return on investment"
      },
      {
        icon: MapPin,
        value: "50+",
        label: "Prime Locations",
        description: "Prestigious neighborhoods and districts"
      }
    ]
  };

  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">About {city}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover why {city} is one of the world's most sought-after destinations for real estate investment and luxury living
          </p>
        </div>

        {/* City Description */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-in">
          <div className="prose prose-lg max-w-none">
            {cityInfo.description.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-6">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </div>

        {/* City Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {cityInfo.stats.map((stat, index) => (
            <Card key={index} className="text-center shadow-card hover:shadow-card-hover transition-smooth group">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
                  <p className="font-semibold">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Highlights */}
        <div className="mt-12 animate-fade-in">
          <h3 className="text-2xl font-bold text-center mb-8">Why Choose {city}?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">World-Class Infrastructure</h4>
              <p className="text-sm text-muted-foreground">
                State-of-the-art facilities, modern transportation networks, and cutting-edge technology integration
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Strong Investment Returns</h4>
              <p className="text-sm text-muted-foreground">
                Consistent capital appreciation and attractive rental yields in prime locations
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Cosmopolitan Lifestyle</h4>
              <p className="text-sm text-muted-foreground">
                Diverse cultural experiences, world-class dining, and luxury shopping destinations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCity;