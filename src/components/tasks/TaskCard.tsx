"use client";

import type { Task, TaskPriority, TaskStatus, TaskAttachment } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Check, MoreHorizontal, Building, FileText as FileTextIcon, UserCircle, RefreshCcw, ListChecks, Briefcase, UserCog, Paperclip, Image as ImageIcon, Edit3, Trash2 } from "lucide-react";
import { format, formatDistanceToNowStrict } from "date-fns";
import { arSA } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (task: Task) => void; // Added for status toggle
}

const priorityClasses: Record<TaskPriority, string> = {
  high: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700",
  low: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700",
};
const priorityText: Record<TaskPriority, string> = {
  high: "أولوية عالية",
  medium: "أولوية متوسطة",
  low: "أولوية منخفضة",
};

const statusClasses: Record<TaskStatus, string> = {
  pending: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700",
  completed: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700",
  overdue: "bg-destructive/10 text-destructive border-destructive/30 dark:bg-destructive/20 dark:text-red-400 dark:border-destructive/50",
};
const statusText: Record<TaskStatus, string> = {
  pending: "قيد التنفيذ",
  completed: "مكتملة",
  overdue: "متأخرة",
};

const typeIcons: Record<Task["type"], React.ReactElement> = {
  property: <Building className="h-3.5 w-3.5" />,
  quote: <FileTextIcon className="h-3.5 w-3.5" />,
  general: <ListChecks className="h-3.5 w-3.5" />,
};

const getAttachmentIcon = (type: TaskAttachment['type']) => {
  switch (type) {
    case 'pdf': return <FileTextIcon className="h-3.5 w-3.5 text-red-600" />;
    case 'image': return <ImageIcon className="h-3.5 w-3.5 text-blue-600" />;
    case 'document': return <FileTextIcon className="h-3.5 w-3.5 text-yellow-600" />;
    default: return <Paperclip className="h-3.5 w-3.5 text-gray-600" />;
  }
};


export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), "dd MMM yyyy, HH:mm", { locale: arSA }) : "غير محدد";
  const timeToNow = task.dueDate && task.status !== 'completed' ? formatDistanceToNowStrict(new Date(task.dueDate), { addSuffix: true, locale: arSA }) : "";
  
  const isOverdue = task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date();
  const effectiveStatus = isOverdue ? 'overdue' : task.status;


  return (
    <Card 
      className={cn(
        "shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out border-l-4",
        effectiveStatus === 'overdue' ? "border-l-red-500" :
        effectiveStatus === 'completed' ? "border-l-green-500" :
        task.priority === 'high' ? "border-l-yellow-500" : "border-l-primary"
      )}
    >
      <CardHeader className="p-4 pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-md font-semibold text-foreground leading-snug hover:text-primary cursor-pointer" onClick={() => onEdit(task)}>
            {task.title}
          </CardTitle>
          <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2 rtl:mr-2 rtl:ml-0">
            <Badge variant="outline" className={cn("text-xs py-0.5 px-2 font-medium", statusClasses[effectiveStatus])}>
              {statusText[effectiveStatus]}
            </Badge>
            <Badge variant="outline" className={cn("text-xs py-0.5 px-2 font-medium", priorityClasses[task.priority])}>
              {priorityText[task.priority]}
            </Badge>
          </div>
        </div>
        <div className="flex items-center text-xs text-muted-foreground gap-x-3 gap-y-1 flex-wrap pt-1">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-default">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>{formattedDueDate}</span>
                  {timeToNow && <span className={cn("text-xs", effectiveStatus === 'overdue' ? "text-red-600 font-medium" : "text-muted-foreground/80")}>({timeToNow})</span>}
                </div>
              </TooltipTrigger>
              <TooltipContent><p>تاريخ الاستحقاق: {formattedDueDate}</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {task.relatedToDisplayName && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-default truncate">
                    {typeIcons[task.type]}
                    <span className="truncate max-w-[150px]">{task.relatedToDisplayName}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>مرتبط بـ: {task.relatedToDisplayName} (النوع: {task.type === 'property' ? 'عقار' : task.type === 'quote' ? 'عرض/عقد' : 'عام'})</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      {task.description && (
        <CardContent className="p-4 pt-0 pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        </CardContent>
      )}
      {task.attachments && task.attachments.length > 0 && (
        <CardContent className="p-4 pt-0 pb-3">
          <div className="mt-2 pt-2 border-t border-border/30">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                 <Paperclip className="h-3.5 w-3.5"/>
                 <span>المرفقات:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.attachments.map((att) => (
                <TooltipProvider key={att.id} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href={att.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-primary hover:underline flex items-center gap-1.5 bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded-md transition-colors"
                      >
                        {getAttachmentIcon(att.type)}
                        <span className="truncate max-w-[120px]">{att.name}</span>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>الاسم: {att.name}</p>
                      <p>النوع: {att.type}</p>
                      {att.size && <p>الحجم: {(att.size / 1024).toFixed(1)} KB</p>}
                      <p>تاريخ الرفع: {format(new Date(att.uploadedAt), "dd/MM/yyyy HH:mm", { locale: arSA })}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </CardContent>
      )}
      <CardFooter className="p-4 pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center text-xs w-full sm:w-auto flex-wrap gap-x-2 gap-y-1.5">
          {task.assigneeName && (
            <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-xs font-medium">
              <UserCircle className="h-4 w-4" />
              <span>مُعين إلى:</span>
              <span>{task.assigneeName}</span>
            </span>
          )}
          {task.assignerName && (
            <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground px-2.5 py-1 rounded-full text-xs font-medium">
               <UserCog className="h-4 w-4" />
               <span>بواسطة:</span>
               <span>{task.assignerName}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 self-end sm:self-center mt-2 sm:mt-0">
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onToggleStatus(task)}>
                        {effectiveStatus === 'completed' ? <RefreshCcw className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{effectiveStatus === 'completed' ? "إعادة فتح المهمة" : "إكمال المهمة"}</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(task)} className="cursor-pointer">
                        <Edit3 className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        تعديل
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive focus:text-destructive-foreground focus:bg-destructive cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        حذف
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
}