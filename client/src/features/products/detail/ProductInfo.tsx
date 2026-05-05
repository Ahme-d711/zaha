import { Star } from "lucide-react";

interface ProductInfoProps {
  name: string;
  rating: number;
  reviewsCount: number;
  price: number;
  oldPrice?: number;
  description?: string;
  isBestSeller?: boolean;
}

export function ProductInfo({
  name,
  rating,
  reviewsCount,
  price,
  oldPrice,
  description,
  isBestSeller,
}: ProductInfoProps) {
  return (
    <>
      {isBestSeller && (
        <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
          Bestseller
        </span>
      )}
      <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">{name}</h1>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(rating || 0) ? "fill-accent text-accent" : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium">{rating || 0}</span>
        <span className="text-sm text-muted-foreground">({(reviewsCount || 0).toLocaleString()} reviews)</span>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl font-bold">${price.toLocaleString()}</span>
        {oldPrice && oldPrice > price && (
          <>
            <span className="text-xl text-muted-foreground line-through">${oldPrice.toLocaleString()}</span>
            <span className="px-2 py-0.5 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
              -{Math.round((1 - price / oldPrice) * 100)}%
            </span>
          </>
        )}
      </div>

      <p className="text-muted-foreground leading-relaxed mb-8">{description || "No description available."}</p>
    </>
  );
}
