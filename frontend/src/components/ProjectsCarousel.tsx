import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProjectCard from "./ProjectCard";

const ProjectsCarousel = () => {
  const [activeCity, setActiveCity] = useState("Dubai");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/project-details`, {
          credentials: "include"
        });
        const data = await response.json();
        setProjects(data);
        console.log("Fetched projects from projectdetail:", data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) => project.city === activeCity
  );

  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Browse New Projects in the UAE
          </h2>
          <p className="text-muted-foreground">
            Discover the latest developments across the Emirates
          </p>
        </div>

        {/* City Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 overflow-x-auto pb-2">
          {[...new Set(projects.map((p) => p.city))].map((city) => (
            <Badge
              key={city}
              variant={activeCity === city ? "default" : "secondary"}
              className="px-4 py-2 cursor-pointer whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-smooth"
              onClick={() => setActiveCity(city)}
            >
              {city}
            </Badge>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="px-8">
            View all new projects in {activeCity}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsCarousel;
