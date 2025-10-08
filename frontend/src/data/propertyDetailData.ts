export interface PropertyDetail {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  images: string[];
  videos: string[];
  propertyType: string;
  tags: string[];
  developer: string;
  isOffPlan: boolean;
  paymentPlan?: string;
  whatsappLink: string;
  emailLink: string;
  refNumber: string;
  postedDate: string;
  description: string;
  propertyInfo: {
    type: string;
    purpose: string;
    refNo: string;
    completion: string;
    furnishing: string;
    truCheck: string;
    avgRent: string;
    addedOn: string;
  };
  validatedInfo: {
    developer: string;
    ownership: string;
    buildUpArea: string;
    usage: string;
    parking: string;
  };
  buildingInfo: {
    name: string;
    year: string;
    floors: string;
    retailCentres: string;
    pools: string;
    parking: string;
    area: string;
    elevators: string;
  };
  amenities: string[];
  similarTransactions: Array<{
    date: string;
    location: string;
    area: string;
    price: string;
  }>;
  regulatoryInfo: {
    permitNo: string;
    zone: string;
    agency: string;
    ded: string;
    rera: string;
    brn: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const propertyDetails: PropertyDetail[] = [
  {
    id: "1",
    title: "Laya Residences, JVC District 10, JVC, Dubai",
    location: "Jumeirah Village Circle (JVC)",
    price: "AED 999",
    beds: 1,
    baths: 2,
    sqft: 750,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200"
    ],
    videos: [
      "https://example.com/video1.mp4",
      "https://example.com/video2.mp4"
    ],
    propertyType: "Apartment",
    tags: ["For Sale", "Off-Plan"],
    developer: "Emaar Properties",
    isOffPlan: true,
    paymentPlan: "10% on Booking, 40% during Construction, 50% on Handover",
    whatsappLink: "https://wa.me/971501234567",
    emailLink: "mailto:info@example.com",
    refNumber: "LR-JVC-001",
    postedDate: "2024-01-15",
    description: "This stunning 1-bedroom apartment in Laya Residences offers modern living with mesmerizing views of Dubai's skyline. Located in the heart of JVC, this property features contemporary design, premium finishes, and access to world-class amenities. The unit comes with a spacious living area, fully equipped kitchen, and a private balcony perfect for relaxation. Residents can enjoy swimming pools, fitness centers, children's play areas, and landscaped gardens. With flexible payment plans and prime location, this is an excellent investment opportunity in Dubai's thriving real estate market.",
    propertyInfo: {
      type: "Apartment",
      purpose: "For Sale",
      refNo: "LR-JVC-001",
      completion: "Q4 2025",
      furnishing: "Unfurnished",
      truCheck: "Verified",
      avgRent: "AED 55,000/year",
      addedOn: "15 Jan 2024"
    },
    validatedInfo: {
      developer: "Emaar Properties",
      ownership: "Freehold",
      buildUpArea: "750 sqft",
      usage: "Residential",
      parking: "1 Space"
    },
    buildingInfo: {
      name: "Laya Residences",
      year: "2025",
      floors: "25",
      retailCentres: "Yes",
      pools: "2",
      parking: "500 Spaces",
      area: "JVC District 10",
      elevators: "4"
    },
    amenities: [
      "Swimming Pool", "Gym", "Children's Play Area", "Landscaped Gardens",
      "24/7 Security", "Covered Parking", "BBQ Area", "Community Center",
      "Retail Outlets", "Mosque", "School Nearby", "Metro Access",
      "Shopping Mall", "Hospital Nearby", "Parks", "Beach Access",
      "Business Center", "Concierge Service"
    ],
    similarTransactions: [
      { date: "Dec 2023", location: "JVC District 9", area: "720 sqft", price: "AED 820,000" },
      { date: "Nov 2023", location: "JVC District 11", area: "780 sqft", price: "AED 875,000" },
      { date: "Oct 2023", location: "JVC District 10", area: "750 sqft", price: "AED 840,000" },
      { date: "Sep 2023", location: "JVC District 12", area: "800 sqft", price: "AED 890,000" }
    ],
    regulatoryInfo: {
      permitNo: "1234567890",
      zone: "JVC-10",
      agency: "RERA Registered",
      ded: "DE123456",
      rera: "1234567890",
      brn: "987654321"
    },
    coordinates: {
      lat: 25.0657,
      lng: 55.2346
    }
  },
];







//  {
//     id: "2",
//     title: "Majestic Tower, Business Bay, Dubai",
//     location: "Business Bay",
//     price: "AED 1,250,000",
//     beds: 2,
//     baths: 2,
//     sqft: 1100,
//     images: [
//       "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
//       "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
//       "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200",
//       "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200"
//     ],
//     videos: ["https://example.com/video1.mp4"],
//     propertyType: "Apartment",
//     tags: ["For Sale", "Ready"],
//     developer: "Damac Properties",
//     isOffPlan: false,
//     whatsappLink: "https://wa.me/971501234567",
//     emailLink: "mailto:info@example.com",
//     refNumber: "MT-BB-002",
//     postedDate: "2024-01-10",
//     description: "Luxurious 2-bedroom apartment in the prestigious Business Bay area with stunning canal views and premium amenities.",
//     propertyInfo: {
//       type: "Apartment",
//       purpose: "For Sale",
//       refNo: "MT-BB-002",
//       completion: "Ready",
//       furnishing: "Furnished",
//       truCheck: "Verified",
//       avgRent: "AED 90,000/year",
//       addedOn: "10 Jan 2024"
//     },
//     validatedInfo: {
//       developer: "Damac Properties",
//       ownership: "Freehold",
//       buildUpArea: "1100 sqft",
//       usage: "Residential",
//       parking: "2 Spaces"
//     },
//     buildingInfo: {
//       name: "Majestic Tower",
//       year: "2020",
//       floors: "40",
//       retailCentres: "Yes",
//       pools: "3",
//       parking: "800 Spaces",
//       area: "Business Bay",
//       elevators: "6"
//     },
//     amenities: [
//       "Swimming Pool", "Gym", "Spa", "Business Center",
//       "24/7 Security", "Valet Parking", "Concierge", "Rooftop Terrace",
//       "Canal Views", "Metro Access", "Shopping", "Restaurants"
//     ],
//     similarTransactions: [
//       { date: "Dec 2023", location: "Business Bay", area: "1050 sqft", price: "AED 1,200,000" },
//       { date: "Nov 2023", location: "Business Bay", area: "1150 sqft", price: "AED 1,300,000" },
//       { date: "Oct 2023", location: "Business Bay", area: "1100 sqft", price: "AED 1,250,000" }
//     ],
//     regulatoryInfo: {
//       permitNo: "2345678901",
//       zone: "BB-01",
//       agency: "RERA Registered",
//       ded: "DE234567",
//       rera: "2345678901",
//       brn: "876543210"
//     },
//     coordinates: {
//       lat: 25.1879,
//       lng: 55.2676
//     }
//   }