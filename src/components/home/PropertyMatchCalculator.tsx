
"use client";

import React, { useState, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RefreshCcw, FilePlus2, Percent, Building2 as Building2Icon, Square, LocateFixed, ChevronDown, Cog, BedDouble, Bath, Home, Briefcase, Calendar as CalendarIcon, ParkingCircle, Palette, Globe, MapPin, Edit3 } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, Cell, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PolarAngleAxis, LabelList } from 'recharts';
import type { PropertyUsage, RiyadhRegion, MatchCalculatorPropertyType, MatchCalculatorPurpose, MatchCalculatorFormValues, CommercialCategory, ServiceId, ResidentialPropertyType, CommercialPropertyType as CommercialPropertyTypeEnum } from '@/types';
import { RIYADH_REGIONS, RIYADH_NEIGHBORHOODS_WITH_REGIONS, ALL_RIYADH_NEIGHBORHOODS_FOR_SELECT } from "@/lib/constants";
import { Zap, ShieldCheck, Sparkles, Wrench, ReceiptText, Droplets, Siren, ArrowUpDown, Wifi } from "lucide-react";
import { CarIcon } from "@/components/icons/CarIcon";


const matchCalculatorPurposes: { value: MatchCalculatorPurpose; label: string }[] = [
  { value: 'Buy', label: 'شراء' },
  { value: 'Rent', label: 'إيجار' },
  { value: 'Investment', label: 'استثمار' },
  { value: 'Financing', label: 'تمويل' },
];

const matchCalculatorUsages: { value: PropertyUsage; label: string }[] = [
  { value: 'Commercial', label: 'تجاري' },
  { value: 'Residential', label: 'سكني' },
];

const residentialMatchPropertyTypes: { value: ResidentialPropertyType; label: string }[] = [
  { value: "Apartment", label: "شقة" },
  { value: "Villa", label: "فيلا" },
  { value: "Residential Land", label: "أرض سكنية" },
  { value: "Floor", label: "دور" },
  { value: "Duplex", label: "دوبلكس" },
  { value: "Building", label: "عمارة سكنية" },
  { value: "Palace", label: "قصر" },
  { value: "Residential Complex", label: "مجمع سكني" },
  { value: "Other", label: "أخرى (سكني)" },
];

const commercialMatchPropertyTypes: { value: CommercialPropertyTypeEnum; label: string }[] = [
  { value: "Office", label: "مكتب" },
  { value: "Commercial Land", label: "أرض تجارية" },
  { value: "Showroom", label: "معرض" },
  { value: "Warehouse", label: "مستودع" },
  { value: "Commercial Building", label: "عمارة تجارية" },
  { value: "Commercial Complex", label: "مجمع تجاري" },
  { value: "Workshop", label: "ورشة" },
  { value: "Gas Station", label: "محطة وقود" },
  { value: "Other", label: "أخرى (تجاري)" },
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

const serviceOptionsList: { id: ServiceId; label: string; icon: React.ReactElement }[] = [
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

const riyadhRegionEnum = z.custom<RiyadhRegion>((val) => RIYADH_REGIONS.map(r => r.value).includes(val as RiyadhRegion) || val === undefined, { message: "الرجاء اختيار النطاق" }).optional();
const serviceIdEnum = z.enum(serviceOptionsList.map(s => s.id) as [ServiceId, ...ServiceId[]]);

const formSchema = z.object({
  purpose: z.custom<MatchCalculatorPurpose>((val) => matchCalculatorPurposes.map(p => p.value).includes(val as MatchCalculatorPurpose),{
    message: "الرجاء اختيار الغرض من البحث العقاري.",
  }).optional(),
  usage: z.custom<PropertyUsage>((val) => matchCalculatorUsages.map(u => u.value).includes(val as PropertyUsage), {
    message: "الرجاء تحديد استخدام العقار.",
  }).optional(),
  propertyType: z.string().optional(),
  otherPropertyType: z.string().optional(),
  area: z.coerce.number().min(1, { message: "المساحة المطلوبة يجب أن تكون أكبر من صفر." }).optional(),
  region: riyadhRegionEnum,
  neighborhood: z.string().optional(),
  budgetMin: z.coerce.number().min(0).optional(),
  budgetMax: z.coerce.number().min(0).optional(),
  bedrooms: z.coerce.number().int().min(0).optional().transform(val => val === 0 ? undefined : val),
  bathrooms: z.coerce.number().int().min(0).optional().transform(val => val === 0 ? undefined : val),
  commercialCategory: z.custom<CommercialCategory>().optional(),
  otherCommercialCategory: z.string().optional(),
  services: z.array(serviceIdEnum).optional(),
  yearBuilt: z.coerce.number().int().min(1900, "سنة الإنشاء غير صالحة").max(new Date().getFullYear() +1, "سنة الإنشاء لا يمكن أن تكون في المستقبل البعيد جداً").optional().transform(val => val === 0 ? undefined : val),
  floors: z.coerce.number().int().min(0).optional().transform(val => val === 0 ? undefined : val),
  parkingSpots: z.coerce.number().int().min(0).optional().transform(val => val === 0 ? undefined : val),
}).superRefine((data, ctx) => {
  if (data.usage === "Residential" && data.propertyType && !residentialMatchPropertyTypes.map(p => p.value).includes(data.propertyType as ResidentialPropertyType) ) {
    if (data.propertyType !== "Other") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "نوع العقار السكني المحدد غير صالح.",
          path: ['propertyType'],
        });
    }
  }
  if (data.usage === "Commercial" && data.propertyType && !commercialMatchPropertyTypes.map(p => p.value).includes(data.propertyType as CommercialPropertyTypeEnum) ) {
     if (data.propertyType !== "Other") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "نوع العقار التجاري المحدد غير صالح.",
          path: ['propertyType'],
        });
    }
  }
  if (data.propertyType === 'Other' && !data.otherPropertyType?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "يرجى تحديد نوع العقار الآخر.",
      path: ['otherPropertyType'],
    });
  }
  if (data.budgetMin !== undefined && data.budgetMax !== undefined && data.budgetMax < data.budgetMin) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'الحد الأقصى للميزانية يجب أن يكون أكبر من أو يساوي الحد الأدنى.',
      path: ['budgetMax'],
    });
  }
  if (data.usage === 'Commercial' && data.commercialCategory === 'Other' && !data.otherCommercialCategory?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "يرجى تحديد فئة النشاط الأخرى.",
      path: ['otherCommercialCategory'],
    });
  }
});

