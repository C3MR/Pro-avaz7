
"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { Location } from "@/types";

// Define props for LocationPicker to pass them through DynamicLocationPicker
interface LocationPickerProps {
  onLocationSelect: (location: Location | null, mapScreenshotUri?: string | null) => void;
  initialPosition?: Location;
  drawMode?: 'point' | 'polygon';
}

const LocationPicker = dynamic(() => import('@/components/map/LocationPicker'), {
  loading: () => (
    <div className="space-y-2">
      <div className="flex space-x-2 rtl:space-x-reverse">
        <Skeleton className="h-10 flex-grow" />
        <Skeleton className="h-10 w-20" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
  ssr: false // Map components are typically client-side only
});

export default function DynamicLocationPicker(props: LocationPickerProps) {
  return <LocationPicker {...props} />;
}
