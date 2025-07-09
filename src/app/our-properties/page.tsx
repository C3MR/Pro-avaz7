
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, MessageSquare, ChevronDown, Filter, List, LayoutGrid, ShoppingBag, Loader2, MapPin, Globe } from "lucide-react";
import type { ManagedProperty, PropertyStatus, PropertyType, PropertyUsage, PropertyListingPurpose, RiyadhRegion } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getAllManagedProperties } from "@/lib/managed-properties-db";
import { riyadhRegionArabicMap } from "@/lib/constants"; // Use centralized map

export const propertyUsageMap: Record<PropertyUsage, string> = { Residential: "سكني", Commercial: "تجاري", };
export const propertyListingPurposeMap: Record<PropertyListingPurpose, string> = { "For Sale": "بيع", "For Rent": "إيجار", "For Investment": "استثمار", };
export const propertyTypeArabicMap: Record<string, string> = { "Residential Land": "أرض سكنية", "Palace": "قصر", "Villa": "فيلا", "Duplex": "دوبلكس", "Apartment": "شقة", "Floor": "دور", "Building": "عمارة", "Residential Complex": "مجمع سكني", "Commercial Land": "أرض تجارية", "Showroom": "معرض", "Office": "مكتب", "Commercial Complex": "مجمع تجاري", "Commercial Building": "عمارة تجارية", "Warehouse": "مستودع", "Workshop": "ورشة", "Gas Station": "محطة وقود", "Other": "أخرى", };
export const statusColors: Record<PropertyStatus, string> = { "متاح": "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700", "قيد التفاوض": "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700", "محجوز": "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700", "مباع": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700", "مؤجر": "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700", };
export function getPropertyTypeDisplay(propertyType?: PropertyType, otherPropertyType?: string): string { if (propertyType === "Other" && otherPropertyType) { return `${propertyTypeArabicMap[propertyType] || propertyType} (${otherPropertyType})`; } return propertyType ? (propertyTypeArabicMap[propertyType] || propertyType) : "غير محدد"; }

export default function OurPropertiesPage() {
  const [properties, setProperties] = React.useState<ManagedProperty[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest" | "priceHigh" | "priceLow">("newest");
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table");

  React.useEffect(() => {
    async function fetchProperties() {
      setIsLoading(true);
      try { const fetchedProperties = await getAllManagedProperties(); setProperties(fetchedProperties);
      } catch (error) { console.error("Failed to fetch managed properties:", error); } finally { setIsLoading(false); }}
    fetchProperties();
  }, []);

  const sortedProperties = React.useMemo(() => {
    let sorted = [...properties];
    if (sortOrder === "newest") { sorted.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOrder === "oldest") { sorted.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOrder === "priceHigh") { sorted.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "priceLow") { sorted.sort((a, b) => a.price - b.price); }
    return sorted;
  }, [properties, sortOrder]);

  const formatPrice = (price: number, suffix?: string) => `${price.toLocaleString('en-US')} ر.س ${suffix || ''}`.trim();

   if (isLoading) { return (<div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-4 text-lg text-muted-foreground">جاري تحميل العقارات...</p></div>); }

  return (
    <div className="space-y-8" dir="rtl">
      <Card className="shadow-lg border-primary/20"><CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30 p-4 sm:p-6 rounded-t-lg"><div><CardTitle className="text-2xl sm:text-3xl font-bold text-primary font-headline">قائمة العقارات</CardTitle><CardDescription className="text-sm sm:text-md text-muted-foreground mt-1">العقارات المختارة والمتاحة حالياً تحت إدارة AVAZ.</CardDescription></div>
          {sortedProperties.length > 0 && (<div className="flex items-center gap-2 sm:gap-3"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="whitespace-nowrap"><Filter className="ml-2 h-4 w-4" />ترتيب حسب: {sortOrder === "newest" ? "الأحدث" : sortOrder === "oldest" ? "الأقدم" : sortOrder === "priceHigh" ? "السعر (الأعلى)" : "السعر (الأدنى)"}<ChevronDown className="mr-2 h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => setSortOrder("newest")}>الأحدث</DropdownMenuItem><DropdownMenuItem onSelect={() => setSortOrder("oldest")}>الأقدم</DropdownMenuItem><DropdownMenuItem onSelect={() => setSortOrder("priceHigh")}>السعر (الأعلى أولاً)</DropdownMenuItem><DropdownMenuItem onSelect={() => setSortOrder("priceLow")}>السعر (الأدنى أولاً)</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
              <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}>{viewMode === "table" ? <LayoutGrid className="h-5 w-5" /> : <List className="h-5 w-5" />}</Button></TooltipTrigger><TooltipContent><p>{viewMode === "table" ? "عرض شبكي" : "عرض جدولي"}</p></TooltipContent></Tooltip></TooltipProvider></div>)}</CardHeader>
        <CardContent className="p-0">
          {sortedProperties.length > 0 ? ( viewMode === "table" ? (<div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead className="text-right w-[100px]">الكود</TableHead><TableHead className="text-right min-w-[250px]">العقار</TableHead><TableHead className="text-right">الاستخدام</TableHead><TableHead className="text-right">الغرض</TableHead><TableHead className="text-right">النطاق</TableHead><TableHead className="text-right">الحي</TableHead><TableHead className="text-right">السعر</TableHead><TableHead className="text-right hidden md:table-cell">رقم المعلن</TableHead><TableHead className="text-right">الحالة</TableHead><TableHead className="text-center w-[120px]">الإجراءات</TableHead></TableRow></TableHeader>
              <TableBody>{sortedProperties.map((prop) => { const regionDisplay = prop.region ? riyadhRegionArabicMap[prop.region] : "غير محدد"; return (<TableRow key={prop.id} className="hover:bg-muted/10 transition-colors"><TableCell className="font-mono text-xs text-muted-foreground">{prop.code}</TableCell><TableCell><div className="flex items-center gap-3"><Image src={prop.imageUrl || "https://placehold.co/80x60.png"} alt={prop.title} width={60} height={45} className="rounded-md object-cover aspect-[4/3]" data-ai-hint={prop.dataAiHint || "property building exterior"}/><div className="max-w-[200px]"><Link href={`/our-properties/${prop.id}`} className="font-semibold text-primary hover:underline text-sm truncate block">{prop.title}</Link><p className="text-xs text-muted-foreground truncate">{prop.description}</p></div></div></TableCell><TableCell>{propertyUsageMap[prop.usage]}</TableCell><TableCell>{propertyListingPurposeMap[prop.listingPurpose]}</TableCell><TableCell className="text-xs">{regionDisplay}</TableCell><TableCell className="text-xs">{prop.location}</TableCell><TableCell className="font-semibold" dir="ltr">{formatPrice(prop.price, prop.priceSuffix)}</TableCell><TableCell className="text-xs text-muted-foreground hidden md:table-cell">{prop.advertiserNumber}</TableCell><TableCell><Badge variant="outline" className={`text-xs ${statusColors[prop.status]}`}>{prop.status}</Badge></TableCell><TableCell className="text-center"><TooltipProvider delayDuration={100}><div className="flex items-center justify-center gap-1"><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary/80" asChild><Link href={`/our-properties/${prop.id}`}><Eye className="h-4 w-4" /></Link></Button></TooltipTrigger><TooltipContent><p>عرض التفاصيل</p></TooltipContent></Tooltip><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-accent hover:text-accent/80"><MessageSquare className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>تواصل للاستفسار</p></TooltipContent></Tooltip></div></TooltipProvider></TableCell></TableRow>);})}</TableBody></Table></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:p-6">{sortedProperties.map((prop) => { const regionDisplay = prop.region ? riyadhRegionArabicMap[prop.region] : undefined; return (<Card key={prop.id} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col group"><Link href={`/our-properties/${prop.id}`} className="block"><div className="relative aspect-[16/10] w-full overflow-hidden"><Image src={prop.imageUrl || "https://placehold.co/400x250.png"} alt={prop.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint={prop.dataAiHint || "modern property building"}/><Badge variant="outline" className={`absolute top-2 right-2 text-xs backdrop-blur-sm bg-black/30 text-white border-white/50 ${statusColors[prop.status]}`}>{prop.status}</Badge></div></Link><CardHeader className="p-4 flex-grow"><Link href={`/our-properties/${prop.id}`}><CardTitle className="text-lg font-semibold text-primary group-hover:underline leading-tight mb-1">{prop.title}</CardTitle></Link><CardDescription className="text-xs text-muted-foreground mb-1 flex items-center"><MapPin className="w-3 h-3 ml-1"/>{prop.location}{regionDisplay && <><Globe className="w-3 h-3 mr-2 ml-1"/>{regionDisplay}</>}</CardDescription><CardDescription className="text-xs text-muted-foreground">{prop.description}</CardDescription><p className="text-lg font-bold text-accent mt-2" dir="ltr">{formatPrice(prop.price, prop.priceSuffix)}</p></CardHeader><CardContent className="p-4 pt-0"><div className="flex items-center justify-between text-xs text-muted-foreground mb-2"><span>{propertyUsageMap[prop.usage]}</span><span>{propertyListingPurposeMap[prop.listingPurpose]}</span></div><div className="flex items-center justify-center gap-1"><Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 flex-1" asChild><Link href={`/our-properties/${prop.id}`}><Eye className="ml-1 h-4 w-4" /> عرض</Link></Button><Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 flex-1"><MessageSquare className="ml-1 h-4 w-4" /> تواصل</Button></div></CardContent></Card>);})}</div>
          )) : (
            <div className="text-center py-12 text-muted-foreground"><ShoppingBag className="mx-auto h-12 w-12 mb-4 text-primary/50"/><p className="text-lg font-semibold">لا توجد عقارات تحت إدارة أفاز معروضة حالياً.</p><p className="text-sm mt-1">هذه الصفحة مخصصة لعرض العقارات التي تديرها أفاز بشكل مباشر.<br/>إذا كنت مالك عقار وترغب في عرضه من خلالنا، يرجى <Link href="/add-property" className="text-primary hover:underline font-medium">تقديم طلب عرض عقار من هنا</Link>.</p></div>)}</CardContent>
        {sortedProperties.length > 0 && (<CardFooter className="flex items-center justify-between p-4 border-t bg-muted/20 text-sm text-muted-foreground"><div dir="ltr">عرض {Math.min(1, sortedProperties.length > 0 ? 1 : 0)} إلى {sortedProperties.length} من {properties.length} عقار</div><div className="flex gap-1"><Button variant="outline" size="sm" disabled>السابق</Button><Button variant="outline" size="sm" disabled>التالي</Button></div></CardFooter>)}</Card></div>); }

    
