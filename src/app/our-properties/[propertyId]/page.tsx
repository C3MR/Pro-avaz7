
"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight, Building, Calendar, ChevronLeft, ChevronRight, DollarSign, Home, Info, ListChecks, Loader2, MapPin, Maximize2, MessageSquare, Phone, Tag, Users, Wallet, Cog, Zap, ShieldCheck, Sparkles, Wrench, ReceiptText, Droplets, Siren, ArrowUpDown, Wifi, Building2 as Building2Icon, FileText, Archive, UserCheck as RentedIcon, DoorOpen, Percent, Store, Briefcase, Landmark, Globe } from "lucide-react";
import type { ManagedProperty, ServiceId, PropertyType as FullPropertyType, RiyadhRegion } from "@/types";
import { propertyUsageMap, propertyListingPurposeMap, statusColors, getPropertyTypeDisplay as getPropertyTypeDisplayUtil } from "@/app/our-properties/page";
import { getManagedPropertyById } from "@/lib/managed-properties-db";
import { CarIcon } from "@/components/icons/CarIcon";
import { serviceOptions } from "@/components/forms/AddPropertyForm";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, Tooltip as RechartsTooltip } from 'recharts';
import { riyadhRegionArabicMap } from "@/lib/constants"; // Use centralized map


const serviceDetailsMap: Record<ServiceId, { label: string; icon: React.ReactElement }> =
  serviceOptions.reduce((acc, service) => {
    acc[service.id] = { label: service.label, icon: service.icon };
    return acc;
  }, {} as Record<ServiceId, { label: string; icon: React.ReactElement }>);


