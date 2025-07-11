"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useEffect, useState, useRef, useMemo, useActionState, startTransition } from "react";
import type { NewRequestFormState} from "@/lib/actions";
import { submitNewRequest } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle, AlertCircle, Loader2, User, Smartphone, Mail, Hash, Calendar, Archive, Building2, Pencil, LayoutGrid, Briefcase, Building, GitBranch, MapPin, Minimize2, Maximize2, LocateFixed, MessageSquareText, RefreshCw, Send, ListFilter, ChevronDown, FileDown, XCircle, UserCheck, DollarSign, Globe } from "lucide-react";
import DynamicLocationPicker from "@/components/map/DynamicLocationPicker";
import type { Location, PropertyUsage, ResidentialPropertyType, CommercialPropertyType, RequestPurpose, CommercialCategory, ContactPoint, ClientRole, RiyadhRegion } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import PdfRequestSummaryCard from "@/components/pdf/PdfRequestSummaryCard";
// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import jsPDF from 'jspdf';
import Image from 'next/image';
import { RIYADH_REGIONS, RIYADH_NEIGHBORHOODS_WITH_REGIONS, ALL_RIYADH_NEIGHBORHOODS_FOR_SELECT } from "@/lib/constants";


const requestPurposes: { value: RequestPurpose; labelAr: string; labelEn: string }[] = [
  { value: "Buy", labelAr: "شراء", labelEn: "Buy" },
  { value: "Rent", labelAr: "إيجار", labelEn: "Rent" },
  { value: "Financing", labelAr: "تمويل", labelEn: "Financing" },
  { value: "Partnership", labelAr: "شراكة", labelEn: "Partnership" },
  { value: "Buy via Bank", labelAr: "شراء عن طريق بنك", labelEn: "Buy via Bank" },
];

const propertyUsages: { value: PropertyUsage; labelAr: string; labelEn: string }[] = [
  { value: "Residential", labelAr: "سكني", labelEn: "Residential" },
  { value: "Commercial", labelAr: "تجاري", labelEn: "Commercial" },
];

const clientRoles: { value: ClientRole; labelAr: string; labelEn: string }[] = [
  { value: "Applicant", labelAr: "صاحب الطلب", labelEn: "Applicant" },
  { value: "Agent", labelAr: "وكيل", labelEn: "Agent" },
  { value: "Broker", labelAr: "وسيط", labelEn: "Broker" },
  { value: "CompanyEmployee", labelAr: "موظف شركة", labelEn: "Company Employee" },
  { value: "Other", labelAr: "أخرى", labelEn: "Other" },
];

const residentialPropertyTypes: { value: ResidentialPropertyType; labelAr: string; labelEn: string }[] = [
  { value: "Residential Land", labelAr: "أرض سكنية", labelEn: "Residential Land" },
  { value: "Palace", labelAr: "قصر", labelEn: "Palace" },
  { value: "Villa", labelAr: "فيلا", labelEn: "Villa" },
  { value: "Duplex", labelAr: "دوبلكس", labelEn: "Duplex" },
  { value: "Apartment", labelAr: "شقة", labelEn: "Apartment" },
  { value: "Floor", labelAr: "دور", labelEn: "Floor" },
  { value: "Building", labelAr: "عمارة", labelEn: "Building" },
  { value: "Residential Complex", labelAr: "مجمع سكني", labelEn: "Residential Complex" },
  { value: "Other", labelAr: "أخرى", labelEn: "Other" },
];

const commercialPropertyTypes: { value: CommercialPropertyType; labelAr: string; labelEn: string }[] = [
  { value: "Commercial Land", labelAr: "أرض تجارية", labelEn: "Commercial Land" },
  { value: "Showroom", labelAr: "معرض", labelEn: "Showroom" },
  { value: "Office", labelAr: "مكتب", labelEn: "Office" },
  { value: "Commercial Complex", labelAr: "مجمع تجاري", labelEn: "Commercial Complex" },
  { value: "Commercial Building", labelAr: "عمارة تجارية", labelEn: "Commercial Building" },
  { value: "Warehouse", labelAr: "مستودع", labelEn: "Warehouse" },
  { value: "Workshop", labelAr: "ورشة", labelEn: "Workshop" },
  { value: "Gas Station", labelAr: "محطة وقود", labelEn: "Gas Station" },
  { value: "Other", labelAr: "أخرى", labelEn: "Other" },
];

const commercialCategoriesList: { value: CommercialCategory; labelAr: string; labelEn: string }[] = [
    { value: "Retail Trade", labelAr: "تجارة التجزئة", labelEn: "Retail Trade"},
    { value: "Food & Beverages", labelAr: "الأغذية والمشروبات", labelEn: "Food & Beverages"},
    { value: "Professional Services", labelAr: "الخدمات المهنية", labelEn: "Professional Services"},
    { value: "Public Services", labelAr: "الخدمات العامة", labelEn: "Public Services"},
    { value: "Education & Training", labelAr: "التعليم والتدريب", labelEn: "Education & Training"},
    { value: "Entertainment & Tourism", labelAr: "الترفيه والسياحة", labelEn: "Entertainment & Tourism"},
    { value: "Sports & Fitness", labelAr: "الرياضة واللياقة", labelEn: "Sports & Fitness"},
    { value: "Logistics & Storage", labelAr: "اللوجستيات والتخزين", labelEn: "Logistics & Storage"},
    { value: "Other", labelAr: "أخرى", labelEn: "Other"},
];

