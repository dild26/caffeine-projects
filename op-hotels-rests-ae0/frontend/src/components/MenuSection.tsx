import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MessageCircle, IndianRupee } from 'lucide-react';
import { useMenuItemsByCategory, useReviewsForMenuItem, getDietaryTagLabel, getDietaryTagColor, useInitializeSampleData, useCheckDataExists } from '../hooks/useQueries';
import { Language } from '../types/language';
import { ReviewDialog } from './ReviewDialog';

interface MenuSectionProps {
  language: Language;
}

const menuCategories = [
  { id: 'appetizers', label: 'Appetizers', labelMl: 'വിശപ്പുണ്ടാക്കുന്നവ', labelAr: 'المقبلات', labelHi: 'स्टार्टर्स' },
  { id: 'mains', label: 'Main Course', labelMl: 'പ്രധാന വിഭവങ്ങൾ', labelAr: 'الأطباق الرئيسية', labelHi: 'मुख्य व्यंजन' },
  { id: 'rice', label: 'Rice & Biryanis', labelMl: 'ചോറും ബിരിയാണിയും', labelAr: 'الأرز والبرياني', labelHi: 'चावल और बिरयानी' },
  { id: 'desserts', label: 'Desserts', labelMl: 'മധുരപലഹാരങ്ങൾ', labelAr: 'الحلويات', labelHi: 'मिठाइयाँ' },
  { id: 'beverages', label: 'Beverages', labelMl: 'പാനീയങ്ങൾ', labelAr: 'المشروبات', labelHi: 'पेय पदार्थ' },
];

function getCategoryLabel(category: typeof menuCategories[0], language: Language): string {
  switch (language) {
    case Language.malayalam: return category.labelMl;
    case Language.arabic: return category.labelAr;
    case Language.hindi: return category.labelHi;
    default: return category.label;
  }
}

function MenuItem({ item, language }: { item: any; language: Language }) {
  const [showReviews, setShowReviews] = useState(false);
  const { data: reviews = [] } = useReviewsForMenuItem(item.id);
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  // Generate descriptive alt text based on item name and category
  const getAltText = (itemName: string, category: string) => {
    const categoryDescriptions = {
      appetizers: 'authentic Kerala appetizer',
      mains: 'traditional Kerala main course',
      rice: 'Kerala rice dish and biryani',
      desserts: 'traditional Kerala dessert',
      beverages: 'refreshing Kerala beverage'
    };
    
    const categoryDesc = categoryDescriptions[category as keyof typeof categoryDescriptions] || 'Kerala delicacy';
    return `${itemName} - ${categoryDesc} served at Sudeep Hotels`;
  };

  return (
    <Card className="group hover:shadow-heritage transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Food Image */}
      <div className="aspect-video overflow-hidden">
        <img
          src={item.imagePath}
          alt={getAltText(item.name, item.category)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            // Fallback to a default Kerala food image if the original fails to load
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-display group-hover:text-primary transition-colors">
            {item.name}
          </CardTitle>
          <div className="flex items-center gap-1 text-primary font-bold">
            <IndianRupee className="h-4 w-4" />
            <span>{item.price}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            Portion: {item.portionSize}
          </span>
          {averageRating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({reviews.length})</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-3">
          {item.dietaryTags.map((tag: any) => (
            <Badge
              key={tag}
              variant="secondary"
              className={`text-xs ${getDietaryTagColor(tag)}`}
            >
              {getDietaryTagLabel(tag)}
            </Badge>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowReviews(true)}
          className="w-full gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          View Reviews ({reviews.length})
        </Button>
        
        <ReviewDialog
          open={showReviews}
          onOpenChange={setShowReviews}
          menuItem={item}
          reviews={reviews}
          language={language}
        />
      </CardContent>
    </Card>
  );
}

export function MenuSection({ language }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState('appetizers');
  const { data: menuItems = [], isLoading } = useMenuItemsByCategory(activeCategory);
  const { data: dataExists = false, isLoading: checkingData } = useCheckDataExists();
  const initializeSampleData = useInitializeSampleData();

  // Initialize sample data if no data exists
  useEffect(() => {
    if (!checkingData && !dataExists && !initializeSampleData.isPending) {
      initializeSampleData.mutate();
    }
  }, [dataExists, checkingData, initializeSampleData]);

  const content = {
    [Language.english]: {
      title: 'Our Menu',
      subtitle: 'Discover the authentic flavors of Kerala',
      loading: 'Loading menu items...',
      noItems: 'No items available in this category.',
      initializing: 'Preparing our delicious menu...'
    },
    [Language.malayalam]: {
      title: 'ഞങ്ങളുടെ മെനു',
      subtitle: 'കേരളത്തിന്റെ യഥാർത്ഥ രുചികൾ കണ്ടെത്തുക',
      loading: 'മെനു ഇനങ്ങൾ ലോഡ് ചെയ്യുന്നു...',
      noItems: 'ഈ വിഭാഗത്തിൽ ഇനങ്ങൾ ലഭ്യമല്ല.',
      initializing: 'ഞങ്ങളുടെ രുചികരമായ മെനു തയ്യാറാക്കുന്നു...'
    },
    [Language.arabic]: {
      title: 'قائمتنا',
      subtitle: 'اكتشف النكهات الأصيلة لكيرالا',
      loading: 'جاري تحميل عناصر القائمة...',
      noItems: 'لا توجد عناصر متاحة في هذه الفئة.',
      initializing: 'جاري تحضير قائمتنا اللذيذة...'
    },
    [Language.hindi]: {
      title: 'हमारा मेनू',
      subtitle: 'केरल के प्रामाणिक स्वादों की खोज करें',
      loading: 'मेनू आइटम लोड हो रहे हैं...',
      noItems: 'इस श्रेणी में कोई आइटम उपलब्ध नहीं है।',
      initializing: 'हमारा स्वादिष्ट मेनू तैयार कर रहे हैं...'
    }
  };

  const currentContent = content[language];

  // Show initialization loading if data doesn't exist and we're initializing
  if (!dataExists && (checkingData || initializeSampleData.isPending)) {
    return (
      <section id="menu" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 animate-fade-in-up">
              {currentContent.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
              {currentContent.subtitle}
            </p>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{currentContent.initializing}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 animate-fade-in-up">
            {currentContent.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
            {currentContent.subtitle}
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 h-auto p-1">
            {menuCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-xs md:text-sm py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {getCategoryLabel(category, language)}
              </TabsTrigger>
            ))}
          </TabsList>

          {menuCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">{currentContent.loading}</p>
                </div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{currentContent.noItems}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <MenuItem item={item} language={language} />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
