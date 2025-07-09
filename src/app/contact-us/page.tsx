
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Users, Briefcase, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const contactDetails = {
  companyName: "AVAZ العقارية",
  addressLine1: "2225 طريق الملك عبدالعزيز، حي الياسمين،",
  addressLine2: "7443، الرياض 13326، المملكة العربية السعودية",
  phone: "920004209",
  email: "info@avaz.sa",
  website: "www.avaz.sa",
  workingHours: "الأحد - الخميس: 9:00 ص - 6:00 م",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2876.005232946366!2d46.637822400000005!3d24.8317992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f0504d92ddee9%3A0x625630d6ca0acc31!2z2LTYsdmD2Kkg2KfZgdin2LIg2KfZhNi52YLYp9ix2YrYqQ!5e1!3m2!1sar!2ssa!4v1750218673570!5m2!1sar!2ssa"
};

interface InfoItemProps {
  icon: React.ReactElement;
  label: string;
  value: string;
  href?: string;
  isHtml?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, href, isHtml }) => (
  <div className="flex items-start space-x-3 rtl:space-x-reverse">
    <span className="text-primary mt-1 flex-shrink-0">
      {React.cloneElement(icon, { className: "h-5 w-5" })}
    </span>
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      {href ? (
        <Link href={href} target="_blank" rel="noopener noreferrer" className="text-md text-muted-foreground hover:text-primary transition-colors break-all">
          {value}
        </Link>
      ) : isHtml ? (
         <p className="text-md text-muted-foreground" dangerouslySetInnerHTML={{ __html: value }} />
      ) : (
        <p className="text-md text-muted-foreground break-all">{value}</p>
      )}
    </div>
  </div>
);

export default function ContactUsPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 md:py-12" dir="rtl">
      <header className="text-center mb-10 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline">تواصل معنا</h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          نحن هنا لمساعدتك. سواء كان لديك استفسار، أو ترغب في مناقشة احتياجاتك العقارية، أو تحتاج إلى دعم، لا تتردد في التواصل معنا.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <Card className="shadow-xl border-primary/20">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-2xl font-semibold text-accent font-headline flex items-center">
              <MapPin className="mr-3 rtl:ml-3 rtl:mr-0 h-7 w-7" />
              معلومات الاتصال والموقع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <InfoItem icon={<Briefcase />} label="الشركة" value={contactDetails.companyName} />
            <InfoItem 
              icon={<MapPin />} 
              label="العنوان" 
              value={`${contactDetails.addressLine1}<br/>${contactDetails.addressLine2}`}
              isHtml={true}
            />
            <InfoItem icon={<Phone />} label="الهاتف" value={contactDetails.phone} href={`tel:${contactDetails.phone.replace(/\s/g, '')}`} />
            <InfoItem icon={<Mail />} label="البريد الإلكتروني" value={contactDetails.email} href={`mailto:${contactDetails.email}`} />
            <InfoItem icon={<Clock />} label="ساعات العمل" value={contactDetails.workingHours} />
             <Button asChild className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/new-request">
                <MessageSquare className="mr-2 rtl:ml-2 rtl:mr-0 h-5 w-5" />
                لديك طلب عقاري؟ قدمه الآن
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-accent/20 overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-2xl font-semibold text-accent font-headline flex items-center">
              <Users className="mr-3 rtl:ml-3 rtl:mr-0 h-7 w-7" />
              موقعنا على الخريطة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-2">
            <div className="aspect-video overflow-hidden md:rounded-lg">
              <iframe
                src={contactDetails.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`موقع ${contactDetails.companyName} على الخريطة`}
                data-ai-hint="company location map"
              ></iframe>
            </div>
          </CardContent>
           <CardDescription className="text-xs text-muted-foreground px-4 pb-4 text-center">
            يظهر هذا العنوان موقع مكتبنا الرئيسي.
          </CardDescription>
        </Card>
      </div>
       <section className="mt-12 md:mt-20 text-center">
         <Card className="max-w-2xl mx-auto shadow-lg p-6 md:p-8 bg-primary/5 border-primary/10">
            <Image 
                src="https://avaz.sa/tower/images/logo-avaz.png" 
                alt={`${contactDetails.companyName} Logo`}
                width={180}
                height={50}
                className="mx-auto mb-6 h-auto"
                data-ai-hint="company logo"
            />
            <h3 className="text-xl font-semibold text-primary mb-3">نقدر تواصلك ونسعى لخدمتك بأفضل شكل ممكن.</h3>
            <p className="text-muted-foreground">
                فريق AVAZ العقارية مستعد دائمًا لتقديم الاستشارات والحلول العقارية التي تناسب تطلعاتك.
            </p>
        </Card>
      </section>
    </div>
  );
}

    