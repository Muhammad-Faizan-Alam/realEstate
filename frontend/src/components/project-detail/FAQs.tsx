import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

interface FAQsProps {
  faqs: FAQ[];
  city: string;
}

const FAQs = ({ faqs, city }: FAQsProps) => {
  if (!faqs || faqs.length === 0) {
    return (
      <section className="py-16 bg-background text-center">
        <h2 className="text-2xl font-bold mb-2">
          No FAQs found for {city}
        </h2>
        <p className="text-muted-foreground">
          Currently, there are no FAQs available for {city} properties.
        </p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            FAQs about Properties in {city}
          </h2>
          <p className="text-muted-foreground">
            Get answers to the most commonly asked questions about investing in {city} real estate
          </p>
        </div>

        <div className="max-w-4xl mx-auto animate-fade-in">
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                <span>Frequently Asked Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq) => (
                  <AccordionItem
                    key={faq._id}
                    value={faq._id}
                    className="border border-border rounded-lg px-4 hover:shadow-card-hover transition-smooth"
                  >
                    <AccordionTrigger className="text-left hover:no-underline hover:text-primary transition-smooth py-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">Q</span>
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-9 pb-4 text-muted-foreground leading-relaxed">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-success">A</span>
                        </div>
                        <span>{faq.answer}</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Help Section */}
          <div className="mt-8 text-center">
            <Card className="bg-accent shadow-card">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Still have questions?</h3>
                <p className="text-muted-foreground mb-4">
                  Our expert team is here to help you with any additional questions about {city} properties.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-smooth">
                    Contact Our Experts
                  </button>
                  <button className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-smooth">
                    Schedule a Call
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
