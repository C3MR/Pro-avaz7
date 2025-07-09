
import React from 'react';
import { Building2 as Building2Icon, Edit3, MapPin, Minimize2, Maximize2, DollarSign, FileText, MessageSquareText, Info, Briefcase, Globe } from 'lucide-react';
import type { PropertyUsage, ResidentialPropertyType, CommercialPropertyType, PropertyListingPurpose, PropertyType as FullPropertyType, RiyadhRegion } from "@/types";
import Image from 'next/image'; // For Next/Image
import { RIYADH_REGIONS, riyadhRegionArabicMap } from '@/lib/constants'; // Import centralized map

// Constants for Arabic labels (subset from AddPropertyForm)
const propertyUsagesList: { value: PropertyUsage; labelAr: string; labelEn: string }[] = [
  { value: "Residential", labelAr: "سكني", labelEn: "Residential" },
  { value: "Commercial", labelAr: "تجاري", labelEn: "Commercial" },
];

const residentialPropertyTypesList: { value: ResidentialPropertyType; labelAr: string; labelEn: string }[] = [
  { value: "Residential Land", labelAr: "أرض سكنية", labelEn: "Residential Land" },
  { value: "Palace", labelAr: "قصر", labelEn: "Palace" }, { value: "Villa", labelAr: "فيلا", labelEn: "Villa" },
  { value: "Duplex", labelAr: "دوبلكس", labelEn: "Duplex" }, { value: "Apartment", labelAr: "شقة", labelEn: "Apartment" },
  { value: "Floor", labelAr: "دور", labelEn: "Floor" }, { value: "Building", labelAr: "عمارة", labelEn: "Building" },
  { value: "Residential Complex", labelAr: "مجمع سكني", labelEn: "Residential Complex" }, { value: "Other", labelAr: "أخرى", labelEn: "Other" },
];

const commercialPropertyTypesList: { value: CommercialPropertyType; labelAr: string; labelEn: string }[] = [
  { value: "Commercial Land", labelAr: "أرض تجارية", labelEn: "Commercial Land" },
  { value: "Showroom", labelAr: "معرض", labelEn: "Showroom" }, { value: "Office", labelAr: "مكتب", labelEn: "Office" },
  { value: "Commercial Complex", labelAr: "مجمع تجاري", labelEn: "Commercial Complex" },
  { value: "Commercial Building", labelAr: "عمارة تجارية", labelEn: "Commercial Building" },
  { value: "Warehouse", labelAr: "مستودع", labelEn: "Warehouse" }, { value: "Workshop", labelAr: "ورشة", labelEn: "Workshop" },
  { value: "Gas Station", labelAr: "محطة وقود", labelEn: "Gas Station" }, { value: "Other", labelAr: "أخرى", labelEn: "Other" },
];

const propertyListingPurposesList: { value: PropertyListingPurpose; labelAr: string; labelEn: string }[] = [
    { value: "For Sale", labelAr: "للبيع", labelEn: "For Sale" },
    { value: "For Rent", labelAr: "للإيجار", labelEn: "For Rent" },
    { value: "For Investment", labelAr: "للاستثمار", labelEn: "For Investment"},
];


export interface PdfPropertyCardProps {
  propertyId: string;
  propertyDate: string;
  deedNumber?: string;
  usage?: PropertyUsage;
  propertyType?: FullPropertyType; 
  otherPropertyType?: string;
  purpose?: PropertyListingPurpose;
  region?: RiyadhRegion;
  neighborhood?: string;
  areaSize?: number;
  price?: number;
  brokerageAgreementNumber?: string;
  notes?: string;
  mapScreenshot?: string | null;
  propertyImage?: string | null; 
}

