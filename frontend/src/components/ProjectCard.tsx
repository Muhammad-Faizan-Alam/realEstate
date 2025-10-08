import { MessageCircle, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/data/projects";
import { Link } from "react-router-dom";
import { handleImageError, getPropertyImageFallback } from "@/lib/imageUtils";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-card-hover transition-smooth">
     <Link to={`/new-project/${project.title}/${project._id}`}>

        <div className="relative overflow-hidden">
          <img
            src={project.image || getPropertyImageFallback(project._id)}
            alt={project.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
            onError={(e) => handleImageError(e, project._id)}
          />
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            New Project
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-smooth">
            {project.title}
          </h3>
        
        <div className="flex items-center text-muted-foreground text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{project.area}, {project.location}</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">Starting from</p>
            <p className="font-bold text-lg text-primary">{project.priceFrom}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{project.handover}</span>
            </div>
          </div>
        </div>
      </CardContent>
      </Link>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-success hover:bg-success/90 text-success-foreground"
          onClick={() => window.open(project.whatsappLink, '_blank')}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;