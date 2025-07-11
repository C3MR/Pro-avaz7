
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
  FormDescription as ShadFormDescription,
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
import { submitNewQuotation, type NewQuotationFormState } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Loader2, User, Smartphone, Mail, Hash, CalendarDays, Edit3, DollarSign, FileText as FileTextIcon, Percent, Info, Briefcase, Send, RefreshCw, XCircle, Building, MapPinIcon, Maximize2, Tag, PackageSearch, ListChecks, Settings2, TrendingUp, Globe, HandCoins, ConciergeBell, Building2 as BuildingIcon, Handshake, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription as ShadCardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import type { QuotationStatus, PropertyUsage, PropertyType as FullPropertyType, ServiceId, RiyadhRegion, PropertyDescriptionType, CommissionType, QuotationServiceType, FinancialCalculationBasis, AdditionalFeeType, ResidentialPropertyType, CommercialPropertyType as CommercialPropertyTypeEnum } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { RIYADH_NEIGHBORHOODS_WITH_REGIONS, ALL_RIYADH_NEIGHBORHOODS_FOR_SELECT } from "@/lib/constants";
import { serviceOptions as propertyServiceOptions } from './AddManagedPropertyForm';
import { cn } from "@/lib/utils";


const quotationStatuses: { value: QuotationStatus; labelAr: string }[] = [
  { value: "مسودة", labelAr: "مسودة" }, { value: "مُرسل", labelAr: "مُرسل" },
  { value: "مقبول", labelAr: "مقبول" }, { value: "مرفوض", labelAr: "مرفوض" },
  { value: "مُلغى", labelAr: "مُلغى" },
];

const quotationServiceTypes: { value: QuotationServiceType; labelAr: string; icon: React.ReactElement }[] = [
    { value: "rental_services", labelAr: "خدمات تأجير", icon: <Handshake/> },
    { value: "property_management", labelAr: "إدارة عقارات", icon: <BuildingIcon/> },
    { value: "marketing_services", labelAr: "خدمات تسويق عقاري", icon: <BarChart3/> },
    { value: "general_consultancy", labelAr: "استشارات عامة", icon: <ConciergeBell/> },
    { value: "other_services", labelAr: "خدمات أخرى", icon: <Settings2/> },
];

const propertyUsagesList: { value: PropertyUsage; labelAr: string }[] = [
  { value: "Residential", labelAr: "سكني" }, { value: "Commercial", labelAr: "تجاري" },
];

const residentialPropertyTypesList: { value: ResidentialPropertyType; labelAr: string }[] = [
  { value: "Apartment", labelAr: "شقة" }, { value: "Villa", labelAr: "فيلا" },
  { value: "Residential Land", labelAr: "أرض سكنية" }, { value: "Floor", labelAr: "دور" },
  { value: "Building", labelAr: "عمارة سكنية" }, { value: "Duplex", labelAr: "دوبلكس" },
  { value: "Palace", labelAr: "قصر" }, { value: "Residential Complex", labelAr: "مجمع سكني" },
  { value: "Other", labelAr: "أخرى (سكني)" },
];
const commercialPropertyTypesList: { value: CommercialPropertyTypeEnum; labelAr: string }[] = [
  { value: "Office", labelAr: "مكتب" }, { value: "Showroom", labelAr: "معرض" },
  { value: "Commercial Land", labelAr: "أرض تجارية" }, { value: "Commercial Building", labelAr: "مبنى تجاري" },
  { value: "Warehouse", labelAr: "مستودع" }, { value: "Commercial Complex", labelAr: "مجمع تجاري" },
  { value: "Workshop", labelAr: "ورشة" }, { value: "Gas Station", labelAr: "محطة وقود" },
  { value: "Other", labelAr: "أخرى (تجاري)" },
];

const financialCalculationBasisOptions: { value: FinancialCalculationBasis; labelAr: string }[] = [
    { value: "per_meter", labelAr: "بناءً على سعر المتر" },
    { value: "fixed_amount", labelAr: "مبلغ مقطوع" },
];

const additionalFeeTypeOptions: { value: AdditionalFeeType; labelAr: string }[] = [
    { value: "amount", labelAr: "مبلغ ثابت" },
    { value: "percentage", labelAr: "نسبة مئوية (من قيمة الإيجار/الخدمة الأساسية)" },
];

const commissionTypeOptions: { value: CommissionType; labelAr: string }[] = [
    { value: "amount", labelAr: "مبلغ ثابت" },
    { value: "percentage", labelAr: "نسبة مئوية" },
];

const clientSideFormSchema = z.object({
  id: z.string().min(1),
  clientName: z.string().min(2),
  clientContact: z.string().regex(/^05\d{8}$/),
  clientEmail: z.string().email().optional().or(z.literal('')),
  companyName: z.string().optional(),
  serviceType: z.custom<QuotationServiceType>(),
  otherServiceTypeDetail: z.string().optional(),
  subject: z.string().min(3),
  propertyDescriptionType: z.custom<PropertyDescriptionType>().optional(),
  linkedManagedPropertyId: z.string().optional(),
  propertyUsage: z.custom<PropertyUsage>().optional(),
  propertyType: z.string().optional(), 
  otherPropertyTypeDetail: z.string().optional(),
  propertyNeighborhood: z.string().optional(),
  propertyAreaM2: z.coerce.number().optional(),
  financialCalculationBasis: z.custom<FinancialCalculationBasis>().optional(),
  pricePerMeter: z.coerce.number().optional(),
  fixedAmountForService: z.coerce.number().optional(),
  calculatedPropertyOrServiceBaseValue: z.coerce.number().optional(), 
  hasAdditionalFees: z.boolean().optional(),
  additionalFeeType: z.custom<AdditionalFeeType>().optional(),
  additionalFeeValue: z.coerce.number().optional(),
  calculatedAdditionalFeeAmount: z.coerce.number().optional(), 
  subTotalBeforeTax: z.coerce.number().optional(), 
  taxPercentage: z.coerce.number().optional().default(15),
  calculatedTaxAmount: z.coerce.number().optional(), 
  finalQuotedAmountToClient: z.coerce.number().optional(), 
  commissionType: z.custom<CommissionType>().optional(),
  commissionValue: z.coerce.number().optional(),
  calculatedCommissionAmount: z.coerce.number().optional(), 
  contractDurationYears: z.coerce.number().optional(),
  gracePeriodDays: z.coerce.number().optional(),
  scopeOfWork: z.string().optional(),
  paymentTerms: z.string().optional(),
  termsAndConditions: z.string().optional(),
  validityPeriodDays: z.coerce.number().optional().default(30),
  issueDate: z.date(),
  status: z.custom<QuotationStatus>(),
  includedPropertyServices: z.array(z.string()).optional(),
});

type QuotationFormValues = z.infer<typeof clientSideFormSchema>;


export default function CreateQuotationForm() {
  const { toast } = useToast();
  const router = useRouter();
  
  const [quotationId, setQuotationId] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const generateNewQuotationInfo = () => { 
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString();
    const uniqueNum = (now.getSeconds() * 1000 + now.getMilliseconds()) % 899 + 100; 
    const id = `AVZ-Q${year}${month.padStart(2, '0')}-${uniqueNum}`;
    setQuotationId(id);
    form.setValue("id", id, { shouldValidate: true });
   };
  useEffect(() => { generateNewQuotationInfo(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialState: NewQuotationFormState = { message: "", errors: {}, submittedData: undefined };
  const [state, formAction, isSubmitting] = useActionState(submitNewQuotation, initialState);

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(clientSideFormSchema), 
    defaultValues: {
      id: "", clientName: "", clientContact: "", clientEmail: "", companyName: "",
      serviceType: undefined, otherServiceTypeDetail: "", subject: "",
      propertyDescriptionType: "none", linkedManagedPropertyId: "",
      propertyUsage: undefined, propertyType: undefined, otherPropertyTypeDetail: "",
      propertyNeighborhood: undefined, propertyAreaM2: undefined,
      financialCalculationBasis: undefined, pricePerMeter: undefined, fixedAmountForService: undefined,
      calculatedPropertyOrServiceBaseValue: 0,
      hasAdditionalFees: false, additionalFeeType: undefined, additionalFeeValue: undefined, calculatedAdditionalFeeAmount: 0,
      subTotalBeforeTax: 0, taxPercentage: 15, calculatedTaxAmount: 0,
      finalQuotedAmountToClient: 0, 
      commissionType: undefined, commissionValue: undefined, calculatedCommissionAmount: 0,
      contractDurationYears: undefined, gracePeriodDays: undefined,
      scopeOfWork: "", paymentTerms: "",
      termsAndConditions: "1. الأسعار المذكورة صالحة للمدة المحددة.\n2. الدفعات حسب الاتفاق.\n3. أي أعمال إضافية خارج هذا العرض يتم الاتفاق عليها بشكل منفصل.",
      validityPeriodDays: 30, issueDate: new Date(), status: "مسودة",
      includedPropertyServices: [],
    },
  });
  
  const watchServiceType = form.watch("serviceType");
  const watchPropertyDescriptionType = form.watch("propertyDescriptionType");
  const watchPropertyUsage = form.watch("propertyUsage");
  const watchPropertyType = form.watch("propertyType");
  const watchFinancialCalculationBasis = form.watch("financialCalculationBasis");
  const watchPropertyAreaM2 = form.watch("propertyAreaM2");
  const watchPricePerMeter = form.watch("pricePerMeter");
  const watchFixedAmountForService = form.watch("fixedAmountForService");
  const watchHasAdditionalFees = form.watch("hasAdditionalFees");
  const watchAdditionalFeeType = form.watch("additionalFeeType");
  const watchAdditionalFeeValue = form.watch("additionalFeeValue");
  const watchTaxPercentage = form.watch("taxPercentage");
  const watchCommissionType = form.watch("commissionType");
  const watchCommissionValue = form.watch("commissionValue");

  const availablePropertyTypes = useMemo(() => {
    if (watchPropertyUsage === 'Residential') return residentialPropertyTypesList;
    if (watchPropertyUsage === 'Commercial') return commercialPropertyTypesList;
    return [];
  }, [watchPropertyUsage]);

  useEffect(() => { 
    if (state?.message && !state.errors && state.quotationId) {  
      // Success already handled by the conditional rendering below
    } else if (state?.message) {
        const errorMsg = state.errors?._form?.join(", ") || Object.values(state.errors || {}).flat().join(", ") || state.message;
        toast({ variant: "destructive", title: "خطأ", description: errorMsg });
    }
   }, [state, toast]);

  const handleFormSubmitWrapper = async (event: React.FormEvent<HTMLFormElement>) => { 
    event.preventDefault();
    const isValid = await form.trigger();
    if (isValid && formRef.current) {
        const formData = new FormData(formRef.current);
        startTransition(() => { formAction(formData); });
    } else {
      const firstErrorKey = Object.keys(form.formState.errors)[0];
      if (firstErrorKey) {
        const firstError = form.formState.errors[firstErrorKey as keyof QuotationFormValues];
        toast({ variant: "destructive", title: "خطأ في الإدخال", description: firstError?.message || "الرجاء مراجعة الحقول المميزة." });
      }
    }
   };

  const handleNewQuotationButtonClickInternal = () => { 
    form.reset(); generateNewQuotationInfo(); 
    if (state) { state.quotationId = undefined; state.message = ""; state.errors = undefined; state.submittedData = undefined; }
    toast({ title: "تم تجهيز نموذج عرض سعر جديد" }); window.scrollTo(0,0);
  };

  const handleFinishClick = () => { 
    handleNewQuotationButtonClickInternal(); router.push("/dashboard/quotations"); 
  };


  if (state?.quotationId && !isSubmitting && state.submittedData) { 
    return (<Card className="w-full max-w-2xl mx-auto shadow-xl border-primary my-12"><CardHeader className="bg-primary/10"><CardTitle className="text-center text-2xl text-primary font-headline flex items-center justify-center"><CheckCircle className="h-8 w-8 mr-3 text-green-500 rtl:ml-3 rtl:mr-0" /> {state.message || "تم إنشاء عرض السعر بنجاح!"}</CardTitle></CardHeader><CardContent className="text-center space-y-4 p-6"><p className="text-lg">رقم عرض السعر هو:</p><p className="text-3xl font-bold text-accent bg-accent/10 p-3 rounded-md inline-block" dir=\"ltr">{state.quotationId}</p><div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6"><Button onClick={handleNewQuotationButtonClickInternal} variant="outline" className="w-full sm:w-auto"><RefreshCw className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> إنشاء عرض سعر جديد</Button><Button onClick={handleFinishClick} variant="default" className="w-full sm:w-auto bg-primary hover:bg-primary/90"><XCircle className=\"mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> العودة لقائمة العروض</Button></div></CardContent></Card>);
   }

  return (
    <div className="bg-background p-6 md:p-10 rounded-2xl shadow-lg mb-8 border" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-6 border-b border-border gap-4">
        <div><h2 className="text-2xl md:text-3xl font-bold text-accent font-headline">إنشاء عرض سعر</h2><ShadCardDescription className="text-muted-foreground mt-2">أدخل تفاصيل عرض السعر بدقة لضمان احترافية العرض.</ShadCardDescription></div>
        <div className="text-left rtl:text-right bg-muted/30 p-3 rounded-lg border text-sm shrink-0 w-full sm:w-auto" dir="ltr">
            <div className="flex items-center gap-2 justify-start"><Hash className="w-4 h-4 text-primary" /><span>رقم العرض</span>: <span className="font-mono font-bold text-foreground">{quotationId}</span></div>
        </div>
      </div>
      <Form {...form}>
        <form ref={formRef} onSubmit={handleFormSubmitWrapper} className="space-y-8">
          <input type="hidden" {...form.register("id")} />

          <SectionTitle title="1. بيانات العميل" icon={<User />} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <FormField control={form.control} name="clientName" render={({ field }) => (<FormItem><FormLabel>اسم العميل*</FormLabel><FormControl><Input placeholder="اسم العميل أو الشركة" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="clientContact" render={({ field }) => (<FormItem><FormLabel>رقم الجوال*</FormLabel><FormControl><Input type="tel" dir="ltr" placeholder="05xxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="clientEmail" render={({ field }) => (<FormItem><FormLabel>البريد الإلكتروني</FormLabel><FormControl><Input type="email" dir="ltr" placeholder="client@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>الشركة (إن وجد)</FormLabel><FormControl><Input placeholder="اسم الشركة" {...field} /></FormControl><FormMessage /></FormItem>)} />
          </div>
          
          <SectionTitle title="2. بيانات الخدمة (نوع عرض السعر)" icon={<PackageSearch />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <FormField control={form.control} name="serviceType" render={({ field }) => (<FormItem><FormLabel>نوع الخدمة الرئيسية*</FormLabel><Select onValueChange={(val) => {field.onChange(val); if(val !== 'other_services') form.setValue('otherServiceTypeDetail', '');}} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر نوع الخدمة..." /></SelectTrigger></FormControl><SelectContent>{quotationServiceTypes.map(opt => (<SelectItem key={opt.value} value={opt.value}>{React.cloneElement(opt.icon, {className: "inline h-4 w-4 ml-2 rtl:mr-2 rtl:ml-0"})} {opt.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            {watchServiceType === "other_services" && <FormField control={form.control} name="otherServiceTypeDetail" render={({ field }) => (<FormItem><FormLabel>تحديد تفاصيل الخدمة الأخرى</FormLabel><FormControl><Input placeholder="أدخل وصف الخدمة" {...field} /></FormControl><FormMessage /></FormItem>)} />}
            <FormField control={form.control} name="subject" render={({ field }) => (<FormItem className={watchServiceType === "other_services" ? "" : "md:col-span-1"}><FormLabel>موضوع العرض*</FormLabel><FormControl><Input placeholder="مثال: عرض سعر خدمات إدارة أملاك لعقار..." {...field} /></FormControl><FormMessage /></FormItem>)} />
          </div>
          
          <SectionTitle title="3. تفاصيل العقار (إن وجد)" icon={<Building />} />
          <FormField control={form.control} name="propertyDescriptionType" render={({ field }) => (
            <FormItem className="space-y-3"><FormLabel>هل هذا العرض مرتبط بعقار محدد؟</FormLabel>
              <FormControl><RadioGroup onValueChange={(value) => { field.onChange(value as PropertyDescriptionType | undefined); form.setValue("financialCalculationBasis", undefined); form.setValue("pricePerMeter", undefined); form.setValue("fixedAmountForService", undefined); form.setValue("calculatedPropertyOrServiceBaseValue", 0);}} value={field.value ?? "none"} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
                  <FormItem className="flex items-center space-x-2 rtl:space-x-reverse"><FormControl><RadioGroupItem value="managed" /></FormControl><FormLabel className="font-normal cursor-pointer">نعم، مرتبط بعقار مُدار حالياً</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-2 rtl:space-x-reverse"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel className="font-normal">نعم، وسأقوم بوصف العقار</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-2 rtl:space-x-reverse"><FormControl><RadioGroupItem value={"none"} /></FormControl><FormLabel className="font-normal">لا، العرض لخدمات عامة</FormLabel></FormItem>
              </RadioGroup></FormControl><FormMessage /></FormItem>)}/>
          
          {watchPropertyDescriptionType === "managed" && (
            <FormField control={form.control} name="linkedManagedPropertyId" render={({ field }) => (<FormItem><FormLabel>معرف العقار المُدار*</FormLabel><FormControl><Input placeholder="أدخل ID العقار المُدار (مثال: PA-YY-MM-XX)" {...field} /></FormControl><FormDescription>مستقبلاً: سيتم اختيار العقار من قائمة.</FormDescription><FormMessage /></FormItem>)} />
          )}

          {watchPropertyDescriptionType === "other" && (
            <div className="space-y-4 p-4 border rounded-md mt-4 bg-muted/20">
              <h4 className="font-medium text-md text-primary mb-3">وصف العقار الآخر:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField control={form.control} name="propertyUsage" render={({ field }) => (<FormItem><FormLabel>استخدام العقار*</FormLabel><Select onValueChange={(val) => {field.onChange(val); form.setValue("propertyType",undefined); form.setValue("otherPropertyTypeDetail",'');}} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الاستخدام..." /></SelectTrigger></FormControl><SelectContent>{propertyUsagesList.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="propertyType" render={({ field }) => (<FormItem><FormLabel>نوع الوحدة*</FormLabel><Select onValueChange={(val) => {field.onChange(val); if(val !== "Other") form.setValue("otherPropertyTypeDetail",'')}} value={field.value} disabled={!watchPropertyUsage}><FormControl><SelectTrigger><SelectValue placeholder={!watchPropertyUsage ? "اختر الاستخدام أولاً" : "اختر نوع الوحدة..."} /></SelectTrigger></FormControl><SelectContent>{availablePropertyTypes.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                {watchPropertyType === "Other" && watchPropertyUsage && <FormField control={form.control} name="otherPropertyTypeDetail" render={({ field }) => (<FormItem><FormLabel>تحديد نوع الوحدة الآخر*</FormLabel><FormControl><Input placeholder="مثال: استراحة" {...field} /></FormControl><FormMessage /></FormItem>)} />}
                <FormField control={form.control} name="propertyNeighborhood" render={({ field }) => (<FormItem><FormLabel>الحي*</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحي..." /></SelectTrigger></FormControl><SelectContent className="max-h-60 overflow-y-auto">{ALL_RIYADH_NEIGHBORHOODS_FOR_SELECT.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="propertyAreaM2" render={({ field }) => (<FormItem><FormLabel>المساحة (م²)*</FormLabel><FormControl><Input type="number" placeholder="300" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} min="0"/></FormControl><FormMessage /></FormItem>)} />
              </div>
            </div>
          )}

          <SectionTitle title="4. التفاصيل المالية" icon={<DollarSign />} />
            { (watchPropertyDescriptionType !== "none" || (watchServiceType !== "general_consultancy" && watchServiceType !== "other_services")) &&
                <FormField control={form.control} name="financialCalculationBasis" render={({ field }) => (<FormItem><FormLabel>أساس حساب قيمة العقار/الخدمة*</FormLabel><RadioGroup onValueChange={(value) => { field.onChange(value as FinancialCalculationBasis | undefined); form.setValue("pricePerMeter", undefined); form.setValue("fixedAmountForService", undefined); }} value={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">{financialCalculationBasisOptions.map(opt => (<FormItem key={opt.value}><FormControl><RadioGroupItem value={opt.value} id={`calcBasis-${opt.value}`} className="sr-only" /></FormControl><FormLabel htmlFor={`calcBasis-${opt.value}`} className="usage-option-label">{opt.labelAr}</FormLabel></FormItem>))}</RadioGroup><FormMessage /></FormItem>)} />
            }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {watchFinancialCalculationBasis === "per_meter" && (
                    <FormField control={form.control} name="pricePerMeter" render={({ field }) => (<FormItem><FormLabel>سعر المتر (ر.س)*</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="5000" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} min="0"/></FormControl><FormMessage /></FormItem>)} />
                )}
                {watchFinancialCalculationBasis === "fixed_amount" && (
                    <FormField control={form.control} name="fixedAmountForService" render={({ field }) => (<FormItem><FormLabel>المبلغ المقطوع للعقار/الخدمة (ر.س)*</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="100000" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} min="0"/></FormControl><FormMessage /></FormItem>)} />
                )}
                 <FormItem><FormLabel>قيمة الإيجار/الخدمة الأساسية (ر.س)</FormLabel><Input type="text" value="يُحسب تلقائياً عند الحفظ" readOnly className="bg-muted/50 cursor-not-allowed" dir=\"ltr"/><ShadFormDescription>يُحسب تلقائياً بناءً على الاختيارات أعلاه.</ShadFormDescription></FormItem>
            </div>
            
            <FormField control={form.control} name="hasAdditionalFees" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 rtl:space-x-reverse space-y-0 border p-3 rounded-md mt-4"><FormControl><Checkbox checked={field.value} onCheckedChange={(checked) => { field.onChange(Boolean(checked)); if(!checked) {form.setValue("additionalFeeType", undefined); form.setValue("additionalFeeValue", undefined);}}} /></FormControl><FormLabel className="font-normal cursor-pointer mb-0 !mt-0">هل توجد رسوم إضافية (مثل صيانة وتشغيل)؟</FormLabel></FormItem>)} />
            {watchHasAdditionalFees && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-md bg-muted/20">
                     <FormField control={form.control} name="additionalFeeType" render={({ field }) => (<FormItem><FormLabel>نوع الرسوم الإضافية*</FormLabel><Select onValueChange={(value) => { field.onChange(value as AdditionalFeeType | undefined); form.setValue("additionalFeeValue", undefined);}} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر نوع الرسوم..." /></SelectTrigger></FormControl><SelectContent>{additionalFeeTypeOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="additionalFeeValue" render={({ field }) => (<FormItem><FormLabel>قيمة الرسوم الإضافية*</FormLabel><FormControl><Input type="number" dir="ltr" placeholder={watchAdditionalFeeType === "percentage" ? "5" : "2000"} {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} min="0" step={watchAdditionalFeeType === "percentage" ? "0.01" : "any"} /></FormControl><FormDescription>{watchAdditionalFeeType === "percentage" ? "(نسبة مئوية)" : "(مبلغ ثابت ر.س)"}</FormDescription><FormMessage /></FormItem>)} />
                     <FormItem><FormLabel>إجمالي الرسوم الإضافية (ر.س)</FormLabel><Input type="text" value="يُحسب تلقائياً عند الحفظ" readOnly className="bg-muted/50 cursor-not-allowed" dir=\"ltr"/></FormItem>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border-t border-b mt-6 bg-muted/10">
                 <FormItem><FormLabel className="text-md font-semibold">المجموع الفرعي (قبل الضريبة)</FormLabel><Input type="text" value="يُحسب تلقائياً عند الحفظ" readOnly className="bg-muted/50 cursor-not-allowed text-lg h-11" dir=\"ltr"/></FormItem>
                 <FormField control={form.control} name="taxPercentage" render={({ field }) => (<FormItem><FormLabel className="text-md font-semibold">نسبة الضريبة (%)*</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="15" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} min="0" max="100" className="text-lg h-11"/></FormControl><FormMessage /></FormItem>)} />
                 <FormItem><FormLabel className="text-md font-semibold">مبلغ الضريبة (ر.س)</FormLabel><Input type="text" value="يُحسب تلقائياً عند الحفظ" readOnly className="bg-muted/50 cursor-not-allowed text-lg h-11" dir=\"ltr"/></FormItem>
            </div>
            <FormItem><FormLabel className="text-xl font-bold text-primary">المبلغ النهائي للعرض للعميل (شامل الضريبة والخدمات) (ر.س)</FormLabel><Input type="text" value="يُحسب تلقائياً عند الحفظ" readOnly className="form-input bg-primary/10 text-primary font-bold text-2xl h-14 text-center cursor-not-allowed" dir=\"ltr" /></FormItem>


            <div className="p-4 border rounded-md bg-accent/5 mt-6">
                <h4 className="font-medium text-md text-accent mb-3 flex items-center gap-2"><HandCoins/> تفاصيل عمولة الشركة</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="commissionType" render={({ field }) => (<FormItem><FormLabel>نوع العمولة</FormLabel><Select onValueChange={(value) => { field.onChange(value as CommissionType | undefined); form.setValue("commissionValue", undefined); }} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر نوع العمولة..." /></SelectTrigger></FormControl><SelectContent>{commissionTypeOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                    {watchCommissionType && (<FormField control={form.control} name="commissionValue" render={({ field }) => (<FormItem><FormLabel>{watchCommissionType === "percentage" ? "نسبة العمولة (%)" : "مبلغ العمولة (ر.س)"}</FormLabel><FormControl><Input type="number" dir="ltr" placeholder={watchCommissionType === "percentage" ? "2.5" : "5000"} {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} min="0" step={watchCommissionType === "percentage" ? "0.01" : "any"}/></FormControl><FormMessage /></FormItem>)} />)}
                    <FormItem><FormLabel>إجمالي مبلغ العمولة (ر.س)</FormLabel><Input type="text" value="يُحسب تلقائياً عند الحفظ" readOnly className="bg-muted/50 cursor-not-allowed" dir=\"ltr"/><ShadFormDescription>تُحسب من المجموع الفرعي (قبل الضريبة).</ShadFormDescription></FormItem>
                </div>
            </div>
          
          <SectionTitle title="5. الشروط والخدمات الإضافية" icon={<Settings2 />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="contractDurationYears" render={({ field }) => (<FormItem><FormLabel>مدة العقد (سنوات)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="1" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} min="0"/></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="gracePeriodDays" render={({ field }) => (<FormItem><FormLabel>فترة السماح (أيام)</FormLabel><FormControl><Input type="number" dir="ltr" placeholder="30" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} min="0"/></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="validityPeriodDays" render={({ field }) => (<FormItem><FormLabel>صلاحية العرض (أيام)*</FormLabel><FormControl><Input type="number" placeholder="30" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} min="1"/></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="issueDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>تاريخ إصدار العرض*</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarDays className="ml-auto rtl:mr-auto rtl:ml-2 h-4 w-4 opacity-50" />{field.value ? format(field.value, "PPP", { locale: arSA }) : <span>اختر تاريخًا</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={(date) => field.onChange(date)} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>حالة العرض*</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحالة" /></SelectTrigger></FormControl><SelectContent>{quotationStatuses.map(s => (<SelectItem key={s.value} value={s.value}>{s.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
          </div>

          <FormField control={form.control} name="scopeOfWork" render={({ field }) => (<FormItem><FormLabel>نطاق العمل / وصف الخدمات المشمولة</FormLabel><FormControl><Textarea placeholder="صف الخدمات أو الأعمال المشمولة في هذا العرض..." {...field} value={field.value ?? ''} rows={4}/></FormControl><FormMessage /></FormItem>)} />
           <FormField control={form.control} name="includedPropertyServices"
            render={({ field }) => (
              <FormItem>
                <div className="mb-2">
                  <FormLabel className="text-base font-semibold flex items-center gap-2"><ListChecks className="w-4 h-4 text-muted-foreground"/>الخدمات العقارية المتضمنة (إن وجدت)</FormLabel>
                  <ShadFormDescription>اختر الخدمات التي سيتم تضمينها في هذا العرض (عادة لإدارة الأملاك).</ShadFormDescription>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {propertyServiceOptions.map((service) => (
                    <FormItem key={service.id}
                        className={cn( "flex flex-col items-center justify-center space-y-1 rounded-lg border p-3 transition-all hover:shadow-md cursor-pointer", field.value?.includes(service.id) && "bg-primary/10 border-primary ring-2 ring-primary")}
                        onClick={() => { const currentValues = field.value || []; const isSelected = currentValues.includes(service.id); if (isSelected) { field.onChange(currentValues.filter((value) => value !== service.id)); } else { field.onChange([...currentValues, service.id]); }}}>
                        <FormControl><Checkbox checked={field.value?.includes(service.id)} className="sr-only" /></FormControl>
                        <div className={cn("p-2 rounded-full transition-colors mb-1", field.value?.includes(service.id) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary" )}>
                            {React.cloneElement(service.icon, { className: "h-5 w-5"})}</div>
                        <FormLabel className={cn("font-medium cursor-pointer text-xs text-center !mt-0", field.value?.includes(service.id) ? "text-primary" : "text-foreground")}>{service.label}</FormLabel>
                    </FormItem>))}
                </div><FormMessage /></FormItem>)}/>
          <FormField control={form.control} name="paymentTerms" render={({ field }) => (<FormItem><FormLabel>شروط الدفع</FormLabel><FormControl><Textarea placeholder="مثال: دفعة مقدمة 50%، والباقي عند التسليم..." {...field} rows={3}/></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="termsAndConditions" render={({ field }) => (<FormItem><FormLabel>الشروط والأحكام العامة</FormLabel><FormControl><Textarea placeholder="أدخل الشروط والأحكام الخاصة بعرض السعر هنا..." {...field} rows={5} /></FormControl><FormMessage /></FormItem>)} />
          
          {state?.errors?._form && (<div className="flex items-center p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm"><AlertCircle className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" /><p>{state.errors._form.join(", ")}</p></div>)}
          <div className="pt-8 border-t flex flex-wrap justify-end items-center gap-4">
            <Button type="button" variant="outline" onClick={handleNewQuotationButtonClickInternal} className="w-full sm:w-auto"><RefreshCw className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> نموذج جديد</Button>
            <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin mr-2 rtl:ml-2 rtl:mr-0" /> : <Send className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />}حفظ عرض السعر</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

const SectionTitle: React.FC<{title: string, icon?: React.ReactElement}> = ({title, icon}) => (
  <legend className="text-xl font-bold text-accent mb-6 flex items-center gap-2 pt-6 border-t first:border-t-0 first:pt-0">
    {icon && React.cloneElement(icon, {className: "w-5 h-5 text-primary"})}
    {title}
  </legend>
);
