import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PropertyDescription = ({ description }) => {
  const [expandedDescription, setExpandedDescription] = useState(false);
  const truncatedDescription = description.substring(0, 200) + '...';

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-3">Description</h3>
        <p className="text-muted-foreground leading-relaxed">
          {expandedDescription ? description : truncatedDescription}
        </p>
        <Button
          variant="link"
          className="p-0 h-auto mt-2"
          onClick={() => setExpandedDescription(!expandedDescription)}
        >
          {expandedDescription ? "Read Less" : "Read More"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyDescription;