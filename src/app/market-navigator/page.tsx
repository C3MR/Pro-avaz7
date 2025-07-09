
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Loader2, ExternalLink, Lightbulb, X, TrendingUp, Scale, ShieldCheck, Map as MapIconLucide, Building, FileText as FileTextLucide, AlertTriangle, Server, Compass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PortalCardProps {
  title: string;
  description: string;
  link: string;
  iconUrl?: string;
  iconElement?: React.ReactElement;
  linkText?: string;
  dataAiHint?: string;
}

const PortalCard: React.FC<PortalCardProps> = ({ title, description, link, iconUrl, iconElement, linkText = "زيارة المنصة", dataAiHint }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group bg-card border-border hover:border-primary/50 text-center">
      <CardHeader className="items-center pt-6 pb-3">
        <div className="mb-3 mt-1 flex justify-center">
          {iconElement ? (
            React.cloneElement(iconElement, { className: "w-12 h-12 text-primary group-hover:text-accent transition-colors duration-300" })
          ) : iconUrl ? (
            <Image
              src={iconUrl}
              alt={`شعار ${title}`}
              width={48}
              height={48}
              className="rounded-md object-contain p-1 bg-muted group-hover:shadow-md"
              data-ai-hint={dataAiHint || "logo government"}
            />
          ) : (
            <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center text-primary group-hover:text-accent group-hover:bg-accent/10 transition-colors duration-300">
              <Lightbulb size={28} />
            </div>
          )}
        </div>
        <CardTitle className="text-xl font-semibold text-primary group-hover:text-accent transition-colors duration-300 mb-0">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0 text-center flex flex-col flex-grow">
        <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-4">{description}</p>
        <Button asChild className="w-full mt-auto bg-accent hover:bg-accent/90 text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          <Link href={link} target="_blank" rel="noopener noreferrer">
            {linkText} <ExternalLink size={16} className="mr-2 rtl:ml-2 rtl:mr-0" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const portals: PortalCardProps[] = [
  {
    title: "شبكة إيجار",
    description: "المنصة الرسمية لتوثيق العقود وتنظيم العلاقة الإيجارية، بما يضمن حقوق جميع الأطراف المعنية.",
    link: "https://www.ejar.sa/",
    iconUrl: "https://www.ejar.sa/favicon.ico",
    dataAiHint: "ejar logo",
    iconElement: <FileTextLucide size={36}/> 
  },
  {
    title: "المؤشرات العقارية (REGA)",
    description: "اطلع على نبض السوق عبر بيانات الصفقات والمؤشرات الإيجارية والبيانات المفتوحة من الهيئة العامة للعقار.",
    link: "https://rei.rega.gov.sa/",
    iconUrl: "https://rei.rega.gov.sa/favicon.ico",
    dataAiHint: "REGA logo",
    iconElement: <TrendingUp size={36}/>
  },
  {
    title: "وافي (البيع على الخارطة)",
    description: "الجهة المنظمة لمشاريع البيع على الخارطة. تحقق من تراخيص المشاريع والمطورين قبل الشراء لضمان حقوقك.",
    link: "https://red.rega.gov.sa/landing", 
    iconUrl: "https://red.rega.gov.sa/favicon.ico", 
    dataAiHint: "Wafi logo REGA",
    iconElement: <Building size={36}/>
  },
  {
    title: "منصة بلدي",
    description: "بوابة الخدمات البلدية للرخص الإنشائية، القرارات المساحية، الاستعلام عن الأراضي، وغيرها من الخدمات.",
    link: "https://balady.gov.sa/",
    iconUrl: "https://balady.gov.sa/favicon.ico",
    dataAiHint: "Balady logo",
    iconElement: <ShieldCheck size={36}/>
  },
  {
    title: "البوابة الجيومكانية (أمانة الرياض)",
    description: "استعلم عن حدود البلديات والأحياء والمخططات وقطع الأراضي والشوارع داخل نطاق أمانة منطقة الرياض.",
    link: "https://mapservice.alriyadh.gov.sa/geoportal/geomap",
    iconUrl: "https://mapservice.alriyadh.gov.sa/favicon.ico",
    dataAiHint: "Riyadh Amanah logo",
    linkText: "استكشف الخريطة",
    iconElement: <MapIconLucide size={36}/>
  },
  {
    title: "تقارير الصفقات العقارية (وزارة العدل)",
    description: "تقارير تفاعلية من وزارة العدل توفر بيانات تفصيلية ومحدثة عن الصفقات العقارية المنفذة في كافة المناطق. (قيد التكامل لتقديم رؤى مباشرة)",
    link: "https://www.moj.gov.sa/ar/OpenData/PowerBIReport/Pages/BIReportRealestate.aspx",
    iconUrl: "https://www.moj.gov.sa/favicon.ico",
    dataAiHint: "MOJ logo",
    linkText: "عرض التقارير",
    iconElement: <Scale size={36}/>
  },
  {
    title: "مؤشر الصفقات العقارية (البورصة العقارية)",
    description: "منصة متكاملة لتداول وعرض الحصص والصفقات العقارية بشفافية وأمان تحت إشراف وزارة العدل.",
    link: "https://srem.moj.gov.sa/",
    iconUrl: "https://srem.moj.gov.sa/favicon.ico", 
    dataAiHint: "SREM logo MOJ",
    iconElement: <TrendingUp size={36}/>
  },
  {
    title: "حالة خدمة Firebase Cloud Messaging",
    description: "تتبع أداء وموثوقية خدمة FCM، وتأكد من عدم وجود انقطاعات قد تؤثر على استلام الإشعارات.",
    link: "https://status.firebase.google.com/incident/Cloud%20Messaging",
    iconUrl: "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/favicon.ico", 
    dataAiHint: "firebase logo",
    iconElement: <Server size={36} />,
    linkText: "عرض حالة الخدمة"
  }
];

export default function MarketNavigatorPage() {
  const [aiPrompt, setAiPrompt] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState("");
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const { toast } = useToast();

  const handleAiAnalysis = async () => {
    if (!aiPrompt.trim()) {
      setModalContent(`
        <div class="flex flex-col items-center justify-center text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 mb-3 h-12 w-12"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          <p class="text-red-600 font-semibold text-lg">الرجاء إدخال وصف لهدفك الاستثماري أو استفسارك في المربع المخصص.</p>
        </div>
      `);
      setIsModalOpen(true);
      return;
    }

    setIsAiLoading(true);
    setModalContent(`<div class="flex justify-center items-center flex-col p-8"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div><p class="mt-4 text-primary">جاري تحليل طلبك بواسطة الذكاء الاصطناعي...</p></div>`);
    setIsModalOpen(true);
    
    const apiKey = "AIzaSyBJRGtLSm1tUWk4cVBFSm5ZcE0xLVk2RERWbE1qUUtvOFJNPQ";

    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE_OR_USE_ENV_VAR") {
        setIsAiLoading(false);
        setModalContent(`
        <div class="flex flex-col items-center justify-center text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 mb-3 h-12 w-12"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            <p class="text-red-600 font-semibold text-lg">عذرًا، خدمة التحليل الذكي غير متاحة حاليًا بسبب مشكلة في الإعدادات.</p>
            <p class="text-muted-foreground mt-1 text-sm">يرجى التأكد من صحة مفتاح API الخاص بـ Gemini.</p>
        </div>
      `);
        return;
    }

    const fullPrompt = `أنت مستشار استثمار عقاري خبير في السوق السعودي وتعمل لصالح "أفاز العقارية". يقوم المستخدم بوصف هدفه الاستثماري. مهمتك هي تقديم تحليل موجز ومفيد باللغة العربية. هدف المستخدم هو: "${aiPrompt}". يجب أن يكون تحليلك منظمًا في نقاط واضحة (باستخدام علامة * للنقاط) ويتضمن: 1. ملخصًا موجزًا لإمكانات نوع الاستثمار. 2. اعتبارين أو ثلاثة اعتبارات رئيسية أو مخاطر يجب الانتباه إليها. 3. اقتراحات لأحياء أو مدن محددة في المملكة العربية السعودية تتوافق مع هذا الهدف. 4. توصية بالمنصات الرسمية الأكثر فائدة لخطواتهم التالية (من هذه القائمة: شبكة إيجار، منصة بلدي، الهيئة العامة للعقار، وافي - البيع على الخارطة، مؤشر الصفقات العقارية). هام جداً: يجب أن تكون إجابتك بأكملها باللغة العربية ومنسقة باستخدام markdown للقوائم. ابدأ بلهجة احترافية وترحيبية. لا تستخدم أي ترميز HTML في ردك، فقط markdown.`;

    try {
      let chatHistory = [{ role: "user", parts: [{ text: fullPrompt }] }];
      const payload = { contents: chatHistory };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
          const errorStatus = response.status;
          const errorStatusText = response.statusText || 'Status text not available';
          
          const errorDetailsForLog: any = {
              api_status: String(errorStatus),
              api_status_text: errorStatusText,
              api_raw_response_body: null,
              api_parsed_error_json: null,
              api_processing_error: null,
          };
          let errorMessageForUser = `خطأ من الخادم (${errorStatus} ${errorStatusText})`;

          try {
              const responseBodyText = await response.text();
              errorDetailsForLog.api_raw_response_body = responseBodyText || 'Empty response body text.';

              try {
                  const jsonData = JSON.parse(responseBodyText);
                  errorDetailsForLog.api_parsed_error_json = jsonData;
                  
                  if (jsonData?.error?.message) {
                      errorMessageForUser = jsonData.error.message;
                  } else if (jsonData?.message) { 
                      errorMessageForUser = jsonData.message;
                  } else if (typeof jsonData === 'object' && Object.keys(jsonData).length === 0 && responseBodyText.trim() === "{}") {
                       errorMessageForUser = `استجابة JSON فارغة من الـ API (${errorStatus} ${errorStatusText}).`;
                  } else if (responseBodyText.trim() === "") {
                       errorMessageForUser = `استجابة نصية فارغة من الـ API (${errorStatus} ${errorStatusText}).`;
                  } else if (errorMessageForUser.startsWith('خطأ من الخادم') && responseBodyText && responseBodyText.length < 200 && !responseBodyText.trim().toLowerCase().startsWith("<!doctype html") && !responseBodyText.trim().toLowerCase().startsWith("<html")) {
                     errorMessageForUser = `استجابة غير متوقعة من الـ API: ${responseBodyText.substring(0,100)}${responseBodyText.length > 100 ? '...' : ''}`;
                  }
              } catch (jsonParseError: any) {
                  errorDetailsForLog.api_processing_error = `Failed to parse JSON. Details: ${jsonParseError.message}. Raw text: "${(errorDetailsForLog.api_raw_response_body || '').substring(0,100)}${errorDetailsForLog.api_raw_response_body.length > 100 ? '...' : ''}"`;
                  if (errorDetailsForLog.api_raw_response_body && errorDetailsForLog.api_raw_response_body.length < 200 && !errorDetailsForLog.api_raw_response_body.trim().toLowerCase().startsWith("<!doctype html") && !errorDetailsForLog.api_raw_response_body.trim().toLowerCase().startsWith("<html")) {
                     errorMessageForUser = `استجابة غير JSON من الـ API: ${errorDetailsForLog.api_raw_response_body.substring(0,100)}${errorDetailsForLog.api_raw_response_body.length > 100 ? '...' : ''}`;
                  } else {
                     errorMessageForUser = `فشل تحليل استجابة الخطأ من الـ API (${errorStatus} ${errorStatusText}).`;
                  }
              }
          } catch (readTextError: any) {
              errorDetailsForLog.api_processing_error = `Failed to read response body. Details: ${readTextError.message}`;
          }
          
          console.error("Gemini API Error Details (raw object):", errorDetailsForLog);
          console.error("Gemini API Error Details (stringified):", JSON.stringify(errorDetailsForLog, null, 2));
          
          throw new Error(`خطأ في الـ API (${errorStatus}): ${errorMessageForUser}`);
      }

      const result = await response.json();
      
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
          const analysisText = result.candidates[0].content.parts[0].text;
          let htmlContent = analysisText
              .replace(/^\* (.*$)/gm, '<li>$1</li>') 
              .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold my-2 text-primary">$1</h3>') 
              .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold my-3 text-accent">$1</h2>') 
              .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold my-4 text-primary">$1</h1>') 
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
              .replace(/\n/g, '<br />'); 
          if (htmlContent.includes('<li>')) {
             htmlContent = htmlContent.replace(/(<li>.*?<\/li>(?:<br \/>)?)+/g, (match) => `<ul class="list-disc list-inside space-y-1 my-3 text-right text-muted-foreground">${match.replace(/<br \/>/g, '')}</ul>`);
          }
          setModalContent(htmlContent);
      } else if (result.candidates?.[0]?.finishReason && result.candidates[0].finishReason !== "STOP") {
          const finishReason = result.candidates[0].finishReason;
          let safetyMessage = "";
          if (result.candidates[0].safetyRatings && result.candidates[0].safetyRatings.length > 0) {
            safetyMessage = ` تقييمات الأمان: ${result.candidates[0].safetyRatings.map((r: any) => `${r.category} (${r.probability})`).join(', ')}`;
          }
          console.error("Gemini API Finish Reason:", finishReason, "Safety Ratings:", safetyMessage);
          throw new Error(`انتهى التحليل بسبب: ${finishReason}.${safetyMessage ? safetyMessage : ' قد يكون السبب يتعلق بمرشحات الأمان أو قيود المحتوى.'}`);
      } else {
          console.error("Unexpected API response structure:", result);
          throw new Error("لم يتم العثور على محتوى في استجابة الـ API أو أن بنية الرد غير متوقعة.");
      }

    } catch (error: any) {
        console.error("Error calling Gemini API:", error); 
        let userFacingErrorMessage = error.message || 'يرجى المحاولة مرة أخرى لاحقًا.';
        let userFacingErrorTitle = "عذرًا، حدث خطأ";
        let detailedAdvice = "(إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني.)";

        if (typeof error.message === 'string' && (error.message.toLowerCase().includes("api key not valid") || error.message.includes("خطأ في الـ API (400): API key not valid"))) {
            userFacingErrorTitle = "خطأ في مفتاح API";
            userFacingErrorMessage = "مفتاح API المستخدم للوصول إلى خدمة Gemini غير صالح أو غير مفعل. يرجى التحقق من المفتاح في إعدادات مشروعك على Google Cloud Console والتأكد من تفعيل Gemini API، ومن أن الفوترة نشطة إذا لزم الأمر.";
            detailedAdvice = "تأكد من نسخ المفتاح بشكل صحيح وأنه مخصص للمشروع الصحيح.";
        } else if (typeof error.message === 'string') {
            userFacingErrorMessage = error.message;
        }
        
        setModalContent(`
            <div class="flex flex-col items-center justify-center text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 mb-3 h-12 w-12"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                <p class="text-red-600 font-semibold text-lg">${userFacingErrorTitle}</p>
                <p class="text-muted-foreground mt-2">${userFacingErrorMessage}</p>
                <p class="text-xs text-muted-foreground mt-1">${detailedAdvice}</p>
            </div>
        `);
    } finally {
        setIsAiLoading(false);
    }
  };


  return (
    <div className="space-y-12 md:space-y-16 py-8" dir="rtl">
      <section className="container mx-auto px-4 text-center">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-6 mx-auto">
            <Compass className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline text-primary mb-5">
          موجه السوق العقاري السعودي
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
          مرحباً بك في "موجه السوق" من أفاز العقارية. هنا، نوفر لك وصولاً مباشرًا إلى أهم المنصات الحكومية الرسمية ومصادر البيانات الموثوقة في القطاع العقاري السعودي. هدفنا هو تمكينك بالمعرفة والأدوات اللازمة لاتخاذ قرارات استثمارية مستنيرة وواعية.
        </p>
      </section>

      <main className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold font-headline text-center text-accent mb-10">المنصات والمصادر الرئيسية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {portals.map((portal) => (
            <PortalCard key={portal.title} {...portal} />
          ))}
        </div>
      </main>

      <section className="container mx-auto px-4 pt-8">
        <Card className="shadow-xl border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card" id="ai-card-section">
          <CardHeader className="text-center">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4 mx-auto">
                <Lightbulb className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-accent font-headline">
              بحاجة إلى استشارة سريعة؟ جرّب مساعدنا الذكي!
            </CardTitle>
            <CardDescription className="text-md text-muted-foreground max-w-xl mx-auto leading-relaxed">
              هل لديك فكرة استثمارية؟ أو استفسار محدد حول نوع عقار أو منطقة معينة؟ صف ما يدور في ذهنك لمساعد أفاز العقارية الذكي، واحصل على تحليل أولي ونقاط رئيسية لمساعدتك في توجيه تفكيرك وخطواتك القادمة.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-8 pb-8">
            <Textarea
              id="ai-prompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full p-3 rounded-lg text-foreground bg-background border-border focus:ring-2 focus:ring-primary min-h-[120px] text-base shadow-inner"
              rows={5}
              placeholder="مثال: أفكر في الاستثمار بشراء مجموعة شقق سكنية في شرق الرياض وتأجيرها. ما هي أهم العوامل التي يجب أن أركز عليها، وما هي الأحياء الواعدة لهذا النوع من الاستثمار؟"
            />
            <Button
              id="ai-button"
              onClick={handleAiAnalysis}
              disabled={isAiLoading}
              size="lg"
              className="w-full mt-5 py-3 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.02]"
            >
              {isAiLoading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                "احصل على تحليل استثماري مبدئي"
              )}
            </Button>
            <p className="text-xs text-center text-destructive mt-4">
              تنبيه: المعلومات المقدمة من المساعد الذكي هي لأغراض استرشادية عامة فقط ولا تعتبر استشارة قانونية أو مالية أو بديلًا عن استشارة المختصين. نوصي دائمًا بالتحقق من المعلومات من مصادرها الرسمية والتشاور مع خبراء أفاز العقارية.
            </p>
          </CardContent>
        </Card>
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col" dir="rtl">
          <DialogHeader className="pr-6 pl-12 py-4 border-b">
            <DialogTitle className="text-xl font-bold text-primary font-headline">تحليل الاستثمار الذكي</DialogTitle>
            <DialogDescription>
              هذا التحليل مقدم من مساعد أفاز العقارية الذكي بناءً على مدخلاتك.
            </DialogDescription>
             <DialogClose asChild>
                <Button variant="ghost" size="icon" className="absolute ltr:right-4 rtl:left-4 top-4 p-1.5 rounded-full hover:bg-muted">
                    <X className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">إغلاق</span>
                </Button>
             </DialogClose>
          </DialogHeader>
          <div id="modal-content" className="p-6 overflow-y-auto flex-grow text-right">
            <div dangerouslySetInnerHTML={{ __html: modalContent }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    
