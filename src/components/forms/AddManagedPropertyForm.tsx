
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
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect, useState, useRef, useMemo, useActionState, startTransition } from "react";
import { submitNewManagedProperty, type NewManagedPropertyFormState } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Loader2, User, Smartphone, Mail, Hash, Building2 as Building2Icon, Edit3, MapPin, Maximize2, DollarSign, FileText, MessageSquareText, RefreshCw, Send, Image as ImageIcon, XCircle, Info, Zap, ShieldCheck, Sparkles, Wrench, ReceiptText, Droplets, Siren, ArrowUpDown, Wifi, Car, Cog, Calendar, UserCheck, BookUser, Link2, Tag, ListChecks, Briefcase, Store, Archive, DoorOpen, Package, Globe } from "lucide-react";
import type { Location, PropertyUsage, ResidentialPropertyType, CommercialPropertyType, PropertyListingPurpose, ServiceId, PropertyStatus, RentPriceType, PropertyType as FullPropertyType, RiyadhRegion } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { CarIcon } from "@/components/icons/CarIcon";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, Tooltip as RechartsTooltip } from 'recharts';
import { RIYADH_REGIONS, RIYADH_NEIGHBORHOODS_WITH_REGIONS, ALL_RIYADH_NEIGHBORHOODS_FOR_SELECT } from "@/lib/constants";
import DynamicLocationPicker from "../map/DynamicLocationPicker";


const propertyUsages: { value: PropertyUsage; labelAr: string; labelEn: string }[] = [
  { value: "Residential", labelAr: "سكني", labelEn: "Residential" },
  { value: "Commercial", labelAr: "تجاري", labelEn: "Commercial" },
];

const residentialPropertyTypes: { value: ResidentialPropertyType; labelAr: string; labelEn: string }[] = [
  { value: "Residential Land", labelAr: "أرض سكنية", labelEn: "Residential Land" }, { value: "Palace", labelAr: "قصر", labelEn: "Palace" },
  { value: "Villa", labelAr: "فيلا", labelEn: "Villa" }, { value: "Duplex", labelAr: "دوبلكس", labelEn: "Duplex" },
  { value: "Apartment", labelAr: "شقة", labelEn: "Apartment" }, { value: "Floor", labelAr: "دور", labelEn: "Floor" },
  { value: "Building", labelAr: "عمارة", labelEn: "Building" }, { value: "Residential Complex", labelAr: "مجمع سكني", labelEn: "Residential Complex" },
  { value: "Other", labelAr: "أخرى", labelEn: "Other" },
];

const commercialPropertyTypes: { value: CommercialPropertyType; labelAr: string; labelEn: string }[] = [
  { value: "Commercial Land", labelAr: "أرض تجارية", labelEn: "Commercial Land" }, { value: "Showroom", labelAr: "معرض", labelEn: "Showroom" },
  { value: "Office", labelAr: "مكتب", labelEn: "Office" }, { value: "Commercial Complex", labelAr: "مجمع تجاري", labelEn: "Commercial Complex" },
  { value: "Commercial Building", labelAr: "عمارة تجارية", labelEn: "Commercial Building" },
  { value: "Warehouse", labelAr: "مستودع", labelEn: "Warehouse" }, { value: "Workshop", labelAr: "ورشة", labelEn: "Workshop" },
  { value: "Gas Station", labelAr: "محطة وقود", labelEn: "Gas Station" },
  { value: "Other", labelAr: "أخرى", labelEn: "Other" },
];

const propertyListingPurposes: { value: PropertyListingPurpose; labelAr: string; labelEn: string }[] = [
    { value: "For Sale", labelAr: "للبيع", labelEn: "For Sale" },
    { value: "For Rent", labelAr: "للإيجار", labelEn: "For Rent" },
    { value: "For Investment", labelAr: "للاستثمار", labelEn: "For Investment"},
];

const propertyStatuses: { value: PropertyStatus; labelAr: string }[] = [
    { value: "متاح", labelAr: "متاح" }, { value: "قيد التفاوض", labelAr: "قيد التفاوض" },
    { value: "محجوز", labelAr: "محجوز" }, { value: "مباع", labelAr: "مباع" },
    { value: "مؤجر", labelAr: "مؤجر" },
];

const rentPriceTypes: { value: RentPriceType; labelAr: string; labelEn: string }[] = [
  { value: "AnnualUnit", labelAr: "التأجير بكامل الوحدة (سنوي)", labelEn: "Annual Rent (Whole Unit)" },
  { value: "PerMeter", labelAr: "التأجير بسعر المتر (سنوي)", labelEn: "Rent per Meter (Annual)" },
];