const PdfPropertyCard: React.FC<PdfPropertyCardProps> = ({
  propertyId,
  propertyDate,
  deedNumber,
  usage,
  propertyType,
  otherPropertyType,
  purpose,
  region,
  neighborhood,
  areaSize,
  price,
  brokerageAgreementNumber,
  notes,
  mapScreenshot,
  propertyImage,
}) => {
  const InfoRow: React.FC<{ label: string; value?: string | number | null; icon?: React.ReactNode; keySuffix?: string; dirValue?: "ltr" | "rtl"; }> = ({ label, value, icon, keySuffix, dirValue = "rtl" }) => {
    if (value === undefined || value === null || String(value).trim() === "") {
      return null;
    }
    return (
      <div key={`${label}-${keySuffix || ''}`} className="py-2 px-3 flex justify-between items-start text-sm border-b border-gray-200" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif' }}>
        <div className="flex items-center font-semibold text-gray-700">
          {icon && <span className="mr-2 ml-1 text-gray-500">{icon}</span>}
          {label}:
        </div>
        <div className="text-right text-gray-600 break-words max-w-[60%]" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif' }} dir={dirValue}>{String(value)}</div>
      </div>
    );
  };

  const getArabicLabel = (value: string | undefined, list: { value: string; labelAr: string; labelEn: string }[]) => {
    if (!value) return undefined;
    return list.find(item => item.value === value)?.labelAr || value;
  };

  const usageAr = getArabicLabel(usage, propertyUsagesList);
  let propertyTypeDisplayAr = "";
  if (usage === "Residential" && propertyType) {
    propertyTypeDisplayAr = getArabicLabel(propertyType, residentialPropertyTypesList) || propertyType;
  } else if (usage === "Commercial" && propertyType) {
    propertyTypeDisplayAr = getArabicLabel(propertyType, commercialPropertyTypesList) || propertyType;
  } else if (propertyType) {
    propertyTypeDisplayAr = propertyType; 
  }
  if (propertyTypeDisplayAr === "أخرى" && otherPropertyType) {
    propertyTypeDisplayAr = `أخرى (${otherPropertyType})`;
  }
  const purposeAr = getArabicLabel(purpose, propertyListingPurposesList);
  const regionAr = region ? riyadhRegionArabicMap[region] : undefined;


  return (
    <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important', direction: 'rtl', width: '100%' }}>
      <div className="text-center mb-6 pb-4 border-b border-gray-300" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
        <h1 className="text-3xl font-bold" style={{ color: '#4f5b93', fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>AVAZ<span style={{color: '#b3a07f'}}>.</span></h1>
        <p className="text-sm text-gray-500" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>بطاقة عرض عقار - Property Offer Card</p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 mb-4 text-xs" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }} dir="ltr">
        <InfoRow label="معرف العقار" value={propertyId} keySuffix="propId" dirValue="ltr"/>
        <InfoRow label="تاريخ الإضافة" value={propertyDate} keySuffix="propDate" dirValue="ltr"/>
      </div>
      
      {propertyImage && (
        <div className="my-4 border rounded-md overflow-hidden max-h-60 flex justify-center items-center bg-gray-100" data-ai-hint="property building exterior">
           <img 
              src={propertyImage} 
              alt="صورة العقار" 
              style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '240px', objectFit: 'contain', display: 'block' }} 
            />
        </div>
      )}

      <div className="mb-4" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
        <h2 className="text-lg font-bold text-gray-700 mb-2 p-2 bg-gray-100 rounded-md" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>تفاصيل العقار</h2>
        <InfoRow label="رقم الصك" value={deedNumber} icon={<FileText size={16}/>} keySuffix="deed" dirValue="ltr"/>
        <InfoRow label="الاستخدام" value={usageAr} icon={<Briefcase size={16}/>} keySuffix="usage" />
        <InfoRow label="نوع العقار" value={propertyTypeDisplayAr} icon={<Building2Icon size={16}/>} keySuffix="propType" />
        <InfoRow label="الغرض" value={purposeAr} icon={<Info size={16}/>} keySuffix="purpose" />
        {regionAr && <InfoRow label="النطاق" value={regionAr} icon={<Globe size={16} />} keySuffix="region" />}
        <InfoRow label="الحي" value={neighborhood} icon={<MapPin size={16}/>} keySuffix="hood" />
        <InfoRow label="المساحة (م²)" value={areaSize ? `${areaSize.toLocaleString('en-US')} م²` : undefined} icon={<Maximize2 size={16}/>} keySuffix="area" dirValue="ltr"/>
        <InfoRow label="السعر (SAR)" value={price ? `${price.toLocaleString('en-US')} ريال` : undefined} icon={<DollarSign size={16}/>} keySuffix="price" dirValue="ltr"/>
        <InfoRow label="رقم عقد الوساطة" value={brokerageAgreementNumber} icon={<FileText size={16}/>} keySuffix="brokerage" dirValue="ltr"/>
      </div>
      
      {notes && (
        <div className="mb-4" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
          <h2 className="text-lg font-bold text-gray-700 mb-2 p-2 bg-gray-100 rounded-md" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>ملاحظات إضافية</h2>
          <div className="p-3 text-sm text-gray-600 border rounded-md bg-gray-50 whitespace-pre-wrap" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
            <MessageSquareText size={16} className="inline-block mr-2 ml-1 align-middle text-gray-500" />
            {notes}
          </div>
        </div>
      )}

      {mapScreenshot && (
        <div className="mt-4" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
          <h2 className="text-lg font-bold text-gray-700 mb-2 p-2 bg-gray-100 rounded-md" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>النطاق الجغرافي المحدد</h2>
          <div className="border rounded-md overflow-hidden" data-ai-hint="map location">
            <img 
              src={mapScreenshot} 
              alt="النطاق الجغرافي" 
              style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} 
            />
          </div>
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-400" style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>
        <p style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }}>هذا المستند لمعاينة العقار ولا يحتوي على معلومات المالك الشخصية.</p>
        <p style={{ fontFamily: 'Almarai, "Trebuchet MS", sans-serif !important' }} dir="ltr">&copy; {new Date().getFullYear()} AVAZ Real Estate. All rights reserved.</p>
      </div>
    </div>
  );
};

export default PdfPropertyCard;

