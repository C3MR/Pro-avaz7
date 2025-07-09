
"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import jsPDF from 'jspdf';
import type { PropertyRequest } from "@/types";
import PdfClientRequestReportCard from './PdfClientRequestReportCard';

interface ExportClientRequestPdfButtonProps {
  request: PropertyRequest;
}

const ExportClientRequestPdfButton: React.FC<ExportClientRequestPdfButtonProps> = ({ request }) => {
  const { toast } = useToast();
  const pdfCardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExportPdfClick = async () => {
    if (!request) {
      toast({ variant: "destructive", title: "خطأ", description: "لا توجد بيانات طلب لتصديرها." });
      return;
    }

    setIsExporting(true);
    toast({ title: "جاري تجهيز PDF", description: "قد تستغرق هذه العملية بضع لحظات..." });

    const pdfContentElement = document.getElementById('pdfClientReportContainer');
    if (!pdfContentElement) {
      toast({ variant: "destructive", title: "Error", description: "PDF content element not found." });
      setIsExporting(false);
      return;
    }

    try {
      // Wait for the off-screen component to render if it's conditional
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(pdfContentElement, {
        scale: 2, // Increase scale for better quality
        useCORS: true,
        allowTaint: true,
        logging: process.env.NODE_ENV === 'development', // Enable logging only in dev
         onclone: (clonedDoc) => {
            const fontLink = clonedDoc.createElement('link');
            fontLink.href = "https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap";
            fontLink.rel = "stylesheet";
            clonedDoc.head.appendChild(fontLink);

            const styleTag = clonedDoc.createElement('style');
            styleTag.innerHTML = `
                body, * { font-family: 'Almarai', "Trebuchet MS", sans-serif !important; line-height: 1.5; }
                h1, h2, h3, h4, h5, h6 { font-weight: bold; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                th { background-color: #f2f2f2; }
            `;
            clonedDoc.head.appendChild(styleTag);
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const ratio = imgProps.width / imgProps.height;

      let imgWidth = pdfWidth - 20; // 10mm margin on each side
      let imgHeight = imgWidth / ratio;

      // If image height is still too large for the page, adjust based on height
      if (imgHeight > pdfHeight - 20) { // 10mm margin top/bottom
        imgHeight = pdfHeight - 20;
        imgWidth = imgHeight * ratio;
      }

      const x = (pdfWidth - imgWidth) / 2;
      const y = 10; // 10mm margin from top

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`Avaz_ClientReport_${request.id}.pdf`);

      toast({ title: "تم التصدير بنجاح", description: `تم حفظ الملف Avaz_ClientReport_${request.id}.pdf` });
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast({ variant: "destructive", title: "فشل تصدير PDF", description: "حدث خطأ أثناء إنشاء الملف." });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button onClick={handleExportPdfClick} variant="outline" disabled={isExporting} className="w-full sm:w-auto">
        {isExporting ? <Loader2 className="animate-spin ml-2 h-4 w-4" /> : <FileDown className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />}
        {isExporting ? 'جاري التصدير...' : 'تصدير تقرير PDF'}
      </Button>
      <div id="pdfClientReportContainer" ref={pdfCardRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '210mm', direction: 'rtl', backgroundColor: 'white' }}>
        {request && <PdfClientRequestReportCard request={request} />}
      </div>
    </>
  );
};

export default ExportClientRequestPdfButton;
    