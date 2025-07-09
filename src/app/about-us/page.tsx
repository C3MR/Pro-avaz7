
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, Eye, Award, Users, Lightbulb, Target, ShieldCheck, Handshake, MessageSquare, ArrowLeft } from "lucide-react";

const teamMembers = [
  {
    name: "منصور القميزي",
    role: "الرئيس التنفيذي",
    avatarSrc: "https://placehold.co/100x100.png",
    avatarFallback: "م ق",
    description: "قيادة استراتيجية ورؤية ثاقبة لتطوير القطاع العقاري وتقديم حلول مبتكرة.",
    dataAiHint: "male portrait professional"
  },
  {
    name: "علي الزويدي",
    role: "مدير قسم التأجير",
    avatarSrc: "https://placehold.co/100x100.png",
    avatarFallback: "ع ز",
    description: "خبرة واسعة في إدارة عمليات التأجير وتحقيق أفضل العوائد للمستثمرين والملاك.",
    dataAiHint: "professional man portrait"
  },
  {
    name: "سعد العتيبي",
    role: "مدير التسويق",
    avatarSrc: "https://placehold.co/100x100.png",
    avatarFallback: "س ع",
    description: "متخصص في ابتكار استراتيجيات تسويقية فعالة للوصول إلى العملاء وتحقيق الأهداف البيعية.",
    dataAiHint: "marketing manager photo"
  },
];

const coreValues = [
  { title: "الاحترافية", description: "نلتزم بأعلى معايير الجودة والمهنية في جميع تعاملاتنا.", icon: <Award className="h-8 w-8 text-primary" /> },
  { title: "الابتكار", description: "نسعى دائمًا لتقديم حلول عقارية مبتكرة تلبي تطلعات عملائنا.", icon: <Lightbulb className="h-8 w-8 text-primary" /> },
  { title: "الشفافية", description: "نبني علاقاتنا على الثقة والوضوح في كافة مراحل العمل.", icon: <ShieldCheck className="h-8 w-8 text-primary" /> },
  { title: "العميل أولاً", description: "نضع احتياجات عملائنا في صميم اهتماماتنا ونسعى لتحقيق رضاهم.", icon: <Handshake className="h-8 w-8 text-primary" /> },
];

export default function AboutUsPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 md:py-12" dir="rtl">
      <header className="text-center mb-10 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline">
          عن أفاز العقارية
        </h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-3xl mx-auto">
          شريكك الموثوق في عالم العقار، نسعى لتقديم حلول عقارية متكاملة ومبتكرة تلبي احتياجاتك وتطلعاتك الاستثمارية والسكنية في المملكة العربية السعودية.
        </p>
      </header>

      <section className="mb-12 md:mb-20">
        <Card className="shadow-xl border-accent/20 overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-6 md:p-10 order-2 md:order-1">
              <h2 className="text-3xl font-bold text-accent mb-4 font-headline flex items-center">
                <Briefcase className="mr-3 rtl:ml-3 rtl:mr-0 h-8 w-8" />
                من نحن؟
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                شركة أفاز العقارية هي شركة رائدة في مجال الخدمات العقارية المتكاملة، تأسست على أسس من الخبرة العميقة والشغف بتطوير القطاع العقاري. نقدم مجموعة واسعة من الخدمات تشمل التسويق العقاري، إدارة الأملاك، الاستشارات الاستثمارية، وتطوير المشاريع.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                نعمل بفريق من الخبراء المتخصصين الذين يمتلكون فهماً دقيقاً لمتطلبات السوق السعودي، ونسعى جاهدين لتحقيق أفضل النتائج لعملائنا من أفراد ومؤسسات.
              </p>
            </div>
            <div className="order-1 md:order-2 h-64 md:h-full min-h-[300px] relative">
              <Image
                src="https://placehold.co/600x400.png"
                alt="فريق عمل أفاز العقارية"
                fill
                className="object-cover"
                data-ai-hint="team meeting office"
              />
            </div>
          </div>
        </Card>
      </section>

      <section className="mb-12 md:mb-20 grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg p-6 bg-primary/5 border-primary/10">
          <div className="flex items-center mb-3">
            <Eye className="h-10 w-10 text-primary mr-4 rtl:ml-4 rtl:mr-0" />
            <h3 className="text-2xl font-bold text-primary font-headline">رؤيتنا</h3>
          </div>
          <p className="text-muted-foreground">
            أن نكون الخيار الأول والمفضل للعملاء والمستثمرين في القطاع العقاري بالمملكة، من خلال تقديم خدمات مبتكرة وموثوقة تساهم في تحقيق تطلعاتهم وأهدافهم.
          </p>
        </Card>
        <Card className="shadow-lg p-6 bg-accent/5 border-accent/10">
          <div className="flex items-center mb-3">
            <Target className="h-10 w-10 text-accent mr-4 rtl:ml-4 rtl:mr-0" />
            <h3 className="text-2xl font-bold text-accent font-headline">رسالتنا</h3>
          </div>
          <p className="text-muted-foreground">
            توفير حلول عقارية شاملة تتسم بالاحترافية والشفافية، والمساهمة في نمو وازدهار السوق العقاري السعودي، مع بناء علاقات مستدامة مع عملائنا وشركائنا.
          </p>
        </Card>
      </section>

      <section className="mb-12 md:mb-20">
        <h2 className="text-3xl font-bold text-center text-accent mb-10 font-headline">قيمنا الأساسية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((value) => (
            <Card key={value.title} className="p-6 text-center shadow-md hover:shadow-lg transition-shadow bg-card">
              <div className="flex justify-center mb-4">
                {value.icon}
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">{value.title}</h4>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12 md:mb-20">
        <h2 className="text-3xl font-bold text-center text-accent mb-12 font-headline">فريق العمل</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.name} className="text-center shadow-lg hover:shadow-xl transition-shadow p-6 bg-muted/20">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
                <AvatarImage src={member.avatarSrc} alt={member.name} data-ai-hint={member.dataAiHint} />
                <AvatarFallback className="text-2xl bg-primary/20 text-primary font-bold">{member.avatarFallback}</AvatarFallback>
              </Avatar>
              <h4 className="text-xl font-semibold text-primary mb-1">{member.name}</h4>
              <p className="text-sm text-accent font-medium mb-3">{member.role}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{member.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center">
         <Card className="max-w-2xl mx-auto shadow-lg p-6 md:p-8 bg-primary/5 border-primary/10">
            <Image 
                src="https://avaz.sa/tower/images/logo-avaz.png" 
                alt="AVAZ Logo"
                width={180}
                height={50}
                className="mx-auto mb-6 h-auto"
                data-ai-hint="company logo"
            />
            <h3 className="text-xl font-semibold text-primary mb-3">نحن هنا لخدمتك وتحقيق أهدافك العقارية.</h3>
            <p className="text-muted-foreground mb-6">
                سواء كنت تبحث عن عقار، أو ترغب في عرض عقارك، أو تحتاج إلى استشارة متخصصة، فريقنا جاهز لمساعدتك.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/contact-us">
                        <MessageSquare className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" /> تواصل معنا
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/our-properties">
                        <Eye className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" /> تصفح عقاراتنا
                    </Link>
                </Button>
            </div>
        </Card>
      </section>
    </div>
  );
}

    