
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { BarChart3, AlertTriangle, Info, Download, Upload, CalendarDays, Building2, MapPinIcon, Scale, DollarSign, TrendingUp, Filter, Search, ChevronDown, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MarketTransaction, MarketTransactionPropertyType, MarketTransactionDealType } from "@/types";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { 
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from "recharts";

// Sample/Mock Data - Kept for initial display or if no file is uploaded
const sampleTransactions: MarketTransaction[] = [
  {
    id: "TXN001",
    transactionDate: new Date("2024-07-20T10:00:00Z"),
    city: "الرياض",
    neighborhood: "النرجس (شمال الرياض)",
    propertyType: "سكني",
    propertyUsage: "فيلا",
    dealType: "بيع",
    areaM2: 450,
    priceSAR: 2800000,
    pricePerM2: 6222.22,
    sourceAgency: "MOJ",
    importedAt: new Date(),
  },
  {
    id: "TXN002",
    transactionDate: new Date("2024-07-20T11:30:00Z"),
    city: "الرياض",
    neighborhood: "الملقا (شمال الرياض)",
    propertyType: "تجاري",
    propertyUsage: "أرض",
    dealType: "بيع",
    areaM2: 1200,
    priceSAR: 15000000,
    pricePerM2: 12500,
    sourceAgency: "MOJ",
    importedAt: new Date(),
  },
  {
    id: "TXN003",
    transactionDate: new Date("2024-07-19T14:15:00Z"),
    city: "الرياض",
    neighborhood: "الصحافة (شمال الرياض)",
    propertyType: "سكني",
    propertyUsage: "شقة",
    dealType: "بيع",
    areaM2: 180,
    priceSAR: 950000,
    pricePerM2: 5277.78,
    sourceAgency: "MOJ",
    importedAt: new Date(),
  },
];

// أضفت المزيد من البيانات للتحليل
const additionalTransactions: MarketTransaction[] = [
  {
    id: "TXN004",
    transactionDate: new Date("2024-07-18T09:30:00Z"),
    city: "الرياض",
    neighborhood: "العارض (شمال الرياض)",
    propertyType: "سكني",
    propertyUsage: "فيلا",
    dealType: "بيع",
    areaM2: 420,
    priceSAR: 2600000,
    pricePerM2: 6190,
    sourceAgency: "MOJ",
    importedAt: new Date(),
  },
  {
    id: "TXN005",
    transactionDate: new Date("2024-07-17T16:00:00Z"),
    city: "الرياض",
    neighborhood: "قرطبة (شرق الرياض)",
    propertyType: "سكني",
    propertyUsage: "شقة",
    dealType: "بيع",
    areaM2: 165,
    priceSAR: 850000,
    pricePerM2: 5152,
    sourceAgency: "MOJ",
    importedAt: new Date(),
  },
  {
    id: "TXN006",
    transactionDate: new Date("2024-07-15T11:00:00Z"),
    city: "الرياض",
    neighborhood: "السويدي (غرب الرياض)",
    propertyType: "سكني",
    propertyUsage: "فيلا",
    dealType: "بيع",
    areaM2: 380,
    priceSAR: 1950000,
    pricePerM2: 5132,
    sourceAgency: "MOJ",
    importedAt: new Date(),
  }
];

const useMarketData = () => {
  const [transactions, setTransactions] = React.useState<MarketTransaction[]>(sampleTransactions);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Placeholder for future data fetching from Firestore
  // React.useEffect(() => { /* Firestore fetching logic */ }, []);

  return { transactions, isLoading, error, setTransactions };
}; 

const propertyTypeArabicMap: Record<MarketTransactionPropertyType, string> = {
  "سكني": "سكني",
  "تجاري": "تجاري",
  "زراعي": "زراعي",
  "صناعي": "صناعي",
  "أخرى": "أخرى",
};

const dealTypeArabicMap: Record<MarketTransactionDealType, string> = {
  "بيع": "بيع",
  "هبة": "هبة",
  "إيجار": "إيجار",
  "أخرى": "أخرى",
};

// نطاقات الرياض
const riyadhRegions = [
  { id: 'all', name: 'جميع المناطق' },
  { id: 'north', name: 'شمال الرياض' },
  { id: 'east', name: 'شرق الرياض' },
  { id: 'west', name: 'غرب الرياض' },
  { id: 'south', name: 'جنوب الرياض' },
  { id: 'central', name: 'وسط الرياض' },
];

export default function MarketDataPage() {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'table' | 'analytics'>('table');
  const [searchTermNeighborhood, setSearchTermNeighborhood] = React.useState("");
  const [filterPropertyType, setFilterPropertyType] = React.useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"priceAsc" | "priceDesc" | "dateDesc">("dateDesc");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const { transactions: baseTransactions, isLoading, error, setTransactions } = useMarketData();
  
  // استخدام مجموعة البيانات الموسعة
  const allTransactions = useMemo(() => [...baseTransactions, ...additionalTransactions], [baseTransactions]);

  const filteredTransactions = React.useMemo(() => {
    return allTransactions.filter(transaction => {
      const matchesNeighborhood = searchTermNeighborhood
        ? transaction.neighborhood.toLowerCase().includes(searchTermNeighborhood.toLowerCase())
        : true;
      const matchesPropertyType = filterPropertyType === "all"
        ? true
        : transaction.propertyType === filterPropertyType;
      
      // تطبيق فلتر المنطقة
      const matchesRegion = regionFilter === "all" 
        ? true 
        : transaction.neighborhood.includes(
            regionFilter === "north" ? "شمال الرياض" : 
            regionFilter === "east" ? "شرق الرياض" : 
            regionFilter === "west" ? "غرب الرياض" :
            regionFilter === "south" ? "جنوب الرياض" :
            regionFilter === "central" ? "وسط الرياض" : ""
          );
          
      return matchesNeighborhood && matchesPropertyType && matchesRegion;
    }).sort((a,b) => {
      if (sortOrder === "dateDesc") return b.transactionDate.getTime() - a.transactionDate.getTime();
      if (sortOrder === "priceAsc") return a.priceSAR - b.priceSAR;
      if (sortOrder === "priceDesc") return b.priceSAR - a.priceSAR;
      return 0;
    });
  }, [allTransactions, searchTermNeighborhood, filterPropertyType, sortOrder, regionFilter]);

  const summaryStats = React.useMemo(() => {
    if (filteredTransactions.length === 0) {
      return { 
        totalTransactions: 0, 
        avgPricePerM2: 0, 
        totalValue: 0, 
        latestTransactionDate: null,
        avgResidentialPricePerM2: 0,
        avgCommercialPricePerM2: 0,
        totalArea: 0
      };
    }
    const totalValue = filteredTransactions.reduce((sum, t) => sum + t.priceSAR, 0);
    const totalArea = filteredTransactions.reduce((sum, t) => sum + t.areaM2, 0);
    const avgPricePerM2 = totalArea > 0 ? totalValue / totalArea : 0;
    
    // حساب متوسط سعر المتر حسب نوع العقار
    const residentialTransactions = filteredTransactions.filter(t => t.propertyType === "سكني");
    const commercialTransactions = filteredTransactions.filter(t => t.propertyType === "تجاري");
    
    const residentialTotalArea = residentialTransactions.reduce((sum, t) => sum + t.areaM2, 0);
    const residentialTotalValue = residentialTransactions.reduce((sum, t) => sum + t.priceSAR, 0);
    const avgResidentialPricePerM2 = residentialTotalArea > 0 ? residentialTotalValue / residentialTotalArea : 0;
    
    const commercialTotalArea = commercialTransactions.reduce((sum, t) => sum + t.areaM2, 0);
    const commercialTotalValue = commercialTransactions.reduce((sum, t) => sum + t.priceSAR, 0);
    const avgCommercialPricePerM2 = commercialTotalArea > 0 ? commercialTotalValue / commercialTotalArea : 0;
    
    const latestTransactionDate = filteredTransactions.length > 0 ? filteredTransactions[0].transactionDate : null;
    
    return {
      totalTransactions: filteredTransactions.length,
      avgPricePerM2: parseFloat(avgPricePerM2.toFixed(0)),
      totalValue: totalValue,
      latestTransactionDate: latestTransactionDate,
      avgResidentialPricePerM2: parseFloat(avgResidentialPricePerM2.toFixed(0)),
      avgCommercialPricePerM2: parseFloat(avgCommercialPricePerM2.toFixed(0)),
      totalArea: totalArea
    };
  }, [filteredTransactions]);
  
  // بيانات للرسوم البيانية
  const chartData = useMemo(() => {
    // تجميع البيانات حسب الحي للرسم البياني
    const neighborhoodData = filteredTransactions.reduce((acc, transaction) => {
      const neighborhood = transaction.neighborhood.split(" ")[0]; // استخراج اسم الحي بدون النطاق
      if (!acc[neighborhood]) {
        acc[neighborhood] = {
          neighborhood,
          count: 0,
          totalValue: 0,
          totalArea: 0,
          avgPricePerM2: 0
        };
      }
      acc[neighborhood].count += 1;
      acc[neighborhood].totalValue += transaction.priceSAR;
      acc[neighborhood].totalArea += transaction.areaM2;
      return acc;
    }, {} as Record<string, { neighborhood: string; count: number; totalValue: number; totalArea: number; avgPricePerM2: number }>);
    
    // حساب متوسط سعر المتر وتحويل إلى مصفوفة
    const chartData = Object.values(neighborhoodData).map(item => {
      item.avgPricePerM2 = item.totalArea > 0 ? Math.round(item.totalValue / item.totalArea) : 0;
      return item;
    });
    
    // ترتيب البيانات حسب عدد المعاملات
    return chartData.sort((a, b) => b.count - a.count).slice(0, 6);
  }, [filteredTransactions]);
  
  // بيانات للرسم البياني الخطي
  const priceTimeSeriesData = useMemo(() => {
    // تجميع البيانات حسب التاريخ للرسم البياني
    const dateMap = filteredTransactions.reduce((acc, transaction) => {
      const dateStr = format(transaction.transactionDate, "yyyy-MM-dd");
      if (!acc[dateStr]) {
        acc[dateStr] = {
          date: dateStr,
          avgPricePerM2: 0,
          totalValue: 0,
          totalArea: 0,
          count: 0
        };
      }
      acc[dateStr].totalValue += transaction.priceSAR;
      acc[dateStr].totalArea += transaction.areaM2;
      acc[dateStr].count += 1;
      return acc;
    }, {} as Record<string, { date: string; avgPricePerM2: number; totalValue: number; totalArea: number; count: number }>);
    
    // حساب متوسط سعر المتر وتحويل إلى مصفوفة
    const timeSeriesData = Object.values(dateMap).map(item => {
      item.avgPricePerM2 = item.totalArea > 0 ? Math.round(item.totalValue / item.totalArea) : 0;
      return item;
    });
    
    // ترتيب البيانات حسب التاريخ
    return timeSeriesData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredTransactions]);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          // Basic CSV Parsing (assuming comma-separated and specific column order)
          // Header: TransactionDate,Neighborhood,PropertyType,PropertyUsage,AreaM2,PriceSAR,DealType
          // Example: 2024-07-21,الرمال,سكني,فيلا,350,2200000,بيع
          const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
          const header = lines[0].split(','); // Or use a predefined header
          const newTransactions: MarketTransaction[] = lines.slice(1).map((line, index) => {
            const columns = line.split(',');
            if (columns.length < 6) { // Expecting at least Date, Hood, Type, Usage, Area, Price
              console.warn(`Skipping malformed CSV line ${index + 2}: ${line}`);
              return null;
            }
            const transactionDate = new Date(columns[0].trim());
            const neighborhood = columns[1].trim();
            const propertyType = columns[2].trim() as MarketTransactionPropertyType;
            const propertyUsage = columns[3].trim();
            const areaM2 = parseFloat(columns[4].trim());
            const priceSAR = parseFloat(columns[5].trim());
            const dealType = columns[6] ? columns[6].trim() as MarketTransactionDealType : "بيع"; // Default to 'بيع' if not present

            if (isNaN(transactionDate.getTime()) || !neighborhood || !propertyType || isNaN(areaM2) || isNaN(priceSAR)) {
              console.warn(`Invalid data in CSV line ${index + 2}: ${line}`);
              return null;
            }
            return {
              id: `CSV-${Date.now()}-${index}`,
              transactionDate,
              city: "الرياض",
              neighborhood,
              propertyType,
              propertyUsage,
              dealType,
              areaM2,
              priceSAR,
              pricePerM2: areaM2 > 0 ? priceSAR / areaM2 : 0,
              sourceAgency: "MOJ",
              importedAt: new Date(),
            };
          }).filter(Boolean) as MarketTransaction[];
          
          if (newTransactions.length > 0) {
            setTransactions(prev => [...newTransactions, ...prev].sort((a,b) => b.transactionDate.getTime() - a.transactionDate.getTime()));
            toast({ title: "تم الاستيراد", description: `${newTransactions.length} صفقة تم استيرادها وعرضها.` });
          } else {
            toast({ variant: "destructive", title: "فشل الاستيراد", description: "لم يتم العثور على بيانات صالحة في الملف أو أن الملف فارغ." });
          }
        } catch (parseError) {
            console.error("Error parsing CSV:", parseError);
            toast({ variant: "destructive", title: "خطأ في تحليل الملف", description: "تعذر تحليل ملف CSV. يرجى التأكد من صحة التنسيق."});
        }
      };
      reader.onerror = () => {
        toast({ variant: "destructive", title: "خطأ في قراءة الملف", description: "لم نتمكن من قراءة الملف المحدد."});
      }
      reader.readAsText(file);
      event.target.value = ""; // Reset file input to allow re-upload of the same file
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <Card className="shadow-xl border-accent/20">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 sm:p-6 rounded-t-lg border-b">
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary font-headline flex items-center">
              <BarChart3 className="ml-3 h-7 w-7" />
              بيانات سوق الرياض العقاري (من وزارة العدل)
            </CardTitle>
            <CardDescription className="text-sm sm:text-md text-muted-foreground mt-1">
              عرض وتحليل لبيانات الصفقات العقارية في مدينة الرياض.
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex p-1 border rounded-lg bg-muted/30">
              <Button variant={activeView === 'table' ? 'default' : 'ghost'} 
                     size="sm" className="text-xs" onClick={() => setActiveView('table')}>
                جدول البيانات
              </Button>
              <Button variant={activeView === 'analytics' ? 'default' : 'ghost'} 
                      size="sm" className="text-xs" onClick={() => setActiveView('analytics')}>تحليلات متقدمة</Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => document.getElementById('csvUpload')?.click()}>
              <Upload className="ml-2 h-4 w-4"/> استيراد CSV (تجريبي)
            </Button>
            <Input type="file" id="csvUpload" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-6 p-4 border bg-blue-50 border-blue-200 rounded-lg text-blue-700 text-sm flex items-start gap-3">
            <Info size={20} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-blue-800">ملاحظة هامة:</p>
              <p>وظيفة استيراد CSV هي ميزة تجريبية لمعاينة البيانات من جانب العميل. البيانات المستوردة لا تُحفظ بشكل دائم في قاعدة البيانات. للتكامل الدائم، سيتم تطوير نظام يعتمد على رفع الملفات إلى خادم سحابي ومعالجتها هناك.</p>
              <p className="mt-1">تنسيق CSV المتوقع (مثال): `تاريخ الصفقة (YYYY-MM-DD),الحي,نوع العقار (سكني/تجاري),وصف الاستخدام (فيلا/أرض),المساحة,السعر,نوع الصفقة (بيع/هبة)`.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            <Card className="shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-1 pt-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <ListChecks className="h-4 w-4 text-primary" /> إجمالي الصفقات
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-2xl font-bold text-primary" dir="ltr">{summaryStats.totalTransactions.toLocaleString('en-US')}</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="pb-1 pt-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-primary" /> متوسط سعر المتر (SAR)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-2xl font-bold text-primary" dir="ltr">{summaryStats.avgPricePerM2.toLocaleString('en-US')}</div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1" dir="ltr">
                  <span>سكني: {summaryStats.avgResidentialPricePerM2.toLocaleString()}</span>
                  <span>تجاري: {summaryStats.avgCommercialPricePerM2.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-1 pt-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-primary" /> إجمالي قيمة الصفقات (SAR)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-2xl font-bold text-primary" dir="ltr">{summaryStats.totalValue.toLocaleString('en-US')}</div>
                <div className="text-xs text-muted-foreground mt-1" dir="ltr">
                  إجمالي المساحة: {summaryStats.totalArea.toLocaleString()} م²
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-1 pt-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-primary" /> آخر تاريخ تحديث
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-lg font-bold text-primary" dir="ltr">
                  {summaryStats.latestTransactionDate ? format(summaryStats.latestTransactionDate, "yyyy/MM/dd", { locale: enUS }) : "N/A"}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Card className="w-full bg-card p-4 border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="absolute top-1/2 transform -translate-y-1/2 right-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="بحث باسم الحي..."
                    value={searchTermNeighborhood}
                    onChange={(e) => setSearchTermNeighborhood(e.target.value)}
                    className="pr-10 form-input h-9 text-sm"
                  />
                </div>
                
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="form-input h-9 text-sm">
                    <SelectValue placeholder="النطاق" />
                  </SelectTrigger>
                  <SelectContent>
                    {riyadhRegions.map(region => (
                      <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterPropertyType} onValueChange={setFilterPropertyType}>
                  <SelectTrigger className="form-input h-9 text-sm">
                    <SelectValue placeholder="نوع العقار" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    {(Object.keys(propertyTypeArabicMap) as MarketTransactionPropertyType[]).map(type => (
                      <SelectItem key={type} value={type}>{propertyTypeArabicMap[type]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto text-sm">
                      <Filter className="ml-1.5 h-3.5 w-3.5" /> ترتيب حسب:
                      {sortOrder === "dateDesc" ? " الأحدث" : 
                       sortOrder === "priceAsc" ? " السعر (تصاعدي)" : 
                       sortOrder === "priceDesc" ? " السعر (تنازلي)" : ""}
                      <ChevronDown className="mr-2 h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem onClick={() => setSortOrder("dateDesc")}>
                      <CalendarDays className="ml-2 h-4 w-4" /> الأحدث أولاً
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("priceAsc")}>
                      <ArrowUpDown className="ml-2 h-4 w-4" /> السعر (الأقل أولاً)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("priceDesc")}>
                      <ArrowUpDown className="ml-2 h-4 w-4" /> السعر (الأعلى أولاً)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          </div>

          {isLoading && <p className="text-center text-muted-foreground py-8">جاري تحميل البيانات...</p>}
          {error && <p className="text-center text-destructive py-8">{error}</p>}
          {!isLoading && !error && (
            activeView === 'table' ? (
              filteredTransactions.length > 0 ? (
                <div className="overflow-x-auto border rounded-lg bg-card/50">
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">تاريخ الصفقة</TableHead>
                      <TableHead className="text-right">الحي</TableHead>
                      <TableHead className="text-right">نوع العقار</TableHead>
                      <TableHead className="text-right">الاستخدام/الوصف</TableHead>
                      <TableHead className="text-right">نوع الصفقة</TableHead>
                      <TableHead className="text-right">المساحة (م²)</TableHead>
                      <TableHead className="text-right">السعر (ر.س)</TableHead>
                      <TableHead className="text-right">سعر المتر (ر.س)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction, idx) => (
                      <TableRow key={transaction.id} className="hover:bg-muted/10">
                        <TableCell className="whitespace-nowrap" dir="ltr">
                          <CalendarDays className="inline h-3.5 w-3.5 mr-1 rtl:ml-1 text-muted-foreground"/>
                          {format(transaction.transactionDate, "yyyy/MM/dd", { locale: enUS })}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <MapPinIcon className="inline h-3.5 w-3.5 mr-1 rtl:ml-1 text-muted-foreground"/>
                          {transaction.neighborhood}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.propertyType === "سكني" ? "secondary" : transaction.propertyType === "تجاري" ? "default" : "outline"}>
                            {propertyTypeArabicMap[transaction.propertyType] || transaction.propertyType}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.propertyUsage || "-"}</TableCell>
                        <TableCell>
                            {dealTypeArabicMap[transaction.dealType] || transaction.dealType}
                        </TableCell>
                        <TableCell dir="ltr">
                          <Scale className="inline h-3.5 w-3.5 mr-1 rtl:ml-1 text-muted-foreground"/>
                          {transaction.areaM2.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell dir="ltr">
                           <DollarSign className="inline h-3.5 w-3.5 mr-1 rtl:ml-1 text-muted-foreground"/>
                          {transaction.priceSAR.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell dir="ltr">{transaction.pricePerM2?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-10">
                  لا توجد صفقات تطابق معايير البحث الحالية.
                </p>
              )
            ) : (
              // قسم التحليلات المتقدمة
              <div className="space-y-8">
                {/* رسم بياني لمتوسط سعر المتر حسب الحي */}
                <Card className="p-4">
                  <CardTitle className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    متوسط سعر المتر المربع حسب الأحياء (ريال سعودي)
                  </CardTitle>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 30, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis 
                          dataKey="neighborhood"
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={70} 
                        />
                        <YAxis 
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                          tickFormatter={(value) => `${value.toLocaleString()}`} 
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toLocaleString()} ر.س`, 'متوسط سعر المتر']}
                          labelFormatter={(label) => `حي ${label}`}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem',
                            direction: 'rtl'
                          }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Bar 
                          dataKey="avgPricePerM2" 
                          name="متوسط سعر المتر" 
                          fill="hsl(var(--primary))" 
                          barSize={40}
                          radius={[4, 4, 0, 0]}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                
                {/* رسم بياني خطي لتوجه الأسعار مع الوقت */}
                <Card className="p-4">
                  <CardTitle className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    اتجاه متوسط سعر المتر المربع حسب التاريخ
                  </CardTitle>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={priceTimeSeriesData}
                        margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        />
                        <YAxis 
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                          tickFormatter={(value) => `${value.toLocaleString()}`} 
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toLocaleString()} ر.س`, 'متوسط سعر المتر']}
                          labelFormatter={(label) => `تاريخ: ${label}`}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem',
                            direction: 'rtl'
                          }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Line 
                          type="monotone" 
                          dataKey="avgPricePerM2" 
                          name="متوسط سعر المتر"
                          stroke="hsl(var(--accent))" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                
                <p className="text-sm text-center text-muted-foreground mt-4">
                  ملاحظة: البيانات المعروضة هي لأغراض العرض التوضيحي فقط. للحصول على بيانات حقيقية، يرجى استيراد ملف CSV أو الانتظار حتى يتم تطوير التكامل مع API وزارة العدل.
                </p>
              </div>
            )
          )}
          
        </CardContent>
      </Card>
    </div>
  );
}

    
