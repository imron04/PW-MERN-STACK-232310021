import React from "react";
import { Navbar } from "./components/navbar";
import { HeroSection } from "./components/herosection";
import { FeaturesSection } from "./components/featuredbookssection";
import { ChooseUs } from "./components/chooseus";
import { TestimonialSection } from "./components/testimonsection";
import { Footers } from "./components/footers";
import { CategoriesSection } from "./components/categoriessection";

export default function LandingPages() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <ChooseUs />
      <FeaturesSection />
      <TestimonialSection />
      <CategoriesSection />
      <Footers />
    </div>
  );
}
