import { HeroSection } from "@/features/home/HeroSection";
import { CategoriesGrid } from "@/features/home/CategoriesGrid";
import { TopVendors } from "@/features/home/TopVendors";
import { FeaturedProducts } from "@/features/home/FeaturedProducts";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoriesGrid />
      <FeaturedProducts />
      <TopVendors />
    </div>
  );
};


export default Index;
