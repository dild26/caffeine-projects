import { Button } from '@/components/ui/button';
import { ArrowDown, Star } from 'lucide-react';
import { Language } from '../types/language';

interface HeroSectionProps {
  language: Language;
  onNavigate: (section: string) => void;
}

export function HeroSection({ language, onNavigate }: HeroSectionProps) {
  const content = {
    [Language.english]: {
      title: 'Authentic Kerala Cuisine',
      subtitle: 'A Heritage of Flavors Since 1952',
      description: 'Experience the rich culinary traditions of Kerala with our time-honored recipes, passed down through generations of master chefs.',
      cta: 'Explore Our Menu',
      features: ['Traditional Recipes', 'Fresh Spices', 'Heritage Ambiance']
    },
    [Language.malayalam]: {
      title: 'യഥാർത്ഥ കേരള പാചകരീതി',
      subtitle: '1952 മുതൽ ഒരു പാരമ്പര്യം',
      description: 'തലമുറകളായി കൈമാറ്റം ചെയ്യപ്പെട്ട പരമ്പരാഗത പാചക വിദ്യകളിലൂടെ കേരളത്തിന്റെ സമ്പന്നമായ പാചക പാരമ്പര്യം അനുഭവിക്കൂ.',
      cta: 'മെനു കാണുക',
      features: ['പരമ്പരാഗത പാചകക്രമങ്ങൾ', 'പുതിയ മസാലകൾ', 'പൈതൃക അന്തരീക്ഷം']
    },
    [Language.arabic]: {
      title: 'المأكولات الكيرالية الأصيلة',
      subtitle: 'تراث من النكهات منذ 1952',
      description: 'اختبر التقاليد الطهوية الغنية لكيرالا مع وصفاتنا العريقة، المتوارثة عبر أجيال من الطهاة المهرة.',
      cta: 'استكشف قائمتنا',
      features: ['وصفات تقليدية', 'توابل طازجة', 'أجواء تراثية']
    },
    [Language.hindi]: {
      title: 'प्रामाणिक केरल व्यंजन',
      subtitle: '1952 से स्वादों की विरासत',
      description: 'हमारे पुराने व्यंजनों के साथ केरल की समृद्ध पाक परंपराओं का अनुभव करें, जो पीढ़ियों से मास्टर शेफ़ों द्वारा पारित किए गए हैं।',
      cta: 'हमारा मेनू देखें',
      features: ['पारंपरिक व्यंजन', 'ताज़े मसाले', 'विरासती माहौल']
    }
  };

  const currentContent = content[language];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background hero image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Traditional Kerala feast with banana leaf"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/95" />
      </div>
      
      {/* Decorative food elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-r from-primary via-accent to-heritage-red bg-clip-text text-transparent">
              {currentContent.title}
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in-up animate-delay-200">
            {currentContent.subtitle}
          </p>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-300">
            {currentContent.description}
          </p>
          
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in-up animate-delay-400">
            {currentContent.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="animate-fade-in-up animate-delay-500">
            <Button
              size="lg"
              onClick={() => onNavigate('menu')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-heritage transition-all duration-300 hover:shadow-spice hover:scale-105"
            >
              {currentContent.cta}
            </Button>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
}
