
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Search, MapPin as MapPinIconLucide, Briefcase, ShieldCheck, Handshake, Building, Settings, Home as HomeIconLucide, GalleryHorizontalEnd, LineChart, HeartHandshake, ClipboardEdit, Building2 as Building2Icon, PlusCircle, Percent, Lightbulb, Users, Camera, Megaphone, Globe, Headset, CircleDollarSign, Wrench, FileText, BarChartBig, SearchCheck, MapIcon, Store, X, Landmark, Sofa, Map, Star, TrendingUp, BookOpen, Compass, Map as MapIconNav, CalendarDays, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import DynamicPropertyMatchCalculator from '@/components/home/DynamicPropertyMatchCalculator';

const ServiceDetailItem: React.FC<{icon: React.ReactElement; title: string; description: string}> = ({icon, title, description}) => (
    <div className="bg-muted/30 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center mb-3">
        <span className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-full rtl:ml-4 ltr:mr-4 shrink-0">
            {icon}
        </span>
        <h4 className="font-semibold text-md text-foreground">{title}</h4>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
);

const licenses: {badgeText: string; title: string; icon: React.ReactElement; licenseNumber?: string; description: string; externalLink?: string; externalImage?: string; externalImageHint?: string;}[] = [
  {
    badgeText: "معتمدة",
    title: "البيع والتأجير على الخارطة (وافي)",
    icon: <Building className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />,
    description: "رخصة معتمدة من نظام وافي لتسويق مشاريع البيع أو التأجير على الخارطة.",
    externalImage: "https://red.rega.gov.sa/img/logo-wafi.svg",
    externalImageHint: "Wafi logo",
    externalLink: "https://wafi.housing.gov.sa/"
  },
  {
    badgeText: "معتمدة",
    title: "فال لإدارة المرافق",
    icon: <Settings className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />,
    licenseNumber: "3200000547",
    description: "رخصة معتمدة لإدارة المرافق العقارية وتقديم خدمات متكاملة تضمن كفاءة التشغيل.",
    externalImage: "https://rega.gov.sa/img/logo-new.svg", 
    externalImageHint: "REGA logo",
    externalLink: "https://rega.gov.sa/"
  },
  {
    badgeText: "معتمدة",
    title: "فال لإدارة الأملاك",
    icon: <HomeIconLucide className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />,
    licenseNumber: "2200000131",
    description: "رخصة معتمدة لإدارة الأملاك العقارية وتقديم خدمات إدارية متكاملة.",
    externalImage: "https://rega.gov.sa/img/logo-new.svg",
    externalImageHint: "REGA logo",
    externalLink: "https://rega.gov.sa/"
  },
  {
    badgeText: "معتمدة",
    title: "فال للوساطة والتسويق",
    icon: <ShieldCheck className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />,
    licenseNumber: "1200015364",
    description: "رخصة معتمدة من برنامج فال للوساطة والتسويق العقاري بكفاءة عالية.",
    externalImage: "https://rega.gov.sa/img/logo-new.svg",
    externalImageHint: "REGA logo",
    externalLink: "https://rega.gov.sa/"
  },
];

interface AvazWebService {
  icon: React.ReactElement;
  title: string;
  description: string;
  dialogTitle: string;
  dialogIcon: React.ReactElement;
  dialogDetails: React.ReactNode;
}

