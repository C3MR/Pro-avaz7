
"use client";

import * as React from "react";
import { useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CalendarDays, DollarSign, HomeIcon, Info, ListChecks, MapPin, MessageSquare, Phone, User, Edit3, Briefcase, BedDouble, Bath, Maximize, Minimize, LayoutGrid, Building, GitBranch, Archive, LocateFixed, UserCheck, Loader2, Globe } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import type { FollowUpEntry, PropertyRequest, PropertyType as FullPropertyType, RequestPurpose, CommercialCategory, ClientRole, RiyadhRegion } from "@/types";
import FollowUpForm from "@/components/forms/FollowUpForm";
import ExportClientRequestPdfButton from "@/components/pdf/ExportClientRequestPdfButton";
import { getRequestById } from "@/lib/requests-db";
import { RIYADH_REGIONS } from "@/lib/constants";

export const propertyTypeArabicMap: Record<string, string> = {
  "Residential Land": "أرض سكنية", "Palace": "قصر", "Villa": "فيلا", "Duplex": "دوبلكس",
  "Apartment": "شقة", "Floor": "دور", "Building": "عمارة",
  "Residential Complex": "مجمع سكني",
  "Commercial Land": "أرض تجارية", "Showroom": "معرض", "Office": "مكتب",
  "Commercial Complex": "مجمع تجاري", "Commercial Building": "عمارة تجارية",
  "Warehouse": "مستودع", "Workshop": "ورشة", "Gas Station": "محطة وقود",
  "Other": "أخرى",
};

export const requestPurposeArabicMap: Record<RequestPurpose, string> = {
  "Buy": "شراء", "Rent": "إيجار", "Financing": "تمويل",
  "Partnership": "شراكة", "Buy via Bank": "شراء عن طريق بنك"
};

export const clientRoleArabicMap: Record<ClientRole, string> = {
  "Applicant": "صاحب الطلب", "Agent": "وكيل", "Broker": "وسيط",
  "CompanyEmployee": "موظف شركة", "Other": "أخرى"
};

export const usageArabicMap = { "Residential": "سكني", "Commercial": "تجاري" };

export const commercialCategoryArabicMap: Record<CommercialCategory, string> = {
  "Retail Trade": "تجارة التجزئة", "Food & Beverages": "الأغذية والمشروبات",
  "Professional Services": "الخدمات المهنية", "Public Services": "الخدمات العامة",
  "Education & Training": "التعليم والتدريب", "Entertainment & Tourism": "الترفيه والسياحة",
  "Sports & Fitness": "الرياضة واللياقة", "Logistics & Storage": "اللوجستيات والتخزين", "Other": "أخرى"
};

export const contactPointArabicMap: Record<string, string> = {
  "Property Sign": "لوحة على عقار", "X Platform (Twitter)": "منصة إكس (تويتر)",
  "Google Maps": "قوقل ماب", "WhatsApp": "واتس آب", "Snapchat": "سناب شات",
  "Personal Recommendation": "توصية شخص", "Other": "أخرى"
};

export const riyadhRegionArabicMap: Record<RiyadhRegion, string> =
  RIYADH_REGIONS.reduce((acc, curr) => {
    acc[curr.value] = curr.labelAr;
    return acc;
  }, {} as Record<RiyadhRegion, string>);


export function getPropertyTypeDisplay(propertyType?: FullPropertyType, otherPropertyType?: string): string {
  if (propertyType === "Other" && otherPropertyType) { return `${propertyTypeArabicMap[propertyType] || propertyType} (${otherPropertyType})`; }
  return propertyType ? (propertyTypeArabicMap[propertyType] || propertyType) : "غير محدد";
}

export function getClientRoleDisplay(role?: ClientRole, otherRole?: string): string {
  if (role === "Other" && otherRole) { return `${clientRoleArabicMap[role]} (${otherRole})`; }
  return role ? clientRoleArabicMap[role] : "غير محدد";
}

export function getCommercialCategoryDisplay(category?: CommercialCategory, otherCategory?: string): string {
  if (category === "Other" && otherCategory) { return `${commercialCategoryArabicMap[category] || category} (${otherCategory})`; }
  return category ? (commercialCategoryArabicMap[category] || category) : "غير محدد";
}

export function getCommercialActivityDisplay(activity?: string, otherActivity?: string, category?: CommercialCategory): string {
    if (!activity) return "غير محدد";
    if ((activity.startsWith("أخرى") || activity.startsWith("Other") || activity === "Other Activity") && otherActivity) { return `${activity.replace(/\s*\(.+?\)/, '')} (${otherActivity})`; }
    return activity;
}

