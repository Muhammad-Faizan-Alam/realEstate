import { useEffect, useState } from "react";
import { MapPin, Calendar, Building, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Developer {
  _id: string;
  name: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ProjectDetail {
  _id: string;
  title: string;
  area: string;
  location: string;
  priceFrom: string;
  handover: string;
  developer: Developer;
  progress: number;
  unitTypes: string[];
  image: string;
  paymentPlan: string;
}

const ProjectHero = ({ projectId }: { projectId: string }) => {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  console.log("Project ID received in ProjectHero:", projectId);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/project-details/${projectId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch project");
        }
        const data = await res.json();
        setProject(data);
        console.log("Fetched projectcvdfklvnsdfjk nadjkvndfj :", data);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (!project) {
    return <p className="text-center py-10">Loading project...</p>;
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6 animate-fade-in">
            <div>
              <Badge className="mb-4 bg-primary text-primary-foreground">
                New Project
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                {project.title}
              </h1>
            </div>

            {/* Location & Area */}
            <div className="flex items-center text-muted-foreground text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              <span>
                {project.area}, {project.location}
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Starting from</p>
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 text-primary mr-1" />
                <span className="text-3xl font-bold text-primary">
                  {project.priceFrom}
                </span>
              </div>
            </div>

            {/* Handover */}
            <div className="flex items-center text-lg">
              <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-2">Handover:</span>
              <span className="font-semibold">{project.handover}</span>
            </div>

            {/* Developer */}
            <div className="flex items-center text-lg">
              <Building className="w-5 h-5 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-2">Developer:</span>
              <span className="font-semibold">{project.developer?.name}</span>
             
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="bg-accent rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {project.progress}%
                </p>
                <p className="text-sm text-muted-foreground">Completion</p>
              </div>
              <div className="bg-accent rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {project.unitTypes?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Unit Types</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative animate-fade-in">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-card-hover">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover hover:scale-105 transition-smooth"
              />
            </div>

            <Badge className="absolute top-4 left-4 bg-success text-success-foreground">
              {project.paymentPlan}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectHero;
