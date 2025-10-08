import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleImageError } from "@/lib/imageUtils";

const Footer = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  // 🔹 Fetch partners from API
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/partners`);
        const data = await res.json();
        console.log("Fetched partners:", data);
        setPartners(data);
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const currentLogos = partners.slice(currentLogoIndex, currentLogoIndex + 3);

  const nextLogos = () => {
    setCurrentLogoIndex((prev) =>
      prev + 3 >= partners.length ? 0 : prev + 3
    );
  };

  const prevLogos = () => {
    setCurrentLogoIndex((prev) =>
      prev - 3 < 0 ? Math.max(0, partners.length - 3) : prev - 3
    );
  };

  const footerSections = [
    {
      title: "MyRealEstate",
      links: ["About Us", "Contact Us", "Careers", "Press", "Terms & Conditions", "Privacy Policy"],
    },
    {
      title: "Discover",
      links: ["New Projects", "Popular Areas", "Property Guides", "Market Reports", "Investment Opportunities"],
    },
    {
      title: "Quick Links",
      links: ["Buy Property", "Rent Property", "Sell Property", "Property Valuation", "Mortgage Calculator"],
    },
    {
      title: "Support",
      links: ["Help Center", "Contact Support", "Report an Issue", "Feedback", "Community"],
    },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Partner Logos Section */}
      {/* <div className="border-b border-primary-foreground/10 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white mb-3">Our Trusted Partners</h3>
            <p className="text-green-100">Leading developers and agencies across the UAE</p>
          </div>

          {loading ? (
            <p className="text-center text-green-100">Loading partners...</p>
          ) : partners.length === 0 ? (
            <p className="text-center text-green-100">No partners available.</p>
          ) : (
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevLogos}
                className="rounded-full bg-white/10 text-white hover:bg-white/20 shadow-md"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <div className="flex items-center space-x-10 flex-1 justify-center">
                {currentLogos.map((partner) => (
                  <div
                    key={partner._id}
                    className="text-center group cursor-pointer transform transition duration-300 hover:scale-105"
                  >
                    <div className="bg-white p-5 rounded-2xl shadow-md mb-3 group-hover:shadow-lg transition">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="h-32 w-60 mx-auto filter grayscale group-hover:grayscale-0 transition"
                        onError={(e) => handleImageError(e, partner._id)}
                      />
                    </div>
                    <p className="text-sm font-semibold text-white">{partner.name}</p>
                    <p className="text-xs text-green-200">{partner.properties} Properties</p>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextLogos}
                className="rounded-full bg-white/10 text-white hover:bg-white/20 shadow-md"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          )}
        </div>
      </div> */}

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-lg mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Country Selector & Social Links */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-12 pt-8 border-t border-primary-foreground/10">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Globe className="w-5 h-5" />
              <Select defaultValue="uae">
                <SelectTrigger className="w-32 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uae">UAE</SelectItem>
                  <SelectItem value="ksa">KSA</SelectItem>
                  <SelectItem value="pk">Pakistan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-primary-foreground/80 mr-2">Follow us:</span>
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10 w-8 h-8"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8 pt-4 border-t border-primary-foreground/10">
            <p className="text-sm text-primary-foreground/80">
              © 2024 MyRealEstate. All rights reserved. | Powered by cutting-edge technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
