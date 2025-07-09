
"use client";
import * as React from "react";
import type { Task, TaskPriority, TaskStatus, TaskType } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TaskList from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, ListChecks, CheckCircle, AlertTriangle, Loader2, ListFilter, Search, Briefcase, ListOrdered, User, Edit3, Trash2 } from "lucide-react";
import { mockTasks } from "@/components/tasks/TaskList"; 
import { mockUsers } from "@/app/dashboard/page";
import AddTaskFormDialog from "@/components/tasks/AddTaskFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { createTaskAction, updateTaskAction, deleteTaskAction, type NewTaskFormState, type UpdateTaskFormState, type DeleteTaskState } from "@/lib/actions";


const initialFilterOptions: { value: string; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "pending", label: "قيد التنفيذ" },
  { value: "completed", label: "مكتملة" },
  { value: "overdue", label: "متأخرة" },
];

const initialSortOptions: { value: string; label: string }[] = [
  { value: "createdAtDesc", label: "تاريخ الإنشاء (الأحدث)" },
  { value: "dueDateAsc", label: "تاريخ الاستحقاق (الأقرب)" },
  { value: "dueDateDesc", label: "تاريخ الاستحقاق (الأبعد)" },
  { value: "priority", label: "الأولوية (الأعلى أولاً)" },
  { value: "status", label: "الحالة (حسب الترتيب)" },
];

const initialTypeFilterOptions: { value: string; label: string; icon?: React.ReactElement }[] = [
  { value: "all", label: "جميع الأنواع" },
  { value: "property", label: "مرتبطة بعقار", icon: <Briefcase className="h-4 w-4" /> },
  { value: "quote", label: "مرتبطة بعرض/عقد", icon: <AlertTriangle className="h-4 w-4" /> }, 
  { value: "general", label: "مهمة عامة", icon: <ListOrdered className="h-4 w-4" /> },
];

const employeeOptions = [
  { value: "all", label: "جميع الموظفين" },
  ...mockUsers.map(user => ({ value: user.email, label: user.name }))
];


export default function TasksPage() {
  const { toast } = useToast();
  const [isAddOrEditDialogOpen, setIsAddOrEditDialogOpen] = React.useState(false);
  const [taskToEdit, setTaskToEdit] = React.useState<Task | null>(null);
  
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks); 
  const [activeStatusFilter, setActiveStatusFilter] = React.useState<string>("all");
  const [activeTypeFilter, setActiveTypeFilter] = React.useState<string>("all");
  const [currentSort, setCurrentSort] = React.useState<string>("createdAtDesc");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [selectedAssigneeFilter, setSelectedAssigneeFilter] = React.useState<string>("all");

  const [taskToDeleteId, setTaskToDeleteId] = React.useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);


  const filteredAndSortedTasks = React.useMemo(() => {
    let filtered = tasks.filter(task => {
      const isOverdue = task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date();
      const effectiveStatus = isOverdue ? 'overdue' : task.status;
      
      const matchesStatus = activeStatusFilter === "all" || effectiveStatus === activeStatusFilter;
      const matchesType = activeTypeFilter === "all" || task.type === activeTypeFilter;
      const matchesAssignee = selectedAssigneeFilter === "all" || task.assigneeId === selectedAssigneeFilter;
      
      const matchesSearch = 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.relatedToDisplayName && task.relatedToDisplayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.assigneeName && task.assigneeName.toLowerCase().includes(searchTerm.toLowerCase()));
        
      return matchesStatus && matchesType && matchesAssignee && matchesSearch;
    });

    if (currentSort === "dueDateAsc") {
      filtered.sort((a, b) => (a.dueDate && b.dueDate ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() : a.dueDate ? -1 : b.dueDate ? 1 : 0));
    } else if (currentSort === "dueDateDesc") {
      filtered.sort((a, b) => (a.dueDate && b.dueDate ? new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime() : a.dueDate ? 1 : b.dueDate ? -1 : 0));
    } else if (currentSort === "priority") {
      const priorityOrder: Record<TaskPriority, number> = { high: 1, medium: 2, low: 3 };
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (currentSort === "status") {
      const statusOrder: Record<TaskStatus, number> = { overdue: 1, pending: 2, completed: 3 };
      const getEffectiveStatus = (taskItem: Task) => (taskItem.status !== 'completed' && taskItem.dueDate && new Date(taskItem.dueDate) < new Date()) ? 'overdue' : taskItem.status;
      filtered.sort((a, b) => statusOrder[getEffectiveStatus(a)] - statusOrder[getEffectiveStatus(b)]);
    } else if (currentSort === "createdAtDesc") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return filtered;
  }, [tasks, activeStatusFilter, activeTypeFilter, currentSort, searchTerm, selectedAssigneeFilter]);


  const taskStats = React.useMemo(() => {
    const tasksForStats = tasks.filter(task => 
      selectedAssigneeFilter === "all" || task.assigneeId === selectedAssigneeFilter
    );

    const total = tasksForStats.length;
    let completed = 0;
    let overdue = 0;
    let pending = 0;

    tasksForStats.forEach(task => {
      const isTaskOverdue = task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date();
      if (isTaskOverdue) {
        overdue++;
        if (task.status === 'pending') pending++; 
      } else if (task.status === 'completed') {
        completed++;
      } else if (task.status === 'pending') {
        pending++;
      }
    });
    
    return [
      { title: `إجمالي المهام ${selectedAssigneeFilter !== 'all' ? `(${employeeOptions.find(e=>e.value === selectedAssigneeFilter)?.label || ''})` : ''}`, value: total.toString(), icon: <ListChecks className="h-6 w-6 text-primary" /> },
      { title: "المهام المنجزة", value: completed.toString(), icon: <CheckCircle className="h-6 w-6 text-green-500" /> },
      { title: "المهام المتأخرة", value: overdue.toString(), icon: <AlertTriangle className="h-6 w-6 text-red-500" /> },
      { title: "قيد التنفيذ", value: pending.toString(), icon: <Loader2 className="h-6 w-6 text-yellow-500 animate-spin" /> },
    ];
  }, [tasks, selectedAssigneeFilter]);

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => [newTask, ...prevTasks].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleOpenAddTaskDialog = () => {
    setTaskToEdit(null);
    setIsAddOrEditDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsAddOrEditDialogOpen(true);
  };
  
  const handleOpenDeleteConfirm = (taskId: string) => {
    setTaskToDeleteId(taskId);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDeleteId) return;
    setIsDeleting(true);
    const result: DeleteTaskState = await deleteTaskAction(taskToDeleteId);
    setIsDeleting(false);
    if (result.success) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDeleteId));
      toast({ title: "نجاح", description: result.message });
    } else {
      toast({ variant: "destructive", title: "خطأ", description: result.message });
    }
    setIsDeleteConfirmOpen(false);
    setTaskToDeleteId(null);
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    const formData = new FormData();
    formData.append("taskId", task.id);
    formData.append("title", task.title); // Required by schema, though not changing
    formData.append("priority", task.priority); // Required
    formData.append("type", task.type); // Required
    formData.append("assigneeId", task.assigneeId); // Required
    formData.append("status", newStatus);
    if (task.description) formData.append("description", task.description);
    if (task.dueDate) formData.append("dueDate", task.dueDate.toISOString());
    if (task.relatedToEntityId) formData.append("relatedToEntityId", task.relatedToEntityId);
    if (task.relatedToDisplayName) formData.append("relatedToDisplayName", task.relatedToDisplayName);
    if (task.assigneeName) formData.append("assigneeName", task.assigneeName);


    const result: UpdateTaskFormState = await updateTaskAction(null, formData);

    if (result.updatedTask) {
      handleTaskUpdated(result.updatedTask);
      toast({ title: "نجاح", description: `تم تحديث حالة المهمة إلى "${statusText[newStatus]}"` });
    } else {
      toast({ variant: "destructive", title: "خطأ", description: result.message || "فشل تحديث حالة المهمة."});
    }
  };


  return (
    <div className="space-y-6" dir="rtl">
      <Card className="shadow-lg border-accent/20">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 sm:p-6 rounded-t-lg">
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary font-headline">إدارة المهام</CardTitle>
            <CardDescription className="text-sm sm:text-md text-muted-foreground mt-1">عرض وتتبع جميع المهام المتعلقة بالعمليات العقارية والفريق.</CardDescription>
          </div>
          <Button onClick={handleOpenAddTaskDialog} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-shadow">
            <PlusCircle className="ml-2 h-5 w-5" />
            إضافة مهمة جديدة
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {taskStats.map((stat) => (
              <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
           
          <div className="p-4 border bg-card rounded-lg shadow-sm space-y-4 mb-6">
            <div className="flex items-center bg-muted p-1 rounded-full">
              {initialFilterOptions.map((filter) => (
                <Button
                  key={filter.value}
                  variant={activeStatusFilter === filter.value ? "default" : "ghost"}
                  onClick={() => setActiveStatusFilter(filter.value)}
                  className={`flex-1 rounded-full text-sm h-9 ${activeStatusFilter === filter.value ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground hover:bg-accent/50'}`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
              <Input
                type="text"
                placeholder="بحث عن مهمة (العنوان، الوصف، المرتبط بـ، الموظف)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rtl:pr-10 form-input h-11 text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <ListOrdered className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground shrink-0">ترتيب حسب:</span>
                <Select value={currentSort} onValueChange={setCurrentSort}>
                  <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs form-input">
                    <SelectValue placeholder="اختر الترتيب" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialSortOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <ListFilter className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground shrink-0">نوع المهمة:</span>
                <Select value={activeTypeFilter} onValueChange={setActiveTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs form-input">
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialTypeFilterOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground shrink-0">الموظف:</span>
                <Select value={selectedAssigneeFilter} onValueChange={setSelectedAssigneeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs form-input">
                    <SelectValue placeholder="اختر الموظف" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <TaskList 
            tasks={filteredAndSortedTasks} 
            onEditTask={handleEditTask}
            onDeleteTask={handleOpenDeleteConfirm}
            onToggleTaskStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>
      <AddTaskFormDialog 
        open={isAddOrEditDialogOpen} 
        onOpenChange={setIsAddOrEditDialogOpen}
        onTaskCreated={handleTaskCreated} 
        onTaskUpdated={handleTaskUpdated}
        taskToEdit={taskToEdit}
      />
       <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد أنك تريد حذف هذه المهمة؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTaskToDeleteId(null)}>إلغاء</AlertDialogCancel>
            <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
            >
                {isDeleting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Trash2 className="ml-2 h-4 w-4" />}
                حذف
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

