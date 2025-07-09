
"use client"; 

import * as React from "react"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ListChecks, PlusCircle, CheckCircle, XCircle as XCircleIconLucide, Users as UsersIcon, Edit3, Phone, MessageCircle, UserCog as UserRoleIcon } from "lucide-react"; 
import EmployeeDetailsDialog from "@/components/dashboard/EmployeeDetailsDialog"; 
import type { SystemUser, TargetedClient, UserRole } from "@/types"; 
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for users including passwords (ONLY FOR MOCK LOGIN - DO NOT DO THIS IN PRODUCTION)
export const mockUsers = [
  { email: "3mr@avaz.sa", name: "عمر الحيدري", password: "Avaz@2031", role: "admin" as UserRole, department: "الإدارة العليا والتطوير", avatarLetter: "ع", avatarColor: "bg-blue-500 text-blue-50", phone: "0501234501", hireDate: "01 يناير 2018", permissions: ["مدير النظام", "إدارة المستخدمين", "إدارة العقارات", "إدارة العقود", "التقارير المالية", "تطوير الموقع"] },
  { email: "mansor@avaz.sa", name: "منصور القميزي", password: "Avaz@2030", role: "user" as UserRole, department: "الرئيس التنفيذي", avatarLetter: "م", avatarColor: "bg-primary text-primary-foreground", phone: "0501234502", hireDate: "15 يناير 2020", permissions: ["إدارة العقارات", "إدارة العقود", "التقارير"] },
  { email: "ali@avaz.sa", name: "علي الزويدي", password: "Avaz@2032", role: "user" as UserRole, department: "قسم التأجير", avatarLetter: "ع", avatarColor: "bg-green-500 text-green-50", phone: "0501234503", hireDate: "10 مارس 2021", permissions: ["إدارة العقارات (تأجير)", "إدارة العقود (تأجير)"] },
  { email: "aziz@avaz.sa", name: "عبد العزيز العتيبي", password: "Avaz@2033", role: "user" as UserRole, department: "قسم التسويق", avatarLetter: "ع", avatarColor: "bg-orange-500 text-orange-50", phone: "0501234504", hireDate: "05 أبريل 2022", permissions: ["عرض التقارير التسويقية"] },
  { email: "faisal@avaz.sa", name: "فيصل القميزي", password: "Avaz@2034", role: "user" as UserRole, department: "قسم المبيعات", avatarLetter: "ف", avatarColor: "bg-red-500 text-red-50", phone: "0501234505", hireDate: "20 يونيو 2022", permissions: ["إدارة العقارات (بيع)", "إدارة العقود (بيع)"] },
  { email: "Abo-qasem@avaz.sa", name: "ابو القاسم", password: "Avaz@2035", role: "user" as UserRole, department: "قسم الصيانة والتشغيل", avatarLetter: "أ", avatarColor: "bg-teal-500 text-teal-50", phone: "0501234506", hireDate: "11 يوليو 2021", permissions: ["إدارة مهام الصيانة"] },
  { email: "asamh@avaz.sa", name: "اسامه", password: "Avaz@2036", role: "user" as UserRole, department: "قسم المالية", avatarLetter: "أ", avatarColor: "bg-yellow-600 text-yellow-50", phone: "0501234507", hireDate: "01 سبتمبر 2020", permissions: ["عرض التقارير المالية"] },
  { email: "abo-fhd@avaz.sa", name: "عبد الرحمن الحميدان", password: "Avaz@2037", role: "user" as UserRole, department: "قسم الصيانة والتشغيل", avatarLetter: "ع", avatarColor: "bg-indigo-500 text-indigo-50", phone: "0501234508", hireDate: "15 نوفمبر 2022", permissions: ["إدارة مهام الصيانة"] },
];

// SystemUsers for display (without passwords)
const systemUsers: SystemUser[] = mockUsers.map(u => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...displayUser } = u;
  return { ...displayUser, id: u.email }; // Use email as ID
});