const initialResultsData = {
  overall: 75,
  breakdown: [
    { name: 'استخدام العقار', value: 24, fill: 'var(--chart-3)', icon: <Building2Icon className="h-5 w-5" /> },
    { name: 'الموقع', value: 28, fill: 'var(--chart-2)', icon: <LocateFixed className="h-5 w-5" /> },
    { name: 'المساحة', value: 23, fill: 'var(--chart-1)', icon: <Square className="h-5 w-5" /> },
  ],
  cards: [
    { label: 'استخدام العقار', criteria: 'نوع واستخدام العقار', value: 24, score: 88, icon: <Building2Icon className="h-7 w-7" />, colorVar: '--chart-3' },
    { label: 'الموقع', criteria: 'الحي والنطاق الجغرافي', value: 28, score: 92, icon: <LocateFixed className="h-7 w-7" />, colorVar: '--chart-2' },
    { label: 'المساحة', criteria: 'المساحة المقترحة مقابل المطلوبة', value: 23, score: 85, icon: <Square className="h-7 w-7" />, colorVar: '--chart-1' },
  ]
};

export default function PropertyMatchCalculator() {
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(initialResultsData);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<MatchCalculatorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: undefined, usage: undefined, propertyType: undefined, otherPropertyType: '',
      area: undefined, region: undefined, neighborhood: '', budgetMin: undefined, budgetMax: undefined,
      bedrooms: undefined, bathrooms: undefined, commercialCategory: undefined, otherCommercialCategory: '',
      services: [], yearBuilt: undefined, floors: undefined, parkingSpots: undefined,
    },
  });

  const currentUsage = form.watch("usage");
  const currentPropertyType = form.watch("propertyType");
  const currentCommercialCategory = form.watch("commercialCategory");
  const currentRegion = form.watch("region");

  const availablePropertyTypes = useMemo(() => {
    if (currentUsage === 'Residential') return residentialMatchPropertyTypes;
    if (currentUsage === 'Commercial') return commercialMatchPropertyTypes;
    return [];
  }, [currentUsage]);

  const availableNeighborhoods = React.useMemo(() => {
    if (!currentRegion || currentRegion === "Other") {
      return ALL_RIYADH_NEIGHBORHOODS_FOR_SELECT;
    }
    return RIYADH_NEIGHBORHOODS_WITH_REGIONS
      .filter(hood => hood.region === currentRegion)
      .map(n => ({value: n.value, labelAr: n.labelAr, labelEn: n.labelEn}))
      .sort((a,b) => a.labelAr.localeCompare(b.labelAr, 'ar'));
  }, [currentRegion]);

  function onSubmit(values: MatchCalculatorFormValues) {
    setIsCalculating(true);
    
    let overallScore = 50;
    if (values.purpose) overallScore += 5; 
    if (values.usage) overallScore += 5; 
    if (values.propertyType) overallScore += 8;
    if (values.area && values.area > 100) overallScore += 7; else if (values.area) overallScore +=3;
    if (values.region) overallScore += 5; if (values.budgetMax && values.budgetMax > 0) overallScore += 5;
    if (values.bedrooms && values.bedrooms > 0) overallScore += 2; if (values.bathrooms && values.bathrooms > 0) overallScore += 2;
    if (values.commercialCategory) overallScore += 3; if (values.services && values.services.length > 0) overallScore += 3;
    if (values.yearBuilt && values.yearBuilt > 2000) overallScore += 2; if (values.floors && values.floors > 0) overallScore += 1;
    if (values.parkingSpots && values.parkingSpots > 0) overallScore += 2;
    overallScore = Math.min(100, Math.max(60, overallScore + Math.floor(Math.random() * 15)));
    
    const newOverall = overallScore;
    const breakdown = [
        { name: 'استخدام ونوع العقار', criteria: 'نوع واستخدام العقار المحدد', value: values.usage && values.propertyType ? Math.floor(Math.random() * 10) + 20 : 5, fill: 'hsl(var(--chart-3))', icon: <Building2Icon className="h-5 w-5" />, score: Math.floor(Math.random() * 20) + 75 },
        { name: 'الموقع والتفضيلات الجغرافية', criteria: 'الحي والنطاق الجغرافي المطلوب', value: values.region || values.neighborhood ? Math.floor(Math.random() * 10) + 25 : 5, fill: 'hsl(var(--chart-2))', icon: <LocateFixed className="h-5 w-5" />, score: Math.floor(Math.random() * 20) + 78 },
        { name: 'المساحة والميزانية', criteria: 'المساحة والميزانية المحددة', value: values.area || values.budgetMax ? Math.floor(Math.random() * 10) + 20 : 5, fill: 'hsl(var(--chart-1))', icon: <Square className="h-5 w-5" />, score: Math.floor(Math.random() * 20) + 70 },
        { name: 'المواصفات الإضافية', criteria: 'الغرف، الخدمات، سنة البناء، إلخ', value: (values.bedrooms || values.bathrooms || values.commercialCategory || (values.services && values.services.length > 0) || values.yearBuilt || values.floors || values.parkingSpots) ? Math.floor(Math.random() * 10) + 15 : 5, fill: 'hsl(var(--chart-4))', icon: <Cog className="h-5 w-5" />, score: Math.floor(Math.random() * 20) + 65 },
    ];

    const totalValue = breakdown.reduce((sum, item) => sum + item.value, 0);
    const finalBreakdown = breakdown.map(item => ({ ...item, value: Math.round((item.value / totalValue) * newOverall) || 0 }));
    
    let currentSum = finalBreakdown.reduce((sum, item) => sum + item.value, 0);
    if (currentSum !== newOverall && finalBreakdown.length > 0) {
        const diff = newOverall - currentSum;
        finalBreakdown[0].value += diff; 
    }

    const finalCards = finalBreakdown.map(item => ({ label: item.name, criteria: item.criteria, value: item.value, score: item.score, icon: React.cloneElement(item.icon, { style: { color: item.fill, margin: '0 auto 0.5rem auto', width: '1.75rem', height: '1.75rem' } }), colorVar: item.fill.replace('hsl(var(', '').replace('))', '') }));
    setResultsData({ overall: newOverall, breakdown: finalBreakdown.map(({ name, value, fill, icon }) => ({ name, value, fill, icon })), cards: finalCards, });
    
    // تأخير إظهار النتائج لتأثير أفضل
    setTimeout(() => {
      setIsCalculating(false);
      setShowResults(true);
    }, 1500);
  }

  function handleReset() {
    form.reset();
    setShowResults(false);
  }

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

  return (
    <Card className="w-full shadow-xl border-primary/20 hover:shadow-2xl transition-shadow duration-500" dir="rtl">
      <CardHeader className="text-center bg-gradient-to-r from-primary/10 to-accent/5 rounded-t-lg">
        <CardTitle className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
          <Percent className="h-9 w-9 text-primary animate-pulse" /> حاسبة توافق العقار
        </CardTitle>
        <CardDescription className="text-md text-muted-foreground pt-1 px-4 leading-relaxed">
          هل تتساءل عن مدى توافق العقار الذي تبحث عنه مع معايير السوق والفرص المتاحة؟ أدخل مواصفات طلبك واحصل على تقدير مبدئي لنسبة التطابق، مما يساعدك على توجيه بحثك بفعالية أكبر.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <FormField control={form.control} name="purpose" render={({ field }) => (<FormItem><FormLabel>الغرض من الطلب</FormLabel><Select onValueChange={field.onChange} value={field.value ?? ''}><FormControl><SelectTrigger className="form-input"><SelectValue placeholder="اختر الغرض..." /></SelectTrigger></FormControl><SelectContent>{matchCalculatorPurposes.map(p => (<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="usage" render={({ field }) => (
                <FormItem>
                  <FormLabel>الاستخدام الأساسي</FormLabel>
                  <Select 
                    onValueChange={(value) => { 
                      field.onChange(value); 
                      form.setValue("propertyType", undefined); 
                      form.setValue("otherPropertyType", ""); 
                      form.setValue("commercialCategory", undefined); 
                      form.setValue("otherCommercialCategory", ""); 
                      form.setValue("bedrooms", undefined); 
                      form.setValue("bathrooms", undefined); 
                    }} 
                    value={field.value ?? ''}>
                    <FormControl>
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="اختر الاستخدام..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {matchCalculatorUsages.map(u => (
                        <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="propertyType" render={({ field }) => (<FormItem><FormLabel>نوع العقار</FormLabel><Select onValueChange={(value) => { field.onChange(value); if (value !== "Other") { form.setValue("otherPropertyType", "");}}} value={field.value ?? ''} disabled={!currentUsage}><FormControl><SelectTrigger className="form-input"><SelectValue placeholder={!currentUsage ? "اختر الاستخدام أولاً" : "اختر نوع العقار..."} /></SelectTrigger></FormControl><SelectContent>{availablePropertyTypes.map(type => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            </div>
            {currentPropertyType === 'Other' && currentUsage && (
              <FormField control={form.control} name="otherPropertyType" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Edit3 className="w-4 h-4 text-muted-foreground" />يرجى تحديد نوع العقار الآخر</FormLabel>
                  <FormControl><Input className="form-input" placeholder={currentUsage === "Residential" ? "مثال: استراحة، شاليه، مزرعة" : "مثال: فندق، مستشفى، مركز بيانات"} {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <FormField control={form.control} name="area" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><Square className="w-4 h-4 text-muted-foreground" />المساحة المطلوبة (م²)</FormLabel><FormControl><Input type="number" placeholder="مثال: 300" className="form-input" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="region" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><Globe className="w-4 h-4 text-muted-foreground" />نطاق مدينة الرياض</FormLabel><Select onValueChange={(value) => handleRegionChange(value as RiyadhRegion | undefined)} value={field.value ?? undefined}><FormControl><SelectTrigger className="form-input"><SelectValue placeholder="اختر النطاق..." /></SelectTrigger></FormControl><SelectContent>{RIYADH_REGIONS.map(regionOpt => (<SelectItem key={regionOpt.value} value={regionOpt.value}>{regionOpt.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="neighborhood" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" />الحي المفضل (اختياري)</FormLabel><Select onValueChange={(value) => handleNeighborhoodChange(value)} value={field.value ?? undefined} disabled={!availableNeighborhoods.length && !!currentRegion && currentRegion !== "Other"}><FormControl><SelectTrigger className="form-input"><SelectValue placeholder={!availableNeighborhoods.length && !!currentRegion && currentRegion !== "Other" ? "لا توجد أحياء لهذا النطاق" : "اختر الحي..."} /></SelectTrigger></FormControl><SelectContent className="max-h-60 overflow-y-auto">{availableNeighborhoods.map(hood => (<SelectItem key={hood.value} value={hood.value}>{hood.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            </div>

            {currentUsage === 'Residential' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="bedrooms" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><BedDouble className="w-4 h-4 text-muted-foreground" /> عدد غرف النوم (اختياري)</FormLabel><FormControl><Input type="number" placeholder="مثال: 3" className="form-input" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} min="0" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="bathrooms" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><Bath className="w-4 h-4 text-muted-foreground" /> عدد دورات المياه (اختياري)</FormLabel><FormControl><Input type="number" placeholder="مثال: 2" className="form-input" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} min="0" /></FormControl><FormMessage /></FormItem>)} />
              </div>
            )}
            
            {currentUsage === 'Commercial' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="commercialCategory" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-muted-foreground" /> فئة النشاط التجاري (اختياري)</FormLabel><Select onValueChange={(value) => { field.onChange(value); form.setValue("otherCommercialCategory", ""); }} value={field.value ?? ''}><FormControl><SelectTrigger className="form-input"><SelectValue placeholder="اختر فئة النشاط..." /></SelectTrigger></FormControl><SelectContent>{commercialCategoriesList.map(cat => (<SelectItem key={cat.value} value={cat.value}>{cat.labelAr}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                {currentCommercialCategory === 'Other' && (
                  <FormField control={form.control} name="otherCommercialCategory" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Edit3 className="w-4 h-4 text-muted-foreground" />يرجى تحديد فئة النشاط الأخرى</FormLabel>
                      <FormControl><Input className="form-input" placeholder="مثال: خدمات تقنية متخصصة" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
              </div>
            )}
            
            <div>
              <FormLabel className="block mb-2">الميزانية المتوقعة (بالريال السعودي)</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="budgetMin" render={({ field }) => (<FormItem><FormLabel className="text-xs text-muted-foreground">أدنى ميزانية (اختياري)</FormLabel><FormControl><Input type="number" placeholder="مثال: 500,000" className="form-input" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="budgetMax" render={({ field }) => (<FormItem><FormLabel className="text-xs text-muted-foreground">أقصى ميزانية (اختياري)</FormLabel><FormControl><Input type="number" placeholder="مثال: 1,000,000" className="form-input" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} /></FormControl><FormMessage />
              </FormItem>
            )} />
          </div>
        </div>
            
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField control={form.control} name="yearBuilt" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-muted-foreground" />سنة الإنشاء (أقدم سنة مقبولة)</FormLabel>
              <FormControl><Input type="number" placeholder="مثال: 2010" className="form-input" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="floors" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><Building2Icon className="w-4 h-4 text-muted-foreground" />عدد الطوابق (الأدنى)</FormLabel>
              <FormControl><Input type="number" placeholder="مثال: 2" className="form-input" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} min="0" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="parkingSpots" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><ParkingCircle className="w-4 h-4 text-muted-foreground" />عدد مواقف السيارات (الأدنى)</FormLabel>
              <FormControl><Input type="number" placeholder="مثال: 1" className="form-input" {...field} value={field.value === undefined ? '' : String(field.value)} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} min="0" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
            
        <FormField control={form.control} name="services" render={() => (
          <FormItem>
            <FormLabel className="flex items-center gap-2"><Cog className="w-4 h-4 text-muted-foreground" /> الخدمات والمرافق الإضافية المطلوبة (اختياري)</FormLabel>
            <Controller control={form.control} name="services" render={({ field: controllerServicesField }) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between form-input !px-3 !py-2 h-10 border-input">
                    <span className="truncate">{controllerServicesField.value && controllerServicesField.value.length > 0 ? controllerServicesField.value.map(val => serviceOptionsList.find(s => s.id === val)?.label || val).join('، ') : "--- اختر الخدمات المطلوبة ---"}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-60 overflow-y-auto">
                  <DropdownMenuLabel>اختر خدمة أو أكثر</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {serviceOptionsList.map((service) => (
                    <DropdownMenuCheckboxItem key={service.id} checked={controllerServicesField.value?.includes(service.id)} onCheckedChange={(checked) => { const currentValues = controllerServicesField.value || []; if (checked) { controllerServicesField.onChange([...currentValues, service.id]); } else { controllerServicesField.onChange(currentValues.filter(v => v !== service.id)); } }}>{service.label}</DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )} />
            <FormMessage />
          </FormItem>
        )} />
            
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Button 
            type="submit" 
            size="lg" 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-lg py-6 px-8 shadow-lg hover:shadow-xl transition-all"
            disabled={isCalculating}>
            {isCalculating ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full ml-2" />
                جاري الحساب...
              </>
            ) : (
              <>
                <Percent className="ml-2 h-5 w-5" /> 
                حساب نسبة التطابق
              </>
            )}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto text-lg py-6 px-8" disabled={isCalculating}>
            <RefreshCcw className="ml-2 h-5 w-5" /> إعادة تعبئة النموذج
          </Button>
          <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto text-lg py-6 px-8 shadow hover:shadow-md transition-all" disabled={isCalculating}>
            <Link href="/new-request">
              <FilePlus2 className="ml-2 h-5 w-5" /> تقديم طلب عقاري مفصل
            </Link>
          </Button>
        </div>
      </form>
    </Form>
    {showResults && (
      <div className="mt-12 pt-8 border-t bg-gradient-to-b from-muted/10 to-transparent">
        <h3 className="text-3xl font-bold text-center text-accent mb-8 font-headline animate-fadeIn">نتائج تقدير تطابق طلبك العقاري</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={230}>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: 'Overall', value: resultsData.overall, fill: 'hsl(var(--primary))' }]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" angleAxisId={0} data={[{ value: 100, fill: "hsl(var(--muted)/0.3)" }]} />
                <RadialBar dataKey="value" angleAxisId={0} cornerRadius={10} animationDuration={1500}/>
                <text 
                  x="50%" 
                  y="48%" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="text-5xl font-bold"
                  style={{ fill: 'hsl(var(--primary))' }}
                >
                  {resultsData.overall}%
                </text>
                <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" className="text-sm" style={{ fill: 'hsl(var(--muted-foreground))' }}>تطابق تقديري</text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="md:col-span-2 animate-fadeIn">
            <ResponsiveContainer width="100%" height={270}>
              <RechartsBarChart data={resultsData.breakdown} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }} barCategoryGap="35%">
                <XAxis type="number" domain={[0, Math.max(...resultsData.breakdown.map(item => item.value), 40)]} hide/>
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={110} style={{ fontSize: '0.9rem', fill: 'hsl(var(--muted-foreground))' }}/>
                <Tooltip cursor={{fill: 'hsl(var(--muted)/0.2)'}} contentStyle={{backgroundColor: 'hsl(var(--background))', borderRadius: '0.5rem', borderColor: 'hsl(var(--border))', direction: 'rtl'}} labelStyle={{color: 'hsl(var(--foreground))', fontWeight: 'bold'}} formatter={(value: number, name: string) => [`${value}%`, name]}/>
                <Bar dataKey="value" radius={[0, 5, 5, 0]} barSize={30} animationDuration={1200} animationBegin={300}>
                  {resultsData.breakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                  <LabelList dataKey="value" position="center" style={{ fill: 'hsl(var(--primary-foreground))', fontSize: '1rem', fontWeight: 'bold', }} formatter={(value: number) => `${value}%`} />
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resultsData.cards.map((card, index) => (
            <Card 
              key={index} 
              className="bg-card text-center border-border hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]"
              style={{ animationDelay: `${index * 150}ms`, animationDuration: '500ms', animationName: 'fadeIn', animationFillMode: 'forwards' }}>
              <CardHeader className="pb-2 pt-4">
                {React.cloneElement(card.icon, { style: {...card.icon.props.style }})}
                <CardTitle className="text-lg font-semibold" style={{color: card.colorVar ? `hsl(var(${card.colorVar}))` : 'hsl(var(--foreground))'}}>{card.label}</CardTitle>
              </CardHeader>
              <CardContent className="pb-5 pt-2">
                <p className="text-3xl font-bold text-foreground">{card.score}%</p>
                <p className="text-xs text-muted-foreground mt-2">{card.criteria}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="p-4 border border-primary/10 bg-primary/5 rounded-lg max-w-3xl mx-auto mt-10">
          <p className="text-sm text-center text-muted-foreground leading-relaxed">
            <strong className="text-primary font-bold">ملاحظة هامة:</strong> هذه النسب هي تقديرات أولية بناءً على البيانات التي أدخلتها. تهدف لمساعدتك في تقييم مدى تطابق طلبك مع المعايير العامة للسوق والفرص المتوفرة. لا تمثل هذه النتائج عروضًا فعلية أو ضمانًا للحصول على عقار معين. للحصول على تحليل دقيق وعروض مخصصة، ننصحك <Link href="/new-request" className="text-primary hover:underline font-medium">بتقديم طلب عقاري مفصل</Link> أو <Link href="/contact-us" className="text-primary hover:underline font-medium">بالتواصل مباشرة مع فريق خبرائنا في أفاز العقارية</Link>.
          </p>
        </div>
      </div>
    )}
    
    <style jsx global>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
      }
        </p>
      </div>
    )}
  </CardContent>
</Card>
  );
}

    