const commercialActivitiesByCat: Record<string, { value: string; labelAr: string; labelEn: string }[]> = {
    "Retail Trade": [
        {value: "Clothing & Fashion", labelAr: "ملابس وأزياء", labelEn: "Clothing & Fashion"},
        {value: "Electronics", labelAr: "إلكترونيات", labelEn: "Electronics"},
        {value: "Home Furniture", labelAr: "أثاث منزلي", labelEn: "Home Furniture"},
        {value: "Supermarket", labelAr: "سوبر ماركت", labelEn: "Supermarket"},
        {value: "Other Retail Trade", labelAr: "أخرى (تجارة التجزئة)", labelEn: "Other (Retail Trade)" }
    ],
    "Food & Beverages": [
        {value: "Restaurant", labelAr: "مطعم", labelEn: "Restaurant"},
        {value: "Cafe", labelAr: "مقهى", labelEn: "Cafe"},
        {value: "Sweets", labelAr: "حلويات", labelEn: "Sweets"},
        {value: "Bakery", labelAr: "مخبز", labelEn: "Bakery"},
        {value: "Other Food & Beverages", labelAr: "أخرى (الأغذية والمشروبات)", labelEn: "Other (Food & Beverages)" }
    ],
    "Professional Services": [
        {value: "Legal Consulting", labelAr: "استشارات قانونية", labelEn: "Legal Consulting"},
        {value: "Financial Consulting", labelAr: "استشارات مالية", labelEn: "Financial Consulting"},
        {value: "Accounting Services", labelAr: "خدمات محاسبية", labelEn: "Accounting Services"},
        {value: "Engineering Services", labelAr: "خدمات هندسية", labelEn: "Engineering Services"},
        {value: "Other Professional Services", labelAr: "أخرى (الخدمات المهنية)", labelEn: "Other (Professional Services)" }
    ],
    "Public Services": [
        {value: "Medical Clinic", labelAr: "عيادة طبية", labelEn: "Medical Clinic"},
        {value: "Pharmacy", labelAr: "صيدلية", labelEn: "Pharmacy"},
        {value: "Medical Lab", labelAr: "مختبر طبي", labelEn: "Medical Lab"},
        {value: "Beauty Center", labelAr: "مركز تجميل", labelEn: "Beauty Center"},
        {value: "Other Public Services", labelAr: "أخرى (الخدمات العامة)", labelEn: "Other (Public Services)" }
    ],
    "Education & Training": [
        {value: "Private School", labelAr: "مدرسة خاصة", labelEn: "Private School"},
        {value: "Training Institute", labelAr: "معهد تدريب", labelEn: "Training Institute"},
        {value: "Kindergarten", labelAr: "روضة أطفال", labelEn: "Kindergarten"},
        {value: "Educational Center", labelAr: "مركز تعليمي", labelEn: "Educational Center"},
        {value: "Other Education & Training", labelAr: "أخرى (التعليم والتدريب)", labelEn: "Other (Education & Training)" }
    ],
    "Entertainment & Tourism": [
        {value: "Hotel", labelAr: "فندق", labelEn: "Hotel"},
        {value: "Resort", labelAr: "منتجع", labelEn: "Resort"},
        {value: "Entertainment Center", labelAr: "مركز ترفيهي", labelEn: "Entertainment Center"},
        {value: "Wedding Hall", labelAr: "صالة أفراح", labelEn: "Wedding Hall"},
        {value: "Other Entertainment & Tourism", labelAr: "أخرى (الترفيه والسياحة)", labelEn: "Other (Entertainment & Tourism)" }
    ],
    "Sports & Fitness": [
        {value: "Sports Club", labelAr: "نادي رياضي", labelEn: "Sports Club"},
        {value: "Gym", labelAr: "صالة ألعاب", labelEn: "Gym"},
        {value: "Swimming Pool", labelAr: "مسبح", labelEn: "Swimming Pool"},
        {value: "Playground", labelAr: "ملعب", labelEn: "Playground"},
        {value: "Other Sports & Fitness", labelAr: "أخرى (الرياضة واللياقة)", labelEn: "Other (Sports & Fitness)" }
    ],
    "Logistics & Storage": [
        {value: "Storage Warehouse", labelAr: "مستودع تخزين", labelEn: "Storage Warehouse"},
        {value: "Distribution Center", labelAr: "مركز توزيع", labelEn: "Distribution Center"},
        {value: "Shipping & Delivery", labelAr: "شحن وتوصيل", labelEn: "Shipping & Delivery"},
        {value: "Logistics Services", labelAr: "خدمات لوجستية", labelEn: "Logistics Services"},
        {value: "Other Logistics & Storage", labelAr: "أخرى (اللوجستيات والتخزين)", labelEn: "Other (Logistics & Storage)" }
    ],
    "Other": [
        {value: "Other Activity", labelAr: "نشاط آخر (يرجى التحديد)", labelEn: "Other Activity (Please Specify)" }
    ]
};


const contactPoints: { value: ContactPoint; labelAr: string; labelEn: string }[] = [
  { value: "Property Sign", labelAr: "لوحة على عقار", labelEn: "Property Sign" },
  { value: "X Platform (Twitter)", labelAr: "منصة إكس (تويتر)", labelEn: "X Platform (Twitter)" },
  { value: "Google Maps", labelAr: "قوقل ماب", labelEn: "Google Maps" },
  { value: "WhatsApp", labelAr: "واتس آب", labelEn: "WhatsApp" },
  { value: "Snapchat", labelAr: "سناب شات", labelEn: "Snapchat" },
  { value: "Personal Recommendation", labelAr: "توصية شخص", labelEn: "Personal Recommendation" },
  { value: "Other", labelAr: "أخرى", labelEn: "Other" },
];

