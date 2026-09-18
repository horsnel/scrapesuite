"use client";

import Navigation from "@/components/navigation";
import MetaballCanvas from "@/components/MetaballCanvas";
import Hero from "@/components/sections/Hero";
import LogoBar from "@/components/sections/LogoBar";
import Features from "@/components/sections/Features";
import Demo from "@/components/sections/Demo";
import Pricing from "@/components/sections/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import Roadmap from "@/components/sections/Roadmap";
import CTAFooter from "@/components/sections/CTAFooter";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <MetaballCanvas />
      <Navigation />
      <Hero />
      <LogoBar />
      <Features />
      <Demo />
      <Pricing />
      <Testimonials />
      <Roadmap />
      <CTAFooter />
    </main>
  );
}
