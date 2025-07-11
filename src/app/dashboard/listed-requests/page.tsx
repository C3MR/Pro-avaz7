
"use client";

import * as React from "react";
import { useParams } from 'next/navigation'; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, Phone, MessageCircle, Search, FileText, Loader2, ListFilter, Square } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import type { PropertyRequest, RequestPurpose, PropertyUsage as CorePropertyUsage, PropertyType as CorePropertyType, RiyadhRegion } from "@/types";
import { getAllRequests, seedInitialPropertyRequests } from "@/lib/requests-db"; // Added seedInitialPropertyRequests
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { riyadhRegionArabicMap } from "@/lib/constants";

const propertyTypeDisplayMap: Record<string, string> = {
  "Residential Land": "أرض سكنية", "Palace": "قصر", "Villa": "فيلا", "Duplex": "دوبلكس",
  "Apartment": "شقة", "Floor": "دور", "Building": "عمارة",
  "Residential Complex": "مجمع سكني",
  "Commercial Land": "أرض تجارية", "Showroom": "معرض", "Office": "مكتب",
  "Commercial Complex": "مجمع تجاري", "Commercial Building": "عمارة تجارية",
  "Warehouse": "مستودع", "Workshop": "ورشة", "Gas Station": "محطة وقود",
  "Other": "أخرى",
};

function getPropertyTypeDisplay(propertyType?: CorePropertyType, otherPropertyType?: string): string {
  if (!propertyType) return "-";
  const baseDisplay = propertyTypeDisplayMap[propertyType] || propertyType;
  if (propertyType === "Other" && otherPropertyType) {
    return `${baseDisplay} (${otherPropertyType})`;
  }
  return baseDisplay;
}

function formatPhoneNumberForWhatsApp(phone: string): string {
  if (phone.startsWith('05') && phone.length === 10) {
    return `966${phone.substring(1)}`;
  }
  return phone.replace(/\D/g, '');
}

