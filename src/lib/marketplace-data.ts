export type ItemType = "template" | "dataset";
export type PricingModel = "free" | "credits" | "subscription";
export type ItemStatus = "draft" | "published" | "deprecated";
export type Category =
  | "e-commerce"
  | "social"
  | "search"
  | "jobs"
  | "real-estate"
  | "news"
  | "government"
  | "travel";

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  type: ItemType;
  category: Category;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  reviewCount: number;
  downloads: number;
  pricing: PricingModel;
  price?: number;
  staffPick: boolean;
  verified: boolean;
  tags: string[];
  version: string;
  createdAt: string;
  updatedAt: string;
  schema?: Record<string, unknown>;
  sampleOutput?: Record<string, unknown>;
  domainPatterns?: string[];
  versions?: VersionEntry[];
  reviews?: Review[];
}

export interface VersionEntry {
  version: string;
  date: string;
  changelog: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export const CATEGORIES: Category[] = [
  "e-commerce",
  "social",
  "search",
  "jobs",
  "real-estate",
  "news",
  "government",
  "travel",
];

export const CATEGORY_ICONS: Record<Category, string> = {
  "e-commerce": "🛒",
  social: "👥",
  search: "🔍",
  jobs: "💼",
  "real-estate": "🏠",
  news: "📰",
  government: "🏛️",
  travel: "✈️",
};

const amazonSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    price: { type: "string" },
    rating: { type: "number" },
    reviews: { type: "number" },
    availability: { type: "string" },
    images: { type: "array", items: { type: "string" } },
    features: { type: "array", items: { type: "string" } },
  },
};

const amazonSample = {
  title: "Apple AirPods Pro (2nd Generation)",
  price: "$189.99",
  rating: 4.7,
  reviews: 98432,
  availability: "In Stock",
  images: [
    "https://example.com/airpods-1.jpg",
    "https://example.com/airpods-2.jpg",
  ],
  features: [
    "Active Noise Cancellation",
    "Adaptive Transparency",
    "Personalized Spatial Audio",
  ],
};

const linkedinSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    headline: { type: "string" },
    location: { type: "string" },
    connections: { type: "number" },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          company: { type: "string" },
          duration: { type: "string" },
        },
      },
    },
  },
};

const linkedinSample = {
  name: "John Smith",
  headline: "Senior Software Engineer at TechCorp",
  location: "San Francisco, CA",
  connections: 500,
  experience: [
    {
      title: "Senior Software Engineer",
      company: "TechCorp",
      duration: "2021 - Present",
    },
    {
      title: "Software Engineer",
      company: "StartupXYZ",
      duration: "2018 - 2021",
    },
  ],
};

const indeedSchema = {
  type: "object",
  properties: {
    jobTitle: { type: "string" },
    company: { type: "string" },
    location: { type: "string" },
    salary: { type: "string" },
    type: { type: "string" },
    description: { type: "string" },
    posted: { type: "string" },
  },
};

const indeedSample = {
  jobTitle: "Full Stack Developer",
  company: "Acme Inc",
  location: "Remote",
  salary: "$120,000 - $160,000",
  type: "Full-time",
  description: "We are looking for an experienced Full Stack Developer...",
  posted: "2 days ago",
};

const zillowSchema = {
  type: "object",
  properties: {
    address: { type: "string" },
    price: { type: "string" },
    beds: { type: "number" },
    baths: { type: "number" },
    sqft: { type: "number" },
    type: { type: "string" },
    yearBuilt: { type: "number" },
    zestimate: { type: "string" },
  },
};

const zillowSample = {
  address: "123 Main St, San Francisco, CA 94102",
  price: "$1,250,000",
  beds: 3,
  baths: 2,
  sqft: 1850,
  type: "Single Family",
  yearBuilt: 1965,
  zestimate: "$1,280,000",
};

const twitterSchema = {
  type: "object",
  properties: {
    username: { type: "string" },
    displayName: { type: "string" },
    bio: { type: "string" },
    followers: { type: "number" },
    following: { type: "number" },
    tweets: { type: "number" },
    verified: { type: "boolean" },
  },
};

const twitterSample = {
  username: "techguru",
  displayName: "Tech Guru",
  bio: "Sharing the latest in tech and AI",
  followers: 125000,
  following: 890,
  tweets: 15432,
  verified: true,
};

const googleSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    url: { type: "string" },
    description: { type: "string" },
    position: { type: "number" },
  },
};

