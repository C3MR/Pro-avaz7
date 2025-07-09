
import type { RequestStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: RequestStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusColors: Record<RequestStatus, string> = {
    "جديد": "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/50 dark:text-sky-300 dark:border-sky-700", // Updated for "جديد"
    "جاري العمل": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700",
    "تم عرض عقار": "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-700",
    "تم تقديم عرض": "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700",
    "مرحلة التفاوض": "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700",
    "مغلق ناجح": "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700",
    "مغلق غير ناجح": "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
    "ملغى": "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-3 py-1 text-sm font-medium",
        statusColors[status] || "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
      )}
    >
      {status}
    </Badge>
  );
}

