import { MapIcon, Home, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4" dir="rtl">
      <div className="bg-primary/10 rounded-full p-6 mb-6">
        <MapIcon className="w-16 h-16 text-primary" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-headline">
        الصفحة غير موجودة
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
        عذرًا، لم نتمكن من العثور على الصفحة التي تبحث عنها. قد تكون الصفحة قد تم نقلها أو حذفها أو ربما هناك خطأ في الرابط.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/">
            <Home className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
            العودة إلى الصفحة الرئيسية
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/search">
            <Search className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
            البحث في الموقع
          </Link>
        </Button>
        <Button variant="ghost" size="lg" onClick={() => window.history.back()}>
          <ArrowLeft className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
          العودة للصفحة السابقة
        </Button>
      </div>
    </div>
  );
}