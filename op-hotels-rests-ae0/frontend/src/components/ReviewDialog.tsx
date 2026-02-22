import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, User } from 'lucide-react';
import { useAddReview } from '../hooks/useQueries';
import { Language } from '../types/language';
import { Review, MenuItem } from '../backend';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem: MenuItem;
  reviews: Review[];
  language: Language;
}

export function ReviewDialog({ open, onOpenChange, menuItem, reviews, language }: ReviewDialogProps) {
  const [showAddReview, setShowAddReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const addReviewMutation = useAddReview();

  const content = {
    [Language.english]: {
      title: 'Reviews',
      addReview: 'Add Review',
      yourName: 'Your Name',
      yourReview: 'Your Review',
      rating: 'Rating',
      submit: 'Submit Review',
      cancel: 'Cancel',
      noReviews: 'No reviews yet. Be the first to review!',
      submitting: 'Submitting...'
    },
    [Language.malayalam]: {
      title: 'അവലോകനങ്ങൾ',
      addReview: 'അവലോകനം ചേർക്കുക',
      yourName: 'നിങ്ങളുടെ പേര്',
      yourReview: 'നിങ്ങളുടെ അവലോകനം',
      rating: 'റേറ്റിംഗ്',
      submit: 'അവലോകനം സമർപ്പിക്കുക',
      cancel: 'റദ്ദാക്കുക',
      noReviews: 'ഇതുവരെ അവലോകനങ്ങളൊന്നുമില്ല. ആദ്യം അവലോകനം ചെയ്യുക!',
      submitting: 'സമർപ്പിക്കുന്നു...'
    },
    [Language.arabic]: {
      title: 'التقييمات',
      addReview: 'إضافة تقييم',
      yourName: 'اسمك',
      yourReview: 'تقييمك',
      rating: 'التقييم',
      submit: 'إرسال التقييم',
      cancel: 'إلغاء',
      noReviews: 'لا توجد تقييمات بعد. كن أول من يقيم!',
      submitting: 'جاري الإرسال...'
    },
    [Language.hindi]: {
      title: 'समीक्षाएं',
      addReview: 'समीक्षा जोड़ें',
      yourName: 'आपका नाम',
      yourReview: 'आपकी समीक्षा',
      rating: 'रेटिंग',
      submit: 'समीक्षा सबमिट करें',
      cancel: 'रद्द करें',
      noReviews: 'अभी तक कोई समीक्षा नहीं। पहले समीक्षा करें!',
      submitting: 'सबमिट कर रहे हैं...'
    }
  };

  const currentContent = content[language];

  const handleSubmitReview = async () => {
    if (!author.trim() || !comment.trim()) return;

    const review: Review = {
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      menuItemId: menuItem.id,
      rating,
      comment: comment.trim(),
      author: author.trim(),
      timestamp: BigInt(Date.now() * 1000000), // Convert to nanoseconds
    };

    try {
      await addReviewMutation.mutateAsync(review);
      setShowAddReview(false);
      setComment('');
      setAuthor('');
      setRating(5);
    } catch (error) {
      console.error('Failed to add review:', error);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert from nanoseconds
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {currentContent.title} - {menuItem.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add Review Button */}
          {!showAddReview && (
            <Button onClick={() => setShowAddReview(true)} className="w-full">
              {currentContent.addReview}
            </Button>
          )}

          {/* Add Review Form */}
          {showAddReview && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label htmlFor="author">{currentContent.yourName}</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder={currentContent.yourName}
                />
              </div>

              <div className="space-y-2">
                <Label>{currentContent.rating}</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">{currentContent.yourReview}</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={currentContent.yourReview}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitReview}
                  disabled={!author.trim() || !comment.trim() || addReviewMutation.isPending}
                  className="flex-1"
                >
                  {addReviewMutation.isPending ? currentContent.submitting : currentContent.submit}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddReview(false)}
                  className="flex-1"
                >
                  {currentContent.cancel}
                </Button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {currentContent.noReviews}
              </p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{review.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {formatDate(review.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
