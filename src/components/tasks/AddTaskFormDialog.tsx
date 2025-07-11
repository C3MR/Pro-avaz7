
"use client";

import React, { useState, useMemo, useEffect, useRef, useActionState, startTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, PlusCircle, Edit3, AlertCircle, Briefcase, ListOrdered } from "lucide-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import type { Task, TaskPriority, TaskStatus, TaskType } from "@/types";
import { mockUsers } from "@/app/dashboard/page"; 
import { createTaskAction, updateTaskAction, type NewTaskFormState, type UpdateTaskFormState } from "@/lib/actions"; 
import { cn } from "@/lib/utils";


const taskPriorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "high", label: "عالية" },
  { value: "medium", label: "متوسطة" },
  { value: "low", label: "منخفضة" },
];

const taskTypeOptions: { value: TaskType; label: string; icon?: React.ReactElement }[] = [
  { value: "property", label: "مرتبطة بعقار", icon: <Briefcase className="h-4 w-4" /> },
  { value: "quote", label: "مرتبطة بعرض/عقد", icon: <AlertCircle className="h-4 w-4" /> }, 
  { value: "general", label: "مهمة عامة", icon: <ListOrdered className="h-4 w-4" /> },
];

const mockProperties = [
  { id: "prop-andalus-001", name: "برج الأندلس" },
  { id: "prop-goldensands-77", name: "أرض الرمال الذهبية" },
  { id: "prop-yasmine-villas", name: "فلل الياسمين" },
];
const mockQuotes = [
  { id: "quote-kf-023", name: "عرض سعر مكاتب الملك فهد" },
  { id: "quote-contract-8754", name: "عقد #8754" },
];

const clientSideTaskFormSchema = z.object({
  title: z.string().min(3, { message: "عنوان المهمة يجب أن يكون 3 أحرف على الأقل." }),
  description: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  priority: z.custom<TaskPriority>((val) => taskPriorityOptions.map(p => p.value).includes(val as TaskPriority), {
    message: "الرجاء اختيار الأولوية.",
  }),
  type: z.custom<TaskType>((val) => taskTypeOptions.map(t => t.value).includes(val as TaskType), {
    message: "الرجاء اختيار نوع المهمة.",
  }),
  relatedToEntityId: z.string().optional(),
  assigneeId: z.string().min(1, {message: "الرجاء اختيار الموظف الموكل إليه."}),
  status: z.custom<TaskStatus>().optional(),
});

type TaskFormValues = z.infer<typeof clientSideTaskFormSchema>;

interface AddTaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated?: (newTask: Task) => void; 
  onTaskUpdated?: (updatedTask: Task) => void;
  taskToEdit?: Task | null; 
}

const statusTextDialog: Record<TaskStatus, string> = {
  pending: "قيد التنفيذ",
  completed: "مكتملة",
  overdue: "متأخرة", 
};