const nameRegex = /^[a-zA-Z\u0600-\u06FF\s.,'-]+$/;
const nameErrorMessage = "الاسم يجب أن يحتوي على حروف عربية أو إنجليزية ومسافات وعلامات ترقيم أساسية فقط.";
const riyadhRegionEnum = z.custom<RiyadhRegion>((val) => RIYADH_REGIONS.map(r => r.value).includes(val as RiyadhRegion) || val === undefined, { message: "الرجاء اختيار النطاق" }).optional();


const formSchema = z.object({
  id: z.string().min(1, { message: "معرف الطلب مطلوب." }),
  clientName: z.string().min(2, { message: "الاسم الكامل مطلوب (حرفين على الأقل)." }).regex(nameRegex, nameErrorMessage),
  clientPhone: z.string().regex(/^05\d{8}$/, "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام."),
  clientEmail: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صالح (مثل example@domain.com)." }).optional().or(z.literal('')),
  clientRole: z.custom<ClientRole>((val) => val === undefined || clientRoles.map(p => p.value).includes(val as ClientRole), {
    message: "الرجاء اختيار صفة العميل",
  }).optional(),
  otherClientRole: z.string().optional(),

  requestPurpose: z.custom<RequestPurpose>((val) => val === undefined || requestPurposes.map(p => p.value).includes(val as RequestPurpose), {
    message: "الرجاء اختيار الغرض من الطلب",
  }).optional(),
  usage: z.custom<PropertyUsage>((val) => val === undefined || propertyUsages.map(u => u.value).includes(val as PropertyUsage), {
    message: "الرجاء اختيار الاستخدام",
  }).optional(),

  propertyType: z.string().optional(),
  otherPropertyType: z.string().optional(),

  commercialCategory: z.custom<CommercialCategory>((val) => val === undefined || commercialCategoriesList.map(c => c.value).includes(val as CommercialCategory),{
      message: "الرجاء اختيار فئة النشاط",
  }).optional(),
  otherCommercialCategory: z.string().optional(),
  commercialActivity: z.string().optional(),
  otherCommercialActivity: z.string().optional(),
  companyName: z.string().optional(),
  branchCount: z.coerce.number().int().min(0).transform(val => val === 0 ? undefined : val).optional(),

  region: riyadhRegionEnum,
  neighborhoodPreferences: z.array(z.string()).optional(),
  minArea: z.coerce.number().min(0).transform(val => val === 0 ? undefined : val).optional(),
  maxArea: z.coerce.number().min(0).transform(val => val === 0 ? undefined : val).optional(),
  budgetMin: z.coerce.number().min(0).transform(val => val === 0 ? undefined : val).optional(),
  budgetMax: z.coerce.number().min(0).transform(val => val === 0 ? undefined : val).optional(),

  contactPoint: z.custom<ContactPoint>((val) => val === undefined || contactPoints.map(c => c.value).includes(val as ContactPoint), {
    message: "الرجاء اختيار كيف سمعت عنا",
  }).optional(),
  otherContactPoint: z.string().optional(),
  notes: z.string().optional(),

  locationQuery: z.string().optional(),
  locationCoordinatesLat: z.coerce.number().optional(),
  locationCoordinatesLng: z.coerce.number().optional(),
  mapScreenshot: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.clientRole === "Other" && !data.otherClientRole?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "يرجى تحديد الصفة الأخرى.", path: ["otherClientRole"] });
    }
    if (data.usage === "Residential" && data.propertyType && !residentialPropertyTypes.map(rt => rt.value).includes(data.propertyType as ResidentialPropertyType) && data.propertyType !== "Other") {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "نوع العقار السكني غير صالح", path: ["propertyType"] });
    }
    if (data.usage === "Commercial" && data.propertyType && !commercialPropertyTypes.map(ct => ct.value).includes(data.propertyType as CommercialPropertyType) && data.propertyType !== "Other") {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "نوع العقار التجاري غير صالح", path: ["propertyType"] });
    }
    if (data.propertyType === "Other" && !data.otherPropertyType?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "يرجى تحديد نوع العقار الآخر", path: ["otherPropertyType"] });
    }
    if (data.commercialCategory === "Other" && !data.otherCommercialCategory?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "يرجى تحديد فئة النشاط الأخرى", path: ["otherCommercialCategory"] });
    }
     const selectedCommercialCategoryKey = commercialCategoriesList.find(c => c.labelAr === data.commercialCategory || c.value === data.commercialCategory)?.value;

    if (data.usage === "Commercial" && selectedCommercialCategoryKey && commercialActivitiesByCat[selectedCommercialCategoryKey as CommercialCategory] &&
        (data.commercialActivity?.startsWith("أخرى") || data.commercialActivity?.startsWith("Other") || data.commercialActivity === "Other Activity") && !data.otherCommercialActivity?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "يرجى تحديد النشاط التجاري الآخر", path: ["otherCommercialActivity"] });
    }
    if (data.contactPoint === "Other" && !data.otherContactPoint?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "يرجى تحديد كيف سمعت عنا", path: ["otherContactPoint"] });
    }
     if (data.minArea !== undefined && data.maxArea !== undefined && data.maxArea < data.minArea) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "المساحة القصوى يجب أن تكون أكبر من أو تساوي المساحة الدنيا",
            path: ["maxArea"],
        });
    }
    if (data.budgetMin !== undefined && data.budgetMax !== undefined && data.budgetMax < data.budgetMin) {
      ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "الميزانية القصوى يجب أن تكون أكبر من أو تساوي الميزانية الدنيا",
          path: ["budgetMax"],
      });
    }
});


