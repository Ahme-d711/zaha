import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveMediaUrl } from "@/lib/media-url";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="glass-card rounded-2xl overflow-hidden aspect-square mb-4">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            src={resolveMediaUrl(images[selectedImage])}
            alt={productName}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                selectedImage === i ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={resolveMediaUrl(img)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