const avazWebServices: AvazWebService[] = [
  {
    icon: <GalleryHorizontalEnd className="text-3xl" />,
    title: "التسويق العقاري الاحترافي",
    description: "نُبرز عقارك بأفضل صورة ونصل به إلى أوسع شريحة من العملاء المستهدفين عبر استراتيجيات تسويق مبتكرة وفعالة.",
    dialogIcon: <GalleryHorizontalEnd className="text-3xl" />,
    dialogTitle: "خدمات التسويق العقاري المتكاملة",
    dialogDetails: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-6">نقدم خدمات تسويق عقاري احترافية تضمن الوصول إلى أكبر شريحة من المشترين المحتملين. نستخدم أحدث التقنيات والاستراتيجيات التسويقية لضمان نجاح عملية البيع أو الإيجار.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ServiceDetailItem icon={<Camera className="text-xl" />} title="التصوير الاحترافي والجولات الافتراضية" description="صور عالية الجودة، فيديوهات ترويجية، وجولات افتراضية 3D تعكس جمال وقيمة عقارك." />
          <ServiceDetailItem icon={<Megaphone className="text-xl" />} title="الحملات الإعلانية المستهدفة" description="إعلانات مدروسة على منصات التواصل الاجتماعي ومحركات البحث للوصول الدقيق للمهتمين." />
          <ServiceDetailItem icon={<Globe className="text-xl" />} title="التسويق الرقمي الشامل" description="استراتيجيات SEO، تسويق بالمحتوى جذاب، وحملات بريد إلكتروني لتعزيز الانتشار." />
          <ServiceDetailItem icon={<Headset className="text-xl" />} title="خدمة عملاء استثنائية" description="فريق متخصص للرد الفوري على الاستفسارات وتنسيق المعاينات بكفاءة واحترافية." />
        </div>
      </>
    )
  },
  {
    icon: <HomeIconLucide className="text-3xl" />,
    title: "إدارة الأملاك الذكية",
    description: "ندير ممتلكاتك بكفاءة عالية، نحافظ على قيمتها ونعظم عوائدها الاستثمارية من خلال فريق متخصص وحلول تقنية متقدمة.",
    dialogIcon: <HomeIconLucide className="text-3xl" />,
    dialogTitle: "خدمات إدارة الأملاك الشاملة",
    dialogDetails: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-6">نقدم خدمات إدارة أملاك متكاملة تضمن الحفاظ على قيمة عقاراتك وتحقيق أعلى عائد استثماري ممكن. يتولى فريقنا المتخصص جميع جوانب إدارة العقار.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ServiceDetailItem icon={<CircleDollarSign className="text-xl" />} title="تحصيل الإيجارات والمستحقات" description="متابعة دقيقة لتحصيل الإيجارات في مواعيدها، ومعالجة أي متأخرات بكفاءة عالية." />
          <ServiceDetailItem icon={<Wrench className="text-xl" />} title="الصيانة الدورية والوقائية" description="برامج صيانة شاملة للحفاظ على سلامة العقار وحل المشكلات الطارئة بسرعة وفعالية." />
          <ServiceDetailItem icon={<FileText className="text-xl" />} title="إدارة العقود والتوثيق" description="إعداد وتجديد وتوثيق عقود الإيجار، وضمان التزام كافة الأطراف بالبنود المتفق عليها." />
          <ServiceDetailItem icon={<LineChart className="text-xl" />} title="التقارير الدورية والشفافية المالية" description="تقارير مفصلة عن أداء العقار تشمل الإيرادات، المصروفات، ومعدلات الإشغال." />
        </div>
      </>
    )
  },
  {
    icon: <LineChart className="text-3xl" />,
    title: "استشارات استثمارية ثاقبة",
    description: "نقدم لك فرصًا استثمارية مدروسة في القطاع العقاري، مدعومة بتحليلات سوق دقيقة ودراسات جدوى احترافية.",
    dialogIcon: <LineChart className="text-3xl" />,
    dialogTitle: "الفرص الاستثمارية والاستشارات العقارية",
    dialogDetails: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-6">نقدم فرصاً استثمارية متميزة في القطاع العقاري مع دراسات جدوى شاملة وتحليل دقيق للسوق لضمان نجاح استثماراتك وتحقيق أهدافك المالية. كما نوفر استشارات عقارية متخصصة.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ServiceDetailItem icon={<BarChartBig className="text-xl" />} title="دراسات الجدوى الشاملة" description="تحليل معمق للتكاليف، العوائد المتوقعة، والمخاطر المحتملة لأي مشروع عقاري." />
          <ServiceDetailItem icon={<SearchCheck className="text-xl" />} title="تحليل اتجاهات السوق" description="رؤى دقيقة حول حركة السوق العقاري، الاتجاهات الحالية والمستقبلية، وأفضل المناطق للاستثمار." />
          <ServiceDetailItem icon={<Building2Icon className="text-xl" />} title="تحديد الفرص الاستثمارية الواعدة" description="ننتقي لك أفضل الفرص في مختلف القطاعات العقارية (سكني، تجاري، صناعي، أراضي)." />
          <ServiceDetailItem icon={<Users className="text-xl" />} title="استشارات مخصصة من خبراء" description="نقدم لك استشارات شخصية من خبراء القطاع لمساعدتك على اتخاذ قرارات استثمارية مستنيرة." />
        </div>
      </>
    )
  },
  {
    icon: <HeartHandshake className="text-3xl" />,
    title: "دعم متكامل للقطاع التجاري",
    description: "نوفر حلولاً استشارية شاملة للأنشطة التجارية، من دراسة ملفات المستثمرين إلى تطوير خطط التوسع واختيار المواقع الاستراتيجية.",
    dialogIcon: <HeartHandshake className="text-3xl" />,
    dialogTitle: "خدمات متكاملة للأنشطة التجارية",
    dialogDetails: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-6">نقدم خدمات شاملة لتنظيم العلاقة بين المالك والمستأجر، ودعم خطط التوسع والانتشار للأنشطة التجارية، مع تقديم حلول متكاملة من استلام المواقع إلى إدارة العقود.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ServiceDetailItem icon={<Users className="text-xl" />} title="تنظيم العلاقات التعاقدية الفعالة" description="صياغة وإدارة عقود إيجار متوازنة تضمن حقوق جميع الأطراف وتتوافق مع الأنظمة." />
          <ServiceDetailItem icon={<MapIcon className="text-xl" />} title="اقتراح واختيار المواقع الاستراتيجية" description="تحليل دقيق لاحتياجات السوق واقتراح أفضل المواقع التي تضمن نجاح نشاطك التجاري." />
          <ServiceDetailItem icon={<Store className="text-xl" />} title="دعم خطط التوسع والانتشار" description="مساعدتك في تحقيق أهدافك التوسعية من خلال توفير الدعم اللوجستي والاستشاري اللازم." />
          <ServiceDetailItem icon={<FileText className="text-xl" />} title="إدارة شاملة للعقود والمواقع" description="خدمات متكاملة تشمل استلام المواقع، تطبيق العقود، ومتابعة الالتزامات بدقة واحترافية." />
        </div>
      </>
    )
  }
];

