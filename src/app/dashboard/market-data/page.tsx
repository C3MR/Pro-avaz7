
"use client";

import * as React from "react";
import { BarChart3, AlertTriangle, Info, Download, Upload, CalendarDays, Building2, MapPinIcon, Scale, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MarketTransaction, MarketTransactionPropertyType, MarketTransactionDealType } from "@/types";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale"; // Added enUS for number formatting
import { useToast } from "@/hooks/use-toast";

// Sample/Mock Data - Kept for initial display or if no file is uploaded
const sampleTransactions: MarketTransaction[] = [
  {
    id: "TXN001",
    transactionDate: new Date("2024-07-20T10:00:00Z"),
    city: "الرياض",
    neighborhood: "النرجس",
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
    neighborhood: "الملقا",
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
    neighborhood: "الصحافة",
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

export default function MarketDataPage() {
  const { transactions, isLoading, error, setTransactions } = useMarketData();
  const [searchTermNeighborhood, setSearchTermNeighborhood] = React.useState("");
  const [filterPropertyType, setFilterPropertyType] = React.useState<string>("all");
  const { toast } = useToast();

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(transaction => {
      const matchesNeighborhood = searchTermNeighborhood
        ? transaction.neighborhood.toLowerCase().includes(searchTermNeighborhood.toLowerCase())
        : true;
      const matchesPropertyType = filterPropertyType === "all"
        ? true
        : transaction.propertyType === filterPropertyType;
      return matchesNeighborhood && matchesPropertyType;
    }).sort((a,b) => b.transactionDate.getTime() - a.transactionDate.getTime());
  }, [transactions, searchTermNeighborhood, filterPropertyType]);

  const summaryStats = React.useMemo(() => {
    if (filteredTransactions.length === 0) {
      return { totalTransactions: 0, avgPricePerM2: 0, totalValue: 0, latestTransactionDate: null };
    }
    const totalValue = filteredTransactions.reduce((sum, t) => sum + t.priceSAR, 0);
    const totalArea = filteredTransactions.reduce((sum, t) => sum + t.areaM2, 0);
    const avgPricePerM2 = totalArea > 0 ? totalValue / totalArea : 0;
    const latestTransactionDate = filteredTransactions.length > 0 ? filteredTransactions[0].transactionDate : null;
    return {
      totalTransactions: filteredTransactions.length,
      avgPricePerM2: parseFloat(avgPricePerM2.toFixed(0)),
      totalValue: totalValue,
      latestTransactionDate: latestTransactionDate
    };
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
    <div className="space-y-6" dir="rtl">
      <Card className="shadow-xl border-accent/20">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 sm:p-6 rounded-t-lg">
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
            <Button variant="outline" onClick={() => document.getElementById('csvUpload')?.click()}>
              <Upload className="ml-2 h-4 w-4"/> استيراد CSV (تجريبي)
            </Button>
            <Input type="file" id="csvUpload" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-6 p-4 border bg-blue-50 border-blue-200 rounded-lg text-blue-700 text-sm flex items-start gap-3">
            <Info size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">ملاحظة هامة:</p>
              <p>وظيفة استيراد CSV هي ميزة تجريبية لمعاينة البيانات من جانب العميل. البيانات المستوردة لا تُحفظ بشكل دائم في قاعدة البيانات. للتكامل الدائم، سيتم تطوير نظام يعتمد على رفع الملفات إلى خادم سحابي ومعالجتها هناك.</p>
              <p className="mt-1">تنسيق CSV المتوقع (مثال): `تاريخ الصفقة (YYYY-MM-DD),الحي,نوع العقار (سكني/تجاري),وصف الاستخدام (فيلا/أرض),المساحة,السعر,نوع الصفقة (بيع/هبة)`.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الصفقات (حسب الفلتر)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary" dir="ltr">{summaryStats.totalTransactions.toLocaleString('en-US')}</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">متوسط سعر المتر (SAR)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary" dir="ltr">{summaryStats.avgPricePerM2.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي قيمة الصفقات (SAR)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary" dir="ltr">{summaryStats.totalValue.toLocaleString('en-US')}</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">آخر تاريخ تحديث للبيانات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-primary" dir="ltr">
                  {summaryStats.latestTransactionDate ? format(summaryStats.latestTransactionDate, "yyyy/MM/dd", { locale: enUS }) : "N/A"}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4 p-3 border rounded-md bg-card">
            <Input
              type="text"
              placeholder="بحث باسم الحي..."
              value={searchTermNeighborhood}
              onChange={(e) => setSearchTermNeighborhood(e.target.value)}
              className="md:flex-grow form-input h-9"
            />
            <Select value={filterPropertyType} onValueChange={setFilterPropertyType}>
              <SelectTrigger className="w-full md:w-[200px] form-input h-9">
                <SelectValue placeholder="فلترة حسب نوع العقار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {(Object.keys(propertyTypeArabicMap) as MarketTransactionPropertyType[]).map(type => (
                  <SelectItem key={type} value={type}>{propertyTypeArabicMap[type]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading && <p className="text-center text-muted-foreground py-8">جاري تحميل البيانات...</p>}
          {error && <p className="text-center text-destructive py-8">{error}</p>}
          {!isLoading && !error && (
            filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto border rounded-lg">
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
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-muted/5">
                        <TableCell className="whitespace-nowrap" dir="ltr">
                          <CalendarDays className="inline h-3.5 w-3.5 mr-1 rtl:ml-1 text-muted-foreground"/>
                          {format(transaction.transactionDate, "yyyy/MM/dd", { locale: enUS })}
                        </TableCell>
                        <TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    
