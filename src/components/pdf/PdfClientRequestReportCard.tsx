
import React from 'react';
import { Building2, LayoutGrid, Briefcase, Building, GitBranch, MapPin, Minimize2, Maximize2, MessageSquareText, Archive, UserCheck, DollarSign, User, Phone, Mail, ListChecks, CalendarDays, Info, LocateFixed, HomeIcon, Globe } from 'lucide-react';
import type { PropertyRequest, PropertyUsage, ResidentialPropertyType, CommercialPropertyType, RequestPurpose, CommercialCategory, ClientRole, FollowUpEntry, PropertyType as FullPropertyType, RiyadhRegion } from "@/types";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { riyadhRegionArabicMap } from "@/lib/constants"; // Import centralized map


// Mappings copied and adapted from track-request page / NewRequestForm for consistency
const propertyTypeArabicMap: Record<string, string> = {
  "Residential Land": "أرض سكنية", "Palace": "قصر", "Villa": "فيلا", "Duplex": "دوبلكس",
  "Apartment": "شقة", "Floor": "دور", "Building": "عمارة",
  "Residential Complex": "مجمع سكني",
  "Commercial Land": "أرض تجارية", "Showroom": "معرض", "Office": "مكتب",
  "Commercial Complex": "مجمع تجاري", "Commercial Building": "عمارة تجارية",
  "Warehouse": "مستودع", "Workshop": "ورشة", "Gas Station": "محطة وقود",
  "Other": "أخرى",
};

const requestPurposeArabicMap: Record<RequestPurpose, string> = {
  "Buy": "شراء", "Rent": "إيجار", "Financing": "تمويل",
  "Partnership": "شراكة", "Buy via Bank": "شراء عن طريق بنك"
};

const clientRoleArabicMap: Record<ClientRole, string> = {
  "Applicant": "صاحب الطلب", "Agent": "وكيل", "Broker": "وسيط",
  "CompanyEmployee": "موظف شركة", "Other": "أخرى"
};

const usageArabicMap = { "Residential": "سكني", "Commercial": "تجاري" };

const commercialCategoryArabicMap: Record<CommercialCategory, string> = {
  "Retail Trade": "تجارة التجزئة", "Food & Beverages": "الأغذية والمشروبات",
  "Professional Services": "الخدمات المهنية", "Public Services": "الخدمات العامة",
  "Education & Training": "التعليم والتدريب", "Entertainment & Tourism": "الترفيه والسياحة",
  "Sports & Fitness": "الرياضة واللياقة", "Logistics & Storage": "اللوجستيات والتخزين", "Other": "أخرى"
};

const contactPointArabicMap: Record<string, string> = {
  "Property Sign": "لوحة على عقار", "X Platform (Twitter)": "منصة إكس (تويتر)",
  "Google Maps": "قوقل ماب", "WhatsApp": "واتس آب", "Snapchat": "سناب شات",
  "Personal Recommendation": "توصية شخص", "Other": "أخرى"
};

const getPropertyTypeDisplay = (propertyType?: FullPropertyType, otherPropertyType?: string): string => {
  if (propertyType === "Other" && otherPropertyType) {
    return `${propertyTypeArabicMap[propertyType] || propertyType} (${otherPropertyType})`;
  }
  return propertyType ? (propertyTypeArabicMap[propertyType] || propertyType) : "غير محدد";
};

const getClientRoleDisplay = (role?: ClientRole, otherRole?: string): string => {
  if (role === "Other" && otherRole) {
    return `${clientRoleArabicMap[role]} (${otherRole})`;
  }
  return role ? clientRoleArabicMap[role] : "غير محدد";
};

const getCommercialCategoryDisplay = (category?: CommercialCategory, otherCategory?: string): string => {
  if (category === "Other" && otherCategory) {
    return `${commercialCategoryArabicMap[category] || category} (${otherCategory})`;
  }
  return category ? (commercialCategoryArabicMap[category] || category) : "غير محدد";
};

const getCommercialActivityDisplay = (activity?: string, otherActivity?: string, category?: CommercialCategory): string => {
    if (!activity) return "غير محدد";
    if ((activity.startsWith("أخرى") || activity.startsWith("Other") || activity === "Other Activity") && otherActivity) {
        return `${activity.replace(/\s*\(.+?\)/, '')} (${otherActivity})`;
    }
    return activity;
};


interface PdfClientRequestReportCardProps {
  request: PropertyRequest;
}