const whyAvazPoints = [
  {
    icon: <Users className="h-10 w-10 text-primary group-hover:text-accent transition-colors" />,
    title: "فريق من الخبراء المتمرسين",
    description: "نمتلك كفاءات وطنية مؤهلة وخبراء يتمتعون بفهم عميق للسوق العقاري السعودي، ملتزمون بتحقيق أهدافك وتقديم استشارات نوعية."
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-primary group-hover:text-accent transition-colors" />,
    title: "حلول عقارية مبتكرة وذكية",
    description: "نتبنى أحدث التقنيات والأدوات الرقمية لابتكار حلول متطورة تلبي تطلعاتك، وتضمن لك تجربة استثمارية وتسويقية فعالة وسلسة."
  },
  {
    icon: <Handshake className="h-10 w-10 text-primary group-hover:text-accent transition-colors" />,
    title: "شفافية مطلقة وموثوقية عالية",
    description: "علاقاتنا مبنية على الثقة والوضوح التام في جميع مراحل التعامل. نلتزم بأعلى معايير النزاهة والمصداقية لضمان راحة بالك."
  }
];

const testimonials = [
  {
    quote: "تجربتي مع أفاز كانت استثنائية بكل المقاييس. الدقة في المواعيد، الاحترافية في التعامل، والنتائج التي فاقت توقعاتي جعلتهم شريكي العقاري المفضل.",
    name: "عمر الحيدري",
    role: "مستثمر ورئيس تنفيذي",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "ceo portrait confident"
  },
  {
    quote: "أفاز العقارية قدمت لي أفضل الحلول لإدارة أملاكي. فريقهم المحترف يهتم بأدق التفاصيل، وأنا مطمئن تمامًا على استثماراتي بفضلهم.",
    name: "سارة بنت عبدالله",
    role: "مالكة عقارات ومحامية",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "businesswoman portrait elegant"
  },
  {
    quote: "خدمات التسويق العقاري لدى أفاز لا مثيل لها. تم بيع عقاري في وقت قياسي وبسعر مرضي جدًا، وبأقل مجهود مني.",
    name: "أحمد بن خالد",
    role: "مطور عقاري ورائد أعمال",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "developer portrait modern"
  },
];