export const serviceOptions: { id: ServiceId; label: string; icon: React.ReactElement }[] = [
  { id: 'cleaning_utilities', label: 'نظافة المرافق', icon: <Building2Icon className="w-5 h-5" /> }, { id: 'corridor_electricity', label: 'كهرباء الممرات', icon: <Zap className="w-5 h-5" /> },
  { id: 'security_guard', label: 'حراسة', icon: <ShieldCheck className="w-5 h-5" /> }, { id: 'general_cleaning', label: 'نظافة عامة', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'general_maintenance', label: 'صيانة عامة', icon: <Wrench className="w-5 h-5" /> }, { id: 'electricity_bill_mgmt', label: 'إدارة فاتورة الكهرباء', icon: <ReceiptText className="w-5 h-5" /> },
  { id: 'water_supply', label: 'مياه', icon: <Droplets className="w-5 h-5" /> }, { id: 'civil_defense_compliance', label: 'متوافق مع الدفاع المدني', icon: <Siren className="w-5 h-5" /> },
  { id: 'elevators', label: 'مصاعد', icon: <ArrowUpDown className="w-5 h-5" /> }, { id: 'parking', label: 'موقف سيارات', icon: <CarIcon className="w-5 h-5" /> },
  { id: 'wifi', label: 'واي فاي', icon: <Wifi className="w-5 h-5" /> },
];

const propertyStatusEnum = z.enum(["متاح", "قيد التفاوض", "محجوز", "مباع", "مؤجر"], { message: "الرجاء اختيار حالة العقار." });
const propertyUsageEnum = z.enum(["Residential", "Commercial"], { message: "الرجاء اختيار استخدام العقار." });
const propertyListingPurposeEnum = z.enum(["For Sale", "For Rent", "For Investment"], { message: "الرجاء اختيار الغرض من عرض العقار." });
const serviceIdEnum = z.enum(['cleaning_utilities', 'corridor_electricity', 'security_guard', 'general_cleaning', 'general_maintenance', 'electricity_bill_mgmt', 'water_supply', 'civil_defense_compliance', 'elevators', 'parking', 'wifi']);
const riyadhRegionEnum = z.custom<RiyadhRegion>((val) => RIYADH_REGIONS.map(r => r.value).includes(val as RiyadhRegion) || val === undefined, { message: "الرجاء اختيار النطاق" }).optional();


const managedPropertyFormSchema = z.object({
  id: z.string().min(1, "معرف العقار مطلوب."),
  code: z.string().min(1, "كود العقار مطلوب."),
  title: z.string().min(3, "عنوان العقار مطلوب (3 أحرف على الأقل)."),
  usage: propertyUsageEnum,
  propertyType: z.string({ required_error: "الرجاء اختيار نوع العقار." }),
  otherPropertyType: z.string().optional(),
  listingPurpose: propertyListingPurposeEnum,
  region: riyadhRegionEnum,
  location: z.string().min(1, "الحي مطلوب."), 
  locationCoordinatesLat: z.coerce.number().optional(),
  locationCoordinatesLng: z.coerce.number().optional(),
  price: z.coerce.number().min(0, "السعر لا يمكن أن يكون سالبًا.").optional(),
  priceSuffix: z.string().optional(),
  rentPriceType: z.custom<RentPriceType>().optional(),
  area: z.coerce.number().min(1, "المساحة يجب أن تكون أكبر من صفر."),
  description: z.string().optional(),
  status: propertyStatusEnum,
  advertiserNumber: z.string().optional(),
  realEstateRegistryNumber: z.string().optional(),
  deedNumber: z.string().optional(),
  imageUrl: z.string().optional(),
  dataAiHint: z.string().optional(),
  features: z.string().optional(),
  agentName: z.string().optional(),
  agentPhone: z.string().optional().refine(val => !val || /^05\d{8}$/.test(val), "رقم جوال المسوق غير صالح."),
  agentEmail: z.string().email("البريد الإلكتروني للمسوق غير صالح.").optional().or(z.literal('')),
  yearBuilt: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 5).optional().transform(val => val === 0 || val === null ? undefined : val),
  floors: z.coerce.number().int().min(0).optional().transform(val => val === 0 || val === null ? undefined : val),
  parkingSpots: z.coerce.number().int().min(0).optional().transform(val => val === 0 || val === null ? undefined : val),
  detailedDescription: z.string().optional(),
  propertyProfilePdfUrl: z.string().url("رابط ملف PDF غير صالح.").optional().or(z.literal('')),
  services: z.array(serviceIdEnum).optional(),
  numberOfOffices: z.coerce.number().int().min(0).optional().transform(val => val === 0 || val === null ? undefined : val),
  numberOfShowrooms: z.coerce.number().int().min(0).optional().transform(val => val === 0 || val === null ? undefined : val),
  totalUnits: z.coerce.number().int().min(0).optional().transform(val => val === 0 || val === null ? undefined : val),
  rentedUnits: z.coerce.number().int().min(0).optional().transform(val => val === 0 || val === null ? undefined : val),
}).superRefine((data, ctx) => {
    if (data.usage === "Residential" && data.propertyType && data.propertyType !== "Other" && !residentialPropertyTypes.map(rt => rt.value).includes(data.propertyType as ResidentialPropertyType)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "نوع العقار السكني المحدد غير صالح.", path: ["propertyType"] });
    }
    if (data.usage === "Commercial" && data.propertyType && data.propertyType !== "Other" && !commercialPropertyTypes.map(ct => ct.value).includes(data.propertyType as CommercialPropertyType)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "نوع العقار التجاري المحدد غير صالح.", path: ["propertyType"] });
    }
    if (data.propertyType === "Other" && !data.otherPropertyType?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "يرجى تحديد نوع العقار الآخر.", path: ["otherPropertyType"] });
    }
    if (data.listingPurpose === "For Rent" && !data.rentPriceType) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "الرجاء اختيار نوع سعر الإيجار.", path: ["rentPriceType"] });
    }
    if ((data.agentName && !data.agentPhone) || (!data.agentName && data.agentPhone)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "يجب إدخال اسم ورقم جوال المسوق معًا أو تركهما فارغين.", path: ["agentName"] });
    }
    if (data.totalUnits !== undefined && data.rentedUnits !== undefined && data.rentedUnits > data.totalUnits) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "عدد الوحدات المؤجرة لا يمكن أن يكون أكبر من إجمالي عدد الوحدات.",
            path: ["rentedUnits"],
        });
    }
});

