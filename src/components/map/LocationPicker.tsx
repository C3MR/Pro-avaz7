
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Map, { Marker, NavigationControl, useControl, ViewState, MapRef } from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { Feature, Point, Polygon } from 'geojson';
import mapboxgl from 'mapbox-gl'; // Import for setRTLTextPlugin
import type { Location } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPinIcon } from "lucide-react";
// @ts-ignore
import html2canvas from 'html2canvas';


// It's highly recommended to move this to an environment variable NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
const MAPBOX_TOKEN = "pk.eyJ1IjoiYXZhYXoiLCJhIjoiY21ia2Z0aTV3MGxvNzJqczV6bDVobWFzbiJ9.6aeIU9h2yE5CPUGl23N5SQ";
const BRAND_BLUE = "#4f5b93"; // AVAZ Brand Blue

// Custom Mapbox Draw Styles
const mapDrawStyles = [
  // INACTIVE STYLES
  {
    'id': 'gl-draw-polygon-fill-inactive',
    'type': 'fill',
    'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    'paint': {
      'fill-color': BRAND_BLUE,
      'fill-outline-color': BRAND_BLUE,
      'fill-opacity': 0.1
    }
  },
  {
    'id': 'gl-draw-polygon-stroke-inactive',
    'type': 'line',
    'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': BRAND_BLUE,
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-line-inactive',
    'type': 'line',
    'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': BRAND_BLUE,
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-point-point-stroke-inactive',
    'type': 'circle',
    'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Point'], ['!=', 'mode', 'static'], ['!=', 'meta', 'midpoint']],
    'paint': {
      'circle-radius': 5,
      'circle-opacity': 1,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-point-inactive',
    'type': 'circle',
    'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Point'], ['!=', 'mode', 'static'], ['!=', 'meta', 'midpoint']],
    'paint': {
      'circle-radius': 3,
      'circle-color': BRAND_BLUE
    }
  },

  // ACTIVE STYLES
  {
    'id': 'gl-draw-polygon-fill-active',
    'type': 'fill',
    'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    'paint': {
      'fill-color': BRAND_BLUE,
      'fill-outline-color': BRAND_BLUE,
      'fill-opacity': 0.2
    }
  },
  {
    'id': 'gl-draw-polygon-stroke-active',
    'type': 'line',
    'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': BRAND_BLUE,
      'line-dasharray': [0.2, 2],
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-line-active',
    'type': 'line',
    'filter': ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': BRAND_BLUE,
      'line-dasharray': [0.2, 2],
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive',
    'type': 'circle',
    'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#fff',
      'circle-stroke-width': 2,
      'circle-stroke-color': BRAND_BLUE
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-active',
    'type': 'circle',
    'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['==', 'active', 'true']],
    'paint': {
      'circle-radius': 7,
      'circle-color': '#fff',
      'circle-stroke-width': 2,
      'circle-stroke-color': BRAND_BLUE
    }
  },
  {
    'id': 'gl-draw-point-point-stroke-active',
    'type': 'circle',
    'filter': ['all', ['==', '$type', 'Point'], ['==', 'active', 'true'], ['!=', 'meta', 'midpoint']],
    'paint': {
      'circle-radius': 7,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-point-active',
    'type': 'circle',
    'filter': ['all', ['==', '$type', 'Point'], ['!=', 'meta', 'midpoint'], ['==', 'active', 'true']],
    'paint': {
      'circle-radius': 5,
      'circle-color': BRAND_BLUE
    }
  }
];


interface LocationPickerProps {
  onLocationSelect: (location: Location | null, mapScreenshotUri?: string | null) => void;
  initialPosition?: Location;
  drawMode?: 'point' | 'polygon'; // New prop to control drawing mode
}

const getCentroid = (coordinates: number[][]): Location => {
  if (!coordinates || coordinates.length === 0) return { lat: 0, lng: 0 };
  let latSum = 0;
  let lngSum = 0;
  coordinates.forEach(([lng, lat]) => {
    latSum += lat;
    lngSum += lng;
  });
  return { lat: latSum / coordinates.length, lng: lngSum / coordinates.length };
};

interface DrawControlProps {
  onDrawCreate?: (evt: { features: Feature[] }) => void;
  onDrawUpdate?: (evt: { features: Feature[]; action: string }) => void;
  onDrawDelete?: (evt: { features: Feature[] }) => void;
  styles?: mapboxgl.Style[];
  instanceRef?: React.MutableRefObject<MapboxDraw | null>;
  drawMode?: 'point' | 'polygon'; // Pass drawMode to DrawControl
}

function DrawControl({ instanceRef, drawMode = 'polygon', ...props }: DrawControlProps) {
  useControl<MapboxDraw>(
    () => { 
      const controls: { [key: string]: boolean } = {};
      if (drawMode === 'polygon') {
        controls.polygon = true;
      } else {
        controls.point = true;
      }
      controls.trash = true;

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: controls,
        defaultMode: drawMode === 'polygon' ? 'draw_polygon' : 'draw_point',
        styles: props.styles,
      });
      if (instanceRef && typeof instanceRef === 'object') {
        instanceRef.current = draw;
      }
      return draw;
    },
    // onAdd
    ({map}) => {
      if (props.onDrawCreate) map.on('draw.create', props.onDrawCreate);
      if (props.onDrawUpdate) map.on('draw.update', props.onDrawUpdate);
      if (props.onDrawDelete) map.on('draw.delete', props.onDrawDelete);
    },
    // onRemove
    ({map}) => {
      if (props.onDrawCreate) map.off('draw.create', props.onDrawCreate);
      if (props.onDrawUpdate) map.off('draw.update', props.onDrawUpdate);
      if (props.onDrawDelete) map.off('draw.delete', props.onDrawDelete);
      if (instanceRef && typeof instanceRef === 'object' && instanceRef.current) {
        instanceRef.current = null; 
      }
    },
    {
      position: 'top-left'
    }
  );
  return null;
}


