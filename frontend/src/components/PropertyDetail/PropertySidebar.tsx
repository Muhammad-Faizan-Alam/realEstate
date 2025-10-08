import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageCircle, Share2 } from "lucide-react";

const PropertySidebar = ({ property, recommended }) => {
  return (
    <div className="sticky top-4 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3 flex flex-col gap-0.5">
            {/* <Button className="w-full" size="lg"><Phone className="w-4 h-4 mr-2" />Call</Button> */}
            <a href={property.emailLink}>
              <Button variant="outline" className="w-full" size="lg"><Mail className="w-4 h-4 mr-2" />Email</Button>
            </a>
            <a href={property.whatsappLink}>
              <Button variant="outline" className="w-full" size="lg"><MessageCircle className="w-4 h-4 mr-2" />WhatsApp</Button>
            </a>
            <Button variant="outline" className="w-full" size="lg" disabled>Reference # {property.refNumber}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Quick Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Property Type</span><span>{property.propertyType}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Developer</span><span>{property.developer.name || property.validatedInfo.ownership}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Completion</span><span>{property.propertyInfo.completion}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Avg. Rent</span><span>{property.propertyInfo.avgRent}</span></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="font-semibold">Recommended Properties</h3></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommended.length > 0 ? (
              recommended.map((recProperty) => (
                <div key={recProperty._id} className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                  const slug = recProperty.title.toLowerCase().replace(/\s+/g, "-");
                  window.location.href = `/apartments-in-dubai/${slug}/${recProperty._id}`;
                }}>
                  <img src={recProperty.images?.[0] || "https://via.placeholder.com/400x250"} alt={recProperty.title} className="w-full h-24 object-cover rounded mb-2" onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x250"; }} />
                  <h4 className="font-medium text-sm mb-1">{recProperty.title}</h4>
                  <p className="text-xs text-muted-foreground mb-1">{recProperty.location}</p>
                  <p className="font-semibold text-primary">{recProperty.price}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recommended properties found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertySidebar;