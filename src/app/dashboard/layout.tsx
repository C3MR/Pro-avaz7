
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, ListOrdered, LayoutDashboard, PlusSquare, Loader2, Building, ClipboardList, BarChart3, FileText as FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AuthenticatedUser } from "@/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticatedUser, setAuthenticatedUser] = React.useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    try {
        const userItem = sessionStorage.getItem('loggedInUser');
        if (userItem) {
            const parsedUser = JSON.parse(userItem);
            setAuthenticatedUser(parsedUser);
        } else {
            const currentPath = window.location.pathname + window.location.search;
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        }
    } catch (error) {
        console.error("Error accessing session storage or parsing user data:", error);
        router.push("/login");
    }
    setIsLoading(false);
  }, [router]);

  const sidebarNavItems = React.useMemo(() => [
    {
      title: "نظرة عامة",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      show: true,
    },
    {
      title: "المهام",
      href: "/dashboard/tasks",
      icon: <ClipboardList className="h-4 w-4" />,
      show: true,
    },
    {
      title: "الطلبات المدرجة",
      href: "/dashboard/listed-requests",
      icon: <ListOrdered className="h-4 w-4" />,
      show: true,
    },
    {
      title: "عروض الأسعار",
      href: "/dashboard/quotations",
      icon: <FileTextIcon className="h-4 w-4" />,
      show: true, 
    },
    {
      title: "إضافة عقار مُدار",
      href: "/dashboard/add-managed-property",
      icon: <PlusSquare className="h-4 w-4" />,
      show: authenticatedUser?.role === "admin",
    },
     {
      title: "عقاراتنا (للإدارة)",
      href: "/our-properties",
      icon: <Building className="h-4 w-4" />,
      show: authenticatedUser?.role === "admin",
    },
    {
      title: "بيانات السوق (العدل)",
      href: "/dashboard/market-data",
      icon: <BarChart3 className="h-4 w-4" />,
      show: true, // Or restrict to admin if desired
    },
  ], [authenticatedUser?.role]);


  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">جاري التحقق من الجلسة...</p>
        </div>
    );
  }

  if (!authenticatedUser) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))]" dir="rtl">
      <aside className="w-64 border-l bg-background p-4 space-y-4 hidden md:block">
        <nav className="flex flex-col space-y-1">
          {sidebarNavItems.filter(item => item.show).map((item) => {
            let isActive = false;
            if (item.href === "/dashboard") {
              isActive = pathname === "/dashboard";
            } else {
              isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            }
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className="justify-start gap-2 text-right"
              >
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
