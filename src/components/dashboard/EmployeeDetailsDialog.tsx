
"use client";

import * as React from "react"; // Added React import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, CalendarDays, UserCircle, Briefcase, ShieldCheck, Users, FileText, Settings, MapPin, Hash, VenetianMask, XCircle } from "lucide-react";
import type { SystemUser } from "@/types";

interface EmployeeDetailsDialogProps {
  user: SystemUser | null;
  isOpen: boolean;
  onClose: () => void;
}

const InfoRow: React.FC<{ label: string; value?: string; icon?: React.ReactNode }> = ({ label, value, icon }) => {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-muted/50">
      <dt className="text-sm font-medium text-muted-foreground flex items-center col-span-1">
        {icon && React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4 mr-2"})}
        {label}
      </dt>
      <dd className="text-sm text-foreground col-span-2">{value}</dd>
    </div>
  );
};

export default function EmployeeDetailsDialog({ user, isOpen, onClose }: EmployeeDetailsDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0" dir="rtl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-primary font-headline">
            بطاقة الموظف | {user.name}
          </DialogTitle>
        </DialogHeader>
          className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-card/50"
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Left Pane */}
          <div className="md:col-span-1 bg-muted/30 p-6 flex flex-col items-center text-center border-l border-border relative">
            <div className="absolute top-2 left-2 bg-primary/10 px-2 py-1 rounded-md text-xs text-primary/70 font-medium">
              {user.department}
            </div>
            <Avatar className="h-28 w-28 mb-4 text-4xl ring-4 ring-primary/10">
              <AvatarFallback className={`${user.avatarColor} font-bold`}>
                {user.avatarLetter}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold text-foreground">{user.name}</h2>
            <p className="text-sm text-accent mb-1">{user.role}</p>
            <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="text-xs mb-4">
              {roleTranslations[user.role as UserRole]}
            </Badge>
            <div className="space-y-2 text-xs text-muted-foreground w-full">
                {user.email && (
                    <a href={`mailto:${user.email}`} className="flex items-center justify-center p-2 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors">
                        <Mail className="h-4 w-4 mr-2" /> {user.email}
                    </a>
                )}
                {user.phone && (
                    <a href={`tel:${user.phone}`} className="flex items-center justify-center p-2 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors">
                        <Phone className="h-4 w-4 mr-2" /> {user.phone}
                    </a>
                )}
                 {/* Placeholder for calendar/tasks icon if needed later 
                 <div className="flex items-center justify-center p-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors">
                    <CalendarDays className="h-4 w-4 mr-2" /> مهام/تقويم
                 </div>
                 */}
            </div>
          </div>

          {/* Right Pane */}
          <div className="md:col-span-2 p-6 bg-card">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="personal">المعلومات الشخصية</TabsTrigger>
                <TabsTrigger value="performance" disabled>الأداء والمهام</TabsTrigger>
                <TabsTrigger value="attendance" disabled>الإجازات والحضور</TabsTrigger>
                <TabsTrigger value="documents" disabled>الوثائق</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold text-primary mb-2 bg-primary/5 p-2 rounded-md">المعلومات الأساسية</h3>
                  <InfoRow label="تاريخ الميلاد" value={user.dateOfBirth} icon={<CalendarDays />} />
                  <InfoRow label="رقم الهوية" value={user.idNumber} icon={<Hash />} />
                  <InfoRow label="الجنسية" value={user.nationality} icon={<VenetianMask />} />
                  <InfoRow label="العنوان" value={user.address} icon={<MapPin />} />
                </div>
                
                <div>
                  <h3 className="text-md font-semibold text-primary mb-2 mt-4 bg-primary/5 p-2 rounded-md">معلومات الوظيفة</h3>
                  <InfoRow label="تاريخ التعيين" value={user.hireDate} icon={<CalendarDays />} />
                  <InfoRow label="القسم" value={user.department} icon={<Users />} />
                  <InfoRow label="نوع العقد" value={user.contractType} icon={<FileText />} />
                  <InfoRow label="المدير المباشر" value={user.directManager} icon={<UserCircle />} />
                </div>

                {user.permissions && user.permissions.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-primary mb-2 mt-4 bg-primary/5 p-2 rounded-md">الأدوار والصلاحيات</h3>
                    <div className="flex flex-wrap gap-2 p-2">
                      {user.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="bg-accent/10 text-accent border-accent/30 shadow-sm">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {user.emergencyContact && (
                  <div>
                    <h3 className="text-md font-semibold text-primary mb-2 mt-4 bg-primary/5 p-2 rounded-md">بيانات الاتصال في حالات الطوارئ</h3>
                    <InfoRow label="الاسم" value={user.emergencyContact.name} icon={<UserCircle />} />
                    <InfoRow label="صلة القرابة" value={user.emergencyContact.relationship} icon={<Users />} />
                    <InfoRow label="رقم الهاتف" value={user.emergencyContact.phone} icon={<Phone />} />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="performance">
                <p className="text-muted-foreground text-center py-8">سيتم عرض تفاصيل الأداء والمهام هنا قريبًا.</p>
              </TabsContent>
              <TabsContent value="attendance">
                <p className="text-muted-foreground text-center py-8">سيتم عرض تفاصيل الإجازات والحضور هنا قريبًا.</p>
              </TabsContent>
              <TabsContent value="documents">
                <p className="text-muted-foreground text-center py-8">سيتم عرض الوثائق المتعلقة بالموظف هنا قريبًا.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <DialogClose className="absolute left-4 top-4 rtl:left-auto rtl:right-4">
            <XCircle className="h-6 w-6 text-muted-foreground hover:text-destructive" />
            <span className="sr-only">إغلاق</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