const googleSample = {
  title: "ScrapeSuite - Web Scraping Platform",
  url: "https://scrapesuite.com",
  description:
    "The most powerful web scraping platform for extracting data at scale.",
  position: 1,
};

const nytSchema = {
  type: "object",
  properties: {
    headline: { type: "string" },
    author: { type: "string" },
    date: { type: "string" },
    section: { type: "string" },
    summary: { type: "string" },
    url: { type: "string" },
  },
};

const nytSample = {
  headline: "AI Advances Reshape Technology Landscape",
  author: "Jane Doe",
  date: "2025-03-01",
  section: "Technology",
  summary:
    "New developments in artificial intelligence are transforming industries...",
  url: "https://nytimes.com/2025/03/01/technology/ai-advances.html",
};

const govSchema = {
  type: "object",
  properties: {
    billId: { type: "string" },
    title: { type: "string" },
    sponsor: { type: "string" },
    status: { type: "string" },
    introducedDate: { type: "string" },
    summary: { type: "string" },
  },
};

const govSample = {
  billId: "H.R. 1234",
  title: "Digital Data Protection Act",
  sponsor: "Rep. Smith",
  status: "In Committee",
  introducedDate: "2025-01-15",
  summary:
    "A bill to protect consumer data and establish digital privacy standards.",
};

const bookingSchema = {
  type: "object",
  properties: {
    hotelName: { type: "string" },
    location: { type: "string" },
    price: { type: "string" },
    rating: { type: "number" },
    reviewCount: { type: "number" },
    amenities: { type: "array", items: { type: "string" } },
    cancellationPolicy: { type: "string" },
  },
};

const bookingSample = {
  hotelName: "Grand Palace Hotel",
  location: "Paris, France",
  price: "$199/night",
  rating: 4.8,
  reviewCount: 3245,
  amenities: ["Free WiFi", "Pool", "Spa", "Restaurant"],
  cancellationPolicy: "Free cancellation up to 24h before",
};

