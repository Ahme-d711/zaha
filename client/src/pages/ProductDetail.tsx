import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/api/product.service";
import { ProductGallery } from "@/features/products/detail/ProductGallery";
import { ProductInfo } from "@/features/products/detail/ProductInfo";
import { ProductActions } from "@/features/products/detail/ProductActions";
import { RelatedProducts } from "@/features/products/detail/RelatedProducts";

import { ProductReviews } from "@/features/products/detail/ProductReviews";

const ProductDetail = () => {
  const { id } = useParams();

  // Fetch Product details
  const { data: productResponse, isLoading, isError } = useQuery({
    queryKey: ["product-detail", id],
    queryFn: () => productService.getById(id as string),
    enabled: !!id,
  });

  const product = productResponse?.data?.product;

  // Fetch Related Products
  const categoryId = typeof product?.categoryId === 'object' ? product?.categoryId._id : product?.categoryId;
  const { data: relatedResponse } = useQuery({
    queryKey: ["related-products", categoryId, id],
    queryFn: () => productService.getAll({ categoryId, limit: 5 }),
    enabled: !!categoryId,
  });

  const relatedProducts = relatedResponse?.data?.products.filter(p => p._id !== id).slice(0, 4) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products" className="text-accent hover:underline">Back to shop</Link>
        </div>
      </div>
    );
  }

  const allImages = [product.images.main, ...(product.images.gallery || [])];
  const productName = product.nameEn || product.name;
  const categoryName = typeof product.categoryId === 'object' ? product.categoryId.nameEn : "Shop";

  return (
    <div className="min-h-screen py-8">
      <div className="section-padding">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
        >
          <Link to="/products" className="hover:text-accent transition-colors flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Back to Shop
          </Link>
          <span className="mx-1">/</span>
          <span>{categoryName}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery Component */}
          <ProductGallery images={allImages} productName={productName} />

          {/* Details & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ProductInfo
              name={productName}
              rating={product.rating}
              reviewsCount={product.reviews_count}
              price={product.price}
              oldPrice={product.old_price}
              description={product.descriptionEn || product.description}
              isBestSeller={product.is_best_seller}
            />

            <ProductActions product={product} />
          </motion.div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product._id} />

        {/* Related Products Component */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
};

export default ProductDetail;