export default function LocationPicker({ onLocationSelect, initialPosition, drawMode = 'polygon' }: LocationPickerProps) {
  const defaultLat = 24.7136; // Riyadh
  const defaultLng = 46.6753;

  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: initialPosition?.lng || defaultLng,
    latitude: initialPosition?.lat || defaultLat,
    zoom: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [markerPosition, setMarkerPosition] = useState<Location | null>(initialPosition || null);
  const mapRef = useRef<MapRef>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const drawInstance = useRef<MapboxDraw | null>(null);

  const captureMapAndCallback = useCallback(async (currentLocation: Location | null) => {
    if (!mapRef.current) {
      onLocationSelect(currentLocation, null);
      return;
    }
    const mapInstance = mapRef.current.getMap();

    if (mapInstance && mapInstance.isStyleLoaded() && mapContainerRef.current) {
      try {
        await new Promise(resolve => setTimeout(resolve, 300)); 
        
        if (!mapRef.current || !mapContainerRef.current) { 
          onLocationSelect(currentLocation, null);
          return;
        }

        const canvas = await html2canvas(mapContainerRef.current, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff', 
          logging: false,
          scale: 1, 
        });
        const dataUri = canvas.toDataURL('image/png');
        
        if(canvas.width > 0 && canvas.height > 0 && dataUri.length > 100 && dataUri.startsWith('data:image/png;base64,')) { 
            onLocationSelect(currentLocation, dataUri);
        } else {
            onLocationSelect(currentLocation, null); 
        }
      } catch (error) {
        onLocationSelect(currentLocation, null); 
      }
    } else {
      onLocationSelect(currentLocation, null); 
    }
  }, [onLocationSelect]);

  const handleMapIdle = useCallback(() => {
    const currentDraw = drawInstance.current;
    let hasActiveDrawingFeatures = false;
    if (currentDraw && typeof currentDraw.getAll === 'function') {
      try {
        const allFeatures = currentDraw.getAll();
        if (allFeatures && allFeatures.features && allFeatures.features.length > 0) {
          hasActiveDrawingFeatures = true;
        }
      } catch (e) {
        // Error accessing drawn features, proceed as if none
      }
    }

    if (markerPosition || hasActiveDrawingFeatures) {
      captureMapAndCallback(markerPosition);
    } else {
      captureMapAndCallback(null);
    }
  }, [markerPosition, captureMapAndCallback]);


  useEffect(() => {
    if (typeof mapboxgl.setRTLTextPlugin === 'function' && (!mapboxgl.getRTLTextPluginStatus || (mapboxgl.getRTLTextPluginStatus && mapboxgl.getRTLTextPluginStatus() === 'unavailable'))) {
        mapboxgl.setRTLTextPlugin(
            'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
             (err) => { if(err) console.error("Mapbox RTL plugin error:", err); },
            true 
        );
    }
  }, []);

  const handleMapClick = (event: mapboxgl.MapLayerMouseEvent) => {
    let currentToolIsActiveDrawingTool = false;
    // Version before the last fix: directly accessed drawInstance.current.getMode()
    // This is the state that likely existed at c58e1007 for this file if it wasn't
    // explicitly changed for the "services" feature but was part of the commit.
    if (drawInstance.current && typeof drawInstance.current.getMode === 'function') {
      try {
          const mode = drawInstance.current.getMode();
          if (mode && (mode.startsWith('draw_') || mode.startsWith('direct_select') || mode.startsWith('simple_select'))) {
              currentToolIsActiveDrawingTool = true;
          }
      } catch(e) {
          // In c58e1007, sophisticated error handling for this might not have been present.
          // The error occurred because drawInstance.current could be undefined here.
      }
    }


    if (!currentToolIsActiveDrawingTool) {
      const newPos = { lat: event.lngLat.lat, lng: event.lngLat.lng };
      if (drawInstance.current && typeof drawInstance.current.deleteAll === 'function') {
        drawInstance.current.deleteAll(); 
      }
      setMarkerPosition(newPos);
    }
  };
  

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&language=ar`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const newPos = { lat, lng };
        setViewState({ latitude: lat, longitude: lng, zoom: 14 });
        
        const currentDraw = drawInstance.current;
        if (currentDraw && typeof currentDraw.deleteAll === 'function') {
            currentDraw.deleteAll(); // Clear drawn shapes
        }
        setMarkerPosition(newPos); // Set marker for search result
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      alert("Error searching for location.");
    }
  };

  const processDrawnFeatures = useCallback((features: Feature[]) => {
    if (features.length > 0) {
      const feature = features[0];
      let location: Location | null = null;
      if (feature.geometry.type === 'Point') {
        const [lng, lat] = (feature.geometry as Point).coordinates;
        location = { lat, lng };
      } else if (feature.geometry.type === 'Polygon' && drawMode === 'polygon') { // Only process polygon if mode allows
        const coordinates = (feature.geometry as Polygon).coordinates[0];
        location = getCentroid(coordinates);
      }

      if (location) {
        setMarkerPosition(location); 
        setViewState(prev => ({...prev, latitude: location!.lat, longitude: location!.lng })); 
      }
    }
  }, [drawMode]);


  const onDrawCreate = useCallback((evt: { features: Feature[] }) => {
    setMarkerPosition(null); 
    processDrawnFeatures(evt.features);
  }, [processDrawnFeatures]);

  const onDrawUpdate = useCallback((evt: { features: Feature[]; action: string }) => {
    setMarkerPosition(null); 
    processDrawnFeatures(evt.features);
  }, [processDrawnFeatures]);

  const onDrawDelete = useCallback(() => {
     setMarkerPosition(null); 
  }, []);


  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "YOUR_MAPBOX_ACCESS_TOKEN_PLACEHOLDER") {
    return (
      <div className="p-4 border border-dashed border-destructive text-destructive rounded-md bg-destructive/10">
        <p className="font-semibold">Map Disabled</p>
        <p>Mapbox Access Token is not configured correctly. Please ensure it's set.</p>
      </div>
    );
  }

  let hasAnyDrawnFeatures = false;
  const currentDraw = drawInstance.current;
  if (currentDraw && typeof currentDraw.getAll === 'function') {
    try {
      const allFeatures = currentDraw.getAll();
      if (allFeatures && allFeatures.features && allFeatures.features.length > 0) {
        hasAnyDrawnFeatures = true;
      }
    } catch (e) {
      // Error checking features
    }
  }
  const shouldShowMarker = markerPosition && !hasAnyDrawnFeatures;

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 rtl:space-x-reverse">
        <Input
          type="text"
          placeholder="ابحث عن موقع على الخريطة"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-grow"
        />
        <Button type="button" onClick={handleSearch} variant="outline">
          <Search className="h-4 w-4 md:mr-2 rtl:md:ml-2 rtl:md:mr-0" />
          <span className="hidden md:inline">بحث</span>
        </Button>
      </div>
      <div ref={mapContainerRef} style={{ height: "400px", width: "100%", borderRadius: "0.5rem", overflow: "hidden" }} className="border shadow-sm" id="mapbox-map-container">
        <Map
          ref={mapRef}
          {...viewState}
          mapboxAccessToken={MAPBOX_TOKEN}
          onMove={evt => setViewState(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          onClick={handleMapClick}
          onIdle={handleMapIdle} 
          language="ar"
          preserveDrawingBuffer 
        >
          <NavigationControl position="top-right" />
          <DrawControl
            instanceRef={drawInstance}
            styles={mapDrawStyles}
            onDrawCreate={onDrawCreate}
            onDrawUpdate={onDrawUpdate}
            onDrawDelete={onDrawDelete}
            drawMode={drawMode} // Pass the drawMode prop
          />
          {shouldShowMarker && (
            <Marker longitude={markerPosition.lng} latitude={markerPosition.lat} anchor="bottom">
              <MapPinIcon className="h-8 w-8 text-primary fill-primary/30" />
            </Marker>
          )}
        </Map>
      </div>
      <p className="text-xs text-muted-foreground">
        {drawMode === 'point' 
          ? "انقر على الخريطة لتحديد نقطة، أو استخدم أداة الرسم لتحديد نقطة، أو استخدم البحث."
          : "انقر على الخريطة لتحديد نقطة، أو استخدم أدوات الرسم (المضلع، النقطة) لتحديد نطاق أو نقطة، أو استخدم البحث."
        }
      </p>
    </div>
  );
}

