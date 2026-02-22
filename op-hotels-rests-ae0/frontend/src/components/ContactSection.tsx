import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { useHotelInfo } from '../hooks/useQueries';
import { Language } from '../types/language';

interface ContactSectionProps {
  language: Language;
}

export function ContactSection({ language }: ContactSectionProps) {
  const { data: hotelInfo } = useHotelInfo();

  const content = {
    [Language.english]: {
      title: 'Visit Us',
      subtitle: 'Experience Kerala\'s finest dining',
      hours: 'Opening Hours',
      hoursText: 'Daily: 11:00 AM - 11:00 PM',
      followUs: 'Follow Us',
      getDirections: 'Get Directions',
      callNow: 'Call Now',
      sendEmail: 'Send Email'
    },
    [Language.malayalam]: {
      title: 'ഞങ്ങളെ സന്ദർശിക്കുക',
      subtitle: 'കേരളത്തിലെ ഏറ്റവും മികച്ച ഭക്ഷണം അനുഭവിക്കുക',
      hours: 'തുറന്നിരിക്കുന്ന സമയം',
      hoursText: 'ദിവസേന: രാവിലെ 11:00 - രാത്രി 11:00',
      followUs: 'ഞങ്ങളെ പിന്തുടരുക',
      getDirections: 'ദിശകൾ നേടുക',
      callNow: 'ഇപ്പോൾ വിളിക്കുക',
      sendEmail: 'ഇമെയിൽ അയയ്ക്കുക'
    },
    [Language.arabic]: {
      title: 'زورونا',
      subtitle: 'اختبروا أفضل مأكولات كيرالا',
      hours: 'ساعات العمل',
      hoursText: 'يومياً: 11:00 صباحاً - 11:00 مساءً',
      followUs: 'تابعونا',
      getDirections: 'احصل على الاتجاهات',
      callNow: 'اتصل الآن',
      sendEmail: 'أرسل بريد إلكتروني'
    },
    [Language.hindi]: {
      title: 'हमसे मिलें',
      subtitle: 'केरल के बेहतरीन भोजन का अनुभव करें',
      hours: 'खुलने का समय',
      hoursText: 'दैनिक: सुबह 11:00 - रात 11:00',
      followUs: 'हमें फॉलो करें',
      getDirections: 'दिशा प्राप्त करें',
      callNow: 'अभी कॉल करें',
      sendEmail: 'ईमेल भेजें'
    }
  };

  const currentContent = content[language];

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 animate-fade-in-up">
            {currentContent.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
            {currentContent.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="hover:shadow-heritage transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display">
                  <MapPin className="h-5 w-5 text-primary" />
                  {hotelInfo?.name || 'Sudeep Hotels'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {hotelInfo?.description || 'Experience authentic Kerala cuisine in our heritage restaurant.'}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">
                      {hotelInfo?.address || 'Kerala, India'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">
                      {hotelInfo?.contactNumber || '+91 123 456 7890'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">
                      {hotelInfo?.email || 'info@sudeephotels.com'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{currentContent.hoursText}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  <Button size="sm" className="gap-2">
                    <Phone className="h-4 w-4" />
                    {currentContent.callNow}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="h-4 w-4" />
                    {currentContent.sendEmail}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    {currentContent.getDirections}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="hover:shadow-heritage transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-display">{currentContent.followUs}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" className="hover:bg-blue-50 hover:border-blue-200">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="hover:bg-pink-50 hover:border-pink-200">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="hover:bg-blue-50 hover:border-blue-200">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Restaurant Ambiance Image */}
          <div className="lg:sticky lg:top-8">
            <Card className="h-full min-h-[400px] hover:shadow-heritage transition-all duration-300 overflow-hidden">
              <CardContent className="p-0 h-full">
                <div className="w-full h-full relative">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Sudeep Hotels restaurant interior - traditional Kerala dining ambiance"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="font-display font-semibold text-xl mb-2">Visit Our Restaurant</h3>
                    <p className="text-sm opacity-90">
                      Experience authentic Kerala hospitality
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
