
// This page is intended for server-side rendering of the PDF content if direct PDF generation in browser is problematic
// For now, the PDF generation is client-side in the track-request page.
// This file can be built out later if server-side PDF generation is required.

import { getRequestById } from "@/lib/requests-db";
import PdfClientRequestReportCard from "@/components/pdf/PdfClientRequestReportCard";
import { AlertTriangle } from "lucide-react";

export default async function ClientRequestReportPdfPage({ params }: { params: { trackingCode: string } }) {
  const trackingCode = params.trackingCode;
  let request = null;
  let error = null;

  if (trackingCode) {
    try {
      request = await getRequestById(trackingCode);
      if (!request) {
        error = "الطلب غير موجود.";
      }
    } catch (e) {
      console.error("Error fetching request for PDF report:", e);
      error = "حدث خطأ أثناء جلب بيانات الطلب.";
    }
  } else {
    error = "رمز التتبع غير متوفر.";
  }

  if (error || !request) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Almarai, "Trebuchet MS", sans-serif', direction: 'rtl', textAlign: 'center', color: '#333' }}>
        <AlertTriangle style={{ width: '50px', height: '50px', color: '#dc3545', margin: '0 auto 20px auto' }} />
        <h1>خطأ في إنشاء التقرير</h1>
        <p>{error || "تعذر تحميل بيانات الطلب."}</p>
      </div>
    );
  }
  
  // This ensures the component is available for potential server-side rendering to HTML string
  return <PdfClientRequestReportCard request={request} />;
}


    