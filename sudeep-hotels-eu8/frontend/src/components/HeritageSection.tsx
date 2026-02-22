import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { useTimelineEvents } from '../hooks/useQueries';
import { useFileUrl } from '../blob-storage/FileStorage';
import { Language } from '../types/language';

interface HeritageSectionProps {
  language: Language;
}

// Heritage images for timeline events
const heritageImages = [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Traditional Kerala kitchen
  'https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Heritage dining
  'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Traditional cooking
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Kerala spices
  'https://images.unsplash.com/photo-1574653853027-5d3ac9b9e7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Traditional vessels
];

function getRandomHeritageImage(): string {
  return heritageImages[Math.floor(Math.random() * heritageImages.length)];
}

function TimelineEventCard({ event, index }: { event: any; index: number }) {
  const { data: imageUrl } = useFileUrl(event.imagePath || '');
  const isEven = index % 2 === 0;
  const fallbackImage = getRandomHeritageImage();

  return (
    <div className={`flex items-center gap-8 ${isEven ? 'flex-row' : 'flex-row-reverse'} mb-16`}>
      {/* Content */}
      <div className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}>
        <Card className="hover:shadow-heritage transition-all duration-300">
          <CardContent className="p-6">
            <div className={`flex items-center gap-2 mb-3 ${isEven ? 'justify-end' : 'justify-start'}`}>
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{Number(event.year)}</span>
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">{event.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg" />
        <div className="w-0.5 h-16 bg-gradient-to-b from-primary to-transparent" />
      </div>

      {/* Image */}
      <div className="flex-1">
        <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
          <img
            src={imageUrl || fallbackImage}
            alt={`Heritage moment: ${event.title}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

function MobileTimelineEventCard({ event }: { event: any }) {
  const { data: imageUrl } = useFileUrl(event.imagePath || '');
  const fallbackImage = getRandomHeritageImage();

  return (
    <div className="mb-8">
      <Card className="hover:shadow-heritage transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-video overflow-hidden">
            <img
              src={imageUrl || fallbackImage}
              alt={`Heritage moment: ${event.title}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{Number(event.year)}</span>
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">{event.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function HeritageSection({ language }: HeritageSectionProps) {
  const { data: timelineEvents = [], isLoading } = useTimelineEvents();
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 3;
  const totalPages = Math.ceil(timelineEvents.length / eventsPerPage);

  const content = {
    [Language.english]: {
      title: 'Our Heritage',
      subtitle: 'A Journey Through Time',
      description: 'Discover the rich history of Sudeep Hotels, from our humble beginnings to becoming a cornerstone of Kerala\'s culinary landscape.',
      loading: 'Loading heritage timeline...',
      noEvents: 'Heritage timeline will be available soon.',
      previous: 'Previous',
      next: 'Next'
    },
    [Language.malayalam]: {
      title: 'ഞങ്ങളുടെ പൈതൃകം',
      subtitle: 'കാലത്തിലൂടെയുള്ള യാത്ര',
      description: 'സുദീപ് ഹോട്ടലുകളുടെ സമ്പന്നമായ ചരിത്രം കണ്ടെത്തുക, ഞങ്ങളുടെ എളിയ തുടക്കം മുതൽ കേരളത്തിന്റെ പാചക ഭൂപ്രകൃതിയുടെ മൂലക്കല്ലായി മാറുന്നതുവരെ.',
      loading: 'പൈതൃക ടൈംലൈൻ ലോഡ് ചെയ്യുന്നു...',
      noEvents: 'പൈതൃക ടൈംലൈൻ ഉടൻ ലഭ്യമാകും.',
      previous: 'മുമ്പത്തേത്',
      next: 'അടുത്തത്'
    },
    [Language.arabic]: {
      title: 'تراثنا',
      subtitle: 'رحلة عبر الزمن',
      description: 'اكتشف التاريخ الغني لفنادق سوديب، من بداياتنا المتواضعة إلى أن نصبح حجر الزاوية في المشهد الطهوي لكيرالا.',
      loading: 'جاري تحميل الجدول الزمني للتراث...',
      noEvents: 'سيكون الجدول الزمني للتراث متاحًا قريبًا.',
      previous: 'السابق',
      next: 'التالي'
    },
    [Language.hindi]: {
      title: 'हमारी विरासत',
      subtitle: 'समय के माध्यम से एक यात्रा',
      description: 'सुदीप होटल्स के समृद्ध इतिहास की खोज करें, हमारी विनम्र शुरुआत से लेकर केरल के पाक परिदृश्य की आधारशिला बनने तक।',
      loading: 'विरासत समयरेखा लोड हो रही है...',
      noEvents: 'विरासत समयरेखा जल्द ही उपलब्ध होगी।',
      previous: 'पिछला',
      next: 'अगला'
    }
  };

  const currentContent = content[language];
  const currentEvents = timelineEvents.slice(
    currentPage * eventsPerPage,
    (currentPage + 1) * eventsPerPage
  );

  return (
    <section id="heritage" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 animate-fade-in-up">
            {currentContent.title}
          </h2>
          <p className="text-xl text-muted-foreground mb-6 animate-fade-in-up animate-delay-200">
            {currentContent.subtitle}
          </p>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-300">
            {currentContent.description}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{currentContent.loading}</p>
          </div>
        ) : timelineEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{currentContent.noEvents}</p>
          </div>
        ) : (
          <>
            {/* Desktop Timeline */}
            <div className="hidden md:block">
              <div className="relative">
                {currentEvents.map((event, index) => (
                  <TimelineEventCard
                    key={event.id}
                    event={event}
                    index={currentPage * eventsPerPage + index}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Timeline */}
            <div className="md:hidden">
              {currentEvents.map((event) => (
                <MobileTimelineEventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {currentContent.previous}
                </Button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      variant={i === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i)}
                      className="w-10 h-10"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="gap-2"
                >
                  {currentContent.next}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
