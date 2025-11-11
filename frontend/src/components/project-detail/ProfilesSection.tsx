import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Award, Briefcase, Phone, Mail } from "lucide-react";

interface CityProfile {
  _id: string;
  name: string;
  role: string;
  image: string;
  description: string;
  city: string;
  experience: string;
  specialization: string;
}

const ProfilesSection = () => {
  const [profiles, setProfiles] = useState<CityProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<CityProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/city-profiles`, {
          credentials: 'include',
        });
        const data = await res.json();

        // Agar API array return kar rahi hai
        const profilesArray = Array.isArray(data) ? data : data.profiles || [];

        setProfiles(profilesArray);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading profiles...</p>;
  }

  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Meet Our Experts</h2>
          <p className="text-muted-foreground">
            Connect with our experienced real estate professionals
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {profiles.map((profile) => (
            <Dialog key={profile._id}>
              <DialogTrigger asChild>
                <Card
                  className="group cursor-pointer hover:shadow-card-hover transition-smooth"
                  onClick={() => setSelectedProfile(profile)}
                >
                  <CardContent className="p-6 text-center">
                    {/* Profile Image */}
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-smooth"
                      />
                      <div className="absolute inset-0 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all" />
                    </div>

                    {/* Name & Role */}
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-smooth">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {profile.role}
                    </p>

                    {/* Experience Badge */}
                    <Badge variant="secondary" className="mb-3">
                      {profile.experience}
                    </Badge>

                    {/* Specialization */}
                    <p className="text-xs text-muted-foreground">
                      {profile.specialization}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>

              {/* Profile Detail Modal */}
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-3">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{profile.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.role}
                      </p>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {profile.description}
                  </p>


                  {/* Experience & Specialization */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Experience
                        </p>
                        <p className="font-medium">{profile.experience}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Specialization
                        </p>
                        <p className="font-medium text-sm">
                          {profile.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          City
                        </p>
                        <p className="font-medium text-sm">
                          {profile.city}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex space-x-2 pt-4">
                    <Button size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* View All Experts Button */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            <User className="w-4 h-4 mr-2" />
            View All Experts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfilesSection;
