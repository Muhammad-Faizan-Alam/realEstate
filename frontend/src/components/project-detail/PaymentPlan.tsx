import { CheckCircle, Calendar, CreditCard, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PaymentScheduleItem {
  milestone: string;
  percentage: number;
  description: string;
  _id?: string;
}

interface PaymentPlanProps {
  paymentPlan: string;
  paymentSchedule: PaymentScheduleItem[];
}

const PaymentPlan = ({ paymentPlan, paymentSchedule }: PaymentPlanProps) => {
  if (!paymentPlan || !paymentSchedule?.length) {
    return null; // Agar data nahi hai to kuch show na karo
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Payment Plan</h2>
          <p className="text-muted-foreground">
            Flexible payment options designed to make your investment journey seamless
          </p>
        </div>

        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Payment Plan Header */}
          <Card className="mb-8 shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <CreditCard className="w-6 h-6 text-primary" />
                <span>{paymentPlan}</span>
              </CardTitle>
              <p className="text-muted-foreground">
                Structured payment schedule with developer-backed guarantees
              </p>
            </CardHeader>
          </Card>

          {/* Payment Schedule Timeline */}
          <div className="space-y-6">
            {paymentSchedule.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === paymentSchedule.length - 1;

              return (
                <div key={item._id || index} className="relative">
                  {!isLast && (
                    <div className="absolute left-8 top-16 w-0.5 h-16 bg-border" />
                  )}

                  <Card className="hover:shadow-card-hover transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Timeline Dot */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                              isFirst
                                ? "bg-success"
                                : isLast
                                ? "bg-primary"
                                : "bg-muted-foreground"
                            }`}
                          >
                            {item.percentage}%
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{item.milestone}</h3>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-primary" />
                              <span className="font-bold text-primary">
                                {item.percentage}%
                              </span>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-4">{item.description}</p>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Payment Progress</span>
                              <span>{item.percentage}%</span>
                            </div>
                            <Progress value={item.percentage} className="h-2" />
                          </div>
                        </div>

                        {/* Check Icon for First Item */}
                        {isFirst && (
                          <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Payment Benefits */}
          <Card className="mt-8 bg-accent shadow-card">
            <CardHeader>
              <CardTitle className="text-center">Payment Plan Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Flexible Timing</h4>
                  <p className="text-sm text-muted-foreground">
                    Extended payment periods aligned with construction milestones
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">No Hidden Fees</h4>
                  <p className="text-sm text-muted-foreground">
                    Transparent pricing with no surprise charges or additional costs
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Early Bird Discounts</h4>
                  <p className="text-sm text-muted-foreground">
                    Special pricing and incentives for early bookings and quick payments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PaymentPlan;
