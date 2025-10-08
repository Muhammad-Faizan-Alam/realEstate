// src/data/projects.ts

export interface Project {
  _id: string;           // MongoDB ka ID
  title: string;
  location?: string;
  area?: string;
  priceFrom?: string;
  handover?: string;
  image?: string;
  city?: string;
  whatsappLink?: string;
  // agar tum purana id field rakhna chaho to optional banao
  id?: string;
}
export const projects: Project[] = [
  // Dubai Projects
  {
    _id: "1",
    title: "Neva Residences",
    location: "Dubai Marina",
    area: "Dubai Marina",
    priceFrom: "AED 1.2M",
    handover: "Q4 2025",
    image: "https://media.istockphoto.com/id/2189495681/photo/green-building-concept.jpg?s=612x612&w=0&k=20&c=tYgukCWgsmGWC_N4DJiLMZcMmXG2iVAZZyIvT0Tw68k=",
    city: "Dubai 2",
    whatsappLink: "https://wa.me/971501234567"
  },


];

export const cities = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Umm Al Quwain"];