export default function NewRequestForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [tempScreenshot, setTempScreenshot] = useState<string | null>(null);
  const [rawRequestDateTime, setRawRequestDateTime] = useState<Date | null>(null);

  const [requestId, setRequestId] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const pdfCardRef = useRef<HTMLDivElement>(null);

  const generateNewRequestInfo = () => {
    const now = new Date();
    setRawRequestDateTime(now);
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString();
    const uniqueNumForPR = (now.getSeconds() * 1000 + now.getMilliseconds()) % 700;
    const sequentialIdPartPR = (301 + uniqueNumForPR).toString().padStart(3, '0');
    const id = `PR-${year}-${month}-${sequentialIdPartPR}`;
    const displayDate = `${now.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    setRequestId(id);
    setRequestDate(displayDate);
    form.setValue("id", id, { shouldValidate: true });
  };

  useEffect(() => {
    generateNewRequestInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialState: NewRequestFormState = { message: "", errors: {}, submittedData: undefined };
  const [state, formAction, isSubmitting] = useActionState(submitNewRequest, initialState);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "", clientName: "", clientPhone: "", clientEmail: "", clientRole: undefined, otherClientRole: "",
      requestPurpose: undefined, usage: undefined, propertyType: undefined, otherPropertyType: "",
      commercialCategory: undefined, otherCommercialCategory: "", commercialActivity: "", otherCommercialActivity: "",
      companyName: "", branchCount: undefined, region: undefined, neighborhoodPreferences: [],
      minArea: undefined, maxArea: undefined, budgetMin: undefined, budgetMax: undefined,
      contactPoint: undefined, otherContactPoint: "", notes: "", locationQuery: "", mapScreenshot: undefined,
    },
  });

  const currentUsage = form.watch("usage");
  const currentPropertyType = form.watch("propertyType");
  const currentCommercialCategory = form.watch("commercialCategory") as CommercialCategory | undefined;
  const currentCommercialActivity = form.watch("commercialActivity");
  const currentContactPoint = form.watch("contactPoint");
  const currentClientRole = form.watch("clientRole");
  const currentRegion = form.watch("region");

  const availableNeighborhoods = React.useMemo(() => {
    if (!currentRegion || currentRegion === "Other") {
      return ALL_RIYADH_NEIGHBORHOODS_FOR_SELECT;
    }
    return RIYADH_NEIGHBORHOODS_WITH_REGIONS
      .filter(hood => hood.region === currentRegion)
      .map(n => ({value: n.value, labelAr: n.labelAr, labelEn: n.labelEn}))
      .sort((a,b) => a.labelAr.localeCompare(b.labelAr, 'ar'));
  }, [currentRegion]);


  useEffect(() => {
    if (state.message && !state.errors && !state.trackingCode) {
      toast({ variant: "destructive", title: "فشل الإرسال", description: state.message, });
    } else if (state.message && (!state.errors || (state.errors && Object.keys(state.errors).length === 0 && !state.errors._form)) && !state.trackingCode) {
        toast({ variant: "destructive", title: "فشل الإرسال", description: state.message });
    }
    if (state.errors?._form) {
       toast({ variant: "destructive", title: "خطأ في الإرسال", description: state.errors._form.join(", "), });
    }
  }, [state, toast]);


  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentFormValues = form.getValues();
    if (!currentFormValues.id) {
        const now = new Date(); setRawRequestDateTime(now);
        const year = now.getFullYear().toString().slice(-2); const month = (now.getMonth() + 1).toString();
        const uniqueNumForPR = (now.getSeconds() * 1000 + now.getMilliseconds()) % 700;
        const sequentialIdPartPR = (301 + uniqueNumForPR).toString().padStart(3, '0');
        const newId = `PR-${year}-${month}-${sequentialIdPartPR}`;
        form.setValue("id", newId, { shouldValidate: true }); setRequestId(newId);
    }
    const newFormData = new FormData(formRef.current!);
    Object.keys(currentFormValues).forEach(key => {
        const typedKey = key as keyof typeof currentFormValues; const value = currentFormValues[typedKey];
        if (typedKey === "neighborhoodPreferences" && Array.isArray(value)) {
            value.forEach(hood => newFormData.append("neighborhoodPreferences", hood));
        } else if (typedKey === "mapScreenshot" && tempScreenshot) { newFormData.set("mapScreenshot", tempScreenshot);
        } else if (value !== undefined && value !== null && String(value).trim() !== '') {
            if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string') { newFormData.set(typedKey, String(value)); }
        } else {
            if (newFormData.has(typedKey) && typedKey !== "mapScreenshot" && typedKey !== "neighborhoodPreferences") newFormData.delete(typedKey);
        }
    });
    if (!newFormData.has("mapScreenshot") && tempScreenshot) { newFormData.set("mapScreenshot", tempScreenshot);
    } else if (!tempScreenshot && newFormData.has("mapScreenshot")) { newFormData.delete("mapScreenshot"); }
    if (selectedLocation) { newFormData.set("locationCoordinatesLat", selectedLocation.lat.toString()); newFormData.set("locationCoordinatesLng", selectedLocation.lng.toString()); }
    const isValid = await form.trigger();
    if (isValid) { startTransition(() => { formAction(newFormData); });
    } else {
      const firstErrorKey = Object.keys(form.formState.errors)[0];
      if (firstErrorKey) {
        const firstError = form.formState.errors[firstErrorKey as keyof z.infer<typeof formSchema>];
        if (firstError && firstError.message) {
            toast({ variant: "destructive", title: "خطأ في الإدخال", description: firstError.message });
             const element = document.getElementsByName(firstErrorKey)[0]; element?.focus({ preventScroll: true }); element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else { toast({ variant: "destructive", title: "خطأ في الإدخال", description: "الرجاء مراجعة الحقول المميزة." }); }
      } else { toast({ variant: "destructive", title: "خطأ في الإدخال", description: "الرجاء التأكد من تعبئة جميع الحقول المطلوبة بشكل صحيح." }); }
    }
  };

  const handleLocationSelection = (loc: Location | null, screenshotUri?: string | null) => {
      setSelectedLocation(loc); setTempScreenshot(screenshotUri || null);
      if (loc) { form.setValue('locationCoordinatesLat', loc.lat, { shouldValidate: true }); form.setValue('locationCoordinatesLng', loc.lng, { shouldValidate: true });
      } else { form.setValue('locationCoordinatesLat', undefined); form.setValue('locationCoordinatesLng', undefined); }
      if (screenshotUri) { form.setValue('mapScreenshot', screenshotUri, { shouldValidate: true });
      } else { form.setValue('mapScreenshot', undefined); }
  };

  const handleNewRequestButtonClickInternal = () => {
    form.reset(); generateNewRequestInfo(); setSelectedLocation(null); setTempScreenshot(null);
    if (state) { state.trackingCode = undefined; state.message = ""; state.errors = undefined; state.submittedData = undefined; }
    toast({ title: "تم تجهيز طلب جديد" }); window.scrollTo(0,0);
  };

  const handleExportPdfClick = async () => {
    if (!state.submittedData || !state.trackingCode) { toast({ variant: "destructive", title: "خطأ", description: "لا توجد بيانات طلب لتصديرها.", }); return; }
    toast({ title: "جاري تجهيز PDF", description: "قد تستغرق هذه العملية بضع لحظات...", });
    let pdfRequestDate = requestDate;
    if (rawRequestDateTime) {
      const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' };
      const formattedDate = rawRequestDateTime.toLocaleDateString('en-CA', dateOptions);
      const formattedTime = rawRequestDateTime.toLocaleTimeString('en-US', timeOptions);
      pdfRequestDate = `${formattedDate} - ${formattedTime}`;
    }
    const pdfContentElement = document.getElementById('pdfCardContainer');
    if (!pdfContentElement) { toast({ variant: "destructive", title: "Error", description: "PDF content element not found. PDF generation skipped.", }); return; }
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const canvas = await html2canvas(pdfContentElement, {
            scale: 2, useCORS: true, allowTaint: true, logging: process.env.NODE_ENV === 'development',
            onclone: (clonedDoc) => {
                const fontLink = clonedDoc.createElement('link'); fontLink.href = "https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap"; fontLink.rel = "stylesheet"; clonedDoc.head.appendChild(fontLink);
                const styleTag = clonedDoc.createElement('style'); styleTag.innerHTML = `body, * { font-family: 'Almarai', "Trebuchet MS", sans-serif !important; }`; clonedDoc.head.appendChild(styleTag);
            }
        });
        const imgData = canvas.toDataURL('image/png'); const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth(); const pdfHeight = pdf.internal.pageSize.getHeight(); const imgProps = pdf.getImageProperties(imgData); const ratio = imgProps.width / imgProps.height;
        let imgWidth = pdfWidth - 20; let imgHeight = imgWidth / ratio;
        if (imgHeight > pdfHeight - 20) { imgHeight = pdfHeight - 20; imgWidth = imgHeight * ratio; }
        const x = (pdfWidth - imgWidth) / 2; const y = 10;
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight); pdf.save(`Avaz_Request_${state.trackingCode}.pdf`);
        toast({ title: "تم التصدير بنجاح", description: `تم حفظ الملف Avaz_Request_${state.trackingCode}.pdf`, });
    } catch (error) {
        console.error('PDF Export Error:', error); toast({ variant: "destructive", title: "فشل تصدير PDF", description: "حدث خطأ أثناء إنشاء الملف.", });
    }
  };

  const handleFinishClick = () => { handleNewRequestButtonClickInternal(); router.push("/"); };

  const handleRegionChange = (selectedValue: RiyadhRegion | undefined) => {
    form.setValue("region", selectedValue);
    form.setValue("neighborhoodPreferences", [], { shouldValidate: true }); 
  };


  if (state.trackingCode && !isSubmitting && state.submittedData) {
    return (
      <>
      <Card id="success-card-for-pdf" className="w-full max-w-2xl mx-auto shadow-xl border-primary my-12">
        <CardHeader className="bg-primary/10"><CardTitle className="text-center text-2xl text-primary font-headline flex items-center justify-center"><CheckCircle className="h-8 w-8 mr-3 text-green-500 rtl:ml-3 rtl:mr-0" /> تم استلام طلبك بنجاح!</CardTitle></CardHeader>
        <CardContent className="text-center space-y-4 p-6">
          <p className="text-lg">تفاصيل الطلب:</p><p className="text-muted-foreground">رقم الطلب الخاص بك هو:</p>
          <p className="text-3xl font-bold text-accent bg-accent/10 p-3 rounded-md inline-block" dir="ltr">{state.trackingCode}</p>
          <p className="text-sm text-muted-foreground">يرجى حفظ هذا الرقم لمتابعة حالة طلبك.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
            <Button onClick={handleNewRequestButtonClickInternal} variant="outline" className="w-full sm:w-auto"><RefreshCw className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> تقديم طلب جديد</Button>
            <Button onClick={handleExportPdfClick} variant="outline" className="w-full sm:w-auto"><FileDown className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> تصدير PDF</Button>
            <Button onClick={handleFinishClick} variant="default" className="w-full sm:w-auto bg-primary hover:bg-primary/90"><XCircle className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> إنهاء</Button>
          </div></CardContent></Card>
      <div id="pdfCardContainer" ref={pdfCardRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '210mm', direction: 'rtl' }}>
        {state.submittedData && state.trackingCode && rawRequestDateTime && (
            <PdfRequestSummaryCard
                requestId={state.trackingCode}
                requestDate={`${rawRequestDateTime.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })} - ${rawRequestDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}`}
                clientRole={state.submittedData.clientRole} otherClientRole={state.submittedData.otherClientRole}
                requestPurpose={state.submittedData.requestPurpose} usage={state.submittedData.usage}
                propertyType={state.submittedData.propertyType} otherPropertyType={state.submittedData.otherPropertyType}
                commercialCategory={state.submittedData.commercialCategory} otherCommercialCategory={state.submittedData.otherCommercialCategory}
                commercialActivity={state.submittedData.commercialActivity} otherCommercialActivity={state.submittedData.otherCommercialActivity}
                branchCount={state.submittedData.branchCount} region={state.submittedData.region}
                neighborhoodPreferences={state.submittedData.neighborhoodPreferences}
                minArea={state.submittedData.minArea} maxArea={state.submittedData.maxArea}
                budgetMin={state.submittedData.budgetMin} budgetMax={state.submittedData.budgetMax}
                notes={state.submittedData.notes} mapScreenshot={tempScreenshot} /> )} </div> </> ); }

  return (
    <>
      <div className="bg-card p-6 md:p-10 rounded-2xl shadow-lg mb-8 border">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-6 border-b border-border gap-4">
            <div><h2 className="text-2xl md:text-3xl font-bold text-accent font-headline">بطاقة طلب عقار</h2><p className="text-muted-foreground mt-2">يرجى تعبئة البيانات بدقة لإيجاد أفضل الفرص لكم</p></div>
             <div className="text-left rtl:text-right bg-muted/30 p-3 rounded-lg border text-sm shrink-0 w-full sm:w-auto" dir="ltr">
                <div className="flex items-center gap-2 justify-start"><Hash className="w-4 h-4 text-primary" /><span>رقم الطلب</span>: <span className="font-mono font-bold text-foreground">{requestId}</span></div>
                <div className="flex items-center gap-2 mt-2 justify-start"><Calendar className="w-4 h-4 text-primary" /><span>التاريخ</span>: <span className="font-mono text-foreground">{requestDate}</span></div>
            </div></div>
        <Form {...form}><form ref={formRef} onSubmit={handleFormSubmit} className="space-y-10 md:space-y-14"><input type="hidden" {...form.register("id")} />
            <fieldset><legend className="text-xl md:text-2xl font-bold text-accent mb-6 flex items-center gap-2"><User className="w-6 h-6 text-primary"/> 1. بيانات العميل</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField control={form.control} name="clientName" render={({ field }) => (<FormItem className="input-group"><FormLabel>الاسم الكامل</FormLabel><FormControl><Input placeholder="مثال: عمر الحيدري" {...field} className="form-input form-input-padding" /></FormControl><User className="input-icon" /><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="clientPhone" render={({ field }) => (<FormItem className="input-group"><FormLabel>رقم الجوال</FormLabel><FormControl><Input type="tel" dir="ltr" placeholder="05xxxxxxxx" {...field} className="form-input form-input-padding" /></FormControl><Smartphone className="input-icon" /><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="clientEmail" render={({ field }) => (<FormItem className="input-group"><FormLabel>البريد الإلكتروني (اختياري)</FormLabel><FormControl><Input type="email" dir="ltr" placeholder="user@example.com" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Mail className="input-icon" /><FormMessage /></FormItem>)} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    <FormField control={form.control} name="clientRole" render={({ field }) => (<FormItem className="input-group"><FormLabel>صفة العميل</FormLabel><Select onValueChange={(value) => { field.onChange(value); form.setValue("otherClientRole", ""); }} value={field.value}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder="--- اختر الصفة ---" /></SelectTrigger></FormControl><UserCheck className="input-icon" /><SelectContent>{clientRoles.map(role => (<SelectItem key={role.value} value={role.value}>{role.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                    {currentClientRole === "Other" && (<FormField control={form.control} name="otherClientRole" render={({ field }) => (<FormItem className="input-group"><FormLabel>يرجى تحديد الصفة</FormLabel><FormControl><Input placeholder="مثال: مستشار" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Pencil className="input-icon" /><FormMessage /></FormItem>)} /> )}</div></fieldset>
            <fieldset><legend className="text-xl md:text-2xl font-bold text-accent mb-6 flex items-center gap-2"><Archive className="w-6 h-6 text-primary"/> 2. تفاصيل الطلب</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="requestPurpose" render={({ field }) => (<FormItem className="input-group"><FormLabel>الغرض من الطلب</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder="--- اختر الغرض ---" /></SelectTrigger></FormControl><Archive className="input-icon" /><SelectContent>{requestPurposes.map(purpose => (<SelectItem key={purpose.value} value={purpose.value}>{purpose.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="usage" render={({ field }) => (<FormItem><FormLabel>الاستخدام</FormLabel><RadioGroup onValueChange={(value) => { field.onChange(value); form.setValue("propertyType", undefined); form.setValue("otherPropertyType", ""); form.setValue("commercialCategory", undefined); form.setValue("otherCommercialCategory", ""); form.setValue("commercialActivity", ""); form.setValue("otherCommercialActivity", ""); form.setValue("companyName", ""); form.setValue("branchCount", undefined); }} value={field.value} className="grid grid-cols-2 gap-3 mt-2">{propertyUsages.map(usageOpt => (<FormItem key={usageOpt.value}><FormControl><RadioGroupItem value={usageOpt.value} id={`usage-${usageOpt.value}`} className="sr-only" /></FormControl><FormLabel htmlFor={`usage-${usageOpt.value}`} className="usage-option-label">{usageOpt.labelAr}</FormLabel></FormItem>))}</RadioGroup><FormMessage /></FormItem>)} /></div>
                {currentUsage && (<div className="mt-6 space-y-6"><FormField control={form.control} name="propertyType" render={({ field }) => (<FormItem className="input-group"><FormLabel>نوع العقار</FormLabel><Select onValueChange={(value) => { field.onChange(value); form.setValue("otherPropertyType", ""); }} value={field.value}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder={currentUsage === "Residential" ? "--- اختر نوع العقار السكني ---" : "--- اختر نوع العقار التجاري ---"} /></SelectTrigger></FormControl><Building2 className="input-icon" /><SelectContent>{(currentUsage === "Residential" ? residentialPropertyTypes : commercialPropertyTypes).map(type => (<SelectItem key={type.value} value={type.value}>{type.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                        {currentPropertyType === "Other" && (<FormField control={form.control} name="otherPropertyType" render={({ field }) => (<FormItem className="input-group"><FormLabel>يرجى تحديد النوع</FormLabel><FormControl><Input placeholder="مثال: شاليه، استراحة" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Pencil className="input-icon" /><FormMessage /></FormItem>)} /> )}</div>)}
                {currentUsage === "Commercial" && (<div className="mt-6 space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><FormField control={form.control} name="commercialCategory" render={({ field }) => (<FormItem className="input-group"><FormLabel>فئة النشاط</FormLabel><Select onValueChange={(value) => { field.onChange(value); form.setValue("commercialActivity", undefined); form.setValue("otherCommercialActivity", ""); }} value={field.value}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder="--- اختر الفئة ---" /></SelectTrigger></FormControl><LayoutGrid className="input-icon" /><SelectContent>{commercialCategoriesList.map(cat => (<SelectItem key={cat.value} value={cat.value}>{cat.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                            {currentCommercialCategory === "Other" && (<FormField control={form.control} name="otherCommercialCategory" render={({ field }) => (<FormItem className="input-group"><FormLabel>يرجى تحديد الفئة</FormLabel><FormControl><Input placeholder="مثال: خدمات بترولية" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Pencil className="input-icon" /><FormMessage /></FormItem>)} /> )}</div>
                        {currentCommercialCategory && currentCommercialCategory !== "Other" && (() => { const categoryKey = commercialCategoriesList.find(c => c.labelAr === currentCommercialCategory || c.value === currentCommercialCategory)?.value; const activities = categoryKey ? (commercialActivitiesByCat[categoryKey] || []) : [];
                            return activities.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-6"><FormField control={form.control} name="commercialActivity" render={({ field }) => (<FormItem className="input-group"><FormLabel>النشاط التجاري</FormLabel><Select onValueChange={(value) => { field.onChange(value); form.setValue("otherCommercialActivity","");}} value={field.value}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder="--- اختر النشاط ---" /></SelectTrigger></FormControl><Briefcase className="input-icon" /><SelectContent>{activities.map(act => (<SelectItem key={act.value} value={act.value}>{act.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                                    {(currentCommercialActivity?.startsWith("أخرى") || currentCommercialActivity?.startsWith("Other") || currentCommercialActivity === "Other Activity") && (<FormField control={form.control} name="otherCommercialActivity" render={({ field }) => (<FormItem className="input-group"><FormLabel>يرجى تحديد النشاط</FormLabel><FormControl><Input placeholder="مثال: بيع معدات رياضية" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Pencil className="input-icon" /><FormMessage /></FormItem>)} /> )}</div>) : null; })()}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><FormField control={form.control} name="companyName" render={({ field }) => (<FormItem className="input-group"><FormLabel>اسم المنشأة (إن وجد)</FormLabel><FormControl><Input placeholder="مثال: شركة الأمل للتجارة" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Building className="input-icon" /><FormMessage /></FormItem>)} />
                             <FormField control={form.control} name="branchCount" render={({ field }) => (<FormItem className="input-group"><FormLabel>عدد الفروع (إن وجد)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="0" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0" /></FormControl><GitBranch className="input-icon" /><FormMessage /></FormItem>)} /></div></div>)}</fieldset>
            <fieldset><legend className="text-xl md:text-2xl font-bold text-accent mb-6 flex items-center gap-2"><MapPin className="w-6 h-6 text-primary"/> 3. الموقع والمتطلبات</legend>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="region" render={({ field }) => (<FormItem className="input-group"><FormLabel>النطاق</FormLabel><Select onValueChange={(value) => handleRegionChange(value as RiyadhRegion | undefined)} value={field.value ?? undefined}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder="--- اختر النطاق ---" /></SelectTrigger></FormControl><Globe className="input-icon" /><SelectContent>{RIYADH_REGIONS.map(regionOpt => (<SelectItem key={regionOpt.value} value={regionOpt.value}>{regionOpt.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="neighborhoodPreferences" render={({ field: controllerField }) => (<FormItem className="input-group"><FormLabel>تفضيلات الأحياء</FormLabel><Controller control={form.control} name="neighborhoodPreferences" render={({ field: controllerField }) => (<DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="w-full justify-between form-input !px-3 !py-2 h-10"><span className="truncate">{controllerField.value && controllerField.value.length > 0 ? controllerField.value.join('، ') : "--- اختر الأحياء ---"}</span><ChevronDown className="h-4 w-4 opacity-50" /></Button></DropdownMenuTrigger><ListFilter className="input-icon" /><DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-60 overflow-y-auto"><DropdownMenuLabel>اختر حي أو أكثر</DropdownMenuLabel><DropdownMenuSeparator />{availableNeighborhoods.map((hood) => (<DropdownMenuCheckboxItem key={hood.value} checked={controllerField.value?.includes(hood.value)} onCheckedChange={(checked) => { const currentValues = controllerField.value || []; if (checked) { controllerField.onChange([...currentValues, hood.value]); } else { controllerField.onChange(currentValues.filter(v => v !== hood.value)); } }}>{hood.labelAr}</DropdownMenuCheckboxItem>))}</DropdownMenuContent></DropdownMenu>)} /><FormMessage /></FormItem>)} />
                    </div>
                    <div><FormLabel>تحديد نطاق جغرافي (اختياري)</FormLabel><DynamicLocationPicker onLocationSelect={handleLocationSelection} initialPosition={selectedLocation || undefined}/>
                         {selectedLocation && (<p className="mt-2 text-sm text-muted-foreground" dir="ltr">الموقع المحدد: {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}</p>)}
                        {tempScreenshot && (<div className="mt-2"><FormLabel className="text-xs">معاينة صورة الخريطة للـ PDF:</FormLabel><Image src={tempScreenshot} alt="Map screenshot preview" width={200} height={100} className="border rounded-md mt-1" data-ai-hint="map location"/></div>)}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="minArea" render={({ field }) => (<FormItem className="input-group"><FormLabel>أدنى مساحة (م²)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="100" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><Minimize2 className="input-icon" /><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="maxArea" render={({ field }) => (<FormItem className="input-group"><FormLabel>أقصى مساحة (م²)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="500" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><Maximize2 className="input-icon" /><FormMessage /></FormItem>)} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="budgetMin" render={({ field }) => (<FormItem className="input-group"><FormLabel>الميزانية المرصودة (أدنى - SAR)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="500000" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><DollarSign className="input-icon" /><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="budgetMax" render={({ field }) => (<FormItem className="input-group"><FormLabel>الميزانية المرصودة (أقصى - SAR)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="1000000" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><DollarSign className="input-icon" /><FormMessage /></FormItem>)} /></div></div></fieldset>
            <fieldset><legend className="text-xl md:text-2xl font-bold text-accent mb-6 flex items-center gap-2"><LocateFixed className="w-6 h-6 text-primary"/> 4. تفاصيل إضافية</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="contactPoint" render={({ field }) => (<FormItem className="input-group"><FormLabel>كيف سمعت عنا؟</FormLabel><Select onValueChange={(value) => { field.onChange(value); form.setValue("otherContactPoint", ""); }} value={field.value}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder="--- اختر ---" /></SelectTrigger></FormControl><LocateFixed className="input-icon" /><SelectContent>{contactPoints.map(cp => (<SelectItem key={cp.value} value={cp.value}>{cp.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                    {currentContactPoint === "Other" && (<FormField control={form.control} name="otherContactPoint" render={({ field }) => (<FormItem className="input-group"><FormLabel>يرجى التحديد</FormLabel><FormControl><Input placeholder="مثال: إعلان في صحيفة" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Pencil className="input-icon" /><FormMessage /></FormItem>)} /> )}</div>
                     <div className="mt-6"><FormField control={form.control} name="notes" render={({ field }) => (<FormItem className="input-group"><FormLabel>ملاحظات</FormLabel><FormControl><Textarea placeholder="اكتب أي متطلبات خاصة هنا (اختياري)..." {...field} value={field.value ?? ''} className="form-input form-textarea-padding" rows={4}/></FormControl><MessageSquareText className="input-icon textarea-icon" /><FormMessage /></FormItem>)} /></div></fieldset>
            {state.errors?._form && (<div className="flex items-center p-3 bg-destructive/10 border border-destructive text-destructive rounded-md"><AlertCircle className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" /><p>{state.errors._form.join(", ")}</p></div>)}
            <div className="pt-8 border-t flex flex-wrap justify-end items-center gap-4">
                <Button type="button" variant="outline" onClick={handleNewRequestButtonClickInternal} className="w-full sm:w-auto"><RefreshCw className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> طلب جديد</Button>
                <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin mr-2 rtl:ml-2 rtl:mr-0" /> : <Send className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />}حفظ وإرسال الطلب</Button>
            </div></form></Form></div></> );}