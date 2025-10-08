import { Bed, Bath, Square, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface unitTypes{
  _id:string
  name:string;
  sizeRange:string;
  priceRange:string;
  availability:string;
  bedrooms:string;
  bathrooms:string;

}
interface UnitTypesProps {
  unitTypes: unitTypes[];
}
  
const UnitTypes = ({ unitTypes }: UnitTypesProps) => {
  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Unit Types & Pricing</h2>
          <p className="text-muted-foreground">
            Choose from our carefully designed unit configurations to suit your lifestyle
          </p>
        </div>

        {/* Unit Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {unitTypes.map((unit, index) => {
            const isPopular = index === 1; // Make middle unit popular for demo
            
            return (
              <Card 
                key={index} 
                className={`relative overflow-hidden hover:shadow-card-hover transition-smooth ${
                  isPopular ? 'ring-2 ring-primary shadow-card-hover' : 'shadow-card'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <CardHeader className={`text-center ${isPopular ? 'pt-12' : 'pt-6'}`}>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bed className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{unit.name}</CardTitle>
                  <p className="text-muted-foreground">Perfect for {unit.bedrooms === "1" ? "singles or couples" : "families"}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Unit Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bed className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Bedrooms</span>
                      </div>
                      <span className="font-medium">{unit.bedrooms}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bath className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Bathrooms</span>
                      </div>
                      <span className="font-medium">{unit.bathrooms}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Square className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Size Range</span>
                      </div>
                      <span className="font-medium">{unit.sizeRange}</span>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="text-center bg-background rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Price Range</p>
                    <p className="text-xl font-bold text-primary">{unit.priceRange}</p>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <Badge variant="secondary" className="text-success">
                      {unit.availability}
                    </Badge>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Included Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                        <span>Premium fixtures and finishes</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                        <span>Built-in wardrobes</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                        <span>Kitchen appliances</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                        <span>Balcony with views</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                        <span>Smart home integration</span>
                      </li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button 
                      className={`w-full ${isPopular ? 'bg-primary hover:bg-primary-hover' : ''}`}
                      variant={isPopular ? "default" : "outline"}
                    >
                      Reserve Now
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full">
                      View Floor Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Need a Custom Configuration?</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Our team can help you find the perfect unit that matches your specific requirements and budget.
              </p>
              <Button>
                Speak with a Consultant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UnitTypes;