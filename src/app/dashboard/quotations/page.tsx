
"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText as FileTextIcon, PlusCircle, List } from "lucide-react";
// import { getAllQuotations } from "@/lib/quotations-db"; // For future use
// import type { Quotation } from "@/types"; // For future use

export default function QuotationsListPage() {
  // const [quotations, setQuotations] = React.useState<Quotation[]>([]);
  // const [isLoading, setIsLoading] = React.useState(true);

  // React.useEffect(() => {
  //   async function fetchData() {
  //     setIsLoading(true);
  //     try {
  //       // const fetchedQuotations = await getAllQuotations();
  //       // setQuotations(fetchedQuotations);
  //     } catch (error) {
  //       console.error("Failed to fetch quotations:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, []);

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
  //       <Loader2 className="h-12 w-12 animate-spin text-primary" />
  //       <p className="ml-4 text-lg text-muted-foreground">جاري تحميل عروض الأسعار...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="shadow-xl border-primary/20">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-muted/30 p-4 sm:p-6 rounded-t-lg">
          <div>
            <CardTitle className="text-2xl font-bold text-primary font-headline flex items-center">
              <FileTextIcon className="ml-3 h-7 w-7 rtl:mr-0 rtl:ml-3" />
              عروض الأسعار
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              إدارة وإنشاء عروض الأسعار للعملاء والخدمات العقارية.
            </CardDescription>
          </div>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md">
            <Link href="/dashboard/quotations/new">
              <PlusCircle className="ml-2 h-5 w-5 rtl:mr-0 rtl:ml-2" />
              إنشاء عرض سعر جديد
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-muted-foreground">
            <List className="mx-auto h-12 w-12 mb-4 text-primary/30" />
            <p className="text-lg font-semibold">لا توجد عروض أسعار معروضة حالياً.</p>
            <p className="text-sm mt-1">
              سيتم عرض قائمة بعروض الأسعار هنا عند إضافتها. يمكنك البدء بإنشاء عرض سعر جديد.
            </p>
          </div>
          {/* 
            Future implementation:
            {quotations.length > 0 ? (
              <Table>
                <TableHeader>...</TableHeader>
                <TableBody>...</TableBody>
              </Table>
            ) : ( ... placeholder ... )}
          */}
        </CardContent>
      </Card>
    </div>
  );
}

    