export const targetedClientsData: TargetedClient[] = [
    { 
      id: "client1",
      name: "شركة الأمل للتطوير", 
      contact: "0501234567", 
      status: "لم يتم التواصل", 
      priority: "عالية",
      communicationLog: [ { id: "comm1_1", timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), notes: "تمت إضافة العميل إلى القائمة. يحتاج إلى اتصال أولي.", employee: "النظام" } ],
      generalNotes: "عميل محتمل مهم في قطاع التطوير السكني. يبحثون عن أراضي كبيرة شمال الرياض. التواصل الأولي مطلوب بشكل عاجل.",
      lastCommunication: { employee: "النظام", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      nextAction: "الاتصال الأول للاستكشاف المبدئي للاحتياجات وتقديم الشركة.",
      nextActionDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Needs follow up soon
    },
    { 
      id: "client2",
      name: "مؤسسة البناء الحديث", 
      contact: "0557654321", 
      status: "تم التواصل المبدئي", 
      priority: "متوسطة",
      communicationLog: [
        { id: "comm2_1", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), notes: "تم الاتصال وإرسال نبذة عن خدمات أفاز عبر البريد الإلكتروني.", employee: "aziz@avaz.sa" },
        { id: "comm2_2", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), notes: "أبدى العميل اهتمامًا أوليًا بالاستثمار في معارض تجارية على طريق الملك فهد.", employee: "aziz@avaz.sa" }
      ],
      generalNotes: "مهتمون بالمواقع التجارية على الطرق الرئيسية، يفضلون مساحات تزيد عن 500م².",
      lastCommunication: { employee: "aziz@avaz.sa", date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      nextAction: "إرسال قائمة بالعروض التجارية المتوفرة على طريق الملك فهد والمواقع المشابهة.",
      nextActionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    { 
      id: "client3",
      name: "مجموعة استثمار الغد", 
      contact: "0533219876", 
      status: "بانتظار الرد", 
      priority: "عالية",
      communicationLog: [ 
        { id: "comm3_1", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), notes: "تم إرسال عرض تفصيلي لمشروع X (أرض تجارية في الملقا).", employee: "ali@avaz.sa" },
        { id: "comm3_2", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), notes: "تأكيد استلام العرض من قبل مدير الاستثمار لديهم.", employee: "ali@avaz.sa" }
      ],
      generalNotes: "مجموعة استثمارية كبيرة، يبحثون عن فرص ذات عوائد مرتفعة. يركزون على الأراضي والمجمعات التجارية.",
      lastCommunication: { employee: "ali@avaz.sa", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      nextAction: "متابعة الرد على العرض المرسل (بعد يومين عمل).",
      nextActionDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
    { 
      id: "client4", name: "شركة الرواد العقارية", contact: "0598765432", status: "تم تحديد موعد", priority: "متوسطة",
      communicationLog: [
         { id: "comm4_1", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), notes: "تم الاتفاق على موعد اجتماع يوم الأربعاء القادم الساعة 11 صباحًا في مقرهم.", employee: "faisal@avaz.sa" }
      ],
      lastCommunication: {employee: "faisal@avaz.sa", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)},
      nextAction: "اجتماع يوم الأربعاء القادم لمناقشة فرص التعاون في تسويق مشاريعهم السكنية.",
      nextActionDate: new Date(Date.now() + (new Date().getDay() <=3 ? 3-new Date().getDay() : 10-new Date().getDay())*24*60*60*1000), // Next Wednesday
    },
    { 
      id: "client5", name: "مؤسسة المستقبل الذهبي", contact: "0561122334", status: "يتطلب متابعة", priority: "منخفضة",
      generalNotes: "تم التواصل سابقًا ولم يبدوا اهتمامًا كبيرًا، ولكن يمكن إعادة التواصل بعد فترة للاستفسار عن أي مستجدات.",
      communicationLog: [
          { id: "comm5_1", timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), notes: "تواصل أولي، لم يكن لديهم مشاريع حالية تتطلب خدماتنا.", employee: "aziz@avaz.sa" }
      ],
      lastCommunication: { employee: "aziz@avaz.sa", date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)},
      nextAction: "إعادة الاتصال نهاية الأسبوع القادم للاستفسار عن أي اهتمام جديد أو مشاريع مستقبلية.",
      nextActionDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: "client6",
      name: "مشاريع الغد العقارية",
      contact: "0544112233",
      status: "تم إرسال العرض", 
      priority: "عالية",
      communicationLog: [
        { id: "comm6_1", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), notes: "اجتماع أولي، تم تحديد الاهتمامات الرئيسية: أراضي تجارية كبيرة شمال الرياض.", employee: "faisal@avaz.sa" },
        { id: "comm6_2", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), notes: "تم إعداد وإرسال عرض أسعار مخصص لعدة قطع أراضي استثمارية في حي النرجس والعارض.", employee: "faisal@avaz.sa" }
      ],
      generalNotes: "العميل يبحث عن فرص استثمارية كبيرة في الأراضي التجارية الخام. مهتم جدًا بالتوسع في شمال الرياض. تم إرسال عرض مبدئي ويتوقعون الرد خلال 3 أيام.",
      lastCommunication: { employee: "faisal@avaz.sa", date: new Date(Date.now() - 1 * 60 * 60 * 1000) },
      nextAction: "المتابعة مع العميل خلال 48 ساعة بخصوص العرض المرسل.",
      nextActionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    }
];

function formatPhoneNumberForWhatsApp(phone: string): string {
  if (phone.startsWith('05') && phone.length === 10) {
    return `966${phone.substring(1)}`;
  }
  return phone.replace(/\D/g, ''); 
}

const roleTranslations: Record<UserRole, string> = {
  admin: "مدير النظام",
  user: "مستخدم"
};

