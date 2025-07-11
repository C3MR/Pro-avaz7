
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
import { submitNewPropertyOffer, type NewPropertyFormState } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Loader2, User, Smartphone, Mail, Hash, Building2 as Building2Icon, Edit3, MapPin, Maximize2, DollarSign, FileText, MessageSquareText, RefreshCw, Send, Image as ImageIcon, XCircle, Info, Zap, ShieldCheck, Sparkles, Wrench, ReceiptText, Droplets, Siren, ArrowUpDown, Wifi, Car, Cog, Calendar, UserCheck, BookUser, Link2, Globe } from "lucide-react";
import DynamicLocationPicker from "@/components/map/DynamicLocationPicker";
import type { Location, PropertyUsage, ResidentialPropertyType, CommercialPropertyType, PropertyListingPurpose, ServiceId, ClientAttributePropertyOffer, RentPriceType, RiyadhRegion } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { CarIcon } from "@/components/icons/CarIcon";
import { RIYADH_REGIONS, RIYADH_NEIGHBORHOODS_WITH_REGIONS, ALL_RIYADH_NEIGHBORHOODS_FOR_SELECT } from "@/lib/constants";


const propertyUsages: { value: PropertyUsage; labelAr: string; labelEn: string }[] = [
  { value: "Residential", labelAr: "سكني", labelEn: "Residential" },
  { value: "Commercial", labelAr: "تجاري", labelEn: "Commercial" },
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

const propertyListingPurposes: { value: PropertyListingPurpose; labelAr: string; labelEn: string }[] = [
    { value: "For Sale", labelAr: "للبيع", labelEn: "For Sale" },
    { value: "For Rent", labelAr: "للإيجار", labelEn: "For Rent" },
    { value: "For Investment", labelAr: "للاستثمار", labelEn: "For Investment"},
];

const clientAttributes: { value: ClientAttributePropertyOffer; labelAr: string; labelEn: string }[] = [
  { value: "Owner", labelAr: "مالك", labelEn: "Owner" },
  { value: "Agent", labelAr: "وكيل", labelEn: "Agent" },
  { value: "Investor", labelAr: "مستثمر", labelEn: "Investor" },
  { value: "Other", labelAr: "أخرى", labelEn: "Other" },
];

const rentPriceTypes: { value: RentPriceType; labelAr: string; labelEn: string }[] = [
  { value: "AnnualUnit", labelAr: "التأجير بكامل الوحدة (سنوي)", labelEn: "Annual Rent (Whole Unit)" },
  { value: "PerMeter", labelAr: "التأجير بسعر المتر (سنوي)", labelEn: "Rent per Meter (Annual)" },
];

export const serviceOptions: { id: ServiceId; label: string; icon: React.ReactElement }[] = [
  { id: 'cleaning_utilities', label: 'نظافة المرافق', icon: <Building2Icon className="w-5 h-5" /> },
  { id: 'corridor_electricity', label: 'كهرباء الممرات', icon: <Zap className="w-5 h-5" /> },
  { id: 'security_guard', label: 'حراسة', icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 'general_cleaning', label: 'نظافة عامة', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'general_maintenance', label: 'صيانة عامة', icon: <Wrench className="w-5 h-5" /> },
  { id: 'electricity_bill_mgmt', label: 'إدارة فاتورة الكهرباء', icon: <ReceiptText className="w-5 h-5" /> },
  { id: 'water_supply', label: 'مياه', icon: <Droplets className="w-5 h-5" /> },
  { id: 'civil_defense_compliance', label: 'متوافق مع الدفاع المدني', icon: <Siren className="w-5 h-5" /> },
  { id: 'elevators', label: 'مصاعد', icon: <ArrowUpDown className="w-5 h-5" /> },
  { id: 'parking', label: 'موقف سيارات', icon: <CarIcon className="w-5 h-5" /> },
  { id: 'wifi', label: 'واي فاي', icon: <Wifi className="w-5 h-5" /> },
];

const nameRegex = /^[a-zA-Z\u0600-\u06FF\s.,'-]+$/;
const nameErrorMessage = "الاسم يجب أن يحتوي على حروف عربية أو إنجليزية ومسافات وعلامات ترقيم أساسية فقط.";
const riyadhRegionEnum = z.custom<RiyadhRegion>((val) => RIYADH_REGIONS.map(r => r.value).includes(val as RiyadhRegion) || val === undefined, { message: "الرجاء اختيار النطاق" }).optional();


const propertyFormSchema = z.object({
  id: z.string().min(1, { message: "معرف العقار مطلوب." }),
  clientName: z.string().min(2, { message: "اسم العميل مطلوب (حرفين على الأقل)." }).regex(nameRegex, nameErrorMessage),
  clientContact: z.string().regex(/^05\d{8}$/, "رقم جوال العميل يجب أن يبدأ بـ 05 ويتكون من 10 أرقام."),
  clientEmail: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صالح (مثل example@domain.com)." }).optional().or(z.literal('')),
  clientAttribute: z.custom<ClientAttributePropertyOffer>((val) => val === undefined || clientAttributes.map(p => p.value).includes(val as ClientAttributePropertyOffer), {
    message: "الرجاء اختيار صفة العميل",
  }).optional(),
  otherClientAttribute: z.string().optional(),

  deedNumber: z.string().optional(),
  realEstateRegistryNumber: z.string().optional(),
  usage: z.custom<PropertyUsage>((val) => propertyUsages.map(u => u.value).includes(val as PropertyUsage), {
    message: "الرجاء اختيار استخدام العقار.",
  }),
  propertyType: z.string({ required_error: "الرجاء اختيار نوع العقار."}),
  otherPropertyType: z.string().optional(),
  purpose: z.custom<PropertyListingPurpose>((val) => propertyListingPurposes.map(p => p.value).includes(val as PropertyListingPurpose), {
    message: "الرجاء اختيار الغرض من عرض العقار.",
  }),
  region: riyadhRegionEnum,
  neighborhood: z.string().min(1, { message: "اسم الحي مطلوب." }),
  
  price: z.coerce.number().min(0, { message: "السعر لا يمكن أن يكون سالبًا." }),
  rentPriceType: z.custom<RentPriceType>().optional(),
  askingPrice: z.coerce.number().min(0, { message: "السومة لا يمكن أن تكون سالبة." }).optional(),
  
  notes: z.string().optional(),
  services: z.array(z.string()).optional(),
  propertyProfilePdfUrl: z.string().url({ message: "الرجاء إدخال رابط URL صالح لملف PDF." }).optional().or(z.literal('')),

  locationCoordinatesLat: z.coerce.number().optional(),
  locationCoordinatesLng: z.coerce.number().optional(),
  propertyImage: z.string().optional(),
  mapScreenshot: z.string().optional(),
  areaSize: z.coerce.number().min(0).optional().transform(val => val === 0 ? undefined : val),
}).superRefine((data, ctx) => {
    if (data.clientAttribute === "Other" && !data.otherClientAttribute?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "يرجى تحديد الصفة الأخرى.", path: ["otherClientAttribute"] });
    }
    if (data.usage === "Residential" && data.propertyType && !residentialPropertyTypes.map(rt => rt.value).includes(data.propertyType as ResidentialPropertyType) && data.propertyType !== "Other") {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "نوع العقار السكني المحدد غير صالح.", path: ["propertyType"] });
    }
    if (data.usage === "Commercial" && data.propertyType && !commercialPropertyTypes.map(ct => ct.value).includes(data.propertyType as CommercialPropertyType) && data.propertyType !== "Other") {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "نوع العقار التجاري المحدد غير صالح.", path: ["propertyType"] });
    }
    if (data.propertyType === "Other" && !data.otherPropertyType?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "يرجى تحديد نوع العقار الآخر.", path: ["otherPropertyType"] });
    }
    if (data.purpose === "For Rent" && !data.rentPriceType) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "الرجاء اختيار نوع سعر الإيجار.", path: ["rentPriceType"] });
    }
});