export const MOCK_ITEMS: MarketplaceItem[] = [
  {
    id: "1",
    name: "Amazon Product Scraper",
    description:
      "Extract product details, pricing, reviews, and availability from Amazon product pages.",
    longDescription:
      "This template provides a comprehensive scraping solution for Amazon product pages. It extracts all essential product information including titles, prices, ratings, review counts, availability status, product images, and feature bullet points. The schema is designed to handle variations in Amazon's page structure across different product categories. Supports both standard and variation product pages.",
    type: "template",
    category: "e-commerce",
    author: { name: "ScrapeSuite Team", avatar: "ST", verified: true },
    rating: 4.8,
    reviewCount: 156,
    downloads: 12450,
    pricing: "credits",
    price: 5,
    staffPick: true,
    verified: true,
    tags: ["amazon", "products", "pricing", "reviews"],
    version: "2.3.1",
    createdAt: "2024-06-15",
    updatedAt: "2025-02-28",
    schema: amazonSchema,
    sampleOutput: amazonSample,
    domainPatterns: ["amazon.com/*", "amazon.*/dp/*", "amazon.*/gp/product/*"],
    versions: [
      { version: "2.3.1", date: "2025-02-28", changelog: "Fixed price extraction for deal pages" },
      { version: "2.3.0", date: "2025-01-15", changelog: "Added variant support" },
      { version: "2.2.0", date: "2024-11-20", changelog: "Improved rating extraction" },
      { version: "2.1.0", date: "2024-09-10", changelog: "Added image extraction" },
      { version: "2.0.0", date: "2024-06-15", changelog: "Major rewrite with new schema" },
    ],
    reviews: [
      { id: "r1", author: "DataMiner42", avatar: "DM", rating: 5, comment: "Excellent template! Works flawlessly on all Amazon product pages I've tested.", date: "2025-02-20" },
      { id: "r2", author: "ShopSpy", avatar: "SS", rating: 5, comment: "The schema is well-designed and covers everything I need. Great documentation too.", date: "2025-02-10" },
      { id: "r3", author: "PriceTracker", avatar: "PT", rating: 4, comment: "Works great for most pages. Had some issues with A/B tested layouts but the latest update fixed it.", date: "2025-01-25" },
      { id: "r4", author: "WebScrap3r", avatar: "WS", rating: 5, comment: "Best Amazon scraper I've used. The variant support is a game changer.", date: "2025-01-15" },
    ],
  },
  {
    id: "2",
    name: "LinkedIn Profile Extractor",
    description:
      "Scrape professional profiles including experience, education, and skills from LinkedIn.",
    longDescription:
      "Extract comprehensive professional data from LinkedIn profiles including work experience, education history, skills, endorsements, and connection counts. This template handles both public and authenticated profile views, with intelligent fallbacks for restricted fields. Built-in rate limiting ensures safe scraping without account restrictions.",
    type: "template",
    category: "social",
    author: { name: "ProScrape", avatar: "PS", verified: true },
    rating: 4.5,
    reviewCount: 89,
    downloads: 7820,
    pricing: "subscription",
    price: 29,
    staffPick: true,
    verified: true,
    tags: ["linkedin", "profiles", "recruitment", "networking"],
    version: "1.8.0",
    createdAt: "2024-08-20",
    updatedAt: "2025-02-15",
    schema: linkedinSchema,
    sampleOutput: linkedinSample,
    domainPatterns: ["linkedin.com/in/*"],
    versions: [
      { version: "1.8.0", date: "2025-02-15", changelog: "Added skills extraction" },
      { version: "1.7.0", date: "2025-01-10", changelog: "Improved experience parsing" },
      { version: "1.6.0", date: "2024-12-05", changelog: "Added education section" },
    ],
    reviews: [
      { id: "r5", author: "RecruiterAI", avatar: "RA", rating: 5, comment: "Perfect for our recruitment pipeline. Extracts all the key fields we need.", date: "2025-02-10" },
      { id: "r6", author: "HRBot", avatar: "HB", rating: 4, comment: "Good extraction quality. Sometimes misses recent position changes.", date: "2025-01-28" },
    ],
  },
  {
    id: "3",
    name: "Indeed Job Listings Dataset",
    description:
      "Pre-scraped dataset of 50K+ job listings from Indeed with salary, requirements, and metadata.",
    longDescription:
      "A comprehensive dataset of over 50,000 job listings scraped from Indeed across multiple industries and locations. Each listing includes job title, company, location, salary range, job type, full description, and posting date. The dataset is updated monthly and covers major metropolitan areas in the US, UK, and Canada.",
    type: "dataset",
    category: "jobs",
    author: { name: "DataVault", avatar: "DV", verified: true },
    rating: 4.6,
    reviewCount: 67,
    downloads: 5340,
    pricing: "credits",
    price: 15,
    staffPick: false,
    verified: true,
    tags: ["jobs", "indeed", "employment", "salary", "listings"],
    version: "3.1.0",
    createdAt: "2024-03-10",
    updatedAt: "2025-03-01",
    schema: indeedSchema,
    sampleOutput: indeedSample,
    domainPatterns: ["indeed.com/jobs*"],
    versions: [
      { version: "3.1.0", date: "2025-03-01", changelog: "March 2025 data update" },
      { version: "3.0.0", date: "2025-02-01", changelog: "February 2025 data update" },
    ],
    reviews: [
      { id: "r7", author: "JobAnalytics", avatar: "JA", rating: 5, comment: "Incredibly comprehensive dataset. Saved us weeks of scraping.", date: "2025-02-25" },
    ],
  },
  {
    id: "4",
    name: "Zillow Property Scraper",
    description:
      "Extract property details, pricing, Zestimate, and agent info from Zillow listings.",
    longDescription:
      "Scrape detailed property information from Zillow including listing prices, Zestimates, property details (beds, baths, sqft), year built, property type, and agent information. Supports both for-sale and rental listings with automatic detection.",
    type: "template",
    category: "real-estate",
    author: { name: "PropData", avatar: "PD", verified: false },
    rating: 4.2,
    reviewCount: 45,
    downloads: 3200,
    pricing: "credits",
    price: 8,
    staffPick: false,
    verified: false,
    tags: ["zillow", "real-estate", "property", "housing"],
    version: "1.5.0",
    createdAt: "2024-10-05",
    updatedAt: "2025-01-20",
    schema: zillowSchema,
    sampleOutput: zillowSample,
    domainPatterns: ["zillow.com/homedetails/*", "zillow.com/b/*"],
    versions: [
      { version: "1.5.0", date: "2025-01-20", changelog: "Added rental support" },
      { version: "1.4.0", date: "2024-12-15", changelog: "Fixed Zestimate extraction" },
    ],
    reviews: [
      { id: "r8", author: "RealtorTech", avatar: "RT", rating: 4, comment: "Works well for most listings. Some edge cases with new constructions.", date: "2025-01-15" },
    ],
  },
  {
    id: "5",
    name: "Twitter/X Profile Scraper",
    description:
      "Extract user profiles, bios, follower counts, and recent tweets from Twitter/X.",
    longDescription:
      "Scrape comprehensive Twitter/X profile data including display name, bio, follower/following counts, tweet counts, verification status, and account creation date. Also supports extraction of recent tweets with full text, engagement metrics, and media URLs.",
    type: "template",
    category: "social",
    author: { name: "SocialExtract", avatar: "SE", verified: true },
    rating: 4.4,
    reviewCount: 112,
    downloads: 8960,
    pricing: "free",
    staffPick: true,
    verified: true,
    tags: ["twitter", "x", "social-media", "profiles"],
    version: "3.0.0",
    createdAt: "2024-01-15",
    updatedAt: "2025-02-25",
    schema: twitterSchema,
    sampleOutput: twitterSample,
    domainPatterns: ["twitter.com/*", "x.com/*"],
    versions: [
      { version: "3.0.0", date: "2025-02-25", changelog: "Complete rewrite for X.com" },
      { version: "2.5.0", date: "2024-12-10", changelog: "Added tweet extraction" },
    ],
    reviews: [
      { id: "r9", author: "SocialListener", avatar: "SL", rating: 5, comment: "The v3 rewrite is fantastic. Works perfectly with X.com.", date: "2025-02-28" },
      { id: "r10", author: "BrandWatch", avatar: "BW", rating: 4, comment: "Solid performer. Glad it's free!", date: "2025-02-20" },
    ],
  },
  {
    id: "6",
    name: "Google Search Results Scraper",
    description:
      "Extract organic search results, featured snippets, and ads from Google search pages.",
    longDescription:
      "Scrape Google search engine results pages (SERPs) including organic results, featured snippets, People Also Ask boxes, and ad listings. Extracts title, URL, description, and position for each result. Perfect for SEO monitoring and competitive analysis.",
    type: "template",
    category: "search",
    author: { name: "ScrapeSuite Team", avatar: "ST", verified: true },
    rating: 4.7,
    reviewCount: 203,
    downloads: 15800,
    pricing: "credits",
    price: 3,
    staffPick: true,
    verified: true,
    tags: ["google", "search", "seo", "serp"],
    version: "4.1.0",
    createdAt: "2023-12-01",
    updatedAt: "2025-03-01",
    schema: googleSchema,
    sampleOutput: googleSample,
    domainPatterns: ["google.com/search*"],
    versions: [
      { version: "4.1.0", date: "2025-03-01", changelog: "Added People Also Ask extraction" },
      { version: "4.0.0", date: "2025-01-20", changelog: "Major update for new Google layout" },
    ],
    reviews: [
      { id: "r11", author: "SEOWizard", avatar: "SW", rating: 5, comment: "Essential for our SEO tool. Always up to date with Google's changes.", date: "2025-03-01" },
    ],
  },
  {
    id: "7",
    name: "NYT Articles Dataset",
    description:
      "Pre-scraped dataset of 100K+ New York Times articles with metadata and full text.",
    longDescription:
      "A rich dataset containing over 100,000 New York Times articles spanning from 2020 to 2025. Includes headline, author, publication date, section, summary, and full article text. Ideal for NLP research, sentiment analysis, and media studies.",
    type: "dataset",
    category: "news",
    author: { name: "NewsDataLab", avatar: "ND", verified: true },
    rating: 4.9,
    reviewCount: 34,
    downloads: 2100,
    pricing: "subscription",
    price: 49,
    staffPick: true,
    verified: true,
    tags: ["news", "nyt", "articles", "nlp", "media"],
    version: "5.0.0",
    createdAt: "2023-06-15",
    updatedAt: "2025-02-28",
    schema: nytSchema,
    sampleOutput: nytSample,
    domainPatterns: ["nytimes.com/*"],
    versions: [
      { version: "5.0.0", date: "2025-02-28", changelog: "Added 2025 Q1 articles" },
      { version: "4.0.0", date: "2025-01-01", changelog: "Full year 2024 update" },
    ],
    reviews: [
      { id: "r12", author: "NLPResearcher", avatar: "NR", rating: 5, comment: "Best news dataset I've found. Clean, well-structured, and comprehensive.", date: "2025-02-15" },
    ],
  },
  {
    id: "8",
    name: "US Government Bills Scraper",
    description:
      "Track and scrape US Congressional bills, votes, and legislative data from govinfo.gov.",
    longDescription:
      "Extract detailed information about US Congressional bills including bill ID, title, sponsor, cosponsors, status, committee assignments, and full text. Also tracks voting records and amendment histories. Essential for policy analysis and civic tech applications.",
    type: "template",
    category: "government",
    author: { name: "CivicData", avatar: "CD", verified: false },
    rating: 4.1,
    reviewCount: 28,
    downloads: 1450,
    pricing: "free",
    staffPick: false,
    verified: false,
    tags: ["government", "bills", "congress", "legislation"],
    version: "1.2.0",
    createdAt: "2024-09-15",
    updatedAt: "2025-01-30",
    schema: govSchema,
    sampleOutput: govSample,
    domainPatterns: ["govinfo.gov/*", "congress.gov/bill/*"],
    versions: [
      { version: "1.2.0", date: "2025-01-30", changelog: "Added vote tracking" },
      { version: "1.1.0", date: "2024-11-20", changelog: "Fixed sponsor extraction" },
    ],
    reviews: [
      { id: "r13", author: "PolicyAnalyst", avatar: "PA", rating: 4, comment: "Very useful for tracking legislation. Would love more historical data.", date: "2025-01-25" },
    ],
  },
  {
    id: "9",
    name: "Booking.com Hotel Scraper",
    description:
      "Extract hotel details, pricing, availability, and reviews from Booking.com.",
    longDescription:
      "Scrape comprehensive hotel data from Booking.com including hotel name, location, room rates, ratings, review counts, amenities, cancellation policies, and photo URLs. Supports both individual hotel pages and search result listings with date-specific pricing.",
    type: "template",
    category: "travel",
    author: { name: "TravelData", avatar: "TD", verified: true },
    rating: 4.3,
    reviewCount: 56,
    downloads: 4300,
    pricing: "credits",
    price: 6,
    staffPick: false,
    verified: true,
    tags: ["booking", "hotels", "travel", "pricing"],
    version: "2.0.0",
    createdAt: "2024-07-20",
    updatedAt: "2025-02-10",
    schema: bookingSchema,
    sampleOutput: bookingSample,
    domainPatterns: ["booking.com/hotel/*", "booking.com/searchresults*"],
    versions: [
      { version: "2.0.0", date: "2025-02-10", changelog: "Added search results support" },
      { version: "1.5.0", date: "2024-12-15", changelog: "Improved pricing extraction" },
    ],
    reviews: [
      { id: "r14", author: "TravelAggregator", avatar: "TA", rating: 4, comment: "Good quality data extraction. Pricing can vary based on dates.", date: "2025-02-05" },
    ],
  },
  {
    id: "10",
    name: "e-Commerce Product Dataset",
    description:
      "Dataset of 200K+ products from major e-commerce platforms with pricing and reviews.",
    longDescription:
      "A massive dataset containing over 200,000 product listings aggregated from Amazon, eBay, and Walmart. Includes product names, prices, ratings, review counts, categories, and brand information. Updated weekly with new products and price changes.",
    type: "dataset",
    category: "e-commerce",
    author: { name: "DataVault", avatar: "DV", verified: true },
    rating: 4.4,
    reviewCount: 78,
    downloads: 6200,
    pricing: "subscription",
    price: 39,
    staffPick: false,
    verified: true,
    tags: ["e-commerce", "products", "pricing", "amazon", "dataset"],
    version: "8.2.0",
    createdAt: "2023-01-10",
    updatedAt: "2025-03-01",
    schema: amazonSchema,
    sampleOutput: amazonSample,
    domainPatterns: ["amazon.com/*", "ebay.com/*", "walmart.com/*"],
    versions: [
      { version: "8.2.0", date: "2025-03-01", changelog: "Weekly update - 5K new products" },
      { version: "8.1.0", date: "2025-02-22", changelog: "Weekly update - 3K new products" },
    ],
    reviews: [
      { id: "r15", author: "PriceCompare", avatar: "PC", rating: 5, comment: "Our price comparison tool relies on this dataset. Excellent quality and coverage.", date: "2025-02-28" },
    ],
  },
  {
    id: "11",
    name: "Google Maps Business Scraper",
    description:
      "Extract business names, addresses, ratings, and reviews from Google Maps search results.",
    longDescription:
      "Scrape local business data from Google Maps including business name, address, phone number, rating, review count, hours of operation, and category. Supports location-based searches with radius filtering and category-specific queries.",
    type: "template",
    category: "search",
    author: { name: "LocalLeads", avatar: "LL", verified: false },
    rating: 4.0,
    reviewCount: 41,
    downloads: 2800,
    pricing: "credits",
    price: 10,
    staffPick: false,
    verified: false,
    tags: ["google-maps", "local-business", "leads", "reviews"],
    version: "1.3.0",
    createdAt: "2024-11-01",
    updatedAt: "2025-02-05",
    schema: {
      type: "object",
      properties: {
        businessName: { type: "string" },
        address: { type: "string" },
        phone: { type: "string" },
        rating: { type: "number" },
        reviewCount: { type: "number" },
        category: { type: "string" },
      },
    },
    sampleOutput: {
      businessName: "Joe's Pizza",
      address: "456 Main St, New York, NY 10001",
      phone: "(212) 555-0123",
      rating: 4.6,
      reviewCount: 1240,
      category: "Pizza Restaurant",
    },
    domainPatterns: ["google.com/maps/*"],
    versions: [
      { version: "1.3.0", date: "2025-02-05", changelog: "Added phone number extraction" },
    ],
    reviews: [],
  },
  {
    id: "12",
    name: "GitHub Repository Scraper",
    description:
      "Extract repository metadata, README, contributors, and commit history from GitHub.",
    longDescription:
      "Scrape comprehensive data from GitHub repositories including description, stars, forks, language breakdown, README content, contributor list, and recent commit history. Ideal for developer tool analysis and open-source research.",
    type: "template",
    category: "social",
    author: { name: "DevInsight", avatar: "DI", verified: true },
    rating: 4.6,
    reviewCount: 73,
    downloads: 5600,
    pricing: "free",
    staffPick: true,
    verified: true,
    tags: ["github", "repositories", "open-source", "developers"],
    version: "2.1.0",
    createdAt: "2024-04-15",
    updatedAt: "2025-02-20",
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        stars: { type: "number" },
        forks: { type: "number" },
        language: { type: "string" },
        license: { type: "string" },
      },
    },
    sampleOutput: {
      name: "scrapesuite",
      description: "The most powerful web scraping platform",
      stars: 15420,
      forks: 2310,
      language: "TypeScript",
      license: "MIT",
    },
    domainPatterns: ["github.com/*/*"],
    versions: [
      { version: "2.1.0", date: "2025-02-20", changelog: "Added contributor extraction" },
      { version: "2.0.0", date: "2025-01-05", changelog: "Major refactor" },
    ],
    reviews: [
      { id: "r16", author: "OSSAnalyst", avatar: "OA", rating: 5, comment: "Perfect for tracking open-source trends!", date: "2025-02-15" },
    ],
  },
];