export default function ListedRequestsPage() {
  const [allRequests, setAllRequests] = React.useState<PropertyRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTermId, setSearchTermId] = React.useState("");
  const [searchTermPhone, setSearchTermPhone] = React.useState("");

  React.useEffect(() => {
    async function initializeAndFetchData() {
      setIsLoading(true);
      try {
        await seedInitialPropertyRequests(); // Attempt to seed data if needed
        const requestsFromDb = await getAllRequests();
        setAllRequests(requestsFromDb);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        setAllRequests([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    }
    initializeAndFetchData();
  }, []);

  const filteredRequests = React.useMemo(() => {
    return allRequests.filter((req) => {
      const matchesId = searchTermId ? req.id.toLowerCase().includes(searchTermId.toLowerCase()) : true;
      const matchesPhone = searchTermPhone ? req.clientContact.includes(searchTermPhone) : true;
      return matchesId && matchesPhone;
    }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [allRequests, searchTermId, searchTermPhone]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">جاري تحميل الطلبات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-primary/20 overflow-hidden">
        <CardHeader className="bg-muted/20 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <CardTitle className="text-2xl font-bold text-primary font-headline">الطلبات العقارية المدرجة</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">قائمة بالطلبات العقارية المسجلة وتفاصيلها للمتابعة.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 border-b bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="search-id" className="text-xs font-medium text-muted-foreground flex items-center">
                  <FileText className="h-3.5 w-3.5 mr-1.5 rtl:ml-1.5 rtl:mr-0 text-primary/80" />
                  بحث بالرقم التعريفي
                </label>
                <Input
                  id="search-id"
                  type="text"
                  placeholder="أدخل الرقم التعريفي للطلب..."
                  value={searchTermId}
                  onChange={(e) => setSearchTermId(e.target.value)}
                  className="form-input h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="search-phone" className="text-xs font-medium text-muted-foreground flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-1.5 rtl:ml-1.5 rtl:mr-0 text-primary/80" />
                  بحث برقم الجوال
                </label>
                <Input
                  id="search-phone"
                  type="text"
                  placeholder="أدخل رقم جوال العميل..."
                  value={searchTermPhone}
                  onChange={(e) => setSearchTermPhone(e.target.value)}
                  className="form-input h-9 text-sm"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {filteredRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-full text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right px-2 py-2 min-w-[120px]">الرقم</TableHead>
                    <TableHead className="text-center px-2 py-2 min-w-[120px]">الاسم</TableHead>
                    <TableHead className="text-center px-2 py-2 min-w-[110px]">الجوال</TableHead>
                    <TableHead className="text-center px-2 py-2 min-w-[110px]">نوع العقار</TableHead>
                    <TableHead className="text-center px-2 py-2 min-w-[100px]">النطاق/الحي</TableHead>
                    <TableHead className="text-center px-2 py-2 min-w-[100px]">المساحة (م²)</TableHead>
                    <TableHead className="text-center px-2 py-2 min-w-[80px]">الحالة</TableHead>
                    <TableHead className="text-center px-2 py-2 w-[60px]">الإجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((req) => {
                    const whatsappNumber = formatPhoneNumberForWhatsApp(req.clientContact);
                    const areaDisplay = (req.minArea && req.maxArea)
                      ? `${req.minArea.toLocaleString('en-US')} - ${req.maxArea.toLocaleString('en-US')}`
                      : req.minArea?.toLocaleString('en-US') || req.maxArea?.toLocaleString('en-US') || '-';
                    const regionDisplay = req.region ? riyadhRegionArabicMap[req.region] : (req.neighborhoodPreferences && req.neighborhoodPreferences.length > 0 ? req.neighborhoodPreferences[0] : '-');
                    
                    return (
                      <TableRow key={req.id} className="hover:bg-muted/5 transition-colors">
                        <TableCell className="font-mono px-2 py-2 text-right">
                           <Link href={`/track-request/${req.id}`} className="text-primary hover:underline font-semibold">
                            {req.id}
                           </Link>
                        </TableCell>
                        <TableCell className="font-medium px-2 py-2 truncate max-w-[120px] text-center">{req.clientName}</TableCell>
                        <TableCell className="px-2 py-2 text-center">
                          <div className="flex items-center justify-center gap-1" dir="ltr">
                            <span className="text-xs">{req.clientContact}</span>
                            <TooltipProvider delayDuration={100}>
                              <Tooltip><TooltipTrigger asChild>
                                <a href={`tel:${req.clientContact}`} title="اتصال" className="text-primary hover:text-primary/80 p-0.5 rounded-full hover:bg-primary/10">
                                    <Phone className="h-3 w-3" />
                                </a>
                              </TooltipTrigger><TooltipContent><p>اتصال</p></TooltipContent></Tooltip>
                              <Tooltip><TooltipTrigger asChild>
                                <a
                                    href={`https://wa.me/${whatsappNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="واتساب"
                                    className="text-green-500 hover:text-green-600 p-0.5 rounded-full hover:bg-green-500/10"
                                >
                                    <MessageCircle className="h-3 w-3" />
                                </a>
                              </TooltipTrigger><TooltipContent><p>مراسلة واتساب</p></TooltipContent></Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-2 truncate max-w-[110px] text-center">{getPropertyTypeDisplay(req.propertyType, req.otherPropertyType)}</TableCell>
                        <TableCell className="px-2 py-2 truncate max-w-[100px] text-center">
                           {regionDisplay === '-' && req.neighborhoodPreferences && req.neighborhoodPreferences.length > 0 
                             ? req.neighborhoodPreferences.join(', ') 
                             : regionDisplay}
                        </TableCell>
                        <TableCell className="px-2 py-2 text-center" dir="ltr">
                          <div className="flex items-center justify-center gap-1">
                            <Square className="h-3 w-3 text-muted-foreground"/>
                            {areaDisplay}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-2 text-center"><StatusBadge status={req.status} /></TableCell>
                        <TableCell className="text-center px-2 py-2">
                         <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary/80 hover:bg-primary/10">
                                        <Link href={`/track-request/${req.id}`}>
                                        <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>عرض التفاصيل</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground bg-card">
              <ListFilter className="mx-auto h-16 w-16 mb-6 text-primary/30" />
              <p className="text-xl font-semibold mb-2">لا توجد طلبات تطابق معايير البحث الحالية.</p>
              <p className="text-sm">حاول تغيير معايير البحث أو تأكد من وجود طلبات مسجلة.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

