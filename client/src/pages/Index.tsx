import { HeroSection } from "@/features/home/HeroSection";
import { CategoriesGrid } from "@/features/home/CategoriesGrid";
import { FeaturedProducts } from "@/features/home/FeaturedProducts";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoriesGrid />
      <FeaturedProducts />
    </div>
  );
};

export default Index;