// بيانات تمثيلية لأحدث صفقات السوق العقاري
const latestMarketTransactions = [
  {
    id: "TX001",
    date: new Date("2025-04-18"),
    neighborhood: "النرجس",
    propertyType: "فيلا",
    area: 450,
    price: 2800000,
    pricePerMeter: 6222,
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    dataAiHint: "modern villa exterior"
  },
  { 
    id: "TX002",
    date: new Date("2025-04-15"),
    neighborhood: "العارض",
    propertyType: "أرض تجارية",
    area: 1200,
    price: 15000000,
    pricePerMeter: 12500,
    image: "https://images.pexels.com/photos/129494/pexels-photo-129494.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    dataAiHint: "commercial land plot"
  },
  { 
    id: "TX003",
    date: new Date("2025-04-12"),
    neighborhood: "الصحافة",
    propertyType: "شقة",
    area: 180,
    price: 950000,
    pricePerMeter: 5277,
    image: "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    dataAiHint: "modern apartment building"
  },
];


export default function Home() {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative group text-center w-full py-20 md:py-32 rounded-xl shadow-2xl overflow-hidden">
        <Image
          src="https://placehold.co/1200x800.png"
          alt="خلفية بانورامية لمدينة الرياض الحديثة"
          fill
          className="object-cover opacity-20 group-hover:opacity-25 transition-opacity duration-500 ease-in-out scale-105 group-hover:scale-100"
          priority
          data-ai-hint="riyadh city modern architecture"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-white mb-6 drop-shadow-lg">
             AVAZ العقارية
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-md">
            شريكك في النجاح
          </p>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="w-full py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-accent mb-12">
            انطلق نحو هدفك العقاري بثقة مع AVAZ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="group shadow-xl hover:shadow-2xl transition-all duration-300 bg-card overflow-hidden transform hover:-translate-y-1.5 flex flex-col hover:scale-105">
              <CardHeader className="items-center pt-8">
                <div className="p-5 bg-primary/10 rounded-full inline-block mb-4 ring-4 ring-primary/20 group-hover:ring-primary/30 transition-all">
                  <ClipboardEdit className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl font-headline text-primary">هل تبحث عن عقار بمواصفات خاصة؟</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-md leading-relaxed text-foreground/80">
                  دعنا نساعدك! قدم طلبك الآن، وسيقوم فريقنا المتخصص بالبحث عن أفضل الخيارات التي تلبي احتياجاتك وتطلعاتك بدقة.
                </CardDescription>
              </CardContent>
              <CardFooter className="justify-center pb-8 pt-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-110 w-full sm:w-auto">
                  <Link href="/new-request">
                    قدم طلبك الآن <ArrowLeft className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="group shadow-xl hover:shadow-2xl transition-all duration-300 bg-card overflow-hidden transform hover:-translate-y-1.5 flex flex-col hover:scale-105">
              <CardHeader className="items-center pt-8">
                <div className="p-5 bg-secondary/10 rounded-full inline-block mb-4 ring-4 ring-secondary/20 group-hover:ring-secondary/30 transition-all">
                  <Building2Icon className="h-12 w-12 text-secondary" />
                </div>
                <CardTitle className="text-2xl font-headline text-secondary">هل لديك عقار وترغب بعرضه؟</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-md leading-relaxed text-foreground/80">
                  سواء كان للبيع أو الإيجار، أضف عقارك بسهولة عبر منصتنا ليصل إلى شريحة واسعة من العملاء الجادين والمستثمرين المحتملين.
                </CardDescription>
              </CardContent>
              <CardFooter className="justify-center pb-8 pt-4">
                <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg transition-transform hover:scale-110 w-full sm:w-auto">
                  <Link href="/add-property">
                    اعرض عقارك معنا <ArrowLeft className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Avaz Section */}
      <section className="w-full py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center text-accent mb-12">
            لماذا تثق بـ AVAZ العقارية كشريكك الأمثل؟
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {whyAvazPoints.map((point, index) => (
              <Card key={index} className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-card overflow-hidden flex flex-col text-center hover:-translate-y-1.5 hover:scale-[1.03]">
                <CardHeader className="items-center pt-8 pb-4">
                  <div className="p-4 bg-primary/10 rounded-full inline-block mb-4 group-hover:bg-accent/10 transition-colors duration-300">
                    {point.icon}
                  </div>
                  <CardTitle className="text-xl font-headline text-primary group-hover:text-accent transition-colors duration-300">{point.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow px-6">
                  <CardDescription className="text-sm leading-relaxed">
                    {point.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-16">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform hover:scale-105">
              <Link href="/about-us">
                اكتشف المزيد عن قصة نجاحنا <ArrowLeft className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Property Match Calculator Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
           <DynamicPropertyMatchCalculator />
        </div>
      </section>


      {/* Our Services / Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-accent mb-4">مجموعة خدماتنا العقارية المتكاملة</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-md leading-relaxed">
              في أفاز، نقدم باقة شاملة من الخدمات العقارية المصممة خصيصًا لتلبية كافة احتياجاتكم وتحقيق أهدافكم الاستثمارية والسكنية، بخبرة تمتد لسنوات واحترافية تضمن لكم الرضا التام.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
            {avazWebServices.map((service, index) => (
              <Card key={index} className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow group flex flex-col hover:-translate-y-1.5 hover:scale-[1.02]">
                <div className="w-16 h-16 flex items-center justify-center bg-primary/10 text-primary rounded-full mb-5 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300 self-center ring-4 ring-primary/5 group-hover:ring-accent/10">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-accent mb-3 text-center font-headline">{service.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm flex-grow text-center leading-relaxed">{service.description}</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-primary hover:text-primary/80 font-semibold group-hover:text-accent self-center mt-auto transition-colors">
                      <span>اكتشف التفاصيل</span>
                      <ArrowLeft className="inline-block h-4 w-4 rtl:mr-1 ltr:ml-1" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0" dir="rtl">
                    <DialogHeader className="p-6 pb-4 border-b sticky top-0 bg-background z-10">
                       <div className="flex items-center space-x-4 space-x-reverse rtl:space-x-reverse">
                          <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-full shrink-0">
                            {React.cloneElement(service.dialogIcon, {className: "text-2xl"})}
                          </div>
                          <DialogTitle className="text-2xl font-bold text-foreground">{service.dialogTitle}</DialogTitle>
                        </div>
                         <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="absolute ltr:right-4 rtl:left-4 top-4 p-1.5 rounded-full hover:bg-muted">
                               <X className="h-5 w-5 text-muted-foreground" />
                               <span className="sr-only">إغلاق</span>
                            </Button>
                         </DialogClose>
                    </DialogHeader>
                    <div className="space-y-6 text-right p-6">
                        {service.dialogDetails}
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Latest Market Transactions Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center text-accent mb-4">
            أحدث الصفقات في سوق الرياض العقاري
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            نعرض أحدث الصفقات العقارية في سوق الرياض لمساعدتك على اتخاذ قرارات استثمارية مدروسة بناءً على بيانات حقيقية من السوق.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {latestMarketTransactions.map((transaction) => (
              <Card key={transaction.id} className="group shadow-xl hover:shadow-2xl transition-all duration-300 bg-card overflow-hidden hover:-translate-y-1.5 hover:scale-[1.03]">
                <div className="block">
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                      src={transaction.image}
                      alt={`صورة عقار في ${transaction.neighborhood}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      data-ai-hint={transaction.dataAiHint}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70"></div>
                    <Badge className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white border-white/20">
                      {transaction.propertyType}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">
                      حي {transaction.neighborhood}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5 ml-1" />
                      {transaction.date.toLocaleDateString('ar-SA', {year: 'numeric', month: 'numeric', day: 'numeric'})}
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPinIconLucide className="h-4 w-4 ml-1 text-muted-foreground" />
                      <span className="text-foreground">{transaction.neighborhood}</span>
                    </div>
                    <div className="flex items-center">
                      <Maximize2 className="h-4 w-4 ml-1 text-muted-foreground" />
                      <span className="text-foreground" dir="ltr">{transaction.area} م²</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 ml-1 text-muted-foreground" />
                      <span className="font-medium text-foreground" dir="ltr">{transaction.price.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 ml-1 text-muted-foreground" />
                      <span className="text-foreground" dir="ltr">{transaction.pricePerMeter.toLocaleString()} ر.س/م²</span>
                    </div>
                  </div>
                  <Link href="/market-navigator">
                    <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground group-hover:bg-primary group-hover:text-white transition-all duration-200">
                      <Search className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> عرض المزيد من الصفقات
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="text-center mt-10">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
              <Link href="/market-navigator">
                استكشف بيانات السوق العقاري <ArrowLeft className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="w-full py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center text-accent mb-12">
            شهادات نعتز بها من عملائنا وشركائنا
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow bg-card p-6 flex flex-col items-center text-center hover:-translate-y-1.5 hover:scale-[1.02]">
                <Avatar className="w-20 h-20 mb-4 border-2 border-primary">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                  <AvatarFallback className="text-xl bg-primary/20 text-primary font-bold">{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <blockquote className="text-muted-foreground italic mb-4 leading-relaxed text-sm">
                  "{testimonial.quote}"
                </blockquote>
                <p className="font-semibold text-primary">{testimonial.name}</p>
                <p className="text-xs text-accent">{testimonial.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Accredited Licenses Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center text-accent mb-4">
            تراخيصنا المعتمدة: أساس ثقتكم بنا
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-16 leading-relaxed">
            نفتخر في "أفاز العقارية" بحصولنا على كافة التراخيص اللازمة من الجهات التنظيمية المختصة، مما يؤكد التزامنا بأعلى معايير الجودة، الاحترافية، والموثوقية في تقديم خدماتنا.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {licenses.map((license, index) => (
              <Card key={index} className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-card overflow-hidden relative flex flex-col hover:-translate-y-1.5 hover:scale-[1.03]">
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 text-xs sm:text-sm group-hover:bg-accent transition-colors">{license.badgeText}</Badge>
                <CardContent className="pt-10 text-center flex flex-col flex-grow">
                  <div className="flex flex-col items-center mb-4 mt-6">
                    {license.externalImage ? (
                      <Link href={license.externalLink || "#"} target="_blank" rel="noopener noreferrer" className="mb-3 block">
                        <Image 
                            src={license.externalImage} 
                            alt={`شعار ${license.title}`} 
                            width={80} 
                            height={40} 
                            className="object-contain h-10 group-hover:opacity-80 transition-opacity"
                            data-ai-hint={license.externalImageHint || "organization logo"}
                         />
                      </Link>
                    ) : (
                       <div className="p-3 bg-primary/10 rounded-full inline-block mb-3 group-hover:bg-accent/10 transition-colors">
                         {license.icon}
                       </div>
                    )}
                    <h3 className="text-lg sm:text-xl font-bold font-headline text-primary group-hover:text-accent transition-colors">{license.title}</h3>
                  </div>
                  {license.licenseNumber && (
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                      <span className="font-medium">رقم الترخيص:</span> {license.licenseNumber}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-grow mb-4">{license.description}</p>
                   {license.externalLink && (
                     <Button asChild variant="link" size="sm" className="mt-auto self-center text-primary group-hover:text-accent">
                        <Link href={license.externalLink} target="_blank" rel="noopener noreferrer">
                            التحقق من الترخيص <ArrowLeft size={14} className="mr-1 rtl:ml-1 rtl:mr-0"/>
                        </Link>
                     </Button>
                   )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
