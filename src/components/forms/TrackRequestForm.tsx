
"use client";

import React, { useState, useEffect, useRef, useActionState, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { handleTrackRequestSearch, type TrackRequestSearchState } from "@/lib/actions";
import { Search, Smartphone, Hash, Loader2, AlertCircle } from "lucide-react";

type SearchType = "trackingCode" | "clientPhone";

const formSchema = z.object({
  searchValue: z.string().min(1, { message: "قيمة البحث مطلوبة." }), 
  searchType: z.enum(["trackingCode", "clientPhone"], {invalid_type_error: "الرجاء اختيار نوع البحث."}),
}).superRefine((data, ctx) => {
  if (data.searchType === "trackingCode") {
    if (data.searchValue.length < 3) {
      ctx.addIssue({
        path: ["searchValue"],
        code: z.ZodIssueCode.custom,
        message: "رمز التتبع يجب أن يكون 3 أحرف على الأقل.",
      });
    } else if (!/^[a-zA-Z0-9-]+$/.test(data.searchValue)) {
         ctx.addIssue({
            path: ["searchValue"],
            code: z.ZodIssueCode.custom,
            message: "صيغة رمز التتبع غير صالحة (يجب أن يحتوي على حروف إنجليزية وأرقام وشرطات فقط).",
        });
    }
  } else if (data.searchType === "clientPhone") {
    if (!/^05\d{8}$/.test(data.searchValue)) {
      ctx.addIssue({
        path: ["searchValue"],
        code: z.ZodIssueCode.custom,
        message: "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام.",
      });
    }
  }
});


export default function TrackRequestForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchType, setSearchType] = useState<SearchType>("trackingCode");
  const formRef = useRef<HTMLFormElement>(null);

  const initialState: TrackRequestSearchState | null = null;
  const [state, formAction, isPending] = useActionState(handleTrackRequestSearch, initialState);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchValue: "",
      searchType: "trackingCode",
    },
  });

  useEffect(() => {
    if (state?.trackingCode) {
      toast({
        title: "تم العثور على الطلب!",
        description: `جاري عرض تفاصيل الطلب ${state.trackingCode}...`,
      });
      router.push(`/track-request/${state.trackingCode}`);
    } else if (state?.error) {
      toast({
        variant: "destructive",
        title: "خطأ في البحث",
        description: state.error,
      });
    }
  }, [state, router, toast]);
  

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (formRef.current) {
        const formData = new FormData(formRef.current);
        formData.set('searchType', data.searchType); 
        formData.set('searchValue', data.searchValue);
        startTransition(() => {
            formAction(formData);
        });
    }
  };
  
  const handleSearchTypeChange = (value: SearchType) => {
    setSearchType(value);
    form.setValue("searchType", value);
    form.setValue("searchValue", ""); 
    form.clearErrors("searchValue"); 
  };

  const getSearchLabel = () => {
    return searchType === "trackingCode" ? "أدخل رمز التتبع الخاص بك" : "أدخل رقم جوال العميل";
  };

  const getSearchPlaceholder = () => {
    return searchType === "trackingCode" ? "مثال: PR-YY-MM-XXX" : "مثال: 05xxxxxxxx";
  };
  
  const getSearchIcon = () => {
    return searchType === "trackingCode" ? <Hash className="h-5 w-5 text-primary" /> : <Smartphone className="h-5 w-5 text-primary" />;
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="searchType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg">البحث بواسطة:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => handleSearchTypeChange(value as SearchType)}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4 rtl:sm:space-x-reverse"
                >
                  <FormItem className="flex items-center space-x-2 rtl:space-x-reverse">
                    <FormControl>
                      <RadioGroupItem value="trackingCode" id="trackingCode" />
                    </FormControl>
                    <FormLabel htmlFor="trackingCode" className="font-normal cursor-pointer">رمز التتبع</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 rtl:space-x-reverse">
                    <FormControl>
                      <RadioGroupItem value="clientPhone" id="clientPhone" />
                    </FormControl>
                    <FormLabel htmlFor="clientPhone" className="font-normal cursor-pointer">رقم جوال العميل</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="searchValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">{getSearchLabel()}</FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 right-3 flex items-center pl-3 pointer-events-none rtl:right-auto rtl:left-3">
                    {getSearchIcon()}
                </div>
                <FormControl>
                  <Input 
                    placeholder={getSearchPlaceholder()} 
                    {...field} 
                    className="text-base py-3 h-auto pr-10 rtl:pl-10 rtl:pr-3" 
                    dir={searchType === 'clientPhone' ? 'ltr' : 'rtl'}/>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {state?.error && !state.trackingCode && (
          <div className="flex items-center p-3 my-2 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
            <AlertCircle className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0 shrink-0" />
            <p>{state.error}</p>
          </div>
        )}


        <Button type="submit" className="w-full text-lg py-6 shadow-md hover:bg-primary/80" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />}
          بحث عن الطلب
        </Button>
      </form>
    </Form>
  );
}
