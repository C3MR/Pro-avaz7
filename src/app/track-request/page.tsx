
import TrackRequestForm from "@/components/forms/TrackRequestForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TrackRequestPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Card className="w-full max-w-lg p-6 md:p-8 shadow-xl bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline text-primary">متابعة طلبك</CardTitle>
          <CardDescription className="text-md text-muted-foreground pt-2">
            أدخل رمز التتبع الفريد الذي تلقيته عند تقديم الطلب لعرض حالة طلبك العقاري.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrackRequestForm />
        </CardContent>
      </Card>
    </div>
  );
}