export default function AddManagedPropertyForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [propertyImagePreview, setPropertyImagePreview] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const [autoPropertyId, setAutoPropertyId] = useState("");
  const [propertyDate, setPropertyDate] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const generateNewPropertyInfo = () => {
    const now = new Date(); const year = now.getFullYear().toString().slice(-2); const month = (now.getMonth() + 1).toString(); 
    const uniqueNumForPA = (now.getSeconds() * 1000 + now.getMilliseconds()) % 99; const sequentialIdPartPA = (1 + uniqueNumForPA).toString().padStart(2, '0');
    const id = `PA-${year}-${month}-${sequentialIdPartPA}`;
    const displayDate = `${now.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    setAutoPropertyId(id); setPropertyDate(displayDate); form.setValue("id", id, { shouldValidate: true });
  };

  useEffect(() => { generateNewPropertyInfo(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialState: NewManagedPropertyFormState = { message: "", errors: {}, submittedData: undefined };
  const [state, formAction] = useActionState(submitNewManagedProperty, initialState);
  const isSubmitting = (form.formState.isSubmitting || (state && 'message' in state && state.message === "pending")); // Combine RHF and useActionState pending states

  const form = useForm<z.infer<typeof managedPropertyFormSchema>>({
    resolver: zodResolver(managedPropertyFormSchema),
    defaultValues: {
      id: "", code: "", title: "", usage: undefined, propertyType: undefined, otherPropertyType: "",
      listingPurpose: undefined, region: undefined, location: undefined, price: undefined, priceSuffix: "", rentPriceType: undefined,
      area: undefined, description: "", status: undefined, advertiserNumber: "", realEstateRegistryNumber: "",
      deedNumber: "", imageUrl: undefined, dataAiHint: "", features: "", agentName: "", agentPhone: "", agentEmail: "",
      yearBuilt: undefined, floors: undefined, parkingSpots: undefined, detailedDescription: "", propertyProfilePdfUrl: "", services: [],
      numberOfOffices: undefined, numberOfShowrooms: undefined, totalUnits: undefined, rentedUnits: undefined,
      locationCoordinatesLat: undefined, locationCoordinatesLng: undefined
    },
  });

  const currentUsage = form.watch("usage");
  const currentPropertyType = form.watch("propertyType");
  const currentListingPurpose = form.watch("listingPurpose");
  const currentRegion = form.watch("region");
  const totalUnits = form.watch("totalUnits");
  const rentedUnits = form.watch("rentedUnits");

  const availableNeighborhoods = React.useMemo(() => {
    if (!currentRegion || currentRegion === "Other") {
      return ALL_RIYADH_NEIGHBORHOODS_FOR_SELECT;
    }
    return RIYADH_NEIGHBORHOODS_WITH_REGIONS
      .filter(hood => hood.region === currentRegion)
      .map(n => ({value: n.value, labelAr: n.labelAr, labelEn: n.labelEn}))
      .sort((a,b) => a.labelAr.localeCompare(b.labelAr, 'ar'));
  }, [currentRegion]);

  const vacantUnits = useMemo(() => (typeof totalUnits === 'number' && typeof rentedUnits === 'number') ? totalUnits - rentedUnits : undefined, [totalUnits, rentedUnits]);
  const occupancyPercentage = useMemo(() => (typeof totalUnits === 'number' && typeof rentedUnits === 'number' && totalUnits > 0) ? Math.round((rentedUnits / totalUnits) * 100) : 0, [totalUnits, rentedUnits]);
  const occupancyChartData = [{ name: 'Occupancy', value: occupancyPercentage }];

  useEffect(() => {
    if (state.message && !state.errors && state.propertyId) { /* Success UI handled by conditional rendering */ }
    else if (state.message && (!state.errors || (state.errors && Object.keys(state.errors).length === 0 && !state.errors._form)) && !state.propertyId) {
        toast({ variant: "destructive", title: "فشل الإرسال", description: state.message });
    } else if (state.errors?._form) {
       toast({ variant: "destructive", title: "خطأ في الإرسال", description: state.errors._form.join(", ") });
    }}, [state, toast]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast({ variant: "destructive", title: "خطأ", description: "حجم الصورة يتجاوز 5MB." }); setPropertyImagePreview(null); form.setValue("imageUrl", undefined); event.target.value = ""; return; }
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) { toast({ variant: "destructive", title: "خطأ", description: "نوع الملف غير مدعوم. الرجاء اختيار صورة (JPEG, PNG, WEBP, GIF)." }); setPropertyImagePreview(null); form.setValue("imageUrl", undefined); event.target.value = ""; return; }
      const reader = new FileReader();
      reader.onloadend = () => { setPropertyImagePreview(reader.result as string); form.setValue("imageUrl", reader.result as string, { shouldValidate: true }); };
      reader.readAsDataURL(file);
    } else { setPropertyImagePreview(null); form.setValue("imageUrl", undefined); }};

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    const isValid = await form.trigger();
    if (isValid && formRef.current) {
        const formData = new FormData(formRef.current);
        if(selectedLocation) {
            formData.set('locationCoordinatesLat', String(selectedLocation.lat));
            formData.set('locationCoordinatesLng', String(selectedLocation.lng));
        }
        if (propertyImagePreview) {
            formData.set('imageUrl', propertyImagePreview);
        }
        startTransition(() => {
            formAction(formData);
        });
    } else {
        const firstErrorKey = Object.keys(form.formState.errors)[0];
        if (firstErrorKey) {
            const firstError = form.formState.errors[firstErrorKey as keyof z.infer<typeof managedPropertyFormSchema>];
            toast({ variant: "destructive", title: "خطأ في الإدخال", description: firstError?.message || "الرجاء مراجعة الحقول المميزة." });
            const element = document.getElementsByName(firstErrorKey)[0]; element?.focus({ preventScroll: true }); element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else { toast({ variant: "destructive", title: "خطأ في الإدخال", description: "الرجاء التأكد من تعبئة جميع الحقول المطلوبة بشكل صحيح." }); }
    }
};

  const handleNewPropertyButtonClickInternal = () => {
    form.reset(); generateNewPropertyInfo(); setPropertyImagePreview(null);
    const fileInput = formRef.current?.querySelector('input[type="file"]') as HTMLInputElement | null; if (fileInput) fileInput.value = "";
    if (state) { state.propertyId = undefined; state.message = ""; state.errors = undefined; state.submittedData = undefined; }
    toast({ title: "تم تجهيز بطاقة عرض عقار مُدار جديدة" }); window.scrollTo(0,0); };

  const handleFinishClick = () => { handleNewPropertyButtonClickInternal(); router.push("/dashboard"); };

  const handleLocationChange = (selectedValue: string | undefined) => {
    form.setValue("location", selectedValue, { shouldValidate: true }); 
    if (selectedValue) {
      const selectedHoodObj = RIYADH_NEIGHBORHOODS_WITH_REGIONS.find(h => h.value === selectedValue);
      if (selectedHoodObj && selectedHoodObj.region && form.getValues("region") !== selectedHoodObj.region) {
        form.setValue('region', selectedHoodObj.region, { shouldValidate: true });
      }
    }
  };

  const handleRegionChange = (selectedValue: RiyadhRegion | undefined) => {
    form.setValue("region", selectedValue, { shouldValidate: true });
    form.setValue("location", undefined, { shouldValidate: true }); 
  };
  
  const handleLocationSelection = (loc: Location | null, screenshotUri?: string | null) => {
    setSelectedLocation(loc);
    if(loc) {
        form.setValue('locationCoordinatesLat', loc.lat);
        form.setValue('locationCoordinatesLng', loc.lng);
    } else {
        form.setValue('locationCoordinatesLat', undefined);
        form.setValue('locationCoordinatesLng', undefined);
    }
  };


  if (state.propertyId && !isSubmitting && state.submittedData) {
    return (<Card className="w-full max-w-2xl mx-auto shadow-xl border-primary my-12"><CardHeader className="bg-primary/10"><CardTitle className="text-center text-2xl text-primary font-headline flex items-center justify-center"><CheckCircle className="h-8 w-8 mr-3 text-green-500 rtl:ml-3 rtl:mr-0" /> {state.message || "تم إضافة العقار المُدار بنجاح!"}</CardTitle></CardHeader><CardContent className="text-center space-y-4 p-6"><p className="text-lg">معرّف العقار المُضاف هو:</p><p className="text-3xl font-bold text-accent bg-accent/10 p-3 rounded-md inline-block" dir=\"ltr">{state.propertyId}</p><div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6"><Button onClick={handleNewPropertyButtonClickInternal} variant="outline" className="w-full sm:w-auto"><RefreshCw className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> إضافة عقار مُدار آخر</Button><Button onClick={handleFinishClick} variant="default" className="w-full sm:w-auto bg-primary hover:bg-primary/90"><XCircle className=\"mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> العودة إلى لوحة التحكم</Button></div></CardContent></Card>); }

  return (
    <div className="bg-background p-6 md:p-10 rounded-2xl shadow-lg mb-8 border" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-6 border-b border-border gap-4">
        <div><h2 className="text-2xl md:text-3xl font-bold text-accent font-headline">إضافة عقار مُدار</h2><p className="text-muted-foreground mt-2">يرجى تعبئة بيانات العقار الذي تديره AVAZ.</p></div>
        <div className="text-left rtl:text-right bg-muted/30 p-3 rounded-lg border text-sm shrink-0 w-full sm:w-auto" dir="ltr">
          <div className="flex items-center gap-2 justify-start"><Hash className="w-4 h-4 text-primary" /><span>معرف العقار</span>: <span className="font-mono font-bold text-foreground">{autoPropertyId}</span></div>
          <div className="flex items-center gap-2 mt-2 justify-start"><Calendar className="w-4 h-4 text-primary" /><span>تاريخ الإضافة</span>: <span className="font-mono text-foreground">{propertyDate}</span></div></div></div>
      <Form {...form}><form ref={formRef} onSubmit={handleFormSubmit} className="space-y-10 md:space-y-14"><input type="hidden" {...form.register("id")} />
          <fieldset><legend className="text-xl font-bold text-accent mb-6 flex items-center gap-2"><Building2Icon className="w-6 h-6 text-primary"/> 1. البيانات الأساسية للعقار</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="code" render={({ field }) => (<FormItem className="input-group"><FormLabel>كود العقار</FormLabel><FormControl><Input placeholder="مثال: عمر الحيدري-AVZ-001" {...field} className="form-input form-input-padding" /></FormControl><Tag className="input-icon" /><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="title" render={({ field }) => (<FormItem className="input-group"><FormLabel>عنوان العقار</FormLabel><FormControl><Input placeholder="مثال: فيلا عمر الحيدري الفاخرة في حي النرجس" {...field} className="form-input form-input-padding" /></FormControl><Edit3 className="input-icon" /><FormMessage /></FormItem>)} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <FormField control={form.control} name="usage" render={({ field }) => (<FormItem><FormLabel>استخدام العقار</FormLabel><RadioGroup onValueChange={(value) => { field.onChange(value); form.setValue("propertyType", undefined); form.setValue("otherPropertyType", ""); }} value={field.value} className="grid grid-cols-2 gap-3 mt-2">{propertyUsages.map(usageOpt => (<FormItem key={usageOpt.value}><FormControl><RadioGroupItem value={usageOpt.value} id={`usage-${usageOpt.value}`} className="sr-only" /></FormControl><FormLabel htmlFor={`usage-${usageOpt.value}`} className="usage-option-label">{usageOpt.labelAr}</FormLabel></FormItem>))}</RadioGroup><FormMessage /></FormItem>)} />
              {currentUsage && (<FormField control={form.control} name="propertyType" render={({ field }) => (<FormItem className="input-group"><FormLabel>نوع العقار</FormLabel><Select onValueChange={(value) => { field.onChange(value); form.setValue("otherPropertyType", ""); }} value={field.value}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder={currentUsage === "Residential" ? "--- اختر نوع العقار السكني ---" : "--- اختر نوع العقار التجاري ---"} /></SelectTrigger></FormControl><Building2Icon className="input-icon" /><SelectContent>{(currentUsage === "Residential" ? residentialPropertyTypes : commercialPropertyTypes).map(type => (<SelectItem key={type.value} value={type.value}>{type.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />)}</div>
            {currentPropertyType === "Other" && (<div className="mt-6"><FormField control={form.control} name="otherPropertyType" render={({ field }) => (<FormItem className="input-group"><FormLabel>يرجى تحديد النوع الآخر</FormLabel><FormControl><Input placeholder="مثال: استراحة، فندق بوتيك" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Edit3 className="input-icon" /><FormMessage /></FormItem>)} /></div>)}
             {(currentPropertyType === "Office" || currentPropertyType === "Commercial Building" || currentPropertyType === "Commercial Complex") && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField control={form.control} name="numberOfOffices" render={({ field }) => (<FormItem className="input-group"><FormLabel>عدد المكاتب (اختياري)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="10" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><Briefcase className="input-icon" /><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="numberOfShowrooms" render={({ field }) => (<FormItem className="input-group"><FormLabel>عدد المعارض (اختياري)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="2" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><Store className="input-icon" /><FormMessage /></FormItem>)} /></div>)}</fieldset>
          <fieldset><legend className="text-xl font-bold text-accent mb-6 flex items-center gap-2"><Info className="w-6 h-6 text-primary"/> 2. تفاصيل العرض والموقع</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField control={form.control} name="listingPurpose" render={({ field }) => (<FormItem className="input-group"><FormLabel>الغرض من العرض</FormLabel><Select onValueChange={(value) => { field.onChange(value); form.setValue("price", undefined); form.setValue("rentPriceType", undefined); }} value={field.value}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder="--- اختر الغرض ---" /></SelectTrigger></FormControl><Briefcase className="input-icon" /><SelectContent>{propertyListingPurposes.map(p => (<SelectItem key={p.value} value={p.value}>{p.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="status" render={({ field }) => (<FormItem className="input-group"><FormLabel>حالة العقار</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder="--- اختر الحالة ---" /></SelectTrigger></FormControl><ListChecks className="input-icon" /><SelectContent>{propertyStatuses.map(s => (<SelectItem key={s.value} value={s.value}>{s.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="price" render={({ field }) => (<FormItem className="input-group"><FormLabel>السعر (SAR)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="1500000" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><DollarSign className="input-icon" /><FormMessage /></FormItem>)} /></div>
            {currentListingPurpose === "For Rent" && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormField control={form.control} name="rentPriceType" render={({ field }) => (<FormItem><FormLabel>طريقة احتساب الإيجار</FormLabel><RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 gap-3 mt-2">{rentPriceTypes.map(type => (<FormItem key={type.value}><FormControl><RadioGroupItem value={type.value} id={`rentType-${type.value}`} className="sr-only" /></FormControl><FormLabel htmlFor={`rentType-${type.value}`} className="usage-option-label">{type.labelAr}</FormLabel></FormItem>))}</RadioGroup><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="priceSuffix" render={({ field }) => (<FormItem className="input-group"><FormLabel>لاحقة السعر (اختياري)</FormLabel><FormControl><Input placeholder="مثال: /سنوي، /شهري" {...field} value={field.value ?? ''} className=\"form-input form-input-padding" /></FormControl><Edit3 className=\"input-icon" /><FormMessage /></FormItem>)} /></div>)}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <FormField control={form.control} name="region" render={({ field }) => (<FormItem className="input-group"><FormLabel>النطاق</FormLabel><Select onValueChange={(value) => handleRegionChange(value as RiyadhRegion | undefined)} value={field.value ?? undefined}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder="--- اختر النطاق ---" /></SelectTrigger></FormControl><Globe className="input-icon" /><SelectContent>{RIYADH_REGIONS.map(regionOpt => (<SelectItem key={regionOpt.value} value={regionOpt.value}>{regionOpt.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="location" render={({ field }) => (<FormItem className="input-group"><FormLabel>الحي</FormLabel><Select onValueChange={(value) => handleLocationChange(value)} value={field.value ?? undefined} disabled={!availableNeighborhoods.length && !!currentRegion && currentRegion !== "Other"}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder={!availableNeighborhoods.length && !!currentRegion && currentRegion !== "Other" ? "لا توجد أحياء لهذا النطاق" : "--- اختر الحي ---"} /></SelectTrigger></FormControl><MapPin className="input-icon" /><SelectContent className="max-h-60 overflow-y-auto">{availableNeighborhoods.map((hood) => (<SelectItem key={hood.value} value={hood.value}>{hood.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="area" render={({ field }) => (<FormItem className="input-group"><FormLabel>المساحة (م²)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="300" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><Maximize2 className="input-icon" /><FormMessage /></FormItem>)} /></div>
                <div className="mt-6">
                    <FormLabel>تحديد موقع العقار على الخريطة (اختياري)</FormLabel>
                    <DynamicLocationPicker onLocationSelect={handleLocationSelection} initialPosition={selectedLocation || undefined}/>
                </div>
            </fieldset>
          <fieldset><legend className="text-xl font-bold text-accent mb-6 flex items-center gap-2"><FileText className="w-6 h-6 text-primary"/> 3. الوثائق والمواصفات</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField control={form.control} name="advertiserNumber" render={({ field }) => (<FormItem className="input-group"><FormLabel>رقم المعلن (اختياري)</FormLabel><FormControl><Input dir="ltr" placeholder="1234567" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Hash className="input-icon" /><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="deedNumber" render={({ field }) => (<FormItem className="input-group"><FormLabel>رقم الصك (اختياري)</FormLabel><FormControl><Input dir="ltr" placeholder="123456789" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><FileText className="input-icon" /><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="realEstateRegistryNumber" render={({ field }) => (<FormItem className="input-group"><FormLabel>رقم السجل العقاري (اختياري)</FormLabel><FormControl><Input dir="ltr" placeholder="987654321" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><FileText className="input-icon" /><FormMessage /></FormItem>)} /></div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <FormField control={form.control} name="yearBuilt" render={({ field }) => (<FormItem className="input-group"><FormLabel>سنة الإنشاء (اختياري)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="2010" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" /></FormControl><Calendar className="input-icon" /><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="floors" render={({ field }) => (<FormItem className="input-group"><FormLabel>عدد الطوابق (اختياري)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="2" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><Building2Icon className="input-icon" /><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="parkingSpots" render={({ field }) => (<FormItem className="input-group"><FormLabel>مواقف السيارات (اختياري)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="1" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><CarIcon className="input-icon" /><FormMessage /></FormItem>)} /></div>
            <div className="mt-6"><FormField control={form.control} name="features" render={({ field }) => (<FormItem className="input-group"><FormLabel>المميزات (افصل بينها بفاصلة)</FormLabel><FormControl><Textarea placeholder="مثال: مسبح خاص، إطلالة على الحديقة، تشطيبات فاخرة" {...field} value={field.value ?? ''} className="form-input form-textarea-padding" rows={3}/></FormControl><ListChecks className="input-icon textarea-icon" /><FormMessage /></FormItem>)} /></div>
            <div className="mt-6"><FormField control={form.control} name="description" render={({ field }) => (<FormItem className="input-group"><FormLabel>وصف موجز للعقار</FormLabel><FormControl><Textarea placeholder="وصف قصير وجذاب للعقار..." {...field} value={field.value ?? ''} className="form-input form-textarea-padding" rows={2}/></FormControl><MessageSquareText className="input-icon textarea-icon" /><FormMessage /></FormItem>)} /></div>
            <div className="mt-6"><FormField control={form.control} name="detailedDescription" render={({ field }) => (<FormItem className="input-group"><FormLabel>وصف تفصيلي للعقار</FormLabel><FormControl><Textarea placeholder="اكتب وصفًا شاملاً للعقار ومرافقه..." {...field} value={field.value ?? ''} className="form-input form-textarea-padding" rows={5}/></FormControl><MessageSquareText className="input-icon textarea-icon" /><FormMessage /></FormItem>)} /></div></fieldset>
          <fieldset><legend className="text-xl font-bold text-accent mb-6 flex items-center gap-2"><ImageIcon className="w-6 h-6 text-primary"/> 4. الصور والملفات</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem className="input-group"><FormLabel>الصورة الرئيسية للعقار (اختياري، حتى 5MB)</FormLabel><FormControl><Input type="file" accept="image/png, image/jpeg, image/webp, image/gif" onChange={handleImageChange} className=\"form-input file:mr-4 rtl:file:ml-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" /></FormControl><ImageIcon className=\"input-icon" /><FormMessage /></FormItem>)} />
              {propertyImagePreview && (<div className="mt-2"><FormLabel className="text-xs">معاينة الصورة:</FormLabel><Image src={propertyImagePreview} alt="Property preview" width={200} height={150} className="border rounded-md mt-1 object-cover" data-ai-hint="property building exterior"/></div>)}
              <FormField control={form.control} name="dataAiHint" render={({ field }) => (<FormItem className="input-group"><FormLabel>وصف للصورة (لـ AI)</FormLabel><FormControl><Input placeholder="مثال: modern building, residential villa" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Edit3 className="input-icon" /><FormDescription>كلمات مفتاحية للبحث عن صور مشابهة.</FormDescription><FormMessage /></FormItem>)} /></div>
             <div className="mt-6"><FormField control={form.control} name="propertyProfilePdfUrl" render={({ field }) => (<FormItem className="input-group"><FormLabel>رابط ملف PDF لبروفايل العقار (اختياري)</FormLabel><FormControl><Input type="url" dir="ltr" placeholder="https://example.com/profile.pdf" {...field} value={field.value ?? ''} className=\"form-input form-input-padding" /></FormControl><Link2 className=\"input-icon" /><FormMessage /></FormItem>)} /></div></fieldset>
          <fieldset><legend className="text-xl font-bold text-accent mb-6 flex items-center gap-2"><UserCheck className="w-6 h-6 text-primary"/> 5. بيانات المسوق المسؤول (اختياري)</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField control={form.control} name="agentName" render={({ field }) => (<FormItem className="input-group"><FormLabel>اسم المسوق</FormLabel><FormControl><Input placeholder="مثال: عمر الحيدري" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><User className="input-icon" /><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="agentPhone" render={({ field }) => (<FormItem className="input-group"><FormLabel>جوال المسوق</FormLabel><FormControl><Input type="tel" dir="ltr" placeholder="05xxxxxxxx" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Smartphone className="input-icon" /><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="agentEmail" render={({ field }) => (<FormItem className="input-group"><FormLabel>إيميل المسوق</FormLabel><FormControl><Input type="email" dir="ltr" placeholder="agent@example.com" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Mail className="input-icon" /><FormMessage /></FormItem>)} /></div></fieldset>
          <fieldset><legend className="text-xl font-bold text-accent mb-6 flex items-center gap-2"><Cog className="w-6 h-6 text-primary"/> 6. الخدمات والمرافق</legend>
            <FormField control={form.control} name="services" render={() => (<FormItem><div className="mb-4"><FormLabel className="text-base">اختر الخدمات المتوفرة بالعقار</FormLabel><FormDescription>يمكنك اختيار خدمة واحدة أو أكثر.</FormDescription></div><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">{serviceOptions.map((service) => (<FormField key={service.id} control={form.control} name="services" render={({ field }) => { return (<FormItem key={service.id} className="flex flex-row items-center space-x-2 rtl:space-x-reverse space-y-0 rounded-md border p-3 hover:bg-accent/5 transition-colors"><FormControl><Checkbox checked={field.value?.includes(service.id)} onCheckedChange={(checked) => { return checked ? field.onChange([...(field.value || []), service.id]) : field.onChange((field.value || []).filter((value) => value !== service.id));}}/></FormControl><div className=\"flex items-center gap-2">{React.cloneElement(service.icon, { className: \"h-5 w-5 text-primary"})}<FormLabel className=\"font-normal cursor-pointer text-sm">{service.label}</FormLabel></div></FormItem>);}}/>))}</div><FormMessage /></FormItem>)}/>
          </fieldset>
          <fieldset><legend className="text-xl font-bold text-accent mb-6 flex items-center gap-2"><Package className="w-6 h-6 text-primary"/> 7. تفاصيل الوحدات والإشغال</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <FormField control={form.control} name="totalUnits" render={({ field }) => (<FormItem className="input-group"><FormLabel>إجمالي عدد الوحدات</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="20" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><Archive className="input-icon" /><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="rentedUnits" render={({ field }) => (<FormItem className="input-group"><FormLabel>عدد الوحدات المؤجرة</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="15" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><UserCheck className="input-icon" /><FormMessage /></FormItem>)} />
              {vacantUnits !== undefined && (<FormItem className="input-group"><FormLabel>عدد الوحدات الشاغرة</FormLabel><Input type="text" value={vacantUnits} readOnly className="form-input form-input-padding bg-muted/50 cursor-not-allowed" dir=\"ltr"/><DoorOpen className="input-icon text-muted-foreground"/></FormItem>)}</div>
            {typeof totalUnits === 'number' && totalUnits > 0 && (<div className="mt-6"><FormLabel className="text-base">نسبة الإشغال</FormLabel><div className="h-48 w-full max-w-xs mx-auto mt-2"><ResponsiveContainer width="100%" height="100%"><RadialBarChart innerRadius="70%" outerRadius="100%" data={occupancyChartData} startAngle={90} endAngle={-270}><PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} /><RadialBar background dataKey="value" angleAxisId={0} data={[{ value: 100 }]} fill="hsl(var(--muted))" cornerRadius={10} /><RadialBar dataKey="value" fill="hsl(var(--primary))" cornerRadius={10} /><RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '0.5rem', borderColor: 'hsl(var(--border))' }} formatter={(value: number) => [`${value}%`, "الإشغال"]} /><text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold" style={{ fill: 'hsl(var(--primary))' }}>{occupancyPercentage}%</text></RadialBarChart></ResponsiveContainer></div></div>)}</fieldset>
          {state.errors?._form && (<div className="flex items-center p-3 bg-destructive/10 border border-destructive text-destructive rounded-md"><AlertCircle className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" /><p>{state.errors._form.join(", ")}</p></div>)}
          <div className="pt-8 border-t flex flex-wrap justify-end items-center gap-4">
              <Button type="button" variant="outline" onClick={handleNewPropertyButtonClickInternal} className="w-full sm:w-auto"><RefreshCw className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> إضافة عقار جديد</Button>
              <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin mr-2 rtl:ml-2 rtl:mr-0" /> : <Send className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />}حفظ وإضافة العقار</Button>
          </div></form></Form></div>); }
