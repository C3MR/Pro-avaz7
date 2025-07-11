
"use client";

import * as React from "react";
import type { Task, TaskStatus, TaskPriority, TaskAttachment } from "@/types";
import TaskCard from "./TaskCard";
import { ListChecks } from "lucide-react"; 
import { mockUsers } from "@/app/dashboard/page";

// Helper to get a random user for mock data
const getRandomUser = () => {
  if (!mockUsers || mockUsers.length === 0) {
    return { id: "system-default-" + Math.random().toString(36).substring(7), name: "النظام" };
  }
  const randomIndex = Math.floor(Math.random() * mockUsers.length);
  const user = mockUsers[randomIndex];
  return { id: user.email, name: user.name };
};

// Generate more varied mock attachments
const generateMockAttachments = (count: number = 0): Omit<TaskAttachment, 'uploadedAt'>[] & {uploadedAt: string}[] => {
  if (count === 0) return [];
  const attachments: (Omit<TaskAttachment, 'uploadedAt'> & {uploadedAt: string})[] = [];
  const types: TaskAttachment['type'][] = ['pdf', 'image', 'document', 'other'];
  const names = ['تقرير_نهائي', 'صورة_العقار', 'مستند_العقد', 'ملاحظات_اجتماع', 'فاتورة_الصيانة'];
  const extensions = { pdf: '.pdf', image: '.jpg', document: '.docx', other: '.zip' };

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const name = `${names[Math.floor(Math.random() * names.length)]}_${i + 1}${extensions[type]}`;
    attachments.push({
      id: `att-${Math.random().toString(36).substring(2, 9)}`,
      name: name,
      url: "#", // Placeholder URL
      type: type,
      size: Math.floor(Math.random() * (5000 - 100 + 1) + 100) * 1024, // Size in KB
      uploadedAt: new Date(new Date().getTime() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  return attachments;
};


export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "مراجعة عقد الإيجار لعقار 'برج الأندلس'",
    description: "التدقيق في كافة بنود عقد الإيجار الجديد الخاص ببرج الأندلس والتأكد من مطابقته للشروط القياسية والمعايير القانونية المتبعة. يجب مراجعة بند الصيانة وقيمة الإيجار السنوي.",
    dueDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "high",
    status: "pending",
    type: "property",
    relatedToEntityId: "prop-andalus-001",
    relatedToDisplayName: "برج الأندلس",
    assigneeId: mockUsers.length > 0 ? mockUsers[0].email : "user1@example.com",
    assigneeName: mockUsers.length > 0 ? mockUsers[0].name : "أحمد خالد",
    assignerId: mockUsers.length > 1 ? mockUsers[1].email : "admin@example.com",
    assignerName: mockUsers.length > 1 ? mockUsers[1].name : "المدير",
    createdAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: generateMockAttachments(2),
  },
  {
    id: "task-2",
    title: "إعداد عرض سعر لمشروع 'مكاتب طريق الملك فهد'",
    description: "تجهيز عرض سعر مفصل لتأجير مساحة مكتبية في مشروع مكاتب طريق الملك فهد، شاملًا التكاليف، الميزات، وشروط الدفع لشركة 'التقنية المتقدمة'.",
    dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "medium",
    status: "pending",
    type: "quote",
    relatedToEntityId: "quote-kf-023",
    relatedToDisplayName: "عرض سعر مكاتب الملك فهد",
    assigneeId: mockUsers.length > 2 ? mockUsers[2].email : "user2@example.com",
    assigneeName: mockUsers.length > 2 ? mockUsers[2].name : "سارة عبدالله",
    assignerId: mockUsers.length > 1 ? mockUsers[1].email : "admin@example.com",
    assignerName: mockUsers.length > 1 ? mockUsers[1].name : "المدير",
    createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "task-3",
    title: "متابعة طلب العميل 'خالد عبدالرحمن' لعقار سكني",
    description: "التواصل مع العميل خالد عبدالرحمن لمناقشة آخر تطورات طلبه بخصوص البحث عن فيلا في شمال الرياض، وتقديم قائمة بالعقارات المطابقة.",
    dueDate: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Overdue
    priority: "high",
    status: "pending", 
    type: "general",
    relatedToEntityId: "client-req-KA001",
    relatedToDisplayName: "طلب العميل خالد عبدالرحمن",
    assigneeId: mockUsers.length > 0 ? mockUsers[0].email : "user1@example.com",
    assigneeName: mockUsers.length > 0 ? mockUsers[0].name : "أحمد خالد",
    assignerId: mockUsers.length > 2 ? mockUsers[2].email : "supervisor@example.com",
    assignerName: mockUsers.length > 2 ? mockUsers[2].name : "المشرف العام",
    createdAt: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: generateMockAttachments(1),
  },
  {
    id: "task-4",
    title: "تحديث قائمة العقارات التجارية المتاحة على الموقع",
    description: "مراجعة قائمة العقارات التجارية المعروضة على الموقع الإلكتروني والتأكد من تحديث حالاتها (متاح، مؤجر، مباع) وإضافة أي عقارات جديدة.",
    dueDate: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "medium",
    status: "pending",
    type: "property",
    relatedToDisplayName: "تحديث موقع العقارات التجارية",
    assigneeId: mockUsers.length > 1 ? mockUsers[1].email : "user_dev@example.com",
    assigneeName: mockUsers.length > 1 ? mockUsers[1].name : "فهد المطور",
    assignerId: mockUsers.length > 0 ? mockUsers[0].email : "admin@example.com",
    assignerName: mockUsers.length > 0 ? mockUsers[0].name : "المدير",
    createdAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "task-5",
    title: "إتمام صفقة بيع أرض 'الرمال الذهبية'",
    description: "استكمال كافة الإجراءات القانونية والمالية لإتمام صفقة بيع قطعة الأرض المعروفة باسم 'الرمال الذهبية' للمستثمر 'شركة البناء المتحدة'.",
    dueDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "high",
    status: "completed",
    type: "property",
    relatedToEntityId: "prop-goldensands-77",
    relatedToDisplayName: "أرض الرمال الذهبية",
    assigneeId: getRandomUser().id,
    assigneeName: getRandomUser().name,
    assignerId: getRandomUser().id,
    assignerName: getRandomUser().name,
    createdAt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: generateMockAttachments(3),
  },
  {
    id: "task-6",
    title: "تنظيم حملة تسويقية لمشروع 'فلل الياسمين'",
    description: "وضع خطة تسويقية شاملة لمشروع فلل الياسمين الجديد، تتضمن التسويق الرقمي والإعلانات المطبوعة وتنظيم يوم مفتوح.",
    dueDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "low",
    status: "pending",
    type: "general",
    relatedToDisplayName: "حملة فلل الياسمين",
    assigneeId: getRandomUser().id,
    assigneeName: getRandomUser().name,
    assignerId: getRandomUser().id,
    assignerName: getRandomUser().name,
    createdAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];


interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTaskStatus: (task: Task) => void;
}

export default function TaskList({ tasks, onEditTask, onDeleteTask, onToggleTaskStatus }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground bg-card border rounded-lg shadow">
        <ListChecks className="mx-auto h-12 w-12 mb-4 text-primary/50" />
        <p className="text-lg font-semibold">لا توجد مهام تطابق معايير البحث أو الفلترة الحالية.</p>
        <p className="text-sm mt-1">حاول تغيير الفلاتر أو مصطلح البحث، أو قم بإضافة مهام جديدة.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onEdit={onEditTask} 
          onDelete={onDeleteTask}
          onToggleStatus={onToggleTaskStatus}
        />
      ))}
    </div>
  );
}

