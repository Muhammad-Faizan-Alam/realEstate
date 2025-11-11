import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Eye } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Project {
  _id: string;
  image: string;
  title: string;
  location: string;
  area: string;
  priceFrom: string;
  handover: string;
  city: string;
}

interface SimilarProjectsProps {
  currentProjectId: string;
  city: string;
}

const SimilarProjects = ({ currentProjectId, city }: SimilarProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/project-details`, {
          credentials: 'include',
        }); // apni API ka URL
        const data = await res.json();

        // Filter same city projects, excluding current one
        const filtered = data.filter(
          (project: Project) =>
            project._id !== currentProjectId && project.city === city
        );

        setProjects(filtered.slice(0, 6)); // sirf 6 projects
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentProjectId, city]);

  const itemsPerPage = 3;
  const maxIndex = Math.max(0, projects.length - itemsPerPage);

  const nextSlide = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const visibleProjects = projects.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (projects.length === 0) return null;

  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Similar Projects in {city}
          </h2>
          <p className="text-muted-foreground">
            Discover other exceptional developments in {city} that might
            interest you
          </p>
        </div>

        <div className="relative animate-fade-in">
          {/* Carousel Controls */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="rounded-full shadow-card hover:shadow-card-hover"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex space-x-2">
              {Array.from({
                length: Math.ceil(projects.length / itemsPerPage),
              }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${Math.floor(currentIndex / itemsPerPage) === index
                      ? "bg-primary"
                      : "bg-muted"
                    }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="rounded-full shadow-card hover:shadow-card-hover"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project) => (
              <Card
                key={project._id}
                className="group overflow-hidden shadow-card hover:shadow-card-hover transition-smooth"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                    New Project
                  </Badge>
                  <div className="absolute top-3 right-3 bg-black/40 text-white px-2 py-1 rounded text-sm backdrop-blur-sm">
                    {project.priceFrom}
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-smooth line-clamp-2">
                    {project.title}
                  </h3>

                  <div className="flex items-center text-muted-foreground text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {project.area}, {project.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{project.handover}</span>
                    </div>
                    <span className="font-bold text-primary">
                      {project.priceFrom}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Link to={`/project/${project._id}`} className="w-full">
                    <Button className="w-full" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Projects in {city}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimilarProjects;
