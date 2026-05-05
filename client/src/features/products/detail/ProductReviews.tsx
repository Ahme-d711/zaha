import { useState, useEffect } from "react";
import { Star, User, Loader2, MessageSquare, Edit2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/api/review.service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/use-auth-store";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: reviewsResponse, isLoading } = useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => reviewService.getByProduct(productId),
  });

  const reviews = reviewsResponse?.data?.reviews ?? [];
  const existingReview = reviews.find(r => 
    (typeof r.userId === 'object' ? r.userId._id : r.userId) === user?._id
  );

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment || "");
    }
  }, [existingReview]);

  const addReviewMutation = useMutation({
    mutationFn: (data: { productId: string; rating: number; comment?: string }) =>
      reviewService.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-detail", productId] });
      toast.success("Review submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: (data: { id: string; rating: number; comment?: string }) =>
      reviewService.update(data.id, { rating: data.rating, comment: data.comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-detail", productId] });
      toast.success("Review updated successfully!");
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (id: string) => reviewService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product-detail", productId] });
      setRating(5);
      setComment("");
      toast.success("Review deleted");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }
    
    if (existingReview) {
      updateReviewMutation.mutate({ id: existingReview._id, rating, comment });
    } else {
      addReviewMutation.mutate({ productId, rating, comment });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="mt-16 border-t pt-16">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Summary & Form */}
        <div className="lg:w-1/3">
          <h2 className="text-2xl font-display font-bold mb-6">Customer Reviews</h2>
          
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(averageRating) ? "fill-accent text-accent" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{reviews.length} reviews</p>
              </div>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => Math.round(r.rating) === star).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-3">{star}</span>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent" 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-6">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {user ? (
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{existingReview ? "Edit your review" : "Share your thoughts"}</h3>
                {existingReview && (
                  <button 
                    onClick={() => deleteReviewMutation.mutate(existingReview._id)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                    title="Delete review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-5 w-5 transition-colors ${
                            star <= rating ? "fill-accent text-accent" : "text-muted-foreground/30 hover:text-accent/50"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike?"
                  className="w-full min-h-[100px] rounded-xl bg-secondary/50 border-none p-4 text-sm focus:ring-1 focus:ring-accent outline-none transition-all"
                  maxLength={300}
                />
                <Button 
                  type="submit" 
                  disabled={addReviewMutation.isPending || updateReviewMutation.isPending}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
                >
                  {(addReviewMutation.isPending || updateReviewMutation.isPending) ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : existingReview ? (
                    <Edit2 className="h-4 w-4 mr-2" />
                  ) : (
                    <MessageSquare className="h-4 w-4 mr-2" />
                  )}
                  {existingReview ? "Update Review" : "Post Review"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center p-6 glass-card rounded-2xl">
              <p className="text-sm text-muted-foreground mb-4">Login to write a review</p>
              <Button asChild variant="outline" className="w-full rounded-xl">
                <a href="/login">Login</a>
              </Button>
            </div>
          )}
        </div>

        {/* Right: Reviews List */}
        <div className="lg:w-2/3">
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {reviews.length === 0 ? (
                <div className="text-center py-20 bg-secondary/20 rounded-3xl">
                  <MessageSquare className="h-10 w-10 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <motion.div
                    key={rev._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`glass-card rounded-2xl p-6 ${
                      (typeof rev.userId === 'object' ? rev.userId._id : rev.userId) === user?._id 
                        ? "border-accent/30 bg-accent/5" 
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {typeof rev.userId === 'object' ? rev.userId.name : 'User'}
                            {(typeof rev.userId === 'object' ? rev.userId._id : rev.userId) === user?._id && (
                              <span className="ml-2 text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-md uppercase font-bold">You</span>
                            )}
                          </p>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < rev.rating ? "fill-accent text-accent" : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {rev.comment && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {rev.comment}
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
