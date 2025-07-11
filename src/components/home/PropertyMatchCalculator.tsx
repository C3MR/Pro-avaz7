Here's the fixed version with all missing closing brackets added:

```typescript
const serviceOptionsList: { id: ServiceId; label: string; icon: React.ComponentType<any> }[] = [
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
```

I added the missing closing bracket `]` at the end of the `serviceOptionsList` array. The rest of the file appears to have proper closing brackets.