import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

const PropertyInfoTables = ({ property }) => {
  const { propertyInfo, validatedInfo, buildingInfo, regulatoryInfo } = property;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><h3 className="font-semibold">Property Information</h3></CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow><TableCell className="font-medium">Type</TableCell><TableCell>{propertyInfo.type}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Purpose</TableCell><TableCell>{propertyInfo.purpose}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Reference No.</TableCell><TableCell>{propertyInfo.refNo}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Completion</TableCell><TableCell>{propertyInfo.completion}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Furnishing</TableCell><TableCell>{propertyInfo.furnishing}</TableCell></TableRow>
              {propertyInfo.truCheck && (
                <TableRow>
                  <TableCell className="font-medium">TruCheck</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="font-semibold">Validated Information</h3></CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow><TableCell className="font-medium">Developer</TableCell><TableCell>{validatedInfo.developer.name || validatedInfo.ownership}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Ownership</TableCell><TableCell>{validatedInfo.ownership}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Build-up Area</TableCell><TableCell>{validatedInfo.buildUpArea}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Usage</TableCell><TableCell>{validatedInfo.usage}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Parking</TableCell><TableCell>{validatedInfo.parking}</TableCell></TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="font-semibold">Building Information</h3></CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow><TableCell className="font-medium">Building Name</TableCell><TableCell>{buildingInfo.name}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Year Built</TableCell><TableCell>{buildingInfo.year}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Total Floors</TableCell><TableCell>{buildingInfo.floors}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Elevators</TableCell><TableCell>{buildingInfo.elevators}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Parking Spaces</TableCell><TableCell>{buildingInfo.parking}</TableCell></TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="font-semibold">Regulatory Information</h3></CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow><TableCell className="font-medium">Permit No.</TableCell><TableCell>{regulatoryInfo.permitNo}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Zone</TableCell><TableCell>{regulatoryInfo.zone}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Agency</TableCell><TableCell>{regulatoryInfo.agency.name}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">RERA</TableCell><TableCell>{regulatoryInfo.rera}</TableCell></TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyInfoTables;