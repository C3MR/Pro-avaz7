
"use client";

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Archive, FilePlus2, Search, Building, GalleryVerticalEnd, PlusSquare, LayoutDashboard, ChevronDown, Users, LogIn, LogOut, Compass, Map as MapIconNav } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import NetworkStatusIndicator from '@/components/error-handling/NetworkStatusIndicator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AuthenticatedUser } from "@/types";

interface NavSubItem {
  href: string;
  label: string;
  icon: React.ReactElement;
}

interface NavItem {
  href?: string;
  label: string;
  icon: React.ReactElement;
  activePaths?: string[];
  subItems?: NavSubItem[];
  requiresAuth?: boolean;
  hideWhenAuth?: boolean;
}

const navigationItems: NavItem[] = [
  { href: '/', label: 'الرئيسية', icon: <Home /> },
  {
    label: 'الطلبات',
    icon: <Archive />,
    activePaths: ['/new-request', '/track-request'],
    subItems: [
      { href: '/new-request', label: 'إنشاء طلب', icon: <FilePlus2 /> },
      { href: '/track-request', label: 'متابعة طلب', icon: <Search /> },
    ],
  },
  {
    label: 'العقارات',
    icon: <Building />,
    activePaths: ['/our-properties', '/add-property'],
    subItems: [
      { href: '/our-properties', label: 'عقاراتنا', icon: <GalleryVerticalEnd /> },
      { href: '/add-property', label: 'عرض عقار', icon: <PlusSquare /> },
    ],
  },
  { href: '/map-search', label: 'بحث بالخريطة', icon: <MapIconNav /> },
  { href: '/market-navigator', label: 'موجه السوق', icon: <Compass /> },
  { href: '/about-us', label: 'من نحن', icon: <Users /> },
  { href: '/dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard />, requiresAuth: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticatedUser, setAuthenticatedUser] = React.useState<AuthenticatedUser | null>(null);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    try {
      const userItem = sessionStorage.getItem('loggedInUser');
      if (userItem) {
        setAuthenticatedUser(JSON.parse(userItem));
      } else {
        setAuthenticatedUser(null);
      }
    } catch (error) {
      console.error("Error accessing session storage in Navbar:", error);
      setAuthenticatedUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    setAuthenticatedUser(null);
    router.push('/login');
  };

  const isNavItemActive = (item: NavItem): boolean => {
    if (item.href) {
      if (item.href === '/') { return pathname === item.href; }
      return pathname === item.href || pathname.startsWith(item.href + '/');
    }
    if (item.activePaths) {
      return item.activePaths.some(p => pathname.startsWith(p));
    }
    return false;
  };

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-2 sm:px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="https://avaz.sa/tower/images/logo-avaz.png"
            alt="AVAZ Logo"
            width={120}
            height={33}
            priority
            className="h-auto"
            data-ai-hint="company logo"
          />
        </Link>
        <div className="flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <NetworkStatusIndicator className="mr-2 rtl:ml-2 rtl:mr-0 hidden sm:flex" />
          {navigationItems.map((item) => {
            if (item.requiresAuth && !authenticatedUser) return null;
            if (item.hideWhenAuth && authenticatedUser) return null;

            const isActive = isNavItemActive(item);
            const buttonClasses = cn(
              "px-1.5 py-1 h-auto sm:px-3 sm:py-2 text-xs sm:text-sm",
              isActive
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-accent hover:text-accent-foreground text-foreground/70"
            );

            if (item.subItems) {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={buttonClasses}
                    >
                      <div className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse">
                        {React.cloneElement(item.icon, { className: "h-4 w-4 sm:h-5 sm:w-5 shrink-0"})}
                        <span className="hidden sm:inline">{item.label}</span>
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 opacity-70" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {item.subItems.map((subItem) => (
                      <DropdownMenuItem key={subItem.href} asChild className="cursor-pointer">
                        <Link href={subItem.href} className="flex items-center gap-2 w-full px-2 py-1.5">
                          {React.cloneElement(subItem.icon, { className: "h-4 w-4 text-muted-foreground"})}
                          <span>{subItem.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Button
                key={item.href || item.label}
                variant={isActive ? 'default' : 'ghost'}
                asChild
                className={buttonClasses}
              >
                <Link href={item.href!} className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse">
                  {React.cloneElement(item.icon, { className: "h-4 w-4 sm:h-5 sm:w-5 shrink-0"})}
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </Button>
            );
          })}

          {isClient && (authenticatedUser ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="px-1.5 py-1 h-auto sm:px-3 sm:py-2 text-xs sm:text-sm hover:bg-destructive hover:text-destructive-foreground text-foreground/70"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </Button>
          ) : (
            <Button
              variant={pathname === '/login' ? 'default' : 'ghost'}
              asChild
              className={cn(
                "px-1.5 py-1 h-auto sm:px-3 sm:py-2 text-xs sm:text-sm",
                pathname === '/login'
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-accent hover:text-accent-foreground text-foreground/70"
              )}
            >
              <Link href="/login" className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse">
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span className="hidden sm:inline">الدخول</span>
              </Link>
            </Button>
          ))}
        </div>
      </nav>
    </header>
  );
}
