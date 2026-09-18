import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { ensureDbInit } from "@/lib/api-init";

function getMockData(url: string) {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("amazon") || lowerUrl.includes("amzn")) {
    return {
      title:
        "Sony WH-1000XM5 Wireless Noise Canceling Over-Ear Headphones - Black",
      price: "$278.00",
      originalPrice: "$399.99",
      rating: 4.6,
      reviews: 12847,
      availability: "In Stock",
      seller: "Amazon.com",
      image:
        "https://images-na.ssl-images-amazon.com/images/I/example.jpeg",
      features: [
        "Industry-leading noise cancellation",
        "Auto NC Optimizer",
        "30-hour battery life",
        "Multipoint connection",
      ],
      breadcrumbs: ["Electronics", "Headphones", "Over-Ear"],
    };
  }

  if (lowerUrl.includes("linkedin")) {
    return {
      company: "Acme Technologies Inc.",
      industry: "Software Development",
      size: "501-1,000 employees",
      headquarters: "San Francisco, CA",
      founded: 2015,
      specialties: [
        "AI/ML",
        "Cloud Computing",
        "SaaS",
        "Data Analytics",
      ],
      website: "https://acmetech.example.com",
      followers: 24500,
      description:
        "Acme Technologies is a leading provider of AI-powered business solutions.",
      keyPeople: [
        { name: "Jane Smith", title: "CEO" },
        { name: "John Doe", title: "CTO" },
      ],
    };
  }

  if (lowerUrl.includes("zillow")) {
    return {
      address: "742 Evergreen Terrace, Springfield, IL 62704",
      price: "$425,000",
      estimate: "$432,500",
      beds: 4,
      baths: 2.5,
      sqft: 2100,
      yearBuilt: 1992,
      lotSize: "0.25 acres",
      type: "Single Family",
      status: "For Sale",
      daysOnMarket: 14,
      agent: "Lisa Monroe",
      priceHistory: [
        { date: "2024-01-15", price: "$410,000", event: "Listed" },
        { date: "2019-06-01", price: "$365,000", event: "Sold" },
      ],
    };
  }

  // Default generic product
  return {
    title: "Premium Wireless Headphones Pro Max",
    price: "$149.99",
    originalPrice: "$199.99",
    rating: 4.5,
    reviews: 3421,
    availability: "In Stock",
    seller: "Official Store",
    features: [
      "Active Noise Cancellation",
      "40-hour battery life",
      "Bluetooth 5.3",
      "USB-C Fast Charging",
    ],
    description:
      "Experience premium sound quality with our top-rated wireless headphones.",
  };
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    await ensureDbInit();
    const body = await request.json();
    const { url, prompt } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Get API key from header
    let token: string | null = null;
    const authHeader = request.headers.get("authorization");
    const apiKeyHeader = request.headers.get("x-api-key");

    if (apiKeyHeader) {
      token = apiKeyHeader;
    } else if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return NextResponse.json(
        { error: "API key required. Use x-api-key header or Authorization: Bearer token" },
        { status: 401 }
      );
    }

    // Find user by API key or JWT
    let userId: string | null = null;
    let userPlan = "free";

    // Try API key first
    const apiKey = await db.apiKey.findUnique({
      where: { key: token },
      include: { user: true },
    });

    if (apiKey) {
      userId = apiKey.userId;
      userPlan = apiKey.user.plan;
      // Update last used
      await db.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsed: new Date() },
      });
    } else {
      // Try JWT
      const decoded = verifyToken(token);
      if (decoded && typeof decoded === "object" && "id" in decoded) {
        const user = await db.user.findUnique({
          where: { id: (decoded as { id: string }).id },
        });
        if (user) {
          userId = user.id;
          userPlan = user.plan;
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid API key or token" },
        { status: 401 }
      );
    }

    // Check rate limit
    const rateLimitResult = checkRateLimit(userId, userPlan);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(rateLimitResult.limit),
            "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          },
        }
      );
    }

    // Get mock data
    const data = getMockData(url);
    const responseMs = Date.now() - startTime;

    // Save to history
    await db.scrapeHistory.create({
      data: {
        userId,
        url,
        status: "success",
        result: JSON.stringify(data),
        creditsUsed: 1,
        responseMs,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data,
        prompt: prompt || null,
        meta: {
          creditsUsed: 1,
          responseMs,
          remaining: rateLimitResult.remaining,
          limit: rateLimitResult.limit,
        },
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rateLimitResult.limit),
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
        },
      }
    );
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