export default function RequestDetailsPage() {
  const routeParams = useParams();
  const searchParams = useSearchParams(); // Add searchParams hook even if not immediately used
  const trackingCode = typeof routeParams.trackingCode === 'string' ? routeParams.trackingCode : undefined;
  const [request, setRequest] = React.useState<PropertyRequest | null | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchRequest() {
      if (trackingCode) {
        setIsLoading(true);
        try { const fetchedRequest = await getRequestById(trackingCode); setRequest(fetchedRequest || null);
        } catch (error) { console.error("Error fetching request:", error); setRequest(null); } finally { setIsLoading(false); }
      } else { setRequest(null); setIsLoading(false); }}
    fetchRequest();
  }, [trackingCode]);

  if (isLoading || request === undefined) { return (<div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-4 text-lg text-muted-foreground">جاري تحميل تفاصيل الطلب...</p></div>); }
  if (!request) { return (<Card className="max-w-2xl mx-auto my-12 shadow-xl border-destructive"><CardHeader className="text-center bg-destructive/10"><AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" /><CardTitle className="text-2xl font-bold text-destructive font-headline">الطلب غير موجود</CardTitle></CardHeader><CardContent className="text-center"><p className="text-muted-foreground mb-6">رمز التتبع "{trackingCode || 'المقدم'}" لا يتطابق مع أي طلبات موجودة. يرجى التحقق من الرمز والمحاولة مرة أخرى.</p><Button asChild variant="outline"><Link href="/track-request">جرّب رمزًا آخر</Link></Button></CardContent></Card>); }

  const propertyTypeDisplay = getPropertyTypeDisplay(request.propertyType, request.otherPropertyType);
  const requestPurposeDisplay = request.requestPurpose ? requestPurposeArabicMap[request.requestPurpose] : "غير محدد";
  const clientRoleDisplay = getClientRoleDisplay(request.clientRole, request.otherClientRole);
  const usageDisplay = request.usage ? usageArabicMap[request.usage] : "غير محدد";
  const commercialCategoryDisplay = getCommercialCategoryDisplay(request.commercialCategory, request.otherCommercialCategory);
  const commercialActivityDisplay = getCommercialActivityDisplay(request.commercialActivity, request.otherCommercialActivity, request.commercialCategory);
  let contactPointDisplayValue = request.contactPoint ? (contactPointArabicMap[request.contactPoint] || request.contactPoint) : "غير محدد";
   if (request.contactPoint === "Other" && request.otherContactPoint) { contactPointDisplayValue += ` (${request.otherContactPoint})`; }
  const budgetDisplay = (request.budgetMin || request.budgetMax) ? `${request.budgetMin?.toLocaleString('en-US') || 'غير محدد'} - ${request.budgetMax?.toLocaleString('en-US') || 'غير محدد'} ر.س` : "غير محدد";
  const regionDisplay = request.region ? riyadhRegionArabicMap[request.region] : undefined;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8" dir="rtl">
      <Card className="shadow-xl border-primary/30 overflow-hidden"><CardHeader className="bg-muted/30 p-6"><div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div><CardTitle className="text-3xl font-bold text-primary font-headline mb-1">تفاصيل الطلب</CardTitle><CardDescription className="text-md">رمز التتبع: <span className="font-semibold text-accent">{request.id}</span></CardDescription></div><StatusBadge status={request.status} /></div></CardHeader>
        <CardContent className="p-6 space-y-6">
          <Section title="بيانات العميل" icon={<User className="h-5 w-5 text-primary"/>}>
            <InfoItem icon={<User />} label="اسم العميل" value={request.clientName} />
            <InfoItem icon={<Phone />} label="رقم التواصل" value={request.clientContact} dirValue="ltr" />
            {request.clientEmail && <InfoItem icon={<MessageSquare />} label="البريد الإلكتروني" value={request.clientEmail} dirValue="ltr"/>}
             <InfoItem icon={<UserCheck />} label="صفة العميل" value={clientRoleDisplay} /></Section>
          <Section title="تفاصيل الطلب" icon={<Archive className="h-5 w-5 text-primary"/>}>
            <InfoItem icon={<Archive />} label="الغرض من الطلب" value={requestPurposeDisplay} />
            <InfoItem icon={<LayoutGrid />} label="الاستخدام" value={usageDisplay} />
            <InfoItem icon={<HomeIcon />} label="نوع العقار" value={propertyTypeDisplay} />
            {request.bedrooms !== undefined && <InfoItem icon={<BedDouble />} label="عدد غرف النوم" value={request.bedrooms.toString()} dirValue="ltr"/>}
            {request.bathrooms !== undefined && <InfoItem icon={<Bath />} label="عدد دورات المياه" value={request.bathrooms.toString()} dirValue="ltr"/>}</Section>
          {request.usage === "Commercial" && (<Section title="التفاصيل التجارية" icon={<Briefcase className="h-5 w-5 text-primary"/>}>
              <InfoItem icon={<LayoutGrid />} label="فئة النشاط" value={commercialCategoryDisplay} />
              <InfoItem icon={<Briefcase />} label="النشاط التجاري" value={commercialActivityDisplay} />
              {request.companyName && <InfoItem icon={<Building />} label="اسم المنشأة" value={request.companyName} />}
              {request.branchCount !== undefined && <InfoItem icon={<GitBranch />} label="عدد الفروع" value={request.branchCount.toString()} dirValue="ltr"/>}</Section>)}
           <Section title="الموقع والمتطلبات" icon={<MapPin className="h-5 w-5 text-primary"/>}>
             {regionDisplay && <InfoItem icon={<Globe />} label="النطاق" value={regionDisplay} />}
             {(request.minArea !== undefined || request.maxArea !== undefined) && (<InfoItem icon={<Maximize />} label="المساحة المطلوبة (م²)" value={`${request.minArea !== undefined ? request.minArea.toLocaleString('en-US') : 'غير محدد'} - ${request.maxArea !== undefined ? request.maxArea.toLocaleString('en-US') : 'غير محدد'}`} dirValue="ltr" />)}
            {(request.budgetMin !== undefined || request.budgetMax !== undefined) && (<InfoItem icon={<DollarSign />} label="الميزانية المرصودة" value={budgetDisplay} dirValue="ltr" />)}
            {request.neighborhoodPreferences && request.neighborhoodPreferences.length > 0 && <InfoItem icon={<MapPin />} label="الأحياء المفضلة" value={request.neighborhoodPreferences.join('، ')} />}
            {request.locationQuery && <InfoItem icon={<MapPin />} label="الوصف النصي للموقع" value={request.locationQuery} />}
            {request.locationCoordinates && (<InfoItem icon={<MapPin />} label="الإحداثيات" value={`خط الطول: ${request.locationCoordinates.lat.toFixed(4)}، خط العرض: ${request.locationCoordinates.lng.toFixed(4)}`} dirValue="ltr"/>)}
            {request.mapScreenshot && (<div className="mt-3 rounded-md overflow-hidden border shadow-sm" data-ai-hint="map location"><Image src={request.mapScreenshot} alt="خريطة الموقع المحدد" width={600} height={300} className="w-full h-auto object-cover"/></div>)}
            {!request.mapScreenshot && request.locationCoordinates && (<div className="mt-3 rounded-md overflow-hidden border shadow-sm" data-ai-hint="map satellite location"><Image src={`https://placehold.co/600x300.png/e2e8f0/4A5568?text=Map+View+of+Location`} alt="عرض خريطة الموقع (صورة نائبة)" width={600} height={300} className="w-full h-auto object-cover"/></div>)}</Section>
          <Section title="معلومات إضافية" icon={<Info className="h-5 w-5 text-primary"/>}>
            {request.notes && (<InfoItem icon={<MessageSquare />} label="ملاحظات" value={request.notes} isBlock />)}
            {request.contactPoint && <InfoItem icon={<LocateFixed />} label="كيف سمعت عنا؟" value={contactPointDisplayValue} />}</Section></CardContent>
        <CardFooter className="bg-muted/30 p-4 rounded-b-lg flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground gap-2">
            <div className="flex items-center" dir="ltr"><CalendarDays className="h-4 w-4 mr-2 rtl:ml-0 rtl:mr-2"/><span>Request Date: {format(new Date(request.createdAt), "PPP p", { locale: enUS })}</span></div>
            <div className="flex items-center" dir="ltr"><Info className="h-4 w-4 mr-2 rtl:ml-0 rtl:mr-2"/><span>Last Update: {format(new Date(request.updatedAt), "PPP p", { locale: enUS })}</span></div></CardFooter></Card>
      <div className="my-6 text-center">{request && <ExportClientRequestPdfButton request={request} />}</div>
      <FollowUpForm requestId={request.id} />
      <div className="mt-8 text-center"><Button asChild variant="outline"><Link href="/track-request">التحقق من طلب آخر</Link></Button></div></div>); }

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="space-y-3 py-3 border-b border-border/50 last:border-b-0">
    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">{React.cloneElement(icon as React.ReactElement, { className: "ml-2 rtl:mr-0 rtl:ml-2 h-5 w-5"})}{title}</h3>
    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 pl-4 rtl:pr-4">{children}</div></div>);

interface InfoItemProps { icon: React.ReactNode; label: string; value?: string | null; dirValue?: "ltr" | "rtl"; isBlock?: boolean; }
function InfoItem({ icon, label, value, dirValue = "rtl", isBlock = false }: InfoItemProps) {
  if (value === undefined || value === null || String(value).trim() === "") return null;
  if (isBlock) { return (<div className="md:col-span-2 flex items-start space-x-3 rtl:space-x-reverse"><span className="text-primary mt-1">{icon && React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5"})}</span><div><p className="text-sm font-medium text-foreground">{label}</p><p className="text-md text-muted-foreground bg-secondary/10 p-3 rounded-md whitespace-pre-wrap mt-1" dir={dirValue}>{String(value)}</p></div></div>)}
  return (<div className="flex items-start space-x-3 rtl:space-x-reverse"><span className="text-primary mt-1">{icon && React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5"})}</span><div><p className="text-sm font-medium text-foreground">{label}</p><p className="text-md text-muted-foreground" dir={dirValue}>{String(value)}</p></div></div>);}

    