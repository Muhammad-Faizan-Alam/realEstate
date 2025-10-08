export interface ProjectDetail {
  id: string;
  title: string;
  location: string;
  area: string;
  priceFrom: string;
  handover: string;
  image: string;
  city: string;
  whatsapp: string;
  developer: string;
  propertyType: string;
  progress: number;
  paymentPlan: string;
  description: string;
  gallery: string[];
  unitTypes: UnitType[];
  paymentSchedule: PaymentScheduleItem[];
  faqs: FAQ[];
}

export interface UnitType {
  id: string;
  name: string;
  sizeRange: string;
  priceRange: string;
  availability: string;
  bedrooms: string;
  bathrooms: string;
}

export interface PaymentScheduleItem {
  milestone: string;
  percentage: number;
  description: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface CityProfile {
  id: string;
  name: string;
  role: string;
  image: string;
  description: string;
  experience: string;
  specialization: string;
}



// Dummy data for project details
export const getProjectDetail = (id: string): ProjectDetail | null => {
  const projectDetails: { [key: string]: ProjectDetail } = {
    "1": {
      id: "1",
      title: "Neva Residences",
      location: "Dubai Marina",
      whatsapp: "https://wa.me/971501234567",
      area: "Dubai Marina", 
      priceFrom: "AED 1.2M",
      handover: "Q4 2025",
      image: "https://media.istockphoto.com/id/2189495681/photo/green-building-concept.jpg?s=612x612&w=0&k=20&c=tYgukCWgsmGWC_N4DJiLMZcMmXG2iVAZZyIvT0Tw68k=",
      city: "Dubai",
      developer: "Neva Development",
      propertyType: "Residential Apartments",
      progress: 75,
      paymentPlan: "80/20 Payment Plan",
      description: "Neva Residences stands as a testament to luxury living in the heart of Dubai Marina. This exceptional development offers breathtaking views of the marina and Arabian Gulf, featuring world-class amenities and sophisticated design elements that cater to the most discerning residents.\n\nThe project combines contemporary architecture with premium finishes, creating a harmonious blend of comfort and elegance. Each residence is meticulously designed to maximize natural light and provide stunning panoramic views, making it an ideal choice for those seeking an elevated lifestyle experience.\n\nWith its prime waterfront location, residents enjoy easy access to Dubai's finest dining, shopping, and entertainment destinations, while being part of one of the city's most prestigious communities.",
      gallery: [
        "https://media.istockphoto.com/id/2189495681/photo/green-building-concept.jpg?s=612x612&w=0&k=20&c=tYgukCWgsmGWC_N4DJiLMZcMmXG2iVAZZyIvT0Tw68k=",
        "https://media.istockphoto.com/id/2167986788/photo/construction-crew-putting-up-framing-of-new-home.jpg?s=612x612&w=0&k=20&c=PmoyuOSrfFNh7cCUUS8gkmcoQ24jhaOTSrShw_Buobc=", 
        "https://media.istockphoto.com/id/2190098690/photo/low-angle-view-on-modern-office-building-with-blue-glass-windows.jpg?s=612x612&w=0&k=20&c=Hjc56Y48aVumzC4tCLCKtPlIL0erfJY_Dttx5mnyYJU=",
        "https://media.istockphoto.com/id/2158947565/photo/contemporary-glass-skyscraper.jpg?s=612x612&w=0&k=20&c=pslRwnwJKK3Yr0eaCFCf5eO7wX6gIZbVf7BIlzh-72I=",
        "https://media.istockphoto.com/id/2191907519/photo/skyscraper-in-city-city-downtown-with-skyscraper-office-building-business-district-modern.jpg?s=612x612&w=0&k=20&c=nGGuf3ZfqA4AQJchgHg7LFrNB4RMoOltuWWjOEgD1_Q="
      ],
      unitTypes: [
        {
          id: "1",
          name: "1 Bedroom",
          sizeRange: "650 - 850 sq ft",
          priceRange: "AED 1.2M - 1.5M",
          availability: "15 Units Available",
          bedrooms: "1",
          bathrooms: "1-2"
        },
        {
          id: "2", 
          name: "2 Bedroom",
          sizeRange: "950 - 1,200 sq ft",
          priceRange: "AED 1.8M - 2.3M",
          availability: "12 Units Available",
          bedrooms: "2",
          bathrooms: "2-3"
        },
        {
          id: "3",
          name: "3 Bedroom",
          sizeRange: "1,300 - 1,650 sq ft", 
          priceRange: "AED 2.5M - 3.2M",
          availability: "8 Units Available",
          bedrooms: "3",
          bathrooms: "3-4"
        }
      ],
      paymentSchedule: [
        {
          milestone: "Booking",
          percentage: 10,
          description: "Upon signing the Sale Purchase Agreement"
        },
        {
          milestone: "Foundation",
          percentage: 20,
          description: "Upon completion of foundation work"
        },
        {
          milestone: "Structure",
          percentage: 30,
          description: "Upon completion of structural work"
        },
        {
          milestone: "Finishing",
          percentage: 20,
          description: "Upon completion of MEP and finishing work"
        },
        {
          milestone: "Handover",
          percentage: 20,
          description: "Upon project completion and handover"
        }
      ],
      faqs: [
        {
          id: "1",
          question: "What is the average price of apartments in Dubai Marina?",
          answer: "The average price of apartments in Dubai Marina ranges from AED 1.2M to AED 4.5M depending on the size, floor level, and views. Waterfront units typically command premium prices."
        },
        {
          id: "2",
          question: "What amenities are included in Neva Residences?",
          answer: "Neva Residences offers world-class amenities including a state-of-the-art gym, infinity pool, spa facilities, children's play area, landscaped gardens, and 24/7 security with concierge services."
        },
        {
          id: "3",
          question: "Is financing available for this project?",
          answer: "Yes, we work with leading banks and financial institutions to provide competitive mortgage options. Our sales team can assist you with pre-approval and financing arrangements."
        },
        {
          id: "4",
          question: "What is the expected rental yield in Dubai Marina?",
          answer: "Dubai Marina typically offers rental yields between 5-7% annually, making it an attractive investment destination for both local and international investors."
        }
      ]
    },
   
   
  };
  
  return projectDetails[id] || null;
};

export const cityProfiles: CityProfile[] = [
  {
    id: "1",
    name: "Ahmed Al Mansouri",
    role: "Senior Real Estate Consultant",
    image: "https://media.istockphoto.com/id/2196896353/photo/smart-city-with-glowing-light-trails.jpg?s=612x612&w=0&k=20&c=6edzJKuXLtQ0M0awyrgp6lo9FB5whjKbXXERrXo6edg=",
    description: "Ahmed has over 12 years of experience in Dubai's real estate market, specializing in luxury waterfront properties and investment opportunities.",
    experience: "12+ Years",
    specialization: "Luxury Waterfront Properties"
  },
 
];








export interface PropertyListing {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  whatsapp: string;
  email: string;
  phone: string;
}
export const propertyListings: PropertyListing[] = [
  {
    id: "1",
    title: "Marina Heights Tower Apartment",
    location: "Dubai Marina",
    price: "AED 1.45M",
    image: "https://media.istockphoto.com/id/2196896353/photo/smart-city-with-glowing-light-trails.jpg?s=612x612&w=0&k=20&c=6edzJKuXLtQ0M0awyrgp6lo9FB5whjKbXXERrXo6edg=",
    type: "Apartment",
    bedrooms: "2",
    bathrooms: "2", 
    area: "1,100 sq ft",
    whatsapp: "https://wa.me/971501234567",
    email: "mailto:sales@myrealestate.com",
    phone: "tel:+971501234567"
  },

];