export const MY_ITEMS: (MarketplaceItem & { status: ItemStatus; revenue: number })[] = [
  { ...MOCK_ITEMS[0], status: "published", revenue: 4520.0 },
  { ...MOCK_ITEMS[5], status: "published", revenue: 8340.5 },
  { ...MOCK_ITEMS[4], status: "published", revenue: 0 },
  {
    id: "13",
    name: "eBay Auction Tracker",
    description: "Track and extract eBay auction listings with bidding history.",
    type: "template",
    category: "e-commerce",
    author: { name: "ScrapeSuite Team", avatar: "ST", verified: true },
    rating: 0,
    reviewCount: 0,
    downloads: 0,
    pricing: "credits",
    price: 7,
    staffPick: false,
    verified: false,
    tags: ["ebay", "auctions", "bidding"],
    version: "0.1.0",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-01",
    status: "draft",
    revenue: 0,
  },
  {
    id: "14",
    name: "Craigslist Listings Scraper",
    description: "Extract classified ad listings from Craigslist.",
    type: "template",
    category: "real-estate",
    author: { name: "ScrapeSuite Team", avatar: "ST", verified: true },
    rating: 3.2,
    reviewCount: 12,
    downloads: 890,
    pricing: "free",
    staffPick: false,
    verified: false,
    tags: ["craigslist", "classifieds"],
    version: "1.0.0",
    createdAt: "2024-05-20",
    updatedAt: "2024-08-15",
    status: "deprecated",
    revenue: 0,
  },
];

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function getPriceLabel(item: MarketplaceItem): string {
  switch (item.pricing) {
    case "free":
      return "Free";
    case "credits":
      return `${item.price} credits`;
    case "subscription":
      return `$${item.price}/mo`;
    default:
      return "Free";
  }
}

export function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}
