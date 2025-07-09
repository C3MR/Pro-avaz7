
"use client";

import dynamic from 'next/dynamic';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PropertyMatchCalculator = dynamic(() => import('@/components/home/PropertyMatchCalculator'), {
  loading: () => (
    <Card className="w-full shadow-xl border-primary/20">
      <CardHeader className="text-center bg-muted/30 rounded-t-lg">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Skeleton className="h-12 w-full sm:w-36" />
            <Skeleton className="h-12 w-full sm:w-36" />
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  ssr: false // Ensure it's client-side rendered
});

export default function DynamicPropertyMatchCalculator() {
  return <PropertyMatchCalculator />;
}
