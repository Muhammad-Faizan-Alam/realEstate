import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, TrendingUp, CreditCard } from "lucide-react";

// Developer ka structure
interface Developer {
  _id: string;
  name: string;
  logo: string;
}

interface ProjectDetail {
  _id: string;
  title: string;
  description: string;
  developer: Developer | string; // API kabhi object, kabhi string de sakti hai
  propertyType: string;
  progress: number;
  paymentPlan: string;
  handover: string;
  city: string;
}

const ProjectOverview = () => {
  const [project, setProject] = useState<ProjectDetail | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/project-details`
        );
        const data: ProjectDetail[] = await response.json();

        // Filhaal ek hi project dikhana ho, pehle project ko set kar dete hain
        setProject(data[0]);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, []);

  if (!project) {
    return <p className="text-center py-10">Loading project overview...</p>;
  }

  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
              <div className="prose prose-lg max-w-none">
                {(project.description ?? "")
                  .split("\n")
                  .map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-muted-foreground leading-relaxed mb-4"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Facts */}
          <div className="animate-fade-in">
            <Card className="shadow-card hover:shadow-card-hover transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2 text-primary" />
                  Quick Facts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Developer */}
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">Developer</span>
                  <span className="font-medium">
                    {typeof project.developer === "string"
                      ? project.developer
                      : project.developer?.name}
                  </span>
                </div>

                {/* Property Type */}
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">Property Type</span>
                  <Badge variant="secondary">{project.propertyType}</Badge>
                </div>

                {/* Progress */}
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">Progress</span>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1 text-success" />
                    <span className="font-medium text-success">
                      {project.progress}%
                    </span>
                  </div>
                </div>

                {/* Payment Plan */}
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">Payment Plan</span>
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-1 text-primary" />
                    <span className="font-medium">{project.paymentPlan}</span>
                  </div>
                </div>

                {/* Handover Date */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Handover Date</span>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-primary" />
                    <span className="font-medium">{project.handover}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Construction Progress
                    </span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectOverview;