const PdfClientRequestReportCard: React.FC<PdfClientRequestReportCardProps> = ({ request }) => {
  const InfoRow: React.FC<{ label: string; value?: string | number | string[] | null; icon?: React.ReactNode; keySuffix?: string; dirValue?: "ltr" | "rtl"; isBlock?: boolean; }> = ({ label, value, icon, keySuffix, dirValue = "rtl", isBlock = false }) => {
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0) || String(value).trim() === "") {
      return null;
    }
    const displayValue = Array.isArray(value) ? value.join('، ') : String(value);

    if (isBlock) {
      return (
        <div key={`${label}-${keySuffix || ''}`} className="py-2 px-3 text-sm border-b border-gray-200" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif' }}>
          <div className="flex items-center font-semibold text-gray-700 mb-1">
            {icon && <span className="mr-2 ml-1 text-gray-500">{icon}</span>}
            {label}:
          </div>
          <div className="text-gray-600 break-words whitespace-pre-wrap bg-gray-50 p-2 rounded" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif' }} dir={dirValue}>{displayValue}</div>
        </div>
      );
    }

    return (
      <div key={`${label}-${keySuffix || ''}`} className="py-2 px-3 flex justify-between items-start text-sm border-b border-gray-200" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif' }}>
        <div className="flex items-center font-semibold text-gray-700">
          {icon && <span className="mr-2 ml-1 text-gray-500">{icon}</span>}
          {label}:
        </div>
        <div className="text-right text-gray-600 break-words max-w-[60%]" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif' }} dir={dirValue}>{displayValue}</div>
      </div>
    );
  };

  const propertyTypeDisplay = getPropertyTypeDisplay(request.propertyType, request.otherPropertyType);
  const requestPurposeDisplay = request.requestPurpose ? requestPurposeArabicMap[request.requestPurpose] : "غير محدد";
  const clientRoleDisplay = getClientRoleDisplay(request.clientRole, request.otherClientRole);
  const usageDisplay = request.usage ? usageArabicMap[request.usage] : "غير محدد";
  const commercialCategoryDisplay = getCommercialCategoryDisplay(request.commercialCategory, request.otherCommercialCategory);
  const commercialActivityDisplay = getCommercialActivityDisplay(request.commercialActivity, request.otherCommercialActivity, request.commercialCategory);
  let contactPointDisplayValue = request.contactPoint ? (contactPointArabicMap[request.contactPoint] || request.contactPoint) : "غير محدد";
   if (request.contactPoint === "Other" && request.otherContactPoint) {
       contactPointDisplayValue += ` (${request.otherContactPoint})`;
   }
  const budgetDisplay = (request.budgetMin || request.budgetMax)
    ? `${request.budgetMin?.toLocaleString('en-US') || 'غير محدد'} - ${request.budgetMax?.toLocaleString('en-US') || 'غير محدد'} ر.س`
    : "غير محدد";
  const regionDisplay = request.region ? riyadhRegionArabicMap[request.region] : undefined;


  return (
    <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important', direction: 'rtl', width: '100%' }}>
      <div className="text-center mb-6 pb-4 border-b border-gray-300" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
        <h1 className="text-3xl font-bold" style={{ color: '#4f5b93', fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>AVAZ<span style={{color: '#b3a07f'}}>.</span></h1>
        <p className="text-sm text-gray-500" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>تقرير طلب العميل - Client Request Report</p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 mb-4 text-xs" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }} dir="ltr">
        <InfoRow label="رقم الطلب" value={request.id} keySuffix="reqId" dirValue="ltr"/>
        <InfoRow label="تاريخ الطلب" value={format(new Date(request.createdAt), "yyyy/MM/dd - HH:mm", { locale: enUS })} keySuffix="reqDate" dirValue="ltr"/>
      </div>

      <div className="mb-4" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
        <h2 className="text-lg font-bold text-gray-700 mb-2 p-2 bg-gray-100 rounded-md" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>بيانات العميل</h2>
        <InfoRow label="الاسم" value={request.clientName} icon={<User size={16}/>} keySuffix="clientName" />
        <InfoRow label="رقم التواصل" value={request.clientContact} icon={<Phone size={16}/>} keySuffix="clientContact" dirValue="ltr"/>
        {request.clientEmail && <InfoRow label="البريد الإلكتروني" value={request.clientEmail} icon={<Mail size={16}/>} keySuffix="clientEmail" dirValue="ltr"/>}
        <InfoRow label="صفة العميل" value={clientRoleDisplay} icon={<UserCheck size={16}/>} keySuffix="clientRole" />
      </div>

      <div className="mb-4" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
        <h2 className="text-lg font-bold text-gray-700 mb-2 p-2 bg-gray-100 rounded-md" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>تفاصيل الطلب الأساسية</h2>
        <InfoRow label="الغرض" value={requestPurposeDisplay} icon={<Archive size={16}/>} keySuffix="purpose" />
        <InfoRow label="الاستخدام" value={usageDisplay} icon={<LayoutGrid size={16}/>} keySuffix="usage" />
        <InfoRow label="نوع العقار" value={propertyTypeDisplay} icon={<HomeIcon size={16}/>} keySuffix="propType" />
      </div>

      {request.usage === "Commercial" && (
        <div className="mb-4" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
          <h2 className="text-lg font-bold text-gray-700 mb-2 p-2 bg-gray-100 rounded-md" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>التفاصيل التجارية</h2>
          <InfoRow label="فئة النشاط" value={commercialCategoryDisplay} icon={<LayoutGrid size={16}/>} keySuffix="commCat" />
          <InfoRow label="النشاط التجاري" value={commercialActivityDisplay} icon={<Briefcase size={16}/>} keySuffix="commAct" />
          {request.companyName && <InfoRow label="اسم المنشأة" value={request.companyName} icon={<Building size={16}/>} keySuffix="company" />}
          {request.branchCount !== undefined && <InfoRow label="عدد الفروع" value={request.branchCount.toString()} icon={<GitBranch size={16}/>} keySuffix="branches" dirValue="ltr"/>}
        </div>
      )}

      <div className="mb-4" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
        <h2 className="text-lg font-bold text-gray-700 mb-2 p-2 bg-gray-100 rounded-md" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>الموقع والمتطلبات</h2>
        {regionDisplay && <InfoRow label="النطاق" value={regionDisplay} icon={<Globe size={16}/>} keySuffix="region" />}
        <InfoRow label="الأحياء المفضلة" value={request.neighborhoodPreferences && request.neighborhoodPreferences.length > 0 ? request.neighborhoodPreferences.join('، ') : undefined} icon={<MapPin size={16}/>} keySuffix="hoods" />
        <InfoRow label="المساحة المطلوبة (م²)" value={(request.minArea || request.maxArea) ? `${request.minArea?.toLocaleString('en-US') || 'غير محدد'} - ${request.maxArea?.toLocaleString('en-US') || 'غير محدد'}` : undefined} icon={<Maximize2 size={16}/>} keySuffix="area" dirValue="ltr"/>
        <InfoRow label="الميزانية (ر.س)" value={budgetDisplay !== "غير محدد" ? budgetDisplay : undefined} icon={<DollarSign size={16}/>} keySuffix="budget" dirValue="ltr"/>
        {request.locationQuery && <InfoRow label="وصف الموقع" value={request.locationQuery} icon={<MapPin size={16}/>} keySuffix="locQuery" />}
      </div>
      
      {request.mapScreenshot && (
        <div className="my-4" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
          <h3 className="text-md font-semibold text-gray-700 mb-1 p-1 bg-gray-50 rounded-sm">النطاق الجغرافي المحدد:</h3>
          <div className="border rounded-md overflow-hidden" data-ai-hint="map location">
            <img 
              src={request.mapScreenshot} 
              alt="النطاق الجغرافي" 
              style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} 
            />
          </div>
        </div>
      )}

      <div className="mb-4" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
        <h2 className="text-lg font-bold text-gray-700 mb-2 p-2 bg-gray-100 rounded-md" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>معلومات إضافية</h2>
        {request.notes && <InfoRow label="ملاحظات العميل" value={request.notes} icon={<MessageSquareText size={16}/>} keySuffix="notes" isBlock />}
        {request.contactPoint && <InfoRow label="كيف سمع عنا؟" value={contactPointDisplayValue} icon={<LocateFixed size={16}/>} keySuffix="contactPoint" />}
      </div>

      {request.followUps && request.followUps.length > 0 && (
        <div className="mb-4" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
          <h2 className="text-lg font-bold text-gray-700 mb-2 p-2 bg-gray-100 rounded-md" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>سجل المتابعة</h2>
          <div className="border rounded-md bg-gray-50" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif' }}>
            <table className="w-full text-sm">
              <thead className="bg-gray-200 text-gray-600">
                <tr>
                  <th className="p-2 text-right font-semibold">التاريخ والوقت</th>
                  <th className="p-2 text-right font-semibold">الملاحظات</th>
                  <th className="p-2 text-right font-semibold">المسؤول</th>
                </tr>
              </thead>
              <tbody>
                {request.followUps.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((entry: FollowUpEntry) => (
                  <tr key={entry.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-100">
                    <td className="p-2 text-gray-700" dir="ltr">{format(new Date(entry.timestamp), "yyyy/MM/dd - HH:mm", { locale: enUS })}</td>
                    <td className="p-2 text-gray-700 whitespace-pre-wrap">{entry.notes}</td>
                    <td className="p-2 text-gray-700">{entry.actor || "النظام"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-400" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
        <p style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>هذا التقرير لغرض المراجعة الداخلية والمشاركة مع المتعاونين.</p>
        <p style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }} dir="ltr">&copy; {new Date().getFullYear()} AVAZ Real Estate. All rights reserved.</p>
      </div>
    </div>
  );
};

export default PdfClientRequestReportCard;
    