export default function AddPropertyForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [propertyImagePreview, setPropertyImagePreview] = useState<string | null>(null);
  const [tempMapScreenshot, setTempMapScreenshot] = useState<string | null>(null);

  const [propertyId, setPropertyId] = useState("");
  const [propertyDate, setPropertyDate] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const generateNewPropertyInfo = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString();
    const uniqueNumForPO = (now.getSeconds() * 1000 + now.getMilliseconds()) % 500;
    const sequentialIdPartPO = (501 + uniqueNumForPO).toString().padStart(3, '0');
    const id = `PO-${year}-${month}-${sequentialIdPartPO}`;
    const displayDate = `${now.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    setPropertyId(id);
    setPropertyDate(displayDate);
    form.setValue("id", id, { shouldValidate: true });
  };

  useEffect(() => {
    generateNewPropertyInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialState: NewPropertyFormState = { message: "", errors: {}, submittedData: undefined };
  const [state, formAction, isSubmitting] = useActionState(submitNewPropertyOffer, initialState);

  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      id: "", clientName: "", clientContact: "", clientEmail: "", clientAttribute: undefined, otherClientAttribute: "",
      deedNumber: "", realEstateRegistryNumber: "", usage: undefined, propertyType: undefined, otherPropertyType: "",
      purpose: undefined, region: undefined, neighborhood: undefined, price: undefined, rentPriceType: undefined, askingPrice: undefined,
      notes: "", services: [], propertyProfilePdfUrl: "", locationCoordinatesLat: undefined, locationCoordinatesLng: undefined,
      propertyImage: undefined, mapScreenshot: undefined, areaSize: undefined,
    },
  });

  const currentUsage = form.watch("usage");
  const currentPropertyType = form.watch("propertyType");
  const currentClientAttribute = form.watch("clientAttribute");
  const currentPurpose = form.watch("purpose");
  const currentRentPriceType = form.watch("rentPriceType");
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
    if (state.message && !state.errors && state.propertyId) { /* Success UI handled by conditional rendering */ }
    else if (state.message && (!state.errors || (state.errors && Object.keys(state.errors).length === 0 && !state.errors._form)) && !state.propertyId) {
        toast({ variant: "destructive", title: "فشل الإرسال", description: state.message });
    } else if (state.errors?._form) {
       toast({ variant: "destructive", title: "خطأ في الإرسال", description: state.errors._form.join(", ") });
    }
  }, [state, toast]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast({ variant: "destructive", title: "خطأ", description: "حجم الصورة يتجاوز 5MB." }); setPropertyImagePreview(null); form.setValue("propertyImage", undefined); event.target.value = ""; return; }
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) { toast({ variant: "destructive", title: "خطأ", description: "نوع الملف غير مدعوم. الرجاء اختيار صورة (JPEG, PNG, WEBP, GIF)." }); setPropertyImagePreview(null); form.setValue("propertyImage", undefined); event.target.value = ""; return; }
      const reader = new FileReader();
      reader.onloadend = () => { setPropertyImagePreview(reader.result as string); form.setValue("propertyImage", reader.result as string, { shouldValidate: true }); };
      reader.readAsDataURL(file);
    } else { setPropertyImagePreview(null); form.setValue("propertyImage", undefined); }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    const currentFormValues = form.getValues();
     if (!currentFormValues.id) {
        const now = new Date(); const year = now.getFullYear().toString().slice(-2); const month = (now.getMonth() + 1).toString();
        const uniqueNumForPO = (now.getSeconds() * 1000 + now.getMilliseconds()) % 500; const sequentialIdPartPO = (501 + uniqueNumForPO).toString().padStart(3, '0');
        const newId = `PO-${year}-${month}-${sequentialIdPartPO}`; form.setValue("id", newId, { shouldValidate: true }); setPropertyId(newId); }
    const newFormData = new FormData(formRef.current!);
    Object.keys(currentFormValues).forEach(key => {
        const typedKey = key as keyof typeof currentFormValues; const value = currentFormValues[typedKey];
        if (typedKey === "services" && Array.isArray(value)) { value.forEach(serviceId => newFormData.append("services", serviceId));
        } else if (typedKey === "mapScreenshot" && tempMapScreenshot) { newFormData.set("mapScreenshot", tempMapScreenshot);
        } else if (typedKey === "propertyImage" && propertyImagePreview) { newFormData.set("propertyImage", propertyImagePreview);
        } else if (value !== undefined && value !== null && String(value).trim() !== '') {
            if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string' ) { newFormData.set(typedKey, String(value)); }}
        else { if (newFormData.has(typedKey) && typedKey !== "mapScreenshot" && typedKey !== "propertyImage" && typedKey !== "services") newFormData.delete(typedKey); }});
    if (!newFormData.has("mapScreenshot") && tempMapScreenshot) { newFormData.set("mapScreenshot", tempMapScreenshot);
    } else if (!tempMapScreenshot && newFormData.has("mapScreenshot")) { newFormData.delete("mapScreenshot"); }
    if (!newFormData.has("propertyImage") && propertyImagePreview) { newFormData.set("propertyImage", propertyImagePreview);
    } else if (!propertyImagePreview && newFormData.has("propertyImage")) { newFormData.delete("propertyImage"); }
    if (selectedLocation) { newFormData.set("locationCoordinatesLat", selectedLocation.lat.toString()); newFormData.set("locationCoordinatesLng", selectedLocation.lng.toString()); }
    const isValid = await form.trigger();
    if (isValid) { startTransition(() => { formAction(newFormData); });
    } else {
      const firstErrorKey = Object.keys(form.formState.errors)[0];
      if (firstErrorKey) {
        const firstError = form.formState.errors[firstErrorKey as keyof z.infer<typeof propertyFormSchema>];
        toast({ variant: "destructive", title: "خطأ في الإدخال", description: firstError?.message || "الرجاء مراجعة الحقول المميزة." });
         const element = document.getElementsByName(firstErrorKey)[0]; element?.focus({ preventScroll: true }); element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else { toast({ variant: "destructive", title: "خطأ في الإدخال", description: "الرجاء التأكد من تعبئة جميع الحقول المطلوبة بشكل صحيح." }); }}};

  const handleLocationSelection = (loc: Location | null, screenshotUri?: string | null) => {
      setSelectedLocation(loc); setTempMapScreenshot(screenshotUri || null);
      if (loc) { form.setValue('locationCoordinatesLat', loc.lat, { shouldValidate: true }); form.setValue('locationCoordinatesLng', loc.lng, { shouldValidate: true });
      } else { form.setValue('locationCoordinatesLat', undefined); form.setValue('locationCoordinatesLng', undefined); }
       if (screenshotUri) { form.setValue('mapScreenshot', screenshotUri, { shouldValidate: true });
      } else { form.setValue('mapScreenshot', undefined); }};

  const handleNewPropertyButtonClickInternal = () => {
    form.reset(); generateNewPropertyInfo(); setSelectedLocation(null); setTempMapScreenshot(null); setPropertyImagePreview(null);
    const fileInput = formRef.current?.querySelector('input[type="file"]') as HTMLInputElement | null; if (fileInput) fileInput.value = "";
    if (state) { state.propertyId = undefined; state.message = ""; state.errors = undefined; state.submittedData = undefined; }
    toast({ title: "تم تجهيز بطاقة عرض عقار جديدة" }); window.scrollTo(0,0); };

  const handleFinishClick = () => { handleNewPropertyButtonClickInternal(); router.push("/"); };

  const handleNeighborhoodChange = (selectedValue: string | undefined) => {
    form.setValue("neighborhood", selectedValue);
    if (selectedValue) {
      const selectedHoodObj = RIYADH_NEIGHBORHOODS_WITH_REGIONS.find(h => h.value === selectedValue);
      if (selectedHoodObj && selectedHoodObj.region && form.getValues("region") !== selectedHoodObj.region) {
        form.setValue('region', selectedHoodObj.region, { shouldValidate: true });
      }
    }
  };

  const handleRegionChange = (selectedValue: RiyadhRegion | undefined) => {
    form.setValue("region", selectedValue);
    form.setValue("neighborhood", undefined, { shouldValidate: true }); 
  };


  if (state.propertyId && !isSubmitting && state.submittedData) {
    return (<><Card className="w-full max-w-2xl mx-auto shadow-xl border-primary my-12"><CardHeader className="bg-primary/10"><CardTitle className="text-center text-2xl text-primary font-headline flex items-center justify-center"><CheckCircle className="h-8 w-8 mr-3 text-green-500 rtl:ml-3 rtl:mr-0" /> {state.message || "شكراً لك، تم استلام طلب عرض العقار!"}</CardTitle></CardHeader><CardContent className="text-center space-y-4 p-6"><p className="text-lg">رقم العقار الخاص بك هو:</p><p className="text-3xl font-bold text-accent bg-accent/10 p-3 rounded-md inline-block" dir=\"ltr">{state.propertyId}</p><div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6"><Button onClick={handleNewPropertyButtonClickInternal} variant="outline" className="w-full sm:w-auto"><RefreshCw className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> تقديم طلب عرض جديد</Button><Button onClick={handleFinishClick} variant="default" className="w-full sm:w-auto bg-primary hover:bg-primary/90"><XCircle className=\"mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> إنهاء والعودة للرئيسية</Button></div></CardContent></Card></>); }

  return (<><div className="bg-background p-6 md:p-10 rounded-2xl shadow-lg mb-8 border" dir="rtl">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-6 border-b border-border gap-4">
            <div><h2 className="text-2xl md:text-3xl font-bold text-accent font-headline">تقديم طلب عرض عقار</h2><p className="text-muted-foreground mt-2">يرجى تعبئة بيانات العقار بدقة لعرضه</p></div>
            <div className="text-left rtl:text-right bg-muted/30 p-3 rounded-lg border text-sm shrink-0 w-full sm:w-auto" dir="ltr">
                <div className="flex items-center gap-2 justify-start"><Hash className="w-4 h-4 text-primary" /><span>معرف العقار</span>: <span className="font-mono font-bold text-foreground">{propertyId}</span></div>
                <div className="flex items-center gap-2 mt-2 justify-start"><Calendar className="w-4 h-4 text-primary" /><span>تاريخ الإضافة</span>: <span className="font-mono text-foreground">{propertyDate}</span></div></div></div>
        <Form {...form}><form ref={formRef} onSubmit={handleFormSubmit} className="space-y-10 md:space-y-14"><input type="hidden" {...form.register("id")} />
            <fieldset><legend className="text-xl md:text-2xl font-bold text-accent mb-6 flex items-center gap-2"><User className="w-6 h-6 text-primary"/> 1. بيانات العميل</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField control={form.control} name="clientName" render={({ field }) => (<FormItem className="input-group"><FormLabel>الاسم</FormLabel><FormControl><Input placeholder="مثال: عمر الحيدري" {...field} className="form-input form-input-padding" /></FormControl><User className="input-icon" /><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="clientContact" render={({ field }) => (<FormItem className="input-group"><FormLabel>رقم الجوال</FormLabel><FormControl><Input type="tel" dir="ltr" placeholder="05xxxxxxxx" {...field} className="form-input form-input-padding" /></FormControl><Smartphone className="input-icon" /><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="clientEmail" render={({ field }) => (<FormItem className="input-group"><FormLabel>البريد الإلكتروني (اختياري)</FormLabel><FormControl><Input type="email" dir="ltr" placeholder="client@example.com" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Mail className="input-icon" /><FormMessage /></FormItem>)} />
                   <FormField control={form.control} name="clientAttribute" render={({ field }) => (<FormItem className="input-group"><FormLabel>الصفة</FormLabel><Select onValueChange={(value) => { field.onChange(value); form.setValue("otherClientAttribute", ""); }} value={field.value}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder="--- اختر الصفة ---" /></SelectTrigger></FormControl><BookUser className="input-icon" /><SelectContent>{clientAttributes.map(attr => (<SelectItem key={attr.value} value={attr.value}>{attr.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                    {currentClientAttribute === "Other" && (<FormField control={form.control} name="otherClientAttribute" render={({ field }) => (<FormItem className="input-group"><FormLabel>يرجى تحديد الصفة</FormLabel><FormControl><Input placeholder="مثال: مطور عقاري" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Edit3 className="input-icon" /><FormMessage /></FormItem>)} />)}</div></fieldset>
            <fieldset><legend className="text-xl md:text-2xl font-bold text-accent mb-6 flex items-center gap-2"><Building2Icon className="w-6 h-6 text-primary"/> 2. بيانات العقار</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <FormField control={form.control} name="deedNumber" render={({ field }) => (<FormItem className="input-group"><FormLabel>رقم الصك (اختياري)</FormLabel><FormControl><Input dir="ltr" placeholder="123456789" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><FileText className="input-icon" /><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="realEstateRegistryNumber" render={({ field }) => (<FormItem className="input-group"><FormLabel>رقم السجل العقاري (اختياري)</FormLabel><FormControl><Input dir="ltr" placeholder="987654321" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><FileText className="input-icon" /><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="usage" render={({ field }) => (<FormItem><FormLabel>استخدام العقار</FormLabel><RadioGroup onValueChange={(value) => { field.onChange(value); form.setValue("propertyType", undefined); form.setValue("otherPropertyType", ""); }} value={field.value} className="grid grid-cols-2 gap-3 mt-2">{propertyUsages.map(usageOpt => (<FormItem key={usageOpt.value}><FormControl><RadioGroupItem value={usageOpt.value} id={`usage-${usageOpt.value}`} className="sr-only" /></FormControl><FormLabel htmlFor={`usage-${usageOpt.value}`} className="usage-option-label">{usageOpt.labelAr}</FormLabel></FormItem>))}</RadioGroup><FormMessage /></FormItem>)} /></div>
                {currentUsage && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"><FormField control={form.control} name="propertyType" render={({ field }) => (<FormItem className="input-group"><FormLabel>نوع العقار</FormLabel><Select onValueChange={(value) => { field.onChange(value); form.setValue("otherPropertyType", ""); }} value={field.value}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder={currentUsage === "Residential" ? "--- اختر نوع العقار السكني ---" : "--- اختر نوع العقار التجاري ---"} /></SelectTrigger></FormControl><Building2Icon className="input-icon" /><SelectContent>{(currentUsage === "Residential" ? residentialPropertyTypes : commercialPropertyTypes).map(type => (<SelectItem key={type.value} value={type.value}>{type.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                        {currentPropertyType === "Other" && (<FormField control={form.control} name="otherPropertyType" render={({ field }) => (<FormItem className="input-group"><FormLabel>يرجى تحديد النوع</FormLabel><FormControl><Input placeholder="مثال: استراحة، مزرعة" {...field} value={field.value ?? ''} className="form-input form-input-padding" /></FormControl><Edit3 className="input-icon" /><FormMessage /></FormItem>)} />)}</div>)}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField control={form.control} name="purpose" render={({ field }) => (<FormItem className="input-group"><FormLabel>الغرض من العرض</FormLabel><Select onValueChange={(value) => { field.onChange(value); form.setValue("price", undefined); form.setValue("rentPriceType", undefined); form.setValue("askingPrice", undefined); }} value={field.value}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder="--- اختر الغرض ---" /></SelectTrigger></FormControl><Info className="input-icon" /><SelectContent>{propertyListingPurposes.map(p => (<SelectItem key={p.value} value={p.value}>{p.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                    <FormField control={form.control} name="region" render={({ field }) => (<FormItem className="input-group"><FormLabel>النطاق</FormLabel><Select onValueChange={(value) => handleRegionChange(value as RiyadhRegion | undefined)} value={field.value ?? undefined}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder="--- اختر النطاق ---" /></SelectTrigger></FormControl><Globe className="input-icon" /><SelectContent>{RIYADH_REGIONS.map(regionOpt => (<SelectItem key={regionOpt.value} value={regionOpt.value}>{regionOpt.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                </div>
                <div className="mt-6">
                    <FormField control={form.control} name="neighborhood" render={({ field }) => (<FormItem className="input-group"><FormLabel>الحي</FormLabel><Select onValueChange={(value) => handleNeighborhoodChange(value)} value={field.value ?? undefined} disabled={!availableNeighborhoods.length && !!currentRegion && currentRegion !== "Other"}><FormControl><SelectTrigger className="form-input form-input-padding"><SelectValue placeholder={!availableNeighborhoods.length && !!currentRegion && currentRegion !== "Other" ? "لا توجد أحياء لهذا النطاق" : "--- اختر الحي ---"} /></SelectTrigger></FormControl><MapPin className="input-icon" /><SelectContent className="max-h-60 overflow-y-auto">{availableNeighborhoods.map((hood) => (<SelectItem key={hood.value} value={hood.value}>{hood.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                </div>
                {currentPurpose === "For Rent" && (<div className="mt-6 space-y-6"><FormField control={form.control} name="rentPriceType" render={({ field }) => (<FormItem><FormLabel>طريقة احتساب الإيجار</FormLabel><RadioGroup onValueChange={(value) => { field.onChange(value); form.setValue("price", undefined);}} value={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">{rentPriceTypes.map(type => (<FormItem key={type.value}><FormControl><RadioGroupItem value={type.value} id={`rentType-${type.value}`} className="sr-only" /></FormControl><FormLabel htmlFor={`rentType-${type.value}`} className="usage-option-label">{type.labelAr}</FormLabel></FormItem>))}</RadioGroup><FormMessage /></FormItem>)}/>
                        {currentRentPriceType && (<FormField control={form.control} name="price" render={({ field }) => (<FormItem className="input-group"><FormLabel>{currentRentPriceType === "AnnualUnit" ? "قيمة الإيجار السنوي للوحدة (SAR)" : "سعر الإيجار للمتر المربع سنوياً (SAR)"}</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="50000" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><DollarSign className="input-icon" /><FormMessage /></FormItem>)}/>)}</div>)}
                {currentPurpose === "For Sale" && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"><FormField control={form.control} name="price" render={({ field }) => (<FormItem className="input-group"><FormLabel>قيمة البيع (SAR)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="1500000" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><DollarSign className="input-icon" /><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="askingPrice" render={({ field }) => (<FormItem className="input-group"><FormLabel>قيمة السومة إن وجدت (SAR)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="1450000" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><DollarSign className="input-icon" /><FormMessage /></FormItem>)}/></div>)}
                {currentPurpose === "For Investment" && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"><FormField control={form.control} name="price" render={({ field }) => (<FormItem className="input-group"><FormLabel>السعر (SAR)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="5000000" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><DollarSign className="input-icon" /><FormMessage /></FormItem>)}/></div>)}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                     <FormField control={form.control} name="areaSize" render={({ field }) => (<FormItem className="input-group"><FormLabel>المساحة (م²)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="300" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="form-input form-input-padding" min="0"/></FormControl><Maximize2 className="input-icon" /><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="propertyProfilePdfUrl" render={({ field }) => (<FormItem className="input-group"><FormLabel>رابط ملف PDF لبروفايل العقار (اختياري)</FormLabel><FormControl><Input type="url" dir="ltr" placeholder="https://example.com/profile.pdf" {...field} value={field.value ?? ''} className=\"form-input form-input-padding" /></FormControl><Link2 className=\"input-icon" /><FormMessage /></FormItem>)}/></div>
                <div className="mt-6"><FormField control={form.control} name="notes" render={({ field }) => (<FormItem className="input-group"><FormLabel>ملاحظات إضافية</FormLabel><FormControl><Textarea placeholder="اكتب أي تفاصيل إضافية عن العقار هنا..." {...field} value={field.value ?? ''} className="form-input form-textarea-padding" rows={4}/></FormControl><MessageSquareText className="input-icon textarea-icon" /><FormMessage /></FormItem>)}/></div></fieldset>
            <fieldset><legend className="text-xl md:text-2xl font-bold text-accent mb-6 flex items-center gap-2"><MapPin className="w-6 h-6 text-primary"/> 3. موقع العقار وصورته</legend>
                <div className="space-y-6"><div><FormLabel>تحديد موقع العقار على الخريطة (اختياري)</FormLabel><DynamicLocationPicker onLocationSelect={handleLocationSelection} initialPosition={selectedLocation || undefined}/>
                         {selectedLocation && (<p className="mt-2 text-sm text-muted-foreground" dir="ltr">الموقع المحدد: {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}</p>)}
                        {tempMapScreenshot && (<div className="mt-2"><FormLabel className="text-xs">معاينة صورة الخريطة للـ PDF:</FormLabel><Image src={tempMapScreenshot} alt="Map screenshot preview" width={200} height={100} className="border rounded-md mt-1" data-ai-hint="map location"/></div>)}</div>
                     <FormField control={form.control} name="propertyImage" render={({ field }) => (<FormItem className="input-group"><FormLabel>صورة العقار (اختياري، حتى 5MB)</FormLabel><FormControl><Input type="file" accept="image/png, image/jpeg, image/webp, image/gif" onChange={handleImageChange} className=\"form-input file:mr-4 rtl:file:ml-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" /></FormControl><ImageIcon className=\"input-icon" /><FormMessage /></FormItem>)} />
                    {propertyImagePreview && (<div className="mt-2"><FormLabel className="text-xs">معاينة صورة العقار:</FormLabel><Image src={propertyImagePreview} alt="Property preview" width={200} height={150} className="border rounded-md mt-1 object-cover" data-ai-hint="property building exterior"/></div>)}</div></fieldset>
            <fieldset><legend className="text-xl md:text-2xl font-bold text-accent mb-6 flex items-center gap-2"><Cog className="w-6 h-6 text-primary"/> 4. الخدمات والمرافق</legend>
                <FormField control={form.control} name="services" render={() => (<FormItem><div className="mb-4"><FormLabel className="text-base">اختر الخدمات المتوفرة بالعقار</FormLabel><FormDescription>يمكنك اختيار خدمة واحدة أو أكثر.</FormDescription></div><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">{serviceOptions.map((service) => (<FormField key={service.id} control={form.control} name="services" render={({ field }) => { return (<FormItem key={service.id} className="flex flex-row items-center space-x-2 rtl:space-x-reverse space-y-0 rounded-md border p-3 hover:bg-accent/5 transition-colors"><FormControl><Checkbox checked={field.value?.includes(service.id)} onCheckedChange={(checked) => { return checked ? field.onChange([...(field.value || []), service.id]) : field.onChange((field.value || []).filter((value) => value !== service.id));}}/></FormControl><div className=\"flex items-center gap-2">{React.cloneElement(service.icon, { className: \"h-5 w-5 text-primary"})}<FormLabel className=\"font-normal cursor-pointer text-sm">{service.label}</FormLabel></div></FormItem>);}}/>))}</div><FormMessage /></FormItem>)}/>
            </fieldset>
            {state.errors?._form && (<div className="flex items-center p-3 bg-destructive/10 border border-destructive text-destructive rounded-md"><AlertCircle className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" /><p>{state.errors._form.join(", ")}</p></div>)}
            <div className="pt-8 border-t flex flex-wrap justify-end items-center gap-4">
                <Button type="button" variant="outline" onClick={handleNewPropertyButtonClickInternal} className="w-full sm:w-auto"><RefreshCw className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> عرض عقار جديد</Button>
                <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin mr-2 rtl:ml-2 rtl:mr-0" /> : <Send className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />}تقديم طلب عرض عقار</Button>
            </div></form></Form></div></> );}