export default function AddTaskFormDialog({ open, onOpenChange, onTaskCreated, onTaskUpdated, taskToEdit }: AddTaskFormDialogProps) {
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const initialCreateState: NewTaskFormState = { message: "", errors: {} };
  const [createState, createFormAction, isCreating] = useActionState(createTaskAction, initialCreateState);

  const initialUpdateState: UpdateTaskFormState = { message: "", errors: {} };
  const [updateState, updateFormAction, isUpdating] = useActionState(updateTaskAction, initialUpdateState);

  const isSubmitting = isCreating || isUpdating;
  const serverState = taskToEdit ? updateState : createState;


  const form = useForm<TaskFormValues>({
    resolver: zodResolver(clientSideTaskFormSchema),
    defaultValues: {
      title: "", description: "", dueDate: null, priority: "medium", type: "general",
      relatedToEntityId: "", assigneeId: "", status: "pending",
    },
  });

  useEffect(() => {
    if (open) { 
      if (taskToEdit) {
        form.reset({
          title: taskToEdit.title,
          description: taskToEdit.description || "",
          dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : null,
          priority: taskToEdit.priority,
          type: taskToEdit.type,
          relatedToEntityId: taskToEdit.relatedToEntityId || "",
          assigneeId: taskToEdit.assigneeId || "",
          status: taskToEdit.status,
        });
      } else {
        form.reset({ 
            title: "", description: "", dueDate: null, priority: "medium", type: "general",
            relatedToEntityId: "", assigneeId: "", status: "pending"
        });
      }
    }
  }, [taskToEdit, open, form]);

  const currentType = form.watch("type");

  const relatedEntityOptions = useMemo(() => {
    if (currentType === "property") return mockProperties;
    if (currentType === "quote") return mockQuotes;
    return [];
  }, [currentType]);

  useEffect(() => {
    if (serverState?.message) {
      if (serverState.taskId && !serverState.errors) { 
        toast({ title: "نجاح!", description: serverState.message });
        if (onTaskCreated && 'submittedData' in serverState && serverState.submittedData) {
           const loggedInUserItem = sessionStorage.getItem('loggedInUser');
           let assignerId = "system-default"; let assignerName = "النظام";
           if (loggedInUserItem) { const loggedInUser = JSON.parse(loggedInUserItem); assignerId = loggedInUser.email; assignerName = loggedInUser.name; }
           const assignee = mockUsers.find(user => user.email === serverState.submittedData!.assigneeId);
           const relatedEntity = relatedEntityOptions.find(e => e.id === serverState.submittedData!.relatedToEntityId);
          
           const createdTask: Task = {
             id: serverState.taskId!,
             title: serverState.submittedData.title,
             description: serverState.submittedData.description,
             dueDate: serverState.submittedData.dueDate ? new Date(serverState.submittedData.dueDate) : null,
             priority: serverState.submittedData.priority,
             status: "pending",
             type: serverState.submittedData.type,
             relatedToEntityId: serverState.submittedData.relatedToEntityId,
             relatedToDisplayName: relatedEntity?.name,
             assigneeId: serverState.submittedData.assigneeId,
             assigneeName: assignee?.name,
             assignerId: assignerId,
             assignerName: assignerName,
             createdAt: new Date(), 
             updatedAt: new Date(),
             attachments: [],
           };
           onTaskCreated(createdTask);
        }
        onOpenChange(false);
      } else if ('updatedTask' in serverState && serverState.updatedTask && !serverState.errors) { 
        toast({ title: "نجاح!", description: serverState.message });
        if (onTaskUpdated) onTaskUpdated(serverState.updatedTask);
        onOpenChange(false);
      } else { 
        const errorMsg = serverState.errors?._form?.join(", ") || Object.values(serverState.errors || {}).flat().join(", ") || serverState.message || "حدث خطأ ما.";
        toast({ variant: "destructive", title: "خطأ", description: errorMsg });
      }
    }
  }, [serverState, toast, onTaskCreated, onTaskUpdated, onOpenChange, form, relatedEntityOptions]);


  const handleFormSubmitWrapper = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = await form.trigger();
    if (isValid && formRef.current) {
      const formData = new FormData(formRef.current);
      if (taskToEdit && taskToEdit.id) {
        formData.append("taskId", taskToEdit.id); 
      }
      if (taskToEdit) {
        startTransition(() => { updateFormAction(formData); });
      } else {
        startTransition(() => { createFormAction(formData); });
      }
    } else {
       const firstErrorKey = Object.keys(form.formState.errors)[0];
      if (firstErrorKey) {
        const firstError = form.formState.errors[firstErrorKey as keyof TaskFormValues];
        toast({ variant: "destructive", title: "خطأ في الإدخال", description: firstError?.message || "الرجاء مراجعة الحقول المميزة." });
      }
    }
  };


  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) {
        form.reset({ 
            title: "", description: "", dueDate: null, priority: "medium", type: "general",
            relatedToEntityId: "", assigneeId: "", status: "pending"
        });
      }
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-right">
          <DialogTitle className="text-2xl font-bold text-primary font-headline">
            {taskToEdit ? "تعديل المهمة" : "إضافة مهمة جديدة"}
          </DialogTitle>
          <DialogDescription className="text-right">
            {taskToEdit ? "قم بتحديث تفاصيل المهمة." : "أدخل تفاصيل المهمة الجديدة أدناه."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form ref={formRef} onSubmit={handleFormSubmitWrapper} className="space-y-4 py-4" dir="rtl">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان المهمة*</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: مراجعة عقد الإيجار" {...field} className="form-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف (اختياري)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="أدخل وصفًا تفصيليًا للمهمة..." {...field} className="form-input" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>تاريخ الاستحقاق (اختياري)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("form-input justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                            {field.value ? format(field.value, "PPP", { locale: arSA }) : <span>اختر تاريخًا</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={(date) => field.onChange(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الأولوية*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="form-input">
                          <SelectValue placeholder="اختر الأولوية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {taskPriorityOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             {taskToEdit && (
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحالة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="form-input">
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(Object.keys(statusTextDialog) as TaskStatus[]).map(statusKey => (
                           statusKey !== 'overdue' && 
                           <SelectItem key={statusKey} value={statusKey}>{statusTextDialog[statusKey]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع المهمة*</FormLabel>
                  <Select onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("relatedToEntityId", ""); 
                    }} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="اختر نوع المهمة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {taskTypeOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(currentType === "property" || currentType === "quote") && (
              <FormField
                control={form.control}
                name="relatedToEntityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {currentType === "property" ? "ربط بعقار (اختياري)" : "ربط بعرض/عقد (اختياري)"}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="form-input">
                          <SelectValue placeholder={`اختر ${currentType === "property" ? "العقار" : "العرض/العقد"}...`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {relatedEntityOptions.map(entity => (
                          <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
             <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الموظف الموكل إليه*</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="اختر الموظف" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockUsers.map(user => (
                        <SelectItem key={user.email} value={user.email}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {serverState?.errors?._form && (<div className="text-sm font-medium text-destructive flex items-center gap-2"><AlertCircle size={16}/> {serverState.errors._form.join(", ")}</div>)}
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">إلغاء</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : taskToEdit ? <Edit3 className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {taskToEdit ? "حفظ التعديلات" : "إضافة المهمة"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
