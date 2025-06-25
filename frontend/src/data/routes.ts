import type { Route } from "../components/RouteCard";

// Sample routes for Mitweida with places to visit
export const mittweidaRoutes: Route[] = [
  {
    id: "historic-center",
    name: "Historic City Center",
    duration: 150, // 2h 30min in minutes
    stops: 6,
    features: ["Historical", "Architecture", "Walking"],
    color: "blue",
    description:
      "Explore the charming historic center of Mitweida with its beautiful architecture and cultural landmarks.",
    places: [
      {
        id: "city-hall",
        name: "Mitweida City Hall",
        description: "Beautiful neo-Gothic architecture from the 19th century",
        coordinates: [50.9842, 12.9784],
        type: "landmark",
        estimatedVisitTime: 15,
      },
      {
        id: "market-square",
        name: "Market Square",
        description:
          "Historic market square with traditional German architecture",
        coordinates: [50.9845, 12.978],
        type: "landmark",
        estimatedVisitTime: 20,
      },
      {
        id: "st-marys-church",
        name: "St. Mary's Church",
        description: "Gothic church with stunning stained glass windows",
        coordinates: [50.985, 12.979],
        type: "landmark",
        estimatedVisitTime: 25,
      },
      {
        id: "old-brewery",
        name: "Historic Brewery Building",
        description: "Former brewery now housing local shops and cafés",
        coordinates: [50.9838, 12.9775],
        type: "attraction",
        estimatedVisitTime: 30,
      },
      {
        id: "university-main",
        name: "University of Applied Sciences",
        description: "Modern campus of the renowned technical university",
        coordinates: [50.9855, 12.98],
        type: "landmark",
        estimatedVisitTime: 20,
      },
      {
        id: "local-cafe",
        name: "Café Altstadt",
        description: "Traditional German café with homemade cakes",
        coordinates: [50.984, 12.9782],
        type: "restaurant",
        estimatedVisitTime: 30,
      },
    ],
  },
  {
    id: "nature-parks",
    name: "Parks & Nature",
    duration: 195, // 3h 15min in minutes
    stops: 5,
    features: ["Nature", "Parks", "Fresh Air", "Walking"],
    color: "green",
    description:
      "Discover the green spaces and natural beauty around Mitweida.",
    places: [
      {
        id: "city-park",
        name: "Mitweida City Park",
        description: "Large urban park with walking paths and playgrounds",
        coordinates: [50.986, 12.982],
        type: "park",
        estimatedVisitTime: 45,
      },
      {
        id: "zschopau-riverside",
        name: "Zschopau Riverside Walk",
        description: "Scenic walk along the Zschopau River",
        coordinates: [50.9825, 12.976],
        type: "park",
        estimatedVisitTime: 40,
      },
      {
        id: "forest-trail",
        name: "Forest Trail Entrance",
        description: "Access point to beautiful hiking trails",
        coordinates: [50.988, 12.985],
        type: "park",
        estimatedVisitTime: 60,
      },
      {
        id: "botanical-garden",
        name: "University Botanical Garden",
        description: "Small botanical collection with native plants",
        coordinates: [50.9865, 12.9805],
        type: "park",
        estimatedVisitTime: 30,
      },
      {
        id: "viewpoint-hill",
        name: "Panorama Viewpoint",
        description: "Great views over the city and surrounding countryside",
        coordinates: [50.982, 12.975],
        type: "viewpoint",
        estimatedVisitTime: 20,
      },
    ],
  },
  {
    id: "cultural-heritage",
    name: "Cultural Heritage",
    duration: 165, // 2h 45min in minutes
    stops: 4,
    features: ["Culture", "Museums", "Historical", "Arts"],
    color: "purple",
    description:
      "Immerse yourself in Mitweida's rich cultural heritage and arts scene.",
    places: [
      {
        id: "local-museum",
        name: "Mitweida Local History Museum",
        description: "Learn about the city's industrial and cultural heritage",
        coordinates: [50.9835, 12.977],
        type: "museum",
        estimatedVisitTime: 60,
      },
      {
        id: "art-gallery",
        name: "Community Art Gallery",
        description: "Local and regional contemporary art exhibitions",
        coordinates: [50.9848, 12.9785],
        type: "museum",
        estimatedVisitTime: 45,
      },
      {
        id: "cultural-center",
        name: "Cultural Center",
        description: "Hub for local events, theater, and performances",
        coordinates: [50.9852, 12.9792],
        type: "attraction",
        estimatedVisitTime: 30,
      },
      {
        id: "historic-mill",
        name: "Old Water Mill",
        description: "Restored 18th-century mill with working mechanisms",
        coordinates: [50.985, 12.9795],
        type: "landmark",
        estimatedVisitTime: 40,
      },
    ],
  },
  {
    id: "food-tour",
    name: "Local Food Experience",
    duration: 180, // 3h 00min in minutes
    stops: 5,
    features: ["Food", "Local Cuisine", "Traditional", "Social"],
    color: "orange",
    description:
      "Taste the flavors of Saxony with traditional dishes and local specialties.",
    places: [
      {
        id: "traditional-restaurant",
        name: "Gasthof zur Post",
        description: "Traditional Saxon cuisine in historic setting",
        coordinates: [50.9845, 12.9775],
        type: "restaurant",
        estimatedVisitTime: 75,
      },
      {
        id: "local-bakery",
        name: "Bäckerei Schmidt",
        description:
          "Family bakery with traditional German breads and pastries",
        coordinates: [50.9838, 12.9782],
        type: "shop",
        estimatedVisitTime: 20,
      },
      {
        id: "brewery-pub",
        name: "Mittweider Brauhaus",
        description: "Local microbrewery with regional beer specialties",
        coordinates: [50.985, 12.977],
        type: "restaurant",
        estimatedVisitTime: 60,
      },
      {
        id: "market-hall",
        name: "Weekly Farmers Market",
        description: "Fresh local produce and regional specialties",
        coordinates: [50.9842, 12.978],
        type: "shop",
        estimatedVisitTime: 30,
      },
      {
        id: "ice-cream-parlor",
        name: "Eiscafé Venezia",
        description: "Popular ice cream shop with homemade flavors",
        coordinates: [50.9832, 12.9788],
        type: "restaurant",
        estimatedVisitTime: 15,
      },
    ],
  },
  {
    id: "university-tech",
    name: "University & Technology",
    duration: 135, // 2h 15min in minutes
    stops: 4,
    features: ["Education", "Technology", "Modern", "Innovation"],
    color: "teal",
    description:
      "Explore Mitweida's reputation as a center for technology and higher education.",
    places: [
      {
        id: "university-campus",
        name: "Main University Campus",
        description: "Modern facilities of the University of Applied Sciences",
        coordinates: [50.9855, 12.98],
        type: "landmark",
        estimatedVisitTime: 45,
      },
      {
        id: "tech-labs",
        name: "Technology Laboratories",
        description: "State-of-the-art engineering and computer labs",
        coordinates: [50.9858, 12.9805],
        type: "attraction",
        estimatedVisitTime: 30,
      },
      {
        id: "innovation-center",
        name: "Innovation & Startup Center",
        description: "Hub for local tech startups and innovation",
        coordinates: [50.986, 12.981],
        type: "landmark",
        estimatedVisitTime: 25,
      },
      {
        id: "student-cafe",
        name: "Campus Café",
        description: "Student-run café with international atmosphere",
        coordinates: [50.9862, 12.9815],
        type: "restaurant",
        estimatedVisitTime: 25,
      },
    ],
  },
  {
    id: "family-friendly",
    name: "Family Adventure",
    duration: 240, // 4h 00min in minutes
    stops: 6,
    features: ["Family", "Kids", "Interactive", "Fun", "Parks"],
    color: "yellow",
    description:
      "Perfect route for families with children, featuring parks, playgrounds, and interactive attractions.",
    places: [
      {
        id: "adventure-playground",
        name: "Adventure Playground",
        description: "Large playground with climbing structures and slides",
        coordinates: [50.986, 12.982],
        type: "park",
        estimatedVisitTime: 60,
      },
      {
        id: "mini-zoo",
        name: "Petting Zoo",
        description:
          "Small animal park where children can interact with animals",
        coordinates: [50.9852, 12.9825],
        type: "attraction",
        estimatedVisitTime: 45,
      },
      {
        id: "interactive-museum",
        name: "Children's Discovery Center",
        description: "Hands-on science and technology exhibits for kids",
        coordinates: [50.9845, 12.9795],
        type: "museum",
        estimatedVisitTime: 75,
      },
      {
        id: "family-restaurant",
        name: "Family Restaurant Zum Löwen",
        description: "Kid-friendly restaurant with playground area",
        coordinates: [50.984, 12.9785],
        type: "restaurant",
        estimatedVisitTime: 60,
      },
      {
        id: "duck-pond",
        name: "Duck Pond",
        description: "Peaceful pond where children can feed ducks",
        coordinates: [50.9835, 12.977],
        type: "park",
        estimatedVisitTime: 30,
      },
      {
        id: "riverside-playground",
        name: "Riverside Play Area",
        description: "Natural playground by the river with picnic spots",
        coordinates: [50.9825, 12.976],
        type: "park",
        estimatedVisitTime: 50,
      },
    ],
  },
];

// Export type for use in other components
export type { Route } from "../components/RouteCard";
