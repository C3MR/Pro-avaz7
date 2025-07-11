"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calculator, MapPin, Home, DollarSign } from 'lucide-react';
import { 
  Building2 as Building2Icon, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Wrench, 
  ReceiptText, 
  Droplets, 
  Siren, 
  ArrowUpDown, 
  Wifi 
} from 'lucide-react';
import { CarIcon } from '@/components/icons/CarIcon';

type ServiceId = 
  | 'cleaning_utilities'
  | 'corridor_electricity'
  | 'security_guard'
  | 'general_cleaning'
  | 'general_maintenance'
  | 'electricity_bill_mgmt'
  | 'water_supply'
  | 'civil_defense_compliance'
  | 'elevators'
  | 'parking'
  | 'wifi';

interface PropertyMatchData {
  location: string;
  propertyType: string;
  area: number;
  selectedServices: ServiceId[];
  estimatedCost: number;
}

const serviceOptionsList: { id: ServiceId; label: string; icon: React.FC<any> }[] = [
  { id: 'cleaning_utilities', label: 'نظافة المرافق', icon: Building2Icon },
  { id: 'corridor_electricity', label: 'كهرباء الممرات', icon: Zap },
  { id: 'security_guard', label: 'حراسة', icon: ShieldCheck },
  { id: 'general_cleaning', label: 'نظافة عامة', icon: Sparkles },
  { id: 'general_maintenance', label: 'صيانة عامة', icon: Wrench },
  { id: 'electricity_bill_mgmt', label: 'إدارة فاتورة الكهرباء', icon: ReceiptText },
  { id: 'water_supply', label: 'مياه', icon: Droplets },
  { id: 'civil_defense_compliance', label: 'متوافق مع الدفاع المدني', icon: Siren },
  { id: 'elevators', label: 'مصاعد', icon: ArrowUpDown },
  { id: 'parking', label: 'موقف سيارات', icon: CarIcon },
  { id: 'wifi', label: 'واي فاي', icon: Wifi }
];

export default function PropertyMatchCalculator() {
  const [formData, setFormData] = useState<PropertyMatchData>({
    location: '',
    propertyType: '',
    area: 0,
    selectedServices: [],
    estimatedCost: 0
  });

  const [showResults, setShowResults] = useState(false);

  const handleServiceToggle = (serviceId: ServiceId) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const calculateEstimate = () => {
    // Simple estimation logic
    const baseRate = 10; // SAR per sqm
    const serviceCost = formData.selectedServices.length * 500; // SAR per service
    const totalCost = (formData.area * baseRate) + serviceCost;
    
    setFormData(prev => ({ ...prev, estimatedCost: totalCost }));
    setShowResults(true);
  };

  const resetForm = () => {
    setFormData({
      location: '',
      propertyType: '',
      area: 0,
      selectedServices: [],
      estimatedCost: 0
    });
    setShowResults(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            حاسبة مطابقة العقارات
          </CardTitle>
          <CardDescription>
            احسب تكلفة الخدمات المطلوبة لعقارك
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showResults ? (
            <>
              {/* Location Input */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  الموقع
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="أدخل موقع العقار"
                />
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label htmlFor="propertyType" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  نوع العقار
                </Label>
                <Input
                  id="propertyType"
                  value={formData.propertyType}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
                  placeholder="مثال: شقة، فيلا، مكتب"
                />
              </div>

              {/* Area */}
              <div className="space-y-2">
                <Label htmlFor="area">المساحة (متر مربع)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>

              {/* Services */}
              <div className="space-y-3">
                <Label>الخدمات المطلوبة</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {serviceOptionsList.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={service.id}
                        checked={formData.selectedServices.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                      />
                      <Label 
                        htmlFor={service.id} 
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        {React.createElement(service.icon, { className: "w-4 h-4" })}
                        <span className="text-sm">{service.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculate Button */}
              <Button 
                onClick={calculateEstimate}
                className="w-full"
                disabled={!formData.location || !formData.propertyType || formData.area === 0}
              >
                احسب التكلفة المقدرة
              </Button>
            </>
          ) : (
            /* Results */
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  {formData.estimatedCost.toLocaleString()} ريال سعودي
                </h3>
                <p className="text-gray-600">التكلفة المقدرة الشهرية</p>
              </div>

              {/* Property Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">تفاصيل العقار</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>الموقع:</strong> {formData.location}</p>
                  <p><strong>نوع العقار:</strong> {formData.propertyType}</p>
                  <p><strong>المساحة:</strong> {formData.area} متر مربع</p>
                </div>
              </div>

              {/* Selected Services */}
              {formData.selectedServices.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">الخدمات المختارة</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedServices.map((serviceId) => {
                      const service = serviceOptionsList.find(s => s.id === serviceId);
                      return service ? (
                        <Badge key={serviceId} variant="secondary">
                          {service.label}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  حساب جديد
                </Button>
                <Button className="flex-1">
                  طلب عرض سعر مفصل
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}