
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Map, { Marker, Popup, NavigationControl, MapRef } from 'react-map-gl';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Eye, Home, Loader2, MapPin, Maximize2, Search, X } from "lucide-react";
import type { ManagedProperty, PropertyListingPurpose, PropertyUsage } from "@/types";
import { getAllManagedProperties } from "@/lib/managed-properties-db";
import { propertyListingPurposeMap, propertyUsageMap, getPropertyTypeDisplay } from "../our-properties/page";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYXZhYXoiLCJhIjoiY21ia2Z0aTV3MGxvNzJqczV6bDVobWFzbiJ9.6aeIU9h2yE5CPUGl23N5SQ";

export default function MapSearchPage() {
  const [properties, setProperties] = useState<ManagedProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<ManagedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<ManagedProperty | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 46.6753, // Riyadh
    latitude: 24.7136,
    zoom: 10
  });

  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    async function fetchProperties() {
      setIsLoading(true);
      try {
        const fetchedProperties = await getAllManagedProperties();
        const propertiesWithLocation = fetchedProperties.filter(p => p.locationCoordinates);
        setProperties(propertiesWithLocation);
        setFilteredProperties(propertiesWithLocation);
      } catch (error) {
        console.error("Failed to fetch managed properties:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const formatPrice = (price?: number, suffix?: string) => {
    if (price === undefined) return "غير محدد";
    return `${price.toLocaleString('en-US')} ر.س ${suffix || ''}`.trim();
  }

  const handleMarkerClick = (property: ManagedProperty, e: mapboxgl.MapboxEvent<MouseEvent>) => {
    e.originalEvent.stopPropagation();
    setSelectedProperty(property);
    if(property.locationCoordinates) {
        mapRef.current?.flyTo({ center: [property.locationCoordinates.lng, property.locationCoordinates.lat], duration: 1500, zoom: 14 });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 rtl:mr-4 text-lg text-muted-foreground">جاري تحميل الخريطة والعقارات...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-var(--header-height,68px))] w-full flex" dir="rtl">
        <aside className="w-80 h-full bg-card border-l border-border p-4 flex flex-col shadow-lg z-10">
            <h2 className="text-xl font-bold text-primary mb-4">بحث وتصفية</h2>
            <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                <Input placeholder="بحث بالاسم أو الكود..." />
                 <Select>
                    <SelectTrigger><SelectValue placeholder="الغرض من العرض" /></SelectTrigger>
                    <SelectContent>
                        {(Object.keys(propertyListingPurposeMap) as PropertyListingPurpose[]).map(key => (
                           <SelectItem key={key} value={key}>{propertyListingPurposeMap[key]}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Select>
                    <SelectTrigger><SelectValue placeholder="استخدام العقار" /></SelectTrigger>
                    <SelectContent>
                        {(Object.keys(propertyUsageMap) as PropertyUsage[]).map(key => (
                           <SelectItem key={key} value={key}>{propertyUsageMap[key]}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {/* Add more filters here in the future */}
            </div>
            <Button className="w-full mt-4 bg-accent hover:bg-accent/90">
                <Search className="ml-2 h-4 w-4"/> تطبيق الفلتر
            </Button>
        </aside>

        <main className="flex-1 h-full relative">
            <Map
                ref={mapRef}
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{width: '100%', height: '100%'}}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                <NavigationControl position="top-left" />
                
                {filteredProperties.map(prop => (
                    prop.locationCoordinates && (
                        <Marker
                            key={prop.id}
                            longitude={prop.locationCoordinates.lng}
                            latitude={prop.locationCoordinates.lat}
                            onClick={(e) => handleMarkerClick(prop, e)}
                        >
                            <button className="cursor-pointer transform transition-transform duration-200 hover:scale-125">
                                <Home className="h-7 w-7 text-primary drop-shadow-lg" fill="hsl(var(--primary-foreground))"/>
                            </button>
                        </Marker>
                    )
                ))}

                {selectedProperty && selectedProperty.locationCoordinates && (
                    <Popup
                        longitude={selectedProperty.locationCoordinates.lng}
                        latitude={selectedProperty.locationCoordinates.lat}
                        onClose={() => setSelectedProperty(null)}
                        closeButton={false}
                        anchor="bottom"
                        offset={30}
                    >
                       <Card className="w-64 border-primary shadow-xl">
                            <CardHeader className="p-0">
                                <Image 
                                    src={selectedProperty.imageUrl || "https://placehold.co/300x200.png"}
                                    alt={selectedProperty.title}
                                    width={300}
                                    height={200}
                                    className="w-full h-28 object-cover rounded-t-lg"
                                    data-ai-hint={selectedProperty.dataAiHint || "property exterior"}
                                />
                            </CardHeader>
                            <CardContent className="p-3">
                                <h3 className="font-bold text-md text-foreground mb-1 truncate">{selectedProperty.title}</h3>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                                    <MapPin className="h-3 w-3" />
                                    {selectedProperty.location}
                                </p>
                                <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-2">
                                     <span className="flex items-center gap-1"><Home className="h-3 w-3" /> {getPropertyTypeDisplay(selectedProperty.propertyType, undefined)}</span>
                                     <span className="flex items-center gap-1"><Maximize2 className="h-3 w-3"/> {selectedProperty.area.toLocaleString()} م²</span>
                                </div>
                                <p className="text-lg font-bold text-accent mt-2 text-center" dir="ltr">{formatPrice(selectedProperty.price, selectedProperty.priceSuffix)}</p>
                                <Button asChild size="sm" className="w-full mt-3">
                                    <Link href={`/our-properties/${selectedProperty.id}`}>
                                        <Eye className="ml-2 h-4 w-4"/> عرض التفاصيل
                                    </Link>
                                </Button>
                            </CardContent>
                       </Card>
                    </Popup>
                )}
            </Map>
        </main>
    </div>
  );
}