export default function DashboardPage() {
  const [selectedUser, setSelectedUser] = React.useState<SystemUser | null>(null);
  const [isEmployeeDialogValidOpen, setIsEmployeeDialogValidOpen] = React.useState(false);

  const stats = [
    { title: "إجمالي الطلبات", value: "125", icon: <ListChecks className="h-6 w-6 text-primary" />, color: "text-primary" },
    { title: "طلبات جديدة", value: "15", icon: <PlusCircle className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />, color: "text-yellow-500 dark:text-yellow-400" },
    { title: "طلبات مكتملة", value: "80", icon: <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />, color: "text-green-500 dark:text-green-400" },
    { title: "طلبات ملغاة", value: "5", icon: <XCircleIconLucide className="h-6 w-6 text-red-500 dark:text-red-400" />, color: "text-red-500 dark:text-red-400" },
  ];

  const handleUserClick = (user: SystemUser) => {
    setSelectedUser(user);
    setIsEmployeeDialogValidOpen(true);
  };

  return (
    <div className="space-y-8 bg-background p-4 md:p-6 rounded-lg shadow-inner" dir="rtl">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-accent font-headline">لوحة تحكم المشرف</h1>
        <p className="text-muted-foreground mt-2">نظرة شاملة على أداء النظام والفرق.</p>
      </header>

      <section>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
            <Card key={stat.title} className="shadow-md hover:shadow-xl transition-all duration-300 bg-card transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                </CardTitle>
                {stat.icon}
                </CardHeader>
                <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                </CardContent>
            </Card>
            ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-md hover:shadow-lg transition-shadow bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UsersIcon className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl font-headline text-primary">العملاء المستهدفون (بيانات أسبوعية)</CardTitle>
            </div>
            <CardDescription>قائمة بالعملاء المحتملين للتواصل والمتابعة هذا الأسبوع.</CardDescription>
          </CardHeader>
          <CardContent>
            {targetedClientsData.length > 0 ? (
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="text-right">الاسم</TableHead>
                            <TableHead className="text-right">التواصل</TableHead>
                            <TableHead className="text-right">الحالة</TableHead>
                            <TableHead className="text-right">الأولوية</TableHead>
                             <TableHead className="text-right">الإجراء</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {targetedClientsData.map((client) => {
                          const whatsappNumber = formatPhoneNumberForWhatsApp(client.contact);
                          return (
                            <TableRow key={client.id} className="hover:bg-muted/20 transition-colors">
                            <TableCell className="font-medium text-foreground">
                                <Link href={`/dashboard/clients/${client.id}`} className="hover:underline text-primary">
                                 {client.name}
                                </Link>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                <div className="flex items-center gap-2 rtl:flex-row-reverse rtl:justify-end">
                                  <span dir="ltr">{client.contact}</span>
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
                            </TableCell>
                            <TableCell>
                                <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    client.status === "لم يتم التواصل" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                                    client.status === "تم التواصل المبدئي" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                    client.status === "بانتظار الرد" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                                    client.status === "تم تحديد موعد" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" :
                                    client.status === "تم إرسال العرض" ? "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300" :
                                    "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300"
                                }`}>
                                {client.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Badge 
                                    className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
                                    client.priority === "عالية" ? "bg-red-500 hover:bg-red-600 text-white" : 
                                    client.priority === "متوسطة" ? "bg-accent hover:bg-accent/90 text-accent-foreground" :
                                    "bg-green-500 hover:bg-green-600 text-white"
                                }`}>
                                    {client.priority}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Button asChild variant="ghost" size="sm">
                                  <Link href={`/dashboard/clients/${client.id}`}>
                                    <Edit3 className="h-4 w-4" />
                                  </Link>
                                </Button>
                            </TableCell>
                            </TableRow>
                          );
                        })}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">لا توجد بيانات عملاء مستهدفين حاليًا.</p>
                    <p className="text-xs text-muted-foreground mt-1">سيتم تحديث هذه القائمة أسبوعيًا أو حسب الحاجة.</p>
                </div>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              ملاحظة: تطوير نظام رفع البيانات وتحديثها يتطلب مراحل تطوير إضافية.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UsersIcon className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl font-headline text-primary">قائمة المستخدمين</CardTitle>
            </div>
            <CardDescription>قائمة بالموظفين المصرح لهم بالدخول للنظام وأدوارهم.</CardDescription>
          </CardHeader>
          <CardContent>
            {systemUsers.length > 0 ? (
              <div className="space-y-4">
                {systemUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer hover:shadow-md"
                    onClick={() => handleUserClick(user)} 
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={`${user.avatarColor} font-bold`}>{user.avatarLetter}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        {user.hireDate && <p className="text-xs text-muted-foreground/70">تاريخ التعيين: {user.hireDate}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                       <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="text-xs flex items-center gap-1">
                         <UserRoleIcon className="h-3 w-3"/> {roleTranslations[user.role]}
                       </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{user.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">لا يوجد مستخدمون معرفون حاليًا.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedUser && (
        <EmployeeDetailsDialog
          user={selectedUser}
          isOpen={isEmployeeDialogValidOpen}
          onClose={() => setIsEmployeeDialogValidOpen(false)}
        />
      )}
    </div>
  );
}