export default function PropertyDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams(); // Add searchParams hook even if not immediately used
  const router = useRouter();
  const propertyId = typeof params.propertyId === 'string' ? params.propertyId : undefined;

  const [property, setProperty] = React.useState<ManagedProperty | null | undefined>(undefined);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    const fetchProperty = async () => {
      if (propertyId) {
        try { const foundProperty = await getManagedPropertyById(propertyId); setProperty(foundProperty || null);
        } catch (error) { console.error("Error fetching property details:", error); setProperty(null); }
      } else { setProperty(null); }};
    fetchProperty();
  }, [propertyId]);

  const formatPrice = (price: number, suffix?: string) => `${price.toLocaleString('en-US')} ر.س ${suffix || ''}`.trim();
  const handleNextImage = () => { if (property?.moreImages && property.moreImages.length > 0) { setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (property.moreImages!.length + 1)); }};
  const handlePrevImage = () => { if (property?.moreImages && property.moreImages.length > 0) { setCurrentImageIndex((prevIndex) => (prevIndex - 1 + (property.moreImages!.length + 1)) % (property.moreImages!.length + 1)); }};
  const displayImages = property?.imageUrl ? [property.imageUrl, ...(property.moreImages || [])] : (property?.moreImages || []);

  if (property === undefined) { return (<div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4" dir="rtl"><Loader2 className="w-12 h-12 text-primary animate-spin mb-4" /><h2 className="text-xl font-semibold text-muted-foreground">جاري تحميل بيانات العقار...</h2></div>); }
  if (!property) { return (<Card className="max-w-2xl mx-auto my-12 shadow-xl border-destructive"><CardHeader className="text-center bg-destructive/10"><AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" /><CardTitle className="text-2xl font-bold text-destructive font-headline">العقار غير موجود</CardTitle></CardHeader><CardContent className="text-center"><p className="text-muted-foreground mb-6">لم يتم العثور على عقار بالمعرف "{propertyId || 'المحدد'}". يرجى التحقق والمحاولة مرة أخرى.</p><Button asChild variant="outline" onClick={() => router.back()}><Link href="/our-properties">العودة إلى قائمة العقارات</Link></Button></CardContent></Card>); }

  const propertyTypeDisplay = getPropertyTypeDisplayUtil(property.propertyType, undefined); // Assuming otherPropertyType is not part of ManagedProperty for this display
  const vacantUnits = (typeof property.totalUnits === 'number' && typeof property.rentedUnits === 'number') ? property.totalUnits - property.rentedUnits : undefined;
  const occupancyPercentage = (typeof property.totalUnits === 'number' && typeof property.rentedUnits === 'number' && property.totalUnits > 0) ? Math.round((property.rentedUnits / property.totalUnits) * 100) : 0;
  const occupancyChartData = [{ name: 'Occupancy', value: occupancyPercentage }];
  const regionDisplay = property.region ? riyadhRegionArabicMap[property.region] : undefined;


  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8" dir="rtl">
      <Card className="shadow-2xl border-primary/20 overflow-hidden">
        <CardHeader className="p-0 relative">
          {displayImages.length > 0 ? (<div className="relative w-full aspect-[16/9] group"><Image src={displayImages[currentImageIndex]} alt={`صورة العقار ${property.title} - ${currentImageIndex + 1}`} fill className="object-cover" priority={currentImageIndex === 0} data-ai-hint={property.dataAiHint || "property building detail"}/><div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
              {displayImages.length > 1 && (<><Button variant="ghost" size="lg" onClick={handlePrevImage} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity p-3" aria-label="الصورة السابقة"><ChevronLeft className="h-7 w-7 sm:h-8 sm:w-8" /></Button><Button variant="ghost" size="lg" onClick={handleNextImage} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity p-3" aria-label=\"الصورة التالية"><ChevronRight className=\"h-7 w-7 sm:h-8 sm:w-8" /></Button><div className=\"absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 rtl:space-x-reverse">{displayImages.map((_, index) => (<button key={index} onClick={() => setCurrentImageIndex(index)} className={`h-2.5 w-2.5 rounded-full ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/60'} hover:bg-white transition-all`} aria-label={`الانتقال إلى الصورة ${index + 1}`} />))}</div></>)}</div>
          ) : (<div className="relative w-full aspect-[16/9] group bg-muted flex items-center justify-center" data-ai-hint="placeholder property image"><Building2Icon className="h-24 w-24 text-muted-foreground/50" /></div>)}
           <div className="absolute top-4 right-4"><Badge variant="outline" className={`text-md px-3 py-1.5 ${statusColors[property.status]} backdrop-blur-sm bg-black/40 text-white border-white/50`}>{property.status}</Badge></div></CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="pb-4 border-b border-border"><CardTitle className="text-3xl font-bold text-primary font-headline mb-1">{property.title}</CardTitle>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><CardDescription className="text-md text-muted-foreground flex items-center gap-2"><Tag className="h-4 w-4"/> كود العقار: <span className="font-semibold text-accent">{property.code}</span></CardDescription><Button asChild size="lg" className="mt-4 sm:mt-0 bg-accent hover:bg-accent/80 text-accent-foreground shadow-md hover:shadow-lg transition-shadow"><Link href="/contact-us"><MessageSquare className="ml-2 h-5 w-5" /> تواصل معنا بخصوص هذا العقار</Link></Button></div></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <InfoItem icon={<DollarSign />} label="السعر" value={formatPrice(property.price, property.priceSuffix)} highlight dirValue="ltr"/>
            <InfoItem icon={<Maximize2 />} label="المساحة" value={`${property.area.toLocaleString('en-US')} م²`} dirValue="ltr"/>
            {regionDisplay && <InfoItem icon={<Globe />} label="النطاق" value={regionDisplay} />}
            <InfoItem icon={<MapPin />} label="الحي" value={property.location} />
            <InfoItem icon={<Home />} label="نوع العقار" value={propertyTypeDisplay} />
            <InfoItem icon={<Building />} label="الاستخدام" value={propertyUsageMap[property.usage]} />
            <InfoItem icon={<Wallet />} label="الغرض" value={propertyListingPurposeMap[property.listingPurpose]} />
            {property.yearBuilt && <InfoItem icon={<Calendar />} label="سنة الإنشاء" value={String(property.yearBuilt)} dirValue="ltr"/>}
            {property.floors && <InfoItem icon={<ListChecks />} label="عدد الطوابق" value={String(property.floors)} dirValue="ltr"/>}
            {property.parkingSpots && <InfoItem icon={<CarIcon />} label="عدد المواقف" value={String(property.parkingSpots)} dirValue="ltr"/>}
            {property.numberOfOffices !== undefined && <InfoItem icon={<Briefcase />} label="عدد المكاتب" value={String(property.numberOfOffices)} dirValue="ltr"/>}
            {property.numberOfShowrooms !== undefined && <InfoItem icon={<Store />} label="عدد المعارض" value={String(property.numberOfShowrooms)} dirValue="ltr"/>}</div>
          {property.detailedDescription && (<Section title="الوصف التفصيلي"><p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{property.detailedDescription}</p></Section>)}
          {property.features && property.features.length > 0 && (<Section title="المميزات"><ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">{property.features.map((feature, index) => (<li key={index}>{feature}</li>))}</ul></Section>)}
          {property.services && property.services.length > 0 && (<Section title="الخدمات والمرافق" icon={<Cog className="text-primary"/>}><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">{property.services.map((serviceId) => { const service = serviceDetailsMap[serviceId]; if (!service) return null; return (<div key={serviceId} className="flex flex-col items-center justify-center p-3 border rounded-lg bg-muted/20 hover:shadow-md transition-shadow text-center">{React.cloneElement(service.icon, { className: "h-8 w-8 text-primary mb-2"})}<p className="text-sm text-foreground font-medium">{service.label}</p></div>);})}</div></Section>)}
          {(typeof property.totalUnits === 'number') && (<Section title="تفاصيل الوحدات والإشغال" icon={<Percent className="text-primary"/>}><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 items-center"><InfoItem icon={<Archive />} label="إجمالي الوحدات" value={String(property.totalUnits)} dirValue="ltr"/><InfoItem icon={<RentedIcon />} label="الوحدات المؤجرة" value={property.rentedUnits !== undefined ? String(property.rentedUnits) : '0'} dirValue="ltr"/>{vacantUnits !== undefined && <InfoItem icon={<DoorOpen />} label="الوحدات الشاغرة" value={String(vacantUnits)} dirValue="ltr"/>}</div>
              {property.totalUnits > 0 && (<div className="mt-4 h-48 w-full max-w-xs mx-auto"><ResponsiveContainer width="100%" height="100%"><RadialBarChart innerRadius="70%" outerRadius="100%" data={occupancyChartData} startAngle={90} endAngle={-270}><PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} /><RadialBar background dataKey="value" angleAxisId={0} data={[{ value: 100 }]} fill="hsl(var(--muted))" cornerRadius={10} /><RadialBar dataKey="value" fill="hsl(var(--primary))" cornerRadius={10} /><RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '0.5rem', borderColor: 'hsl(var(--border))' }} formatter={(value: number) => [`${value}%`, "الإشغال"]} /><text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold" style={{ fill: 'hsl(var(--primary))' }}>{occupancyPercentage}%</text></RadialBarChart></ResponsiveContainer></div>)}</Section>)}
          {(property.advertiserNumber || property.deedNumber || property.realEstateRegistryNumber || property.propertyProfilePdfUrl) && (<Section title="معلومات إضافية"><div className="grid md:grid-cols-2 gap-x-6 gap-y-2">{property.advertiserNumber && <InfoItem icon={<Info />} label="رقم المعلن" value={property.advertiserNumber} dirValue="ltr"/>}{property.deedNumber && <InfoItem icon={<Info />} label="رقم الصك" value={property.deedNumber} dirValue="ltr"/>}{property.realEstateRegistryNumber && <InfoItem icon={<Info />} label="رقم السجل العقاري" value={property.realEstateRegistryNumber} dirValue="ltr"/>}{property.propertyProfilePdfUrl && (<div className="md:col-span-2 mt-2"><Button asChild variant="outline" className="w-full"><Link href={property.propertyProfilePdfUrl} target="_blank" rel="noopener noreferrer"><FileText className="ml-2 h-4 w-4" />عرض بروفايل العقار (PDF)</Link></Button></div>)}</div></Section>)}
          {property.agent && (<Section title="مسؤول التسويق"><div className="grid md:grid-cols-2 gap-x-6 gap-y-2"><InfoItem icon={<Users />} label="الاسم" value={property.agent.name} /><InfoItem icon={<Phone />} label="رقم التواصل" value={property.agent.phone} dirValue="ltr"/>{property.agent.email && <InfoItem icon={<MessageSquare />} label="البريد الإلكتروني" value={property.agent.email} dirValue="ltr"/>}</div></Section>)}
          <Section title="مميزات الحي" icon={<Landmark className="text-primary"/>}><p className="text-muted-foreground">سيتم إضافة معلومات حول مميزات الحي والمرافق القريبة قريبًا. (مثال: قربه من مسجد، مدرسة، مركز تسوق، سهولة الوصول للطرق الرئيسية)</p></Section>
           <Section title="عقارات مشابهة" icon={<Building2Icon className="text-primary"/>}><p className="text-muted-foreground">سيتم عرض عقارات مشابهة قد تهمك هنا قريبًا.</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"><Card className="shadow-sm hover:shadow-md transition-shadow"><CardHeader className="p-3"><Image src="https://placehold.co/300x200.png" width={300} height={200} alt=\"عقار مشابه 1" className=\"rounded-md w-full" data-ai-hint=\"property exterior"/></CardHeader><CardContent className=\"p-3 text-sm"><h4 className=\"font-semibold text-foreground mb-1">فيلا فاخرة بحي الياسمين</h4><p className=\"text-muted-foreground text-xs">4 غرف نوم | 500 م² | 2,500,000 ر.س</p></CardContent><CardFooter className=\"p-3"><Button variant=\"outline" size="sm\" className="w-full">عرض التفاصيل</Button></CardFooter></Card><Card className="shadow-sm hover:shadow-md transition-shadow"><CardHeader className="p-3"><Image src="https://placehold.co/300x200.png" width={300} height={200} alt=\"عقار مشابه 2" className=\"rounded-md w-full" data-ai-hint=\"apartment building modern"/></CardHeader><CardContent className=\"p-3 text-sm"><h4 className=\"font-semibold text-foreground mb-1">شقة للإيجار بحي الصحافة</h4><p className=\"text-muted-foreground text-xs">3 غرف نوم | 180 م² | 80,000 ر.س/سنوي</p></CardContent><CardFooter className=\"p-3"><Button variant=\"outline" size="sm\" className="w-full">عرض التفاصيل</Button></CardFooter></Card></div></Section></CardContent>
        <CardFooter className="bg-muted/30 p-4 flex flex-col sm:flex-row justify-between items-center gap-3"><Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto"><ArrowRight className="ml-2 h-4 w-4" />العودة إلى القائمة</Button><Button asChild size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto text-primary-foreground shadow-md hover:shadow-lg transition-shadow"><Link href="/contact-us"><MessageSquare className=\"ml-2 h-5 w-5" />تواصل معنا بخصوص هذا العقار</Link></Button></CardFooter></Card></div>); }

const Section: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactElement }> = ({ title, children, icon }) => (<div className="space-y-2 py-3 border-b border-border/50 last:border-b-0"><h3 className="text-xl font-semibold text-foreground mb-2 flex items-center">{icon && React.cloneElement(icon, { className: `ml-2 rtl:mr-0 rtl:ml-2 ${icon.props.className || 'h-6 w-6'}`})}{title}</h3><div className="pl-2 rtl:pr-2">{children}</div></div>);
interface InfoItemProps { icon: React.ReactNode; label: string; value?: string | number | null; dirValue?: "ltr" | "rtl"; highlight?: boolean; }
function InfoItem({ icon, label, value, dirValue = "rtl", highlight = false }: InfoItemProps) {
  if (value === undefined || value === null || String(value).trim() === "") return null;
  return (<div className="flex items-start space-x-3 rtl:space-x-reverse py-1"><span className={`mt-1 ${highlight ? 'text-primary' : 'text-muted-foreground/80'}`}>{React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}</span><div><p className={`text-sm font-medium ${highlight ? 'text-primary' : 'text-foreground'}`}>{label}</p><p className={`text-md ${highlight ? 'font-semibold text-accent' : 'text-muted-foreground'}`} dir={dirValue}>{String(value)}</p></div></div>); }

    
