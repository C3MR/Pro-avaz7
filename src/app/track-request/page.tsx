
import TrackRequestForm from "@/components/forms/TrackRequestForm";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function TrackRequestPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 max-w-2xl mx-auto">
      <Card className="w-full shadow-xl bg-card border-primary/20">
        <CardHeader className="text-center bg-gradient-to-r from-primary/10 to-transparent pb-8">
          <div className="mx-auto rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline text-primary">متابعة طلبك العقاري</CardTitle>
          <CardDescription className="text-md text-muted-foreground pt-3 max-w-lg mx-auto leading-relaxed">
            أدخل رمز التتبع الفريد الذي تلقيته عند تقديم الطلب أو رقم جوال العميل لعرض حالة وتفاصيل طلبك.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <TrackRequestForm />
        </CardContent>
        <CardFooter className="bg-muted/20 p-4 text-center text-xs text-muted-foreground">
          لمزيد من المساعدة في متابعة طلبك، يرجى <a href="/contact-us" className="text-primary hover:underline">الاتصال بفريق خدمة العملاء</a>
        </CardFooter>
      </Card>
    </div>
  );
}
