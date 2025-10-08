import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";

const PropertyTabs = ({ property }) => {
  const [mortgageAmount, setMortgageAmount] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("3.5");
  const [loanTerm, setLoanTerm] = useState("25");

  const calculateMortgage = () => {
    const principal = parseFloat(mortgageAmount) || 0;
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;

    if (principal > 0 && monthlyRate > 0) {
      const monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      return monthlyPayment.toFixed(0);
    }
    return "0";
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Details & Overview</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
        <TabsTrigger value="mortgage">Mortgage Calculator</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Overview</h3>
            <p className="text-muted-foreground">{property.description}</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="trends" className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Price Trends
            </h3>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Price trend chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="mortgage" className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Mortgage Calculator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mortgage-amount">Property Price (AED)</Label>
                <Input id="mortgage-amount" value={mortgageAmount} onChange={(e) => setMortgageAmount(e.target.value)} placeholder="Enter property price" />
              </div>
              <div>
                <Label htmlFor="down-payment">Down Payment (%)</Label>
                <Input id="down-payment" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} placeholder="25" />
              </div>
              <div>
                <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                <Input id="interest-rate" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="3.5" />
              </div>
              <div>
                <Label htmlFor="loan-term">Loan Term (Years)</Label>
                <Input id="loan-term" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} placeholder="25" />
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Estimated Monthly Payment</p>
                <p className="text-2xl font-bold text-primary">AED {calculateMortgage()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PropertyTabs;