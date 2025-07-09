
"use client";

import * as React from "react";
import { useParams } from 'next/navigation'; 
import { targetedClientsData } from "@/app/dashboard/page"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, User, Phone, MessageSquare, CalendarDays, Briefcase, Edit, ListChecks, Clock, Forward, MessageCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { enUS } from "date-fns/locale"; 
import type { TargetedClient, CommunicationEntry } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

async function getClientById(id: string): Promise<TargetedClient | undefined> {
  return targetedClientsData.find(client => client.id === id);
}

function formatPhoneNumberForWhatsApp(phone: string): string {
  if (phone.startsWith('05') && phone.length === 10) {
    return `966${phone.substring(1)}`;
  }
  return phone.replace(/\D/g, ''); 
}


export default function ClientDetailsPage() {
  const params = useParams();
  const clientId = typeof params.clientId === 'string' ? params.clientId : undefined;

  const [client, setClient] = React.useState<TargetedClient | null | undefined>(undefined); 

  React.useEffect(() => {
    const fetchClient = async () => {
      if (clientId) {
        const foundClient = await getClientById(clientId);
        setClient(foundClient || null); 
      } else {
        setClient(null); 
      }
    };
    fetchClient();
  }, [clientId]);

  if (client === undefined) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Briefcase className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">جاري تحميل بيانات العميل...</p>
        </div>
    );
  }

  if (!client) {
    return (
      <Card className="max-w-2xl mx-auto my-12 shadow-xl border-destructive">
        <CardHeader className="text-center bg-destructive/10">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-bold text-destructive font-headline">العميل غير موجود</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            لم يتم العثور على عميل بالمعرف "{clientId || 'المحدد'}". يرجى التحقق والمحاولة مرة أخرى.
          </p>
          <Button asChild variant="outline">
            <Link href="/dashboard">العودة إلى لوحة التحكم</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const sortedCommunicationLog = client.communicationLog?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) || [];
  const whatsappNumber = formatPhoneNumberForWhatsApp(client.contact);

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8" dir="rtl">
      <Card className="shadow-xl border-primary/30">
        <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-primary font-headline mb-1 flex items-center">
                <User className="h-8 w-8 mr-3 rtl:ml-3 rtl:mr-0" /> {client.name}
              </CardTitle>
              <CardDescription className="text-md">
                معرف العميل: <span className="font-semibold text-accent">{client.id}</span>
              </CardDescription>
            </div>
            <Badge 
                className={`px-3 py-1.5 text-sm font-semibold rounded-full text-white shadow-sm ${
                client.priority === "عالية" ? "bg-red-500 hover:bg-red-600" : 
                client.priority === "متوسطة" ? "bg-accent hover:bg-accent/90" :
                "bg-green-500 hover:bg-green-600"
            }`}>
                الأولوية: {client.priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <span className="text-primary mt-1"><Phone className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-medium text-foreground">رقم التواصل</p>
                <div className="flex items-center gap-2">
                    <p className="text-md text-muted-foreground" dir="ltr">{client.contact}</p>
                    <a href={`tel:${client.contact}`} title="اتصال" className="text-primary hover:text-primary/80 transition-colors">
                        <Phone className="h-4 w-4" />
                    </a>
                    <a 
                        href={`https://wa.me/${whatsappNumber}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="واتساب" 
                        className="text-green-500 hover:text-green-600 transition-colors"
                    >
                        <MessageCircle className="h-4 w-4" />
                    </a>
                </div>
              </div>
            </div>

            <InfoItem icon={<Briefcase />} label="الحالة الحالية" value={client.status} />
          </div>

          {client.generalNotes && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0 text-primary" />
                ملاحظات عامة
              </h3>
              <p className="text-muted-foreground bg-muted/30 p-3 rounded-md whitespace-pre-wrap border">{client.generalNotes}</p>
            </div>
          )}

          {client.lastCommunication && (
             <div>
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                    <Clock className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0 text-primary" />
                    آخر تواصل
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 border rounded-md bg-muted/20">
                    <InfoItem icon={<User className="text-xs"/>} label="الموظف" value={client.lastCommunication.employee} small />
                    <InfoItem icon={<CalendarDays className="text-xs"/>} label="التاريخ" value={format(new Date(client.lastCommunication.date), "PPP p", { locale: enUS })} small dirValue="ltr"/>
                </div>
            </div>
          )}
           {client.nextAction && (
             <div>
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                    <Forward className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0 text-primary" />
                    الإجراء القادم
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 border rounded-md bg-primary/5">
                     <p className="text-foreground col-span-full sm:col-span-1">{client.nextAction}</p>
                    {client.nextActionDate && <InfoItem icon={<CalendarDays className="text-xs"/>} label="الموعد" value={format(new Date(client.nextActionDate), "PPP", { locale: enUS })} small dirValue="ltr"/>}
                </div>
            </div>
          )}

        </CardContent>
         <CardFooter className="bg-muted/30 p-4 rounded-b-lg flex justify-end">
            <Button variant="outline">
                <Edit className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                تعديل بيانات العميل
            </Button>
         </CardFooter>
      </Card>

      <Card className="shadow-xl border-accent/30">
        <CardHeader className="bg-muted/30">
          <CardTitle className="flex items-center text-2xl font-bold text-accent font-headline">
            <ListChecks className="mr-3 rtl:ml-3 rtl:mr-0 h-7 w-7" />
            سجل التواصل
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {sortedCommunicationLog.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right w-[200px]">التاريخ والوقت</TableHead>
                    <TableHead className="text-right">الموظف</TableHead>
                    <TableHead className="text-right">الملاحظات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCommunicationLog.map((entry: CommunicationEntry) => (
                    <TableRow key={entry.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="text-muted-foreground text-sm" dir="ltr">
                        {format(new Date(entry.timestamp), "PPP p", { locale: enUS })}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{entry.employee}</TableCell>
                      <TableCell className="text-muted-foreground whitespace-pre-wrap">{entry.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-6">لا توجد إدخالات تواصل لهذا العميل حتى الآن.</p>
          )}
        </CardContent>
        <CardFooter className="bg-muted/30 p-4 flex justify-end">
            <Button>
                <PlusCircle className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0"/>
                إضافة تواصل جديد
            </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center">
        <Button asChild variant="outline">
            <Link href="/dashboard">العودة إلى لوحة التحكم</Link>
        </Button>
      </div>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
  small?: boolean;
  dirValue?: "ltr" | "rtl";
}

function InfoItem({ icon, label, value, small = false, dirValue = "rtl" }: InfoItemProps) {
  if (value === undefined || value === null || String(value).trim() === "") return null;
  return (
    <div className="flex items-start space-x-2 rtl:space-x-reverse">
      <span className={`text-primary ${small ? 'mt-0.5' : 'mt-1'}`}>
        {icon && React.cloneElement(icon as React.ReactElement, { className: small ? "h-4 w-4" : "h-5 w-5"})}
      </span>
      <div>
        <p className={`font-medium text-foreground ${small ? 'text-xs' : 'text-sm'}`}>{label}</p>
        <p className={`text-muted-foreground ${small ? 'text-sm' : 'text-md'}`} dir={dirValue}>{String(value)}</p>
      </div>
    </div>
  );